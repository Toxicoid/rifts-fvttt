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

  {
    name: "Bandit IP-10 Ion Pistol \"Eye-Pie-Ten\"",
    type: "weapon",
    img: "icons/weapons/guns/gun-pistol-flintlock.webp",
    folder: weaponsFolder.id,
    system: {
      equipped: false,
      description: "Bandito Arms realized there was a large market for high damage yielding weaponry and met the demand with a heavy damage ion pistol. Range is relatively short, but the damage is impressive. As an added selling point, the IP-10 is designed to look like a revolver of the Old West, with the E-Clip fitting into the handle of the weapon.",
      damage: "3d6",
      damageType: "MDC",
      range: "400 ft",
      rateOfFire: "Standard",
      payload: 10,
      weight: "3 lbs",
      cost: 12000,
      bonusToStrike: 1,
      special: "Well balanced: +1 to strike (included in Bonus to Strike).",
      notes: "Payload: 10 shots (standard short E-Clip) or 20 shots (long E-Clip).",
    },
  },

  {
    name: "Bandit LP1 Laser Pistol \"No Lip\"",
    type: "weapon",
    img: "icons/weapons/guns/gun-pistol-flintlock-white.webp",
    folder: weaponsFolder.id,
    system: {
      equipped: false,
      description: "A lightweight, highly accurate laser pistol with good range. Damage yield could be higher, but the accuracy of the weapon and its large payload more than offset this disadvantage.",
      damage: "2d4",
      damageType: "MDC",
      range: "1000 ft",
      rateOfFire: "Standard",
      payload: 20,
      weight: "2 lbs",
      cost: 20000,
      bonusToStrike: 1,
      special: "Superior laser focusing optics, light weight and handling: +1 to strike (included). Damage may be rolled as 1D8 if preferred.",
      notes: "Payload: 20 shots (standard short E-Clip) or 40 shots (long E-Clip). Magazines: 2,000 cr each.",
    },
  },

  {
    name: "Bandit BigBore Revolver (BB-6)",
    type: "weapon",
    img: "icons/weapons/guns/gun-pistol-flintlock.webp",
    folder: weaponsFolder.id,
    system: {
      equipped: false,
      description: "A large revolver that fires high explosive shells — the \"bullets\" could be considered small grenades. Its advantages are knock down power, damage yield, and intimidation factor: it is just plain scary to look down the business end of the BigBore.",
      damage: "1d6",
      damageType: "MDC",
      range: "200 ft",
      rateOfFire: "Single shot (1 melee action, unless shooting wild)",
      payload: 6,
      weight: "4 lbs",
      cost: 6500,
      bonusToStrike: 0,
      special: "Horror Factor 10 when pointed in someone's face. Requires P.S. 14 to shoot (-2 to strike aimed / -6 wild if weaker); P.S. 17 to fire one-handed.\nKNOCKDOWN: human and human-sized D-Bee targets roll 1D20 to keep footing — must equal or surpass the attacker's strike roll. Success: staggered like a mule kick, remains standing, loses initiative only. Failure: knocked off feet (falls back 1D4 ft), loses initiative and one melee attack/action. M.D.C. body armor does NOT prevent knockdown. Power armor, full conversion cyborgs, robots, giants, supernatural beings and creatures of magic are immune.",
      notes: "Ammo: 80 cr per round, or 10,000 cr per gross (box of 144). Revolver-style cylinder.",
    },
  },

  {
    name: "Bandit BigBore Sawed-Off \"The Mule\"",
    type: "weapon",
    img: "icons/weapons/guns/shotgun-worn-brown.webp",
    folder: weaponsFolder.id,
    system: {
      equipped: false,
      description: "Looks like a sawed-off shotgun and fires a large, high explosive shell with even greater knock down power. Known as \"the Mule\" because it has a kick like one. Single and double-barreled varieties are available — the double-barrel is most popular.",
      damage: "2d4",
      damageType: "MDC",
      range: "150 ft",
      rateOfFire: "Single or double-barrel blast (each counts as 1 melee action)",
      payload: 2,
      weight: "6 lbs",
      cost: 15000,
      bonusToStrike: 0,
      special: "DOUBLE-BARREL BLAST: 4D4 M.D. (roll damage twice or roll 4d4 manually).\nHorror Factor 12 when pointed at most mortal opponents. Requires P.S. 18 to shoot (weaker characters are knocked on their butt and lose one melee attack/action); P.S. 22 to fire one-handed.\nKNOCKDOWN: human and human-sized D-Bee targets roll 1D20 at -6 to stay standing — must equal or surpass the attacker's strike roll. Success: staggered, knocked to knees, loses initiative. Failure: knocked off feet and flung 8-10 ft (2.4-3 m), loses initiative, momentarily dazed (all combat bonuses halved for one melee round per blast endured), and loses one melee attack/action. M.D.C. body armor does NOT prevent knockdown. Power armor, full conversion cyborgs, robots, giants, supernatural beings and creatures of magic get +6 to save vs knockdown but still lose initiative and are staggered by each shot.",
      notes: "Payload: 2, or 12 with an ammo drum. Ammo: 120 cr per round, or 16,000 cr per gross (box of 144).",
    },
  },

  {
    name: "Bandit BigBore Shotgun (BB Long-Barrel)",
    type: "weapon",
    img: "icons/weapons/guns/shotgun-worn-brown.webp",
    folder: weaponsFolder.id,
    system: {
      equipped: false,
      description: "Looks like a heavy shotgun and fires the same high explosive shell as the BB Sawed-Off. The advantage of this rifle is its greater range. Single and double-barreled varieties are available.",
      damage: "2d4",
      damageType: "MDC",
      range: "300 ft",
      rateOfFire: "Single or double-barrel blast (each counts as 1 melee action)",
      payload: 4,
      weight: "8 lbs",
      cost: 18000,
      bonusToStrike: 0,
      special: "DOUBLE-BARREL BLAST: 4D4 M.D. (roll damage twice or roll 4d4 manually).\nHorror Factor 12. Requires P.S. 18 to shoot (weaker characters are knocked off their feet and lose one melee attack/action); P.S. 22 to fire one-handed.\nKNOCKDOWN: same as the BB Sawed-Off \"Mule\" — 1D20 at -6 vs the attacker's strike roll; success: staggered to knees, loses initiative; failure: flung 8-10 ft, dazed (combat bonuses halved one melee/blast), loses initiative and one attack. M.D.C. armor doesn't prevent it; power armor/'Borgs/robots/giants/supernatural +6 to save but lose initiative and are staggered.",
      notes: "Payload: 4, or 12 with an ammo clip. Ammo: 120 cr per round, or 16,000 cr per gross (box of 144).",
    },
  },

  {
    name: "Bandit 5000 BigBore Rail Gun \"Big Bear\"",
    type: "weapon",
    img: "icons/weapons/guns/rifle-brown.webp",
    folder: weaponsFolder.id,
    system: {
      equipped: false,
      description: "A light rail gun that can fire single, aimed shots (each pull of the trigger is one melee attack/action) or short bursts. Laser targeting comes standard.",
      damage: "1d6",
      damageType: "MDC",
      range: "2000 ft",
      rateOfFire: "Single or 6-round burst (each counts as 1 melee action)",
      payload: 60,
      weight: "25 lbs (incl. E-Clip + standard drum)",
      cost: 50000,
      bonusToStrike: 1,
      special: "SHORT BURST (6 rounds): 2D6 M.D. — burst is less controlled and less accurate (not all rounds hit the intended target).\nRequires P.S. 20 to use without penalty, otherwise -3 to strike.\nLaser targeting standard: +1 to strike on aimed shots only (included in Bonus to Strike).\nKNOCKDOWN: same as the BB Sawed-Off \"Mule\".",
      notes: "Cost: 50,000-55,000 cr. Standard drum: 60 rounds / 10 bursts; reload takes 1 melee round (2 without W.P. Heavy Weapons). Backpack drum: 240 rounds / 40 bursts, +22 lbs. E-Clip powers 960 rounds (160 bursts) before replacement. Ammo: 80 cr per round, or 10,000 cr per gross (box of 144).",
    },
  },

  {
    name: "C-12 Heavy Assault Laser Rifle",
    type: "weapon",
    img: "icons/weapons/guns/gun-blaster-military.webp",
    folder: weaponsFolder.id,
    system: {
      equipped: false,
      description: "The old standard Coalition infantry weapon, still favoured by Commandos and Special Ops. Sturdy and reliable — it survives heavy combat abuse without mechanical failure. Three power settings (one S.D.C., two M.D.), and it can fire a single shot or a burst of three. Comes standard with a passive night-vision scope and laser targeting.",
      damage: "2d6",
      damageType: "MDC",
      range: "2000 ft",
      rateOfFire: "Each laser blast OR burst counts as one melee attack (shots per melee = your attacks per melee)",
      payload: 20,
      weight: "7 lbs",
      cost: 20000,
      bonusToStrike: 1,
      special: "POWER SETTINGS — choose before firing:\n  \u2022 Low M.D.: 2D6 M.D. (this item's damage roll)\n  \u2022 High M.D.: 4D6 M.D.\n  \u2022 S.D.C.: 6D6 S.D.C. — six S.D.C. shots drain the same charge as one M.D. blast.\nSINGLE SHOT or BURST OF THREE: both cost one melee attack. A burst spends three charges; this stat block prints no separate burst damage, so use your table's standard burst rule.\nLASER TARGETING: +1 to strike on an AIMED shot only (included in Bonus to Strike — ignore it on snap shots).\nPASSIVE NIGHT-VISION SCOPE included.",
      notes: "Payload: 20 M.D. blasts from a standard E-Clip, 30 from a long E-Clip, plus another 30 from an E-Clip canister. Black Market cost: 20,000 credits. Source: RUE p.258. The Rifts GM Guide p.121 lists R.O.F. as equal to the user's hand to hand attacks — the same rule stated from the other end; RUE wins for core mechanics.",
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
