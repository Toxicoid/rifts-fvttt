// ============================================================
// RIFTS RPG - Rifts Cybernetics (Data-Driven Rebuild)
// Builds the "Rifts Cybernetics & Bionics" compendium from
// spreadsheet data: one folder per source sheet, items carry
// per-category SPECS (only the fields that category has).
// Safe to re-run: skips existing by name, moves into folders.
//
// NOTE: replaces the old hand-built category folders. Delete an
// old folder's items before re-running to get reworked versions.
// ============================================================

const PACK_NAME = "rifts-cybernetics";
const PACK_LABEL = "Rifts Cybernetics & Bionics";

let pack = game.packs.get(`world.${PACK_NAME}`);
if (!pack) {
  pack = await foundry.documents.collections.CompendiumCollection.createCompendium({
    label: PACK_LABEL, name: PACK_NAME, type: "Item",
  }).catch(async () => {
    return await CompendiumCollection.createCompendium({
      label: PACK_LABEL, name: PACK_NAME, type: "Item",
    });
  });
  ui.notifications.info(`Created compendium: ${PACK_LABEL}`);
}

const folders = {};
async function categoryFolder(name) {
  if (folders[name]) return folders[name];
  let f = pack.folders.find((x) => x.name === name && !x.folder);
  if (!f) f = await Folder.create({ name, type: "Item" }, { pack: pack.collection });
  folders[name] = f;
  return f;
}

// ── Item helper ────────────────────────────────────────────
// specs = [{label, value}, ...] straight from the source sheet's
// columns; the item sheet shows exactly these, nothing more.
const defs = [];
const cyb = (name, folderName, cost, description, specs, notes = "") =>
  defs.push({ name, folderName, cost, description, specs, notes });

// ═══ MEDICAL CYBERNETICS (from Medical_Cybernectics.xlsx) ═
cyb("Medical Blood Analysis/Tox-Screen", "Medical Cybernetics", 30000, "Special sensors and implants in the hand enable it to do a basic screen for 60 common toxins and blood anomalies (i.e., too much or too little insulin, sugar, cholesterol, white and red cell count, poison, etc.). The subject's blood to be tested must physically touch the area of the hand (may be a particular fmger or area of the palm) to do the analysis. Can also indicate whether the sample is of a human, animal, D-Bee or unknown (alien) blood type.", [{ label: "Cost", value: "30,000 credits" }]);

cyb("Medical Epidermic Analyzer", "Medical Cybernetics", 35000, "Molecular analyzers in the hand identify and measure the amount of salt, sugar and powerful enzymes or chemicals by touching a person's skin and/or perspiration. It can also measure the patient's body temperate by touch (touch for 30 seconds).", [{ label: "Cost", value: "35,000 credits" }]);

cyb("Medical Epidermal Temperature Gauge", "Medical Cybernetics", 1000, "Basically the hand or a specific finger can take a person's body temperature by simply touching the subject on the neck, head or armpits.", [{ label: "Cost", value: "1,000 credits" }]);

cyb("Medical Laser Scalpel Finger", "Medical Cybernetics", 5000, "One of the fingers is really a laser scalpel used for surgery.", [{ label: "Cost", value: "5,000 credits" }, { label: "Damage", value: "1D4 S.D.C" }]);

cyb("Medical Pulse & Pressure Detector", "Medical Cybernetics", 25000, "By simply squeezing and holding a patient's wrist or finger for a minute, the doctor can accurately measure the character' s pulse rate. By squeezing, holding and slowly releasing the wrist, the doctor can also measure the patient's blood pressure.", [{ label: "Cost", value: "25,000 credits" }]);

cyb("Medical Stethoscope Feature", "Medical Cybernetics", 10000, "This feature can only be used in conjunction with one of the cybernetic or bionic ear implants or a universal Headjack and receiver. The doctor can use his hand or ear like a stethoscope, placing it on the patient's chest or back and listen to his heartbeat and/or breathing.", [{ label: "Cost", value: "10,000 credits" }]);

cyb("Medical: Sensor Hand", "Medical Cybernetics", 60000, "This bit of hardware closely resembles an ordinary sensor hand, except it has been designed with medical care, rather than general utility, in mind. As many as 14 features can be installed in the hand. Each sensor feature must be purchased separately. Includes all Medical features, above, plus 1D4 other cybernetic systems.", [{ label: "Cost", value: "60,000 credits" }]);

// ═══ BIO-SYSTEM EYES (from Bio-System_Eyes.xlsx) ══════════
cyb("Infrared/Ultra-V Eye", "Bio-System Eyes", 70000, "A natural, but a bit unusual looking eye. The pupil is noticeably larger than a normal eye's and the iris is an unusual violet or alizarin color. This eye enables the character to see into the infrared and ultraviolet spectrums of color. This means that the character can see in the dark equal to an infrared camera (range is about half the distance of normal, day vision), as well as see infrared and ultraviolet light normally invisible to humans. However, this changes the color perception for the character. Normal vision sees the colors blue, green, and red. The Infrared/Ultra-V eye sees the colors blue, green, and ultraviolet, so everything is seen in hues of purple-blues, deep greens, purple, and violet, much like wearing red or purple tinted sunglasses all the time.", [{ label: "Cost (Single)", value: "70,000 credits" }, { label: "Cost (Pair)", value: "125,000 credits" }], "The character cannot see the invisible nor see heat emanations, only red light (infrared) and ultraviolet light. 20/20 vision.");

cyb("\"Lifelike\" Simulated Eye", "Bio-System Eyes", 20000, "A natural, realistic eye that appears and functions exactly like the real thing, but is created in the laboratory with synthetic tissue and nano-technology. Choice of eye color. Perfect 20/20 vision.", [{ label: "Cost (Single)", value: "20,000 credits" }, { label: "Cost (Pair)", value: "35,000 credits" }], "");

cyb("Mood or Color-Changing Eyes", "Bio-System Eyes", 24000, "No special powers other than the eyes look natural and real, but can change 2-8 different colors to reflect the wearer's moods.", [{ label: "Cost (Pair)", value: "24,000 credits" }], "Plus 800 credits per each color it can change to.");

cyb("Nightvision Eyes", "Bio-System Eyes", 32000, "Perfect 20/20 daytime vision, plus a chip placed in or on the cornea gives the recipient keen nightvision. This is not quite as good as mechanical passive nightvision, but is up there. Can see clearly at night up to 800 feet (244 m); roughly equal to normal vision in a dimly light room. Very popular among guards, police, detectives, thieves, spies, and people who work (or play) at night.", [{ label: "Cost (Single)", value: "32,000 credits" }, { label: "Cost (Pair)", value: "58,000 credits" }], "");

cyb("Polarized Eye", "Bio-System Eyes", 30000, "Looks completely natural, but has light adjusting polarized filters to reduce glare. The glare of bright light and sunlight is filtered as if the individual were wearing the best polarized sunglasses available. Can look directly into the sun without being blinded. Engages automatically as needed. Choice of eye color. Perfect 20/20 vision.", [{ label: "Cost (Single)", value: "30,000 credits" }, { label: "Cost (Pair)", value: "53,000 credits" }], "");

cyb("Underwater Eye", "Bio-System Eyes", 35000, "The cornea is designed to automatically distort when submerged underwater, enabling it to compensate to the new watery environment without need of goggles or other eye protection. The character can see with crystal clarity underwater and in low light depths of up to 600 feet ( 183 m). The eye also contains a self-replicating oil that is automatically released into the eye whenever the water is murky or bright with sunlight. The oil droplets are haze filters which reduce glare from sunlight and filter out reflections and haze from tiny debris particles floating in the water, allowing for quality vision. The oil droplets are also released above water when exposed to bright light, creating a natural and instant filter/sunglasses effect, reducing glare (not as good as polarized vision, but equal to a cheap pair of sunglasses). 20/20 vision. Choice of eye color.", [{ label: "Cost (Single)", value: "35,000 credits" }, { label: "Cost (Pair)", value: "65,000 credits" }], "");

// ── Build ──────────────────────────────────────────────────
const index = await pack.getIndex();
const byName = new Map(index.map((e) => [e.name, e]));

let created = 0, moved = 0;
for (const def of defs) {
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
      type: "equipment",
      img: "icons/svg/upgrade.svg",
      folder: folder.id,
      system: {
        specs: def.specs,
        quantity: 1,
        weight: "",
        cost: def.cost,
        description: def.description,
        notes: def.notes,
      },
    },
    { pack: pack.collection }
  );
  created++;
}

ui.notifications.info(`${PACK_LABEL}: ${created} item(s) added, ${moved} moved into folders, ${defs.length - created - moved} already in place.`);
