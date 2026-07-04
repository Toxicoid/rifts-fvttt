// ============================================================
// RIFTS RPG - Create "Rifts Armory" Compendium
// Run once as GM. Creates a world compendium pack and fills it
// with pre-built items. Safe to re-run: skips items that
// already exist by name.
// ============================================================

const PACK_NAME = "rifts-armory";
const PACK_LABEL = "Rifts Armory";

// ── Find or create the compendium ─────────────────────────
let pack = game.packs.get(`world.${PACK_NAME}`);
if (!pack) {
  pack = await foundry.documents.collections.CompendiumCollection.createCompendium({
    label: PACK_LABEL,
    name: PACK_NAME,
    type: "Item",
  }).catch(async () => {
    // Fallback for API differences across v11-v13
    return await CompendiumCollection.createCompendium({
      label: PACK_LABEL,
      name: PACK_NAME,
      type: "Item",
    });
  });
  ui.notifications.info(`Created compendium: ${PACK_LABEL}`);
}

// ── Compendium folders ─────────────────────────────────────
async function getOrCreateFolder(name, parent = null) {
  let f = pack.folders.find(
    (x) => x.name === name && (x.folder?.id ?? null) === (parent?.id ?? null)
  );
  if (!f) {
    f = await Folder.create(
      { name, type: "Item", folder: parent?.id ?? null },
      { pack: pack.collection }
    );
  }
  return f;
}

const weaponsFolder = await getOrCreateFolder("Weapons");

// ── Item definitions ──────────────────────────────────────
const items = [

  // ═══ WEAPONS ═════════════════════════════════════════════
  {
    name: "Wilk's 210 \"Pocket Pistol\"",
    type: "weapon",
    img: "icons/weapons/guns/gun-pistol-flintlock-white.webp",
    folder: weaponsFolder.id,
    system: {
      equipped: false,
      description: "A truly unique and revolutionary design for any of the weapon manufacturers, the 210 Pocket Pistol is inspired by the Derringer. Its small size (it can fit in the palm of the hand) meant that the weapon could not use the traditional E-Clip, so the Wilk's engineers designed a tiny gun with a permanent built-in energy cell. A special \"plug in\" hookup allows for the use of an ordinary E-clip recharger to power up the empty weapon. The 210 has become popular among City Rats, saloon bums, barmaids, gamblers, spies, and thieves because it is easily palmed and concealed (in a garter belt, boot, hat, hand, etc.).",
      damage: "1d6",
      damageType: "MDC",
      range: "400 ft (122 m)",
      rateOfFire: "1",
      payload: 3,
      weight: "0.5 lbs",
      cost: 8000,
      bonusToStrike: 0,
      notes: "Weight: 8 ounces (0.26 kg). Built-in energy cell — recharges via standard E-clip recharger.",
    },
  },

];

// ── Create items; move existing ones into their folders ───
const index = await pack.getIndex();
const byName = new Map(index.map((e) => [e.name, e]));

let created = 0;
let moved = 0;
for (const itemData of items) {
  const entry = byName.get(itemData.name);
  if (entry) {
    if ((entry.folder ?? null) !== itemData.folder) {
      const doc = await pack.getDocument(entry._id);
      await doc.update({ folder: itemData.folder });
      moved++;
    }
    continue;
  }
  await Item.create(itemData, { pack: `world.${PACK_NAME}` });
  created++;
}

ui.notifications.info(`${PACK_LABEL}: ${created} item(s) added, ${moved} moved into folders, ${items.length - created - moved} already in place.`);
