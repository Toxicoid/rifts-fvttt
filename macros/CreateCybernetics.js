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
const bioSystems = await getOrCreateFolder("Bio-Systems", cyberRoot);

const loc = {};
for (const n of ["Hand", "Finger"]) loc[`med:${n}`] = await getOrCreateFolder(n, medical);
for (const n of ["Finger & Toe", "Hand", "Arm", "Leg & Foot", "Torso & Skeleton", "Head"])
  loc[`app:${n}`] = await getOrCreateFolder(n, appendages);
for (const n of ["Eyes", "Head", "Internal Organs"]) loc[`bio:${n}`] = await getOrCreateFolder(n, bioSystems);
const lungImplants = await getOrCreateFolder("Lung Implants", cyberRoot);
loc["lung"] = lungImplants;
const commercial = await getOrCreateFolder("Commercial", cyberRoot);
loc["com:Eyes"] = await getOrCreateFolder("Eyes", commercial);

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

  // ═══ BIO-SYSTEM EYES ═════════════════════════════════════
  cyber("Infrared/Ultra-V Eye (Bio-System)", "bio:Eyes", 70000,
    "A natural but unusual looking eye — the pupil is noticeably larger than normal and the iris is an unusual violet or alizarin color. Enables sight into the infrared and ultraviolet spectrums: see in the dark equal to an infrared camera (range about half of normal day vision) and see IR/UV light invisible to humans. Color perception changes — sees blue, green and ultraviolet, so everything appears in purple-blues, deep greens, purple and violet, like wearing red or purple tinted sunglasses all the time. 20/20 vision.",
    "Location: Eye. CANNOT see the invisible nor heat emanations — only red (infrared) and ultraviolet light.\nCost: 70,000 cr single / 125,000 pair. Half cost for a cybernetic version."),
  cyber("\"Lifelike\" Simulated Eye (Bio-System)", "bio:Eyes", 20000,
    "A natural, realistic eye that appears and functions exactly like the real thing, created in the laboratory with synthetic tissue and nano-technology. Choice of eye color. Perfect 20/20 vision.",
    "Location: Eye. Cost: 20,000 cr per eye / 35,000 pair if installed at the same time. Half cost for a cybernetic version."),
  cyber("Mood or Color-Changing Eyes (Bio-System)", "bio:Eyes", 24000,
    "No special powers other than the eyes look natural and real, but can change 2-8 different colors to reflect the wearer's moods. 20/20 vision.",
    "Location: Eyes (pair). Cost: 24,000 cr for a pair of 20/20 Bio-System eyes, plus 800 cr per each color it can change to. Half for a lifelike pair of cybernetic eyes."),
  cyber("Nightvision Eyes (Bio-System)", "bio:Eyes", 32000,
    "Perfect 20/20 daytime vision, plus a chip placed in or on the cornea gives the recipient keen nightvision. Not quite as good as mechanical passive nightvision, but close: see clearly at night up to 800 feet (244 m) — roughly equal to normal vision in a dimly lit room. Very popular among guards, police, detectives, thieves, spies, and people who work (or play) at night.",
    "Location: Eye. Nightvision 800 ft (244 m). Cost: 32,000 cr per eye / 58,000 pair if installed simultaneously."),
  cyber("Polarized Eye (Bio-System)", "bio:Eyes", 30000,
    "Looks completely natural, but has light-adjusting polarized filters to reduce glare. Bright light and sunlight are filtered as if wearing the best polarized sunglasses available; can look directly into the sun without being blinded. Engages automatically as needed. Choice of eye color. Perfect 20/20 vision.",
    "Location: Eye. Cost: 30,000 cr per eye / 53,000 pair if installed at the same time. Half cost for a cybernetic version."),
  cyber("Underwater Eye (Bio-System)", "bio:Eyes", 35000,
    "The cornea automatically distorts when submerged, compensating for the watery environment without goggles. Crystal-clear underwater vision in low light to depths of 600 feet (183 m). Contains a self-replicating oil released when water is murky or bright — haze filters that reduce glare and filter reflections and debris haze. The oil also releases above water in bright light, creating an instant filter/sunglasses effect (equal to a cheap pair of sunglasses). 20/20 vision. Choice of eye color.",
    "Location: Eye. Underwater vision to 600 ft (183 m) depth. Cost: 35,000 cr single / 65,000 pair if purchased together. Half for a mechanical cybernetic version."),

  // ═══ BIO-SYSTEMS FOR THE HEAD ════════════════════════════
  cyber("Inner Ear (Bio-System)", "bio:Head", 20000,
    "Completely rebuilds the inner ear and eardrum to create perfect human hearing. No augmentation.",
    "Location: Ear. Cost: 20,000 cr per ear / 36,000 for the pair if done at the same time."),
  cyber("Outer Ear (Bio-System)", "bio:Head", 2000,
    "A cosmetic procedure that replaces a damaged or missing outer ear with a natural living ear. Looks and feels just like the genuine article; no scarring.",
    "Location: Ear (outer). Cost: 1,500-2,000 cr for a replacement matching the original ear's skin color perfectly; 500 cr for a generic replacement that matches neither skin color nor shape."),
  cyber("Nasal Passages (Bio-System)", "bio:Head", 5000,
    "Restores or replaces damaged nasal passages with synthetic skin and olfactory sensors. Duplicates the natural human ability to smell at 75%.",
    "Location: Nose (internal). Smell at 75%. Cost: 5,000 cr."),
  cyber("Outer Nose (Bio-System)", "bio:Head", 2000,
    "A cosmetic procedure that replaces a damaged or missing nose with natural looking living tissue built over a synthetic frame.",
    "Location: Nose (outer). Cost: 2,000 cr to match the original nose (or a nose structure of choice) and skin color perfectly; 900 cr for a generic replacement that may be a little too big, small, or wide."),
  cyber("Lips (Bio-System)", "bio:Head", 600,
    "A cosmetic procedure that replaces damaged or missing lips with natural looking and feeling living tissue; good as new. Now give me a kiss.",
    "Location: Mouth. Cost: 600 cr."),
  cyber("Tongue (Bio-System)", "bio:Head", 14000,
    "Replaces a damaged tongue with a synthetic one composed of living tissue, blood vessels, and taste buds/sensors. Duplicates the natural ability to taste at 63% and offers full speech articulation.",
    "Location: Mouth. Taste at 63%; full speech. Cost: 14,000 cr."),
  cyber("Larynx and Voice Box (Bio-System)", "bio:Head", 18000,
    "Replaces the damaged organ with a synthetic but lifelike Bio-System that simulates human sound/voice. The voice can simulate the original exactly, as long as a quality recording is provided — or the patient may create a new voice by selecting the desired aspects and qualities, all programmed into the replacement unit.",
    "Location: Throat. Cost: 18,000 cr."),

  // ═══ BIO-SYSTEM INTERNAL ORGANS ══════════════════════════
  cyber("Artificial Heart (Bio-System)", "bio:Internal Organs", 70000,
    "Bio-System replacement heart.", "Location: Chest. 40 year life. Cost: 70,000 cr."),
  cyber("Artificial Lungs (Bio-System)", "bio:Internal Organs", 50000,
    "Bio-System replacement lungs.", "Location: Chest. 40 year life. Cost: 50,000 cr."),
  cyber("Artificial Kidney (Bio-System)", "bio:Internal Organs", 30000,
    "Bio-System replacement kidney.", "Location: Torso. 30 year life. Cost: 30,000 cr."),
  cyber("Artificial Liver (Bio-System)", "bio:Internal Organs", 30000,
    "Bio-System replacement liver.", "Location: Torso. 30 year life. Cost: 30,000 cr."),
  cyber("Artificial Spleen (Bio-System)", "bio:Internal Organs", 30000,
    "Bio-System replacement spleen.", "Location: Torso. 30 year life. Cost: 30,000 cr."),
  cyber("Artificial Intestine (Bio-System)", "bio:Internal Organs", 10000,
    "Bio-System replacement intestine.", "Location: Torso. 25 year life. Cost: 10,000 cr."),
  cyber("Artificial Skin / Plastic Surgery (Bio-System)", "bio:Internal Organs", 0,
    "Synthetic skin grafts and reconstructive surgery. 50 year life.",
    "Location: varies. Cost varies by complexity: 1D4x1,000 cr for minor skin grafts (hand or small fleshy area); 2D6x1,000 for minimal work on a large fleshy area (leg or back); 1D4x10,000+ for muscle and skin reconstruction; 2D6x10,000+ for muscle, skin and bone reconstruction. Add 20% when working on the face."),

  // ═══ CYBERNETIC LUNG IMPLANTS ════════════════════════════
  cyber("Molecular Analyzer (Lung Implant)", "lung", 35000,
    "Micro-chip based sensor for testing and analyzing impurities in the air. Specifically identifies any chemical or strange/dangerous molecules — gas, oil, pollution, or other chemicals. Data can be transmitted as an audio report through an ear implant or to a wristwatch-like receiver.",
    "Location: Lungs/Chest. Does NOT enable tracking. Cost: 35,000 cr. (Cybernetic version — the bionic model in Cyborg > Bionics costs 50,000.)"),
  cyber("Oxygen Storage Cell (Lung Implant)", "lung", 60000,
    "A special chemical cell, controlled by micro-processors, that stores oxygen from the character's normal breathing. When oxygen is low, it is released back into the lungs — the character can go without breathing for up to 30 minutes.",
    "Location: Lungs/Chest. 30 minutes without breathing; must breathe normally for about an hour to recharge between uses. Cost: 60,000 cr."),
  cyber("Toxic Filter (Lung Implant)", "lung", 40000,
    "A mechanism designed to filter most toxic gases out before they enter the lungs. Effective against all types of tear gas, smoke, and purely chemical fumes.",
    "Location: Lungs/Chest. 80% chance to also work against nerve gases and poison gases. Cost: 40,000 cr."),

  // ═══ COMMERCIAL CYBERNETICS — EYES ═══════════════════════
  cyber("Cyber-Camera Eye (Cybernetic)", "com:Eyes", 30000,
    "Looks like an ordinary cybernetic eye and provides 20/20 sight, but is also a digital (or video) camera that records and/or transmits everything seen. Live feed is most common; up to one hour of filming can be recorded on a memory chip.",
    "Location: Eye. Transmission range 20 mi (32 km) city / 60 mi (96 km) wilderness. Cost: 30,000 cr single basic color+sound / 50,000 pair. +20,000 synchronized digital audio recording/transmission; +40,000 broadband (doubles transmission range). Sometimes illegal for average citizens. Illegal in the CS."),
  cyber("Cyber-Camera Studio Eye", "com:Eyes", 20000,
    "A concealed cybernetic recording device — typically one eye or a third eye — providing NO simulated vision, but a fully miniaturized video camera system. Records everything the person sees and hears onto a two- or four-hour video disc in a skull implant; the disc ejects from a tiny slot for replacement. A Headjack enables plugging directly into a monitor to display/record without removing the disc, and into duplicating equipment to dupe recordings onto other media or transmit them.",
    "Location: Eye (replaces vision in that eye). Cost: 20,000 cr. Sometimes illegal for average citizens. Illegal in the CS."),
  cyber("Cyber-Lens Implant", "com:Eyes", 500,
    "A simple implant inserted into the eye to correct common problems: nearsightedness, farsightedness, astigmatism, degenerative myopia. Has replaced eyeglasses wherever available. Instantly restores vision to 20/20.",
    "Location: Eye. Cost: 400-600 cr per eye."),
  cyber("\"Lifelike\" Simulated Eye (Cybernetic)", "com:Eyes", 12000,
    "A natural, realistic cyber-eye that appears and functions exactly like the real thing, created with lens, plastic and nano-technology. Choice of eye color. Perfect 20/20 vision.",
    "Location: Eye. Cost: 12,000 cr per eye / 20,000 pair if installed at the same time."),
  cyber("Infrared Eye (Cybernetic)", "com:Eyes", 6000,
    "Relies on a pencil-thin beam of infrared light projected from the eye to the target; the narrow beam limits viewing to about a 7 ft (2.1 m) area. Also simulates normal human vision.",
    "Location: Eye. Range 1,200 ft (366 m). Cost: 6,000 cr / 9,000 pair."),
  cyber("Macro-Eye (Cybernetic)", "com:Eyes", 20000,
    "A robot-looking eye that magnifies tiny objects at close range (within 3 ft / 0.9 m) — magnifying glass to microscope magnification (2x to 50x). Equipped with filters to block glare and dust. Extremely popular among medics, doctors, forgers and engineers (great for spotting defects and cracks).",
    "Location: Eye. Cost: 20,000 cr per eye; photographic camera (still or video) +10,000. See also Modular Eye Socket. A character would seldom get two Macro-Eyes."),
  cyber("Macro-Eye Laser", "com:Eyes", 80000,
    "Very similar to the standard Macro-Eye but with a tiny surgical laser built in. A targeting beam indicates exactly where the laser will fire before it is engaged. Used exclusively for internal surgery — inflicts little discernible damage to external targets (one S.D.C. point). A favorite of doctors and surgeons.",
    "Location: Eye. Magnification limited to 2x-30x. Cost: 80,000 cr. A character would seldom get two Macro-Eyes."),
  cyber("Mechanical Eye w/ Polarized Filter", "com:Eyes", 10000,
    "A robot-looking eye simulating normal human vision, with polarized vision added. Bright light and sunlight are polarized as if wearing the best sunglasses available; can look directly into the sun without being blinded. Engages automatically. Choice of lens color. Perfect 20/20 vision.",
    "Location: Eye. Cost: 10,000 cr per eye / 16,000 pair installed at the same time. (Standard issue for starting Combat Cyborgs.)"),
  cyber("Modular Eye Socket (Multi-System)", "com:Eyes", 100000,
    "The eye socket is designed to allow the wearer to remove the artificial eye and replace it with any eye made to fit the universal modular housing. Modular eyes can be swapped as needed or desired.",
    "Location: Eye socket. Cost: 100,000 cr for the socket housing (half what it cost ten years ago), plus 10,000 cr per eye to fit it with modular capability (pops in and out with ease). Bio-System eyes do NOT work in this housing — mechanical types only."),
  cyber("Multi-Optic Eye (Cybernetic)", "com:Eyes", 60000,
    "A mechanical optic system with multiple systems in a single cyber-eye: Telescopic (4-8x30, 6,000 ft / 1,829 m), Macro Lens (2x-8x, 3 ft), Passive Night-vision (2,000 ft), Thermo-Imaging (2,000 ft), Light Filters (reduces glare), Targeting Display (cross-hairs, +1 to strike with any ranged weapon — same bonus for one or two eyes).",
    "Location: Eye. Cost: 55,000-60,000 cr per eye / 100,000 pair installed together. (Cybernetic macro lens is 2x-8x vs the bionic model's 2x-20x.)"),
  cyber("Night-Eyes (Cybernetic)", "com:Eyes", 32000,
    "Perfect 20/20 daytime vision, plus a chip in the cornea or on the retinal cord gives passive night-vision — roughly equal to normal vision in a dimly lit room. Very popular among guards, police, detectives, thieves, spies, City Rats, and people who work (or play) at night.",
    "Location: Eye. See clearly at night up to 400 ft (122 m). Cost: 32,000 cr per eye / 58,000 pair installed simultaneously. (Bio-System Nightvision Eyes reach 800 ft.)"),
  cyber("Optic Nerve Video Implant (Cybernetic)", "com:Eyes", 35000,
    "Implants an optical sensor right on the optic nerve. Works like the Headjack's inner-ear implant, but for video: the recipient sees video transmissions in his head/eyes. Incredibly useful for secretly monitoring video transmissions and discs. Combined with a Headjack, enables both seeing and hearing audio-visual messages.",
    "Location: Optic nerve. Cost: 35,000 cr (delicate operation). Blind restoration experiments: 1-45% full restoration, 46-80% restores 65%, 81-95% restores 40%, 96-00% restores 10% (legally blind). Sometimes illegal for average citizens. Illegal in the CS."),
  cyber("Telescopic Eye (Cybernetic)", "com:Eyes", 12000,
    "In addition to normal 20/20 vision, the eye has a telescopic lens for long-distance viewing (4-10x50 magnification).",
    "Location: Eye. Range 6,000 ft (1,829 m). Cost: 12,000 cr / 20,000 pair."),
  cyber("Targeting Sight (Eye Feature)", "com:Eyes", 4000,
    "A feature addable to any of the mechanical eyes. Cross-hairs are superimposed over the visual image to help focus on a specific target area.",
    "Location: Eye (feature). +1 to strike with any weapon; two targeting eyes still provide only +1, not +2. Cost: 4,000 cr. Sometimes illegal for average citizens. Illegal in the CS."),
  cyber("Thermo-Imager Eye (Cybernetic)", "com:Eyes", 12000,
    "Simulates normal human vision with an optical heat sensor added. The lens converts infrared radiation of warm objects into a visible image — see heat as bands of color, in darkness, shadows, and through smoke. Perfect 20/20 vision.",
    "Location: Eye. Range 3,000 ft (914 m). Cost: 12,000 cr / 20,000 pair. Sometimes illegal for average citizens. Illegal in the CS."),
  cyber("Third Eye", "com:Eyes", 350000,
    "A cybernetic eye implanted either above a real eye or in the center of the forehead. The mechanical eye can be any of the available artificial eyes, but is typically one of the camera eyes or a Multi-Optic eye.",
    "Location: Forehead. Cost: 350,000 cr. PENALTY: reduce the character's P.B. by 20%. Sometimes illegal for average citizens. Illegal in the CS."),

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
