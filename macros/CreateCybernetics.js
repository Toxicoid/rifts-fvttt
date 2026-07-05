// ============================================================
// RIFTS RPG - Cybernetics
// Adds cybernetic implants (Medical + Appendages, Prosthetics
// & Bone) to the "Rifts Armory" compendium, organized:
//   Cybernetics > Medical > (location)
//   Cybernetics > Appendages & Bone > (location)
// Safe to re-run: skips existing by name, moves items into
// the correct folders.
// ============================================================

const PACK_NAME = "rifts-armory";
const PACK_LABEL = "Rifts Armory";

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

// ── Nested folder helper ───────────────────────────────────
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

const cyberRoot = await getOrCreateFolder("Cybernetics");
const medical = await getOrCreateFolder("Medical", cyberRoot);
const appendages = await getOrCreateFolder("Appendages & Bone", cyberRoot);

const loc = {};
for (const n of ["Hand", "Finger"]) loc[`med:${n}`] = await getOrCreateFolder(n, medical);
for (const n of ["Finger & Toe", "Hand", "Arm", "Leg & Foot", "Torso & Skeleton", "Head"])
  loc[`app:${n}`] = await getOrCreateFolder(n, appendages);

// ── Item helper ────────────────────────────────────────────
const cyber = (name, folderKey, cost, description, notes) => ({
  name,
  type: "equipment",
  img: "icons/commodities/tech/metal-panel.webp",
  folder: loc[folderKey].id,
  system: { quantity: 1, weight: "", cost, description, notes },
});

// ── Item definitions ──────────────────────────────────────
const items = [

  // ═══ MEDICAL ═════════════════════════════════════════════
  cyber("Medical: Blood Analysis/Tox-Screen", "med:Hand", 30000,
    "Special sensors and implants in the hand enable a basic screen for 60 common toxins and blood anomalies (too much or too little insulin, sugar, cholesterol, white and red cell count, poison, etc.). The subject's blood must physically touch the area of the hand (a particular finger or area of the palm) to do the analysis. Can also indicate whether the sample is human, animal, D-Bee or unknown (alien) blood type.",
    "Location: Hand or Finger."),
  cyber("Medical: Epidermic Analyzer", "med:Hand", 35000,
    "Molecular analyzers in the hand identify and measure the amount of salt, sugar and powerful enzymes or chemicals by touching a person's skin and/or perspiration. Can also measure the patient's body temperature by touch (touch for 30 seconds).",
    "Location: Hand."),
  cyber("Medical: Epidermal Temperature Gauge", "med:Hand", 1000,
    "The hand or a specific finger can take a person's body temperature by simply touching the subject on the neck, head or armpits.",
    "Location: Hand or Finger."),
  cyber("Medical: Laser Scalpel Finger", "med:Finger", 5000,
    "One of the fingers is really a laser scalpel used for surgery. Maximum damage is 1D4 S.D.C. It is not a Mega-Damage weapon.",
    "Location: Finger. Improvised weapon: 1D4 S.D.C. max."),
  cyber("Medical: Pulse & Pressure Detector", "med:Hand", 25000,
    "By squeezing and holding a patient's wrist or finger for a minute, the doctor can accurately measure the character's pulse rate. By squeezing, holding and slowly releasing the wrist, the doctor can also measure the patient's blood pressure.",
    "Location: Hand."),
  cyber("Medical: Stethoscope Feature", "med:Hand", 10000,
    "Can only be used in conjunction with one of the cybernetic or bionic ear implants or a universal Head-jack and receiver. The doctor uses his hand or ear like a stethoscope, placing it on the patient's chest or back to listen to heartbeat and/or breathing.",
    "Location: Hand. Requires a cybernetic/bionic ear implant or Headjack."),
  cyber("Medical: Sensor Hand", "med:Hand", 60000,
    "Closely resembles an ordinary sensor hand, except designed with medical care rather than general utility in mind. As many as 14 features can be installed in the hand; each sensor feature must be purchased separately. Includes all Medical features plus 1D4 other cybernetic systems.",
    "Location: Hand. Up to 14 features; each purchased separately."),

  // ═══ APPENDAGES, PROSTHETICS & BONE ═════════════════════
  cyber("Cybernetic Finger (or Toe)", "app:Finger & Toe", 300,
    "A bio-mechanical replacement digit for a lost finger, usually sized and molded to resemble the remaining fingers as closely as possible.",
    "Location: Finger or Toe. P.S. 4-8, S.D.C. 1D4.\nCost tiers: 300 cr standard cybernetic; 1,000 cr cybernetic Bio-System; 2,000 cr full flesh-and-blood Bio-System (like real)."),
  cyber("Cybernetic Foot", "app:Leg & Foot", 10000,
    "A bio-mechanical replacement for a lost foot, fitted to be as similar in shape and size as possible to the lost appendage.",
    "Location: Foot. P.S. 8-10, supports Spd 10, S.D.C. 2D6+25.\nCost tiers: 10,000 cr standard mechanical; 16,000 cr cybernetic + Bio-System; 24,000 cr full flesh-and-blood Bio-System."),
  cyber("Cybernetic Hand", "app:Hand", 12000,
    "A bio-mechanical replacement for a lost hand, fitted to be as similar in shape and size as possible to the lost appendage.",
    "Location: Hand. P.S. 8-10, P.P. 8-10, S.D.C. 2D6+16.\nCost tiers: 12,000 cr standard mechanical; 18,000 cr cybernetic + Bio-System; 30,000 cr full flesh-and-blood Bio-System."),
  cyber("Cybernetic Hand & Forearm", "app:Arm", 12000,
    "A bio-mechanical replacement for a lost hand and forearm, fitted to be as similar in shape and size as possible to the lost appendage.",
    "Location: Hand & Forearm. P.S. 8-10, P.P. 10, S.D.C. 2D6+24. Weight ~6 lbs (2.7 kg).\nCost tiers: 12,000 cr standard mechanical; 22,000 cr cybernetic Bio-System; 40,000 cr full flesh-and-blood Bio-System."),
  cyber("Cybernetic Hand & Entire Arm", "app:Arm", 24000,
    "A cybernetic prosthetic of the entire arm from fingertip to shoulder.",
    "Location: Entire Arm. P.S. 8-10, P.P. 10, S.D.C. 3D6+30. Weight ~8-9 lbs (3.6-4 kg).\nCost tiers: 24,000 cr standard mechanical; 38,000 cr cybernetic + Bio-System; 75,000 cr full flesh-and-blood Bio-System."),
  cyber("Cybernetic Leg & Foot", "app:Leg & Foot", 25000,
    "A bio-mechanical replacement for a lost leg and foot.",
    "Location: Leg & Foot. P.S. 10-12, P.P. 10, supports Spd 12, S.D.C. 3D6+40. Weight ~15 lbs (6.7 kg).\nCost tiers: 25,000 cr standard mechanical; 40,000 cr cybernetic + Bio-System; 80,000 cr full flesh-and-blood Bio-System."),
  cyber("Rebuild Hip & Leg Joint", "app:Torso & Skeleton", 25000,
    "Rebuild of the hip area, compatible with the original or a cybernetic leg.",
    "Location: Hip/Pelvis. P.S. 10, P.P. 10, S.D.C. 2D6+30. Weight ~5 lbs (2.25 kg).\nCost tiers: 25,000 cr standard mechanical; 35,000 cr cybernetic + Bio-System; 70,000 cr full flesh-and-blood Bio-System. DOUBLE cost to completely replace the pelvis."),
  cyber("Rebuild Shoulder & Shoulder Blade", "app:Torso & Skeleton", 20000,
    "Rebuild of the shoulder area, compatible with the original or a cybernetic arm.",
    "Location: Shoulder. P.S. 8-10, P.P. 10, S.D.C. 2D6+30. Weight ~5 lbs (2.25 kg).\nCost tiers: 20,000 cr standard mechanical; 32,000 cr cybernetic + Bio-System; 50,000 cr full flesh-and-blood Bio-System."),
  cyber("Reinforced Bones", "app:Torso & Skeleton", 250000,
    "An S.D.C. or M.D.C. metal and ceramic bone replaces the original. May be done for medical reasons (bone cancer, shattered bone, etc.) or to provide reinforced bones for combat or hazardous labor. Original skin and muscle is put over the synthetic bone structure. Most of the cost is the long and dangerous surgery — a very painful procedure.",
    "Location: per appendage, rib cage or pelvis (does NOT include spine). S.D.C. 90, or 1D6+10 M.D.C. per appendage.\nCost: 250,000 cr S.D.C. / 450,000 cr M.D.C. per appendage/rib cage/pelvis.\nBonus: +2D6+20 to overall S.D.C. if more than 50% of the bones have been replaced."),
  cyber("Cybernetic Spine (Vertebrae)", "app:Torso & Skeleton", 25000,
    "Spinal surgery is tricky and dangerous even for the advanced medicine of Rifts Earth's most technological civilizations. Cybernetic replacement pieces can replace broken and crushed vertebrae to restore the spine to as good as new. Back pain is completely gone after healing.",
    "Location: Spine. Cost: 25,000 cr per vertebra; 750,000 cr to completely replace the spine with a cybernetic system (three times more durable than the original; 80 S.D.C.). An M.D.C. spine is considered bionic augmentation."),
  cyber("Skull Case", "app:Head", 60000,
    "50-100% of the cranium is replaced with a synthetic one, usually to replace a shattered skull, shaped to resemble the original head as closely as possible. May be done for medical reasons or to provide a reinforced skull for combat or hazardous labor personnel. Original skin is put over the skull casing.",
    "Location: Head/Skull. S.D.C. 100, or 1D6+16 M.D.C. Weight ~3-5 lbs (1.35-2.25 kg).\nCost: 60,000 cr S.D.C. / 120,000 cr M.D.C. casing (most of the cost is the long and dangerous brain surgery)."),

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

ui.notifications.info(`${PACK_LABEL}: ${created} cybernetic item(s) added, ${moved} moved into folders, ${items.length - created - moved} already in place.`);
