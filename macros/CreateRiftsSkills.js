// ============================================================
// RIFTS RPG - Rifts Skills Compendium
// Builds the "Rifts Skills" compendium with skills organized
// into folders by category (Communications, Espionage, etc.),
// verified vs book text. Drag skills onto a character — the
// per-level bonus scales automatically with character Level.
// Safe to re-run: skips existing by name, moves into folders.
// ============================================================

const PACK_NAME = "rifts-skills";
const PACK_LABEL = "Rifts Skills";

let pack = game.packs.get(`world.${PACK_NAME}`);
if (!pack) {
  pack = await foundry.documents.collections.CompendiumCollection.createCompendium({
    label: PACK_LABEL,
    name: PACK_NAME,
    type: "Item",
  }).catch(async () => {
    return await CompendiumCollection.createCompendium({
      label: PACK_LABEL,
      name: PACK_NAME,
      type: "Item",
    });
  });
  ui.notifications.info(`Created compendium: ${PACK_LABEL}`);
}

// ── Category folder helper (created on demand) ─────────────
const folders = {};
async function categoryFolder(name) {
  if (folders[name]) return folders[name];
  let f = pack.folders.find((x) => x.name === name && !x.folder);
  if (!f) {
    f = await Folder.create({ name, type: "Item" }, { pack: pack.collection });
  }
  folders[name] = f;
  return f;
}

// ── Skill helper ───────────────────────────────────────────
// categoryKey = the system's category value (matches the sheet's
// category dropdown); folderName = display folder in the pack.
const skillDefs = [];
const skill = (name, folderName, categoryKey, base, perLevel, description, notes = "") =>
  skillDefs.push({ name, folderName, categoryKey, base, perLevel, description, notes });

// ═══ COMMUNICATIONS ════════════════════════════════════════
skill("Barter", "Communications", "communications", 30, 4,
  "A skill at bargaining with merchants, businessmen, thieves, traders and other characters to get a fair price or fair exchange of trade goods or services. Depending on the character's point of view and effort at bartering, he can raise the amount he gets or lower the price he pays by 3D6+2% — not applicable to rare items and alien technology. Generally, if the haggler rolls under his Bartering skill percentage, he gets the discount when buying, or the better price when he is the one doing the selling or trading. If the price is disputed, the two bartering characters can each make rolls on percentile dice: the highest roll wins and gets their price — and not a penny less or nickel more.",
  "Base Skill: 30% +4% per level.\nRESTRICTION: Available only to Adventurer & Scholar O.C.C.s.\nMathematics and Literacy are not required but helpful — EACH adds a +2% bonus to Barter (enter in Bonus % if known).");

// ── Build items and create ─────────────────────────────────
const index = await pack.getIndex();
const byName = new Map(index.map((e) => [e.name, e]));

let created = 0;
let moved = 0;
for (const def of skillDefs) {
  const folder = await categoryFolder(def.folderName);
  const entry = byName.get(def.name);
  if (entry) {
    if ((entry.folder ?? null) !== folder.id) {
      const doc = await pack.getDocument(entry._id);
      await doc.update({ folder: folder.id });
      moved++;
    }
    continue;
  }
  await Item.create(
    {
      name: def.name,
      type: "skill",
      img: "icons/svg/book.svg",
      folder: folder.id,
      system: {
        category: def.categoryKey,
        description: def.description,
        isSecondary: false,
        basePercent: def.base,
        bonusPercent: 0,
        totalPercent: def.base,
        perLevelBonus: def.perLevel,
        relatedAttribute: "",
        notes: def.notes,
      },
    },
    { pack: pack.collection }
  );
  created++;
}

ui.notifications.info(`${PACK_LABEL}: ${created} skill(s) added, ${moved} moved into folders, ${skillDefs.length - created - moved} already in place.`);
