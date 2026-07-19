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
// Weapon variant: creates a rollable weapon item (forearm blasters, blades...)
const cybW = (name, folderName, cost, description, weapon, specs, notes = "") =>
  defs.push({ name, folderName, cost, description, specs, notes, weapon });

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

// ═══ BIO-SYSTEMS FOR THE HEAD (from Bio-Systems_for_the_Head.xlsx) ═
cyb("Inner Ear", "Bio-Systems for the Head", 20000, "Completely rebuilds inner ear and eardrum to create perfect human hearing. No augmentation.", [{ label: "Cost (Single)", value: "20,000 credits" }, { label: "Cost (Pair)", value: "36,000 credits" }], "");

cyb("Outer Ear", "Bio-Systems for the Head", 2000, "A cosmetic procedure that replaces a damaged or missing outer ear with a natural living ear. Looks and feels just like the genuine article; no scarring.", [{ label: "Cost (Single)", value: "2,000 credits" }, { label: "Cost (Generic)", value: "500 credits" }], "A generic replacement does not match the skin color nor shape of the original.");

cyb("Nasal Passages", "Bio-Systems for the Head", 5000, "Restores or replaces damaged nasal passages with synthetic skin and olfactory sensors. Duplicates the human's natural ability to smell at 75%.", [{ label: "Cost (Single)", value: "5,000 credits" }], "");

cyb("Outer Nose", "Bio-Systems for the Head", 2000, "A cosmetic procedure that replaces a damaged or missing nose with natural looking living tissue built over a synthetic frame.", [{ label: "Cost (Single)", value: "2,000 credits" }, { label: "Cost (Generic)", value: "900 credits" }], "A generic replacement that does not match the skin color nor perfectly match the shape of the face (could be a little too big, too small, or too wide).");

cyb("Lips", "Bio-Systems for the Head", 600, "A cosmetic procedure that replaces damaged or missing lips with natural looking and feeling living tissue; good as new. Now give me a kiss!", [{ label: "Cost (Single)", value: "600 credits" }], "");

cyb("Tongue", "Bio-Systems for the Head", 14000, "Replaces a damaged tongue with a synthetic one composed of living tissue, blood vessels, and taste buds/sensors. Duplicates the natural ability to taste by 63% and offers full speech articulation.", [{ label: "Cost (Single)", value: "14,000 credits" }], "");

cyb("Larynx and Voice Box", "Bio-Systems for the Head", 18000, "Replaces the damaged organ with a synthetic but lifelike Bio-System that can simulate human sound/voice. The voice can be made to simulate the original voice exactly, as long as a quality recording is provided. Or the patient may create a new voice by selecting the desired aspects and quality of that voice, all of which are programmed into the replacement unit.", [{ label: "Cost (Single)", value: "18,000 credits" }], "");

// ═══ BIO-SYSTEM INTERNAL ORGANS (from Bio-System_Internal_Organs.xlsx) ═
cyb("Artificial Heart", "Bio-System Internal Organs", 70000, "", [{ label: "Lifespan", value: "40 year life" }, { label: "Cost", value: "70,000 credits" }], "");

cyb("Artificial Lungs", "Bio-System Internal Organs", 50000, "", [{ label: "Lifespan", value: "40 year life" }, { label: "Cost", value: "50,000 credits" }], "");

cyb("Artificial Kidney", "Bio-System Internal Organs", 30000, "", [{ label: "Lifespan", value: "30 year life" }, { label: "Cost", value: "30,000 credits" }], "");

cyb("Artificial Liver", "Bio-System Internal Organs", 30000, "", [{ label: "Lifespan", value: "30 year life" }, { label: "Cost", value: "30,000 credits" }], "");

cyb("Artificial Spleen", "Bio-System Internal Organs", 30000, "", [{ label: "Lifespan", value: "30 year life" }, { label: "Cost", value: "30,000 credits" }], "");

cyb("Artificial Intestine", "Bio-System Internal Organs", 10000, "", [{ label: "Lifespan", value: "25 year life" }, { label: "Cost", value: "10,000 credits" }], "");

cyb("Artificial Skin/Plastic Surgery", "Bio-System Internal Organs", 0, "", [{ label: "Lifespan", value: "50 year life" }, { label: "Cost", value: "Varies" }], "1D4x1000 credits for minor skin grafts. 2D6x1000 for minimal work. 1D4x10,000 for muscle and skin reconstruction. 2D6X10,000 or more for muscle, skin, and bone reconstruction.");

// ═══ CYBERNETIC APPENDAGES, PROSTHETICS & BONE (from Cybernetic_Appendages__Prosthetics___Bone.xlsx) ═
cyb("Cybernetic Finger (or Toe)", "Cybernetic Appendages, Prosthetics & Bone", 300, "A bio-mechanical replacement digit for a lost finger, usually sized and molded to resemble the remaining fingers as closely as possible.", [{ label: "P.S.", value: "4-8" }, { label: "S.D.C.", value: "1D4" }, { label: "Cost (Standard Cybernetic)", value: "300 credits" }, { label: "Cost (Cybernetic Bio-System)", value: "1,000 Credits" }, { label: "Cost (Blood Bio-System)", value: "2,000 credits" }]);

cyb("Cybernetic Foot", "Cybernetic Appendages, Prosthetics & Bone", 10000, "A bio-mechanical replacement for a lost foot, fitted to be as similar in shape and size as possible to the lost appendage.", [{ label: "P.S.", value: "8-10" }, { label: "Spd", value: "10" }, { label: "S.D.C.", value: "2D6+25" }, { label: "Cost (Standard Cybernetic)", value: "10,000 credits" }, { label: "Cost (Cybernetic Bio-System)", value: "16,000 Credits" }, { label: "Cost (Blood Bio-System)", value: "24,000 credits" }]);

cyb("Cybernetic Hand", "Cybernetic Appendages, Prosthetics & Bone", 12000, "A bio-mechanical replacement for a lost hand, fitted to be as similar in shape and size as possible to the lost appendage.", [{ label: "P.S.", value: "8-10" }, { label: "P.P.", value: "8-10" }, { label: "S.D.C.", value: "2D6+16" }, { label: "Cost (Standard Cybernetic)", value: "12,000 credits" }, { label: "Cost (Cybernetic Bio-System)", value: "18,000 Credits" }, { label: "Cost (Blood Bio-System)", value: "30,000 credits" }]);

cyb("Cybernetic Hand & Forearm", "Cybernetic Appendages, Prosthetics & Bone", 12000, "A bio-mechanical replacement for a lost hand and forearm, fitted to be as similar in shape and size as possible to the lost appendage.", [{ label: "P.S.", value: "8-10" }, { label: "P.P.", value: "8-10" }, { label: "S.D.C.", value: "2D6+24" }, { label: "Weight (Human)", value: "6 lbs" }, { label: "Cost (Standard Cybernetic)", value: "12,000 credits" }, { label: "Cost (Cybernetic Bio-System)", value: "22,000 Credits" }, { label: "Cost (Blood Bio-System)", value: "40,000 credits" }]);

cyb("Cybernetic Hand & Entire Arm", "Cybernetic Appendages, Prosthetics & Bone", 24000, "This is a cybernetic prosthetic of the entire arm from fingertip to shoulder.", [{ label: "P.S.", value: "8-10" }, { label: "P.P.", value: "10" }, { label: "S.D.C.", value: "3D6+30" }, { label: "Weight (Human)", value: "9 lbs" }, { label: "Cost (Standard Cybernetic)", value: "24,000 credits" }, { label: "Cost (Cybernetic Bio-System)", value: "38,000 Credits" }, { label: "Cost (Blood Bio-System)", value: "75,000 credits" }]);

cyb("Cybernetic Leg & Foot", "Cybernetic Appendages, Prosthetics & Bone", 25000, "This is a cybernetic prosthetic of the entire leg from toes to thigh.", [{ label: "P.S.", value: "10-12" }, { label: "P.P.", value: "10" }, { label: "Spd", value: "12" }, { label: "S.D.C.", value: "3D6+40" }, { label: "Weight (Human)", value: "15 lbs" }, { label: "Cost (Standard Cybernetic)", value: "25,000 credits" }, { label: "Cost (Cybernetic Bio-System)", value: "40,000 Credits" }, { label: "Cost (Blood Bio-System)", value: "80,000 credits" }]);

cyb("Rebuild Hip & Leg Joint", "Cybernetic Appendages, Prosthetics & Bone", 25000, "Rebuild hip area with the original or a cybernetic leg.", [{ label: "P.S.", value: "10" }, { label: "P.P.", value: "10" }, { label: "S.D.C.", value: "2D6+30" }, { label: "Weight (Human)", value: "5 lbs" }, { label: "Cost (Standard Cybernetic)", value: "25,000 credits" }, { label: "Cost (Cybernetic Bio-System)", value: "35,000 Credits" }, { label: "Cost (Blood Bio-System)", value: "70,000 credits" }]);

cyb("Rebuild Shoulder & Shoulder Blade", "Cybernetic Appendages, Prosthetics & Bone", 20000, "Rebuild shoulder area with original or cybernetic arm.", [{ label: "P.S.", value: "8-10" }, { label: "P.P.", value: "10" }, { label: "S.D.C.", value: "2D6+30" }, { label: "Weight (Human)", value: "5 lbs" }, { label: "Cost (Standard Cybernetic)", value: "20,000 credits" }, { label: "Cost (Cybernetic Bio-System)", value: "32,000 Credits" }, { label: "Cost (Blood Bio-System)", value: "50,000 credits" }]);

cyb("Reinforced Bones", "Cybernetic Appendages, Prosthetics & Bone", 250000, "An S.D.C. or M.D.C. metal and ceramic bone replaces the original. May be done for medical reasons (bone cancer, shattered bone, etc.) or to provide reinforced bones for combat or hazardous labor.", [{ label: "S.D.C.", value: "90" }, { label: "M.D.C.", value: "1D6+10" }, { label: "Weight (Human)", value: "Varies" }, { label: "Cost for S.D.C.", value: "250,000 credits" }, { label: "Cost for M.D.C.", value: "450,000 credits" }, { label: "Bonus", value: "2D6+20 to overall S.D.C if more than 50% of the bones have been replaced. Very painful procedure." }]);

cyb("Spine", "Cybernetic Appendages, Prosthetics & Bone", 25000, "Spinal surgery is tricky and dangerous even for the advanced medicine of Rifts Earth's most technological civilizations. Cybernetic replacement pieces can be used to replace broken and crushed vertebrae to restore the spine to as good as new. Back pain is completely gone after healing.", [{ label: "S.D.C.", value: "80" }, { label: "Cost Per Vertebra", value: "25,000 credits" }]);

cyb("Skull Case", "Cybernetic Appendages, Prosthetics & Bone", 60000, "50- 100% of the cranium is replaced with a synthetic one, usually to replace a shattered skull and shaped to resemble the original head as close as possible. May be done for medical reasons or to provide a reinforced skull for combat or hazardous labor personnel.", [{ label: "S.D.C.", value: "100" }, { label: "M.D.C.", value: "1D6+16" }, { label: "Weight (Human)", value: "5 lbs" }, { label: "Cost for S.D.C.", value: "60,000 credits" }, { label: "Cost for M.D.C.", value: "120,000 credits" }]);

// ═══ COMMERCIAL AUDIO, EAR & HEAD IMPLANTS (from Commercial_Audio__Ear___Head_Implants.xlsx) ═
cyb("Amplified Hearing", "Commercial Audio, Ear & Head Implants", 20000, "A system of tiny sound amplifiers, microphones and receivers are built into the ear canal, enabling the character to hear almost inaudible sounds.", [{ label: "Range", value: "360 feet" }, { label: "Cost", value: "20,000 credits" }, { label: "Bonuses", value: "+1 to parry, +2 to dodge, and +3 on initiative" }], "At 75 feet: softer than a whisper, can be heard. At 150 Feet: a whisper, can be heard clearly. At 360 feet: Normal conversation can be heard.");

cyb("Language Translator", "Commercial Audio, Ear & Head Implants", 16000, "A miniaturized language translator placed right inside the body to facilitate easy communication with the multitude of nonhuman life forms on Rifts Earth. Starts with 10 different languages to begin with, and eight additional languages can be added. (requires an ear implant if none exists yet)", [{ label: "Cost", value: "16,000 credits" }], "Level of accuracy is 98.7% when listening to only one or two speakers and languages at a time. Drops to 70% with a six second delay when trying to translate 3-6 speakers simultaneously, 22% if more than that.");

cyb("Radio Chip (advanced)", "Commercial Audio, Ear & Head Implants", 3000, "Usually implanted in the ear or at the base of the skull. The chip is a radio receiver that enables the character to listen to public radio and television bands of transmission. Superior quality and depth of sound. Channels are typically changed using a tiny, hand-held remote control unit or via a computer or monitor jacked into the cybernetic individual. Most people have it installed for recreational purposes", [{ label: "Cost", value: "3,000 credits" }], "");

cyb("Radio Chip (Wideband conversion)", "Commercial Audio, Ear & Head Implants", 3000, "", [{ label: "Cost", value: "3,000 credits" }], "Sometimes illegal; illegal in CS states.");

cyb("Radio Chip (Broadband conversion)", "Commercial Audio, Ear & Head Implants", 10000, "Adds 1000 frequencies.", [{ label: "Cost", value: "10,000 credits" }], "Sometimes illegal; illegal in CS states.");

cyb("Radio & Scrambler Implant (experimental)", "Commercial Audio, Ear & Head Implants", 80000, "An implant with organic circuitry developed by the military that enables the user to interface with a specially modified radio through mental control. For most cyborgs, the short-wave radio will be housed in a compartment on the armored back. Can broadcast on 800 frequencies and automatically scrambles and decodes all transmissions. It can also send scrambled and coded messages. This implant interferes with psionics, reducing range and duration by 75%! The penalty for this crime is a 10,000 credit fine, a criminal record for using illegal cyberware and removal of the illegal implant (at the cost of the perpetrator). Repeat offenders or those caught using the device for the commission of a crime, face 2D4 years of prison time.", [{ label: "Range", value: "100 miles" }, { label: "Cost", value: "80,000 credits" }], "Often illegal for the average citizen. Illegal in the CS.");

cyb("Radio & Scrambler Implant (Radio Add On)", "Commercial Audio, Ear & Head Implants", 20000, "See (Radio & Scrambler Implant )", [{ label: "Cost", value: "20,000 credits" }], "Often illegal for the average citizen. Illegal in the CS.");

cyb("Radio Ear (Basic)", "Commercial Audio, Ear & Head Implants", 1200, "A cybernetic ear or implant that enables the character to get all commercial radio stations. Channels are typically changed using a tiny, hand-held remote control channel changer or portable computer jacked into the character. Can only receive and listen, not transmit.", [{ label: "Cost", value: "1,200 credits" }], "");

cyb("Radio Bandit's Ear", "Commercial Audio, Ear & Head Implants", 36000, "This illegal version, using broadband, enables the character to receive (listen to) 1000 radio channels and frequencies, including the police band, emergency bands and most common military bands, in addition to most commercial television (can both hear and view TV signals provided a monitor or bionic eyes are available). In addition, the bandit ear can intercept and unscramble coded messages.", [{ label: "Cost", value: "36,000 credits" }], "(01 -59% success ratio), -10% for Coalition transmissions");

cyb("Radio Signal Booster", "Commercial Audio, Ear & Head Implants", 7000, "A small power supply usually implanted to boost the strength/signals of computer and communication implants; increases the clarity of sound and increases range by 25%.", [{ label: "Cost", value: "7,000 credits" }], "");

cyb("Sound Filtration System", "Commercial Audio, Ear & Head Implants", 3500, "This is an ear accessory that can be combined with a Headjack, Amplified or Ultra-Ear, or most bionic and cybernetic ear implants. The filter automatically reacts to diminish potentially damaging sounds with filters and/or earplugs. Sounds are muffled to protect the character from deafening or disorienting levels of sound such as gunfire, explosions, heavy machinery, and painful sound waves.", [{ label: "Cost", value: "3,500 credits" }], "Can only be added to an already existing cybernetic ear implant.");

cyb("Sound Identifier", "Commercial Audio, Ear & Head Implants", 30000, "An ear implant that can be programmed to recognize as many as a dozen specific sounds or voices. Used to identify, track and pinpoint a specific vehicle, device or individual by its distinctive sound. An exact sample must be available for programming. This can be done via any audio recording, or by \"listening\" and recording the sound, live, by the Sound I.D. implant.", [{ label: "Cost", value: "30,000 credits" }], "");

cyb("Surveillance Ear", "Commercial Audio, Ear & Head Implants", 30000, "This is an ear accessory that can be combined with a Headjack, Amplified or Ultra-Ear, or most bionic and cybernetic ear implants. The Surveillance Ear can be tuned to listen to a specific, hidden listening device (\"bug\") as well as work something like a stethoscope or parabolic dish in which the character can press his ear to a wall or door to hear a muffled but relatively clear conversation on the other side.", [{ label: "Cost", value: "30,000 credits" }, { label: "Penalties", value: "The listener is -2 on initiative and anyone sneaking/prowling toward him is + 10% to do so)." }], "The eavesdropping character can hear 2D6+80% of the conversation clearly, tell how many people are speaking, etc.");

cyb("Telephone Jack (connector)", "Commercial Audio, Ear & Head Implants", 800, "Can ''jack'' into telephone lines to use them for free or to eavesdrop on the conversations of others. To do the latter, the eavesdropper must tap into the specific line. A surprising number of local telephone and local internet (regional) services are available at high-tech cities and at least half of the 'Burbs. The other parties, however, hear a double clicking sound every 4D6 seconds, or a slight buzz throughout the conversation while the unseen listener is tapped into the line. Those in the know, may suspect their call is being monitored when they hear these sounds.", [{ label: "Cost", value: "800 credits" }], "Must be added to an existing ear implant.");

cyb("Tracer/Locator Chip", "Commercial Audio, Ear & Head Implants", 800, "Tracer chips are miniature tracking devices usually implanted on prisoners and suspects under the skin of the scalp, behind the ear or under the arm. The chip emits a signal that can be tracked with a portable tracking monitor/locator.", [{ label: "Range", value: "3 miles" }, { label: "Cost", value: "800 credits" }], "Sometimes illegal for the average citizen. Illegal in the CS.");

cyb("Tracer Bug and Tracker", "Commercial Audio, Ear & Head Implants", 800, "In this case, a conventional bug is placed on the subject to be followed. The bug can be tiny, the size of a button or as large as a lighter. It can be the type slipped into a pocket or pinned to a lapel, or magnetically put on the underside of vehicle, and anything inbetween. The implant is the \"tracking\" device, enabling the character with it to track his bug.", [{ label: "Cost", value: "800 credits" }], "");

cyb("Ultra-Ear", "Commercial Audio, Ear & Head Implants", 11000, "Similar to amplified hearing, except that it increases hearing perception into the ultrasonic range of high frequency sound, like the hearing of a bat. The Ultra-Ear also enables the individual to hear the whine of low frequency transmissions, so-called \"silent alarms,\" footsteps, the ruffle of fabric rubbing against other fabric, and the scurry of a mouse. However, whenever the Ultra-Ear is engaged, sounds in the nonnal decibel range are unintelligible - they sound like a recording slowed down to the point that a nonnal conversation sounds like a deep rumbling noise and not words at all. For this reason, the Ultra-Ear can be turned on and off as needed.", [{ label: "Range", value: "300 feet" }, { label: "Cost", value: "11,000 credits" }], "5,500 credits if being added to the Amplified Hearing system.");

cyb("Universal Headjack & Ear Implant", "Commercial Audio, Ear & Head Implants", 8400, "This is a special connector or \"jack\" that is built into the skull, usually at the base of the head or behind the ear. A tiny receiver is then inserted into the ear and linked to the Head-jack. The combination enables characters to plug into audio, sensory, robot, and computer equipment, including most communications equipment, radios, video systems, radar, detection/warning devices, microphones, surveillance systems, and more conventional items like CD players, television, disc recorders, and so on.", [{ label: "Cost", value: "8,400 credits" }], "");

cyb("Universal Headjack & Ear Implant Upgrade Radio", "Commercial Audio, Ear & Head Implants", 16000, "Upgraded to include a built-in radio receiver and transmitter which will allow the character to receive and send radio transmissions as if he were using a walkie-talkie.", [{ label: "Range", value: "3 miles" }, { label: "Cost", value: "16,000 credits" }], "");

cyb("Universal Headjack & Ear Implant Upgrade Long-range", "Commercial Audio, Ear & Head Implants", 48000, "Increasing the system for long-range, wideband and broadband transmission will require additional surgery, a jaw implant for calibrating and switching channels, a high-powered battery, micro-amplifier, and an antenna implant in the skull.", [{ label: "Range", value: "50 miles" }, { label: "Cost", value: "48,000 credits" }], "Additional antenna implant increases range by 50 miles. Max Range: 100 miles");

// ═══ COMMERCIAL CYBERNETIC SENSORS & IMPLANTS (from Commercial_Cybernetic_Sensors___Implants.xlsx) ═
cyb("Air and Surface Temperature Reader", "Commercial Cybernetic Sensors & Implants", 5000, "This sensor is typically built into the hand or wrist, but may also be placed in the neck or head. It precisely measures hot and cold temperatures emanating from objects or areas, provided the surface is not so hot as to bum the skin or sensor. In the case of extremely hot items, such as a cooking grill, stove top, engine, campfire, etc., the temperature can be taken by placing the hand with the sensor near the heat source or item.", [{ label: "Range", value: "Touch or 6 inches from heat subject" }, { label: "Cost", value: "5,000 credits" }], "See Medical: Epidermal Temperature Gauge for taking the temperature of a living creature. This sensor is not suited for that task.");

cyb("Bio-Comp Self-Monitoring System", "Commercial Cybernetic Sensors & Implants", 2500, "A nano-implant tied to a tiny computer system. It monitors, measures and transmits fundamental physiological information about the person it is implanted within. Data includes pulse rate, blood pressure, body temperature, blood sugar level, respiratory rate and difficulty breathing, and the presence of foreign elements in the bloodstream indicating the presence of drugs or poison.", [{ label: "Cost", value: "2,500 credits" }], "");

cyb("Clock Calendar", "Commercial Cybernetic Sensors & Implants", 200, "A device that can be implanted almost anywhere on the body. It continuously keeps track of the exact time, down to a 100th of a second, as well as the calendar date. Data can be transmitted as an audio report through an ear implant or to a wristwatch-like receiver, cybernetic eye, and/or computer screen, but the latter requires a Finger-jack or Head-jack.", [{ label: "Cost", value: "200 credits" }], "");

cyb("Data Plug Internal Link", "Commercial Cybernetic Sensors & Implants", 3000, "A connector jack built into a cybernetic or bionic prosthetic so that a Cyber-Doc can \"jack in\" to get an instant systems' or data readout. Most Bio-Comp, recorders and cyber-computer systems will have such an external jack so an outside computer and monitor can be hooked to the Cyborg or implant to retrieve or share the data contained within.", [{ label: "Cost", value: "3,000 credits" }], "");

cyb("Depth Gauge", "Commercial Cybernetic Sensors & Implants", 600, "An implant popular among SCUBA divers, deep-sea explorers and fishermen. The implant measures the ocean's depth and water pressure. The inexpensive model vibrates when entering dangerous depths.", [{ label: "Range", value: "10 feet" }, { label: "Cost", value: "600 credits" }], "");

cyb("Standard Depth Gauge", "Commercial Cybernetic Sensors & Implants", 4000, "A more advanced implant popular among SCUBA divers, deep-sea explorers and fishermen. Is hooked to an ear implant or radio chip and transmits a \"pinging\" sound for every foot of depth traveled. A warning sounds when entering dangerous depths.", [{ label: "Range", value: "10 feet" }, { label: "Cost", value: "4000 credits" }], "");

cyb("Gyro-Compass", "Commercial Cybernetic Sensors & Implants", 600, "A device that can be implanted almost anywhere on the body. It enables the user to always locate North and the other directions, as well as up and down.", [{ label: "Cost", value: "600 credits" }], "");

cyb("Internal Comp-Calculator", "Commercial Cybernetic Sensors & Implants", 1000, "A tiny computerized calculator usually connected to a Headjack, ear implant or artificial eye. The computer responds to spoken, radio or computer transmitted mathematical equations. The answer is transmitted through the Head-jack, ear or eye implant.", [{ label: "Cost", value: "1,000 credits" }], "Requires skill: Basic Math");

cyb("Advanced Internal Comp-Calculator", "Commercial Cybernetic Sensors & Implants", 5000, "A tiny computerized calculator usually connected to a Headjack, ear implant or artificial eye. The computer responds to spoken, radio or computer transmitted mathematical equations. The answer is transmitted through the Head-jack, ear or eye implant.", [{ label: "Cost", value: "5,000 credits" }], "Requires skill: Advanced Math");

cyb("Metal Detector", "Commercial Cybernetic Sensors & Implants", 4500, "Usually built into a prosthetic hand or forearm. By waving the arm over an area or a person's body, it will detect metal fragments, coins, concealed weapons, and bionics.", [{ label: "Range", value: "2 feet" }, { label: "Cost", value: "4,500 credits" }], "Items covered in synthetic or real flesh only have a 10% chance of detection. VERIFY: source cost cell read '4,500 feet' — imported as credits (assumed typo).");

cyb("Motion Detector", "Commercial Cybernetic Sensors & Implants", 15000, "Usually built into a sensor hand or prosthetic with hair-like sensor wires that are actually tiny motion detector sensors. However, a motion detection sensor system may be implanted in the arm, leg or head with sensor wires hidden among the human hair. The reliability of the detector is quite limited, but can be used to accurately assess wind direction and wind speed, and to detect the rapid approach of large moving objects, such as a vehicle, aircraft, power armor etc., whose rapid approach or large size causes a disturbance in the air.", [{ label: "Range", value: "500 feet" }, { label: "Cost", value: "15,000 credits" }], "Can not be covered; must be bare. VERIFY: source cost cell read '15,000 feet' — imported as credits (assumed typo).");

cyb("Power Chip", "Commercial Cybernetic Sensors & Implants", 5000, "A tiny battery that can be used to supplement implants with limited energy supplies, like tracer chips. Duration is typically 72 hours.", [{ label: "Cost", value: "5,000 credits" }], "");

cyb("Radar Sensor", "Commercial Cybernetic Sensors & Implants", 2000, "A warning is transmitted whenever the sensor detects that it is being scanned by radar. Unfortunately, the level of accuracy is only 68% (roll percentile dice) for determining direction.", [{ label: "Cost", value: "2,000 credits" }], "");

cyb("Radiation Sensor", "Commercial Cybernetic Sensors & Implants", 1200, "Detects and measures the amounts of harmful types of radiation and warns its owner. Includes nuclear, atomic, and microwave radiation. Data may be transmitted to an ear implant, cybernetic eye or wristwatch style monitor. Most usually sound an audio warning as well as a visual transmission display, and some even tick like a Geiger counter, getting louder and faster as the radiation level increases.", [{ label: "Cost", value: "1,200 credits" }], "");

cyb("Basic Security Clearance Access Chip", "Commercial Cybernetic Sensors & Implants", 500, "A variety of identification (ID) chips are used by the police, military and corporate security forces of high-tech cities and nations. The encoded chip can be implanted under the skin anywhere on the body, but usually in the neck, behind the ear, nose, hand or forearm. It is recognized by security devices and detection systems to allow those with the correct security chip access to particular areas of a building, office and even a specific vehicle, computer and machine.", [{ label: "Cost", value: "500 credits" }], "");

cyb("Top Security Clearance Access Chip", "Commercial Cybernetic Sensors & Implants", 1500, "A variety of identification (ID) chips are used by the police, military and corporate security forces of high-tech cities and nations. The encoded chip can be implanted under the skin anywhere on the body, but usually in the neck, behind the ear, nose, hand or forearm. It is recognized by security devices and detection systems to allow those with the correct security chip access to particular areas of a building, office and even a specific vehicle, computer and machine.", [{ label: "Cost", value: "1,500 credits" }], "");

cyb("Military Security Clearance Access Chip", "Commercial Cybernetic Sensors & Implants", 2500, "A variety of identification (ID) chips are used by the police, military and corporate security forces of high-tech cities and nations. The encoded chip can be implanted under the skin anywhere on the body, but usually in the neck, behind the ear, nose, hand or forearm. It is recognized by security devices and detection systems to allow those with the correct security chip access to particular areas of a building, office and even a specific vehicle, computer and machine.", [{ label: "Cost", value: "2,500 credits" }], "");

cyb("Sensor Hand (Standard)", "Commercial Cybernetic Sensors & Implants", 20000, "A special prosthetic hand filled with sensors can be used to replace a severed human hand. Either the cruder mechanical hand or the deluxe Bio-System Hand, with living tissue, can be integrated to replace the lost appendage. This hand also has numerous other special features. The sensor hand is implanted with the following sensors, with data transmitted electronically to a tiny ear receiver attached to the eardrum.", [{ label: "Cost", value: "20,000 credits" }], "Sensors: Heat, Motion Detector, Radiation Detector, Gyro Compass, and Clock Calendar");

cyb("Sensor Hand (Bio-System)", "Commercial Cybernetic Sensors & Implants", 33000, "A special prosthetic hand filled with sensors can be used to replace a severed human hand. Either the cruder mechanical hand or the deluxe Bio-System Hand, with living tissue, can be integrated to replace the lost appendage. This hand also has numerous other special features. The sensor hand is implanted with the following sensors, with data transmitted electronically to a tiny ear receiver attached to the eardrum.", [{ label: "Cost", value: "33,000 credits" }], "Sensors: Heat, Motion Detector, Radiation Detector, Gyro Compass, and Clock Calendar");

cyb("Simple I.D. Chip", "Commercial Cybernetic Sensors & Implants", 500, "A chip implant that transmits a signal recognized by sensors at key junctions like entrances and doors. If the door sensor does not recognize the signal, a silent or audio alarm is sounded and security responds.", [{ label: "Cost", value: "500 credits" }], "");

cyb("Simple I.D. Computer Chip", "Commercial Cybernetic Sensors & Implants", 1500, "A tiny implant that transmits a signal to sensors or which can be accessed via a computer connector plug. Once accessed, the chip provides pertinent data about the individual it is implanted within, including age, race, employment history, security clearance, and personal I.D. code.", [{ label: "Cost", value: "1,500 credits" }], "");

cyb("Snaps, Hooks, Tabs, Loops, Buckles and Velcro Body Attachments", "Commercial Cybernetic Sensors & Implants", 100, "Many of these implanted tabs, hooks, belts, and such are woven or bonded to the flesh and are resistant to tearing, sagging, or breaking. The best can hold items up to one pound (0.45 kg) with little or no discomfort. The most common location for these attachments are the scalp of the head, chest, back, arms, under the arms and the legs.", [{ label: "Cost", value: "100 credits" }], "Per each attachment");

cyb("Speedometer", "Commercial Cybernetic Sensors & Implants", 400, "Simple sensor that indicates how fast the character is moving. This applies to running speed and when a passenger in a moving vehicle. Simple and cheap.", [{ label: "Cost", value: "400 credits" }], "");

cyb("Advanced Speedometer", "Commercial Cybernetic Sensors & Implants", 1200, "Simple sensor that indicates how fast the character is moving. This applies to running speed and when a passenger in a moving vehicle. Transmits a constant read out on a digital Heads Up Display (HUD) in the comer of a bionic eye, wrist unit or plug in monitor.", [{ label: "Cost", value: "1,200 credits" }], "");

cyb("Universal Finger Camera", "Commercial Cybernetic Sensors & Implants", 1200, "A tiny still camera that fits inside the tip of one finger. The camera shoots 48 photos on microfilm and is designed to automatically adjust for low or highlight exposures.", [{ label: "Cost", value: "1,200 credits" }], "");

cyb("Universal Finger Jack", "Commercial Cybernetic Sensors & Implants", 10000, "This is a special connector or jack built into one of the fmgers, allowing the character to plug directly into most sophisticated computers, audio and sensory equipment, radios, video systems, microphones and even conventional items such as CD players. A tiny receiver is inserted into the ear and linked to the Finger Jack to receive audio transmissions from the jack", [{ label: "Cost", value: "10,000 credits" }], "");

// ═══ COMMERCIAL CYBERNETICS (EYES) (from Commerical_Cybernetics__Eyes_.xlsx) ═
cyb("Cyber-Camera Eye", "Commercial Cybernetics (Eyes)", 30000, "Looks like an ordinary cybernetic eye and provides 20/20 sight, but is also a digital (or video) camera that records and/or transmits everything the characters sees. Transmission range is 20 miles (32 km) in the city, 60 miles (96km) in the wilderness, unless hampered by some sort of interference. Live feed is most common, but up to one hour of filming can be recorded and stored on a memory chip.", [{ label: "Cost (Single)", value: "30,000 credits" }, { label: "Cost (Pair)", value: "50,000 credits" }], "Sometimes illegal for the average citizen, Illegal in the CS. Add 20,000 credits for sychronized digtial audio. Add 40,000 credits for broadband capabilities and double transmission range.");

cyb("Cyber-Camera Studio Eye", "Commercial Cybernetics (Eyes)", 20000, "A concealed cybernetic recording device. The camera (typically one eye or a third eye) provides no form of simulated vision, but is a fully miniaturized video camera system. The tiny video recorder tapes everything the person sees and hears. The images are recorded on a two or four hour, one or two inch video disc that is slipped into an implant in the skull. The disc can be easily ejected from a tiny slot and a new one put in. The addition of a Head-jack enables the character to plug directly into a video monitor and display (and record) it for viewing without ever removing the disk. The Head-jack also enables the character to plug into recording and duplicating equipment, allowing him to duplicate his disk or dupe the recorded information onto another disk, computer harddrive, tape, holographic projector, or other recording or transmission equipment. The images can also be transmitted this way.", [{ label: "Cost (Single)", value: "20,000 credits" }, { label: "Cost (Pair)", value: "40,000 credits" }], "Sometimes illegal for the average citizen, Illegal in the CS.");

cyb("Cyber-Lens Implant", "Commercial Cybernetics (Eyes)", 600, "A simple implant inserted into the eye to correct common eye problems such as nearsightedness, far sightedness, astigmatism, and degenerative myopia. Has replaced eyeglasses wherever it is available. Instantly restores vision to 20/20.", [{ label: "Cost (Single)", value: "600 credits" }, { label: "Cost (Pair)", value: "1,200 credits" }], "");

cyb("\"Lifelike\" Simulated Eye (Commercial)", "Commercial Cybernetics (Eyes)", 12000, "A natural, realistic cyber-eye that appears and functions exactly like the real thing, but is created in the laboratory with lens, plastic and nano-technology. Choice of eye color. Perfect 20/20 vision.", [{ label: "Cost (Single)", value: "12,000 credits" }, { label: "Cost (Pair)", value: "20,000 credits" }], "");

cyb("Infrared Eye", "Commercial Cybernetics (Eyes)", 6000, "This type of optical enhancement relies on a source of infrared light, a pencil thin beam of light projected from the eye to the target. The narrowness of the beam limits the viewing area to a small area of about seven feet (2.1m).", [{ label: "Range", value: "1,200 feet" }, { label: "Cost (Single)", value: "6,000 credits" }, { label: "Cost (Pair)", value: "9,000 credits" }], "The eye also simulates normal human vision.");

cyb("Macro-Eye", "Commercial Cybernetics (Eyes)", 20000, "A robot-looking eye that enables the character to magnify tiny objects or areas at close range (within three feet/0.9 m) like a magnifying glass to microscope ranges of magnification! It also comes equipped with a variety of filters to block out glare and dust. Microscopic magnification ranges from 2x to 50x. The artificial eye is extremely popular among medics, doctors, forgers and engineers (great for spotting defects and cracks).", [{ label: "Cost (Single)", value: "20,000 credits" }, { label: "Cost (Pair)", value: "40,000 credits" }], "A photographic camera (still or video) feature can be added for the additional cost of 10,000 credits");

cyb("Macro-Eye Laser", "Commercial Cybernetics (Eyes)", 80000, "This eye is very similar to the standard macro-eye except that it also has a tiny surgical laser built into it. A targeting beam of light indicates exactly where the laser will fire before it is engaged. The laser is used exclusively for internal surgery and inflicts little discernible physical damage to external target. It is another favorite of doctors/surgeons. Microscopic magnification is limited, however, to 2x to 30x.", [{ label: "Damage (S.D.C.)", value: "1" }, { label: "Cost (Single)", value: "80,000 credits" }], "A character would seldom get two Macro Eyes of any kind. VERIFY: source damage cell reads '1' S.D.C. — confirm the dice vs the book.");

cyb("Mechanical Eye with Polarized Filter", "Commercial Cybernetics (Eyes)", 10000, "A robot-looking eye that simulates normal human vision, with the added feature of polarized vision. The glare of bright light and sunlight is polarized as if the individual were wearing the best sunglasses available. Can look directly into the sun without being blinded. Engages automatically as needed. Choice of lens color. Perfect 20/20 vision.", [{ label: "Cost (Single)", value: "10,000 credits" }, { label: "Cost (Pair)", value: "16,000 credits" }], "");

cyb("Modular Eye Socket", "Commercial Cybernetics (Eyes)", 100000, "The eye socket is designed to allow the wearer to remove his artificial eye and replace it with any eye that is made to fit the universal modular housing. Modular eyes can be swapped as needed or desired.", [{ label: "Cost (Single)", value: "100,000 credits" }], "Also known as the Multi-System Eye Socket. 10,000 credits per eye to fit it with modular capabilities for interchangeable use (fits the socket like a glove and can be popped in and out with ease).");

cyb("Multi-Optic Eye", "Commercial Cybernetics (Eyes)", 60000, "A mechanical optic system that includes the following impressive optic systems built into a single cyber-eye: Telescopic: 4-8x30 magnification, range: 6000 feet (1829m). Macro Lens: 2x to 8x magnification, range: 3 feet (0.9m). Passive Nightvision: 2000 foot (610m) range. Thermo-Imaging: 2000 foot (610m) range. Light Filters: Reduces glare. Targeting Display: Imposes cross-hairs on a target, adding a bonus of + 1 to strike with any ranged weapon.", [{ label: "Cost (Single)", value: "60,000 credits" }, { label: "Cost (Pair)", value: "100,000 credits" }], "Same bonus whether one or two Multi-Optic eyes.");

cyb("Night-Eyes", "Commercial Cybernetics (Eyes)", 32000, "Perfect 20/20 daytime vision, plus a chip placed in the cornea or on the retinal cord gives the recipient passive nightvision. Very popular among guards, police, detectives, thieves, spies, City Rats, and people who work (or play) at night.", [{ label: "Range", value: "400 feet" }, { label: "Cost (Single)", value: "32,000 credits" }, { label: "Cost (Pair)", value: "58,000 credits" }], "");

cyb("Optic Nerve Video Implant", "Commercial Cybernetics (Eyes)", 35000, "This advanced operation implants an optical sensor right on the optic nerve. The implant works very similarly to the inner ear implant of the Head-jack, except instead of receiving audio transmissions, it enables the recipient to see video transmissions in his head/eyes. This can be incredibly useful for secretly monitoring video transmissions and video disks. The combination of the Head-jack and optic implant enables the character to both see and hear audio-visual messages (video, digital, etc.)", [{ label: "Cost (Single)", value: "35,000 credits" }], "Experiments with the optic nerve video implant have also been found useful in restoring sight in blind people. 1-45% chance of full restoration of vision, 46-80% chance of restoring 65%, 81-95% chance of restoring 40%, 96-00% chance of restoring only 10% (legally blind). Sometimes illegal for the average citizen. Illegal in the CS.");

cyb("Telescopic Eye", "Commercial Cybernetics (Eyes)", 12000, "In addition to normal 20/20 vision, the eye has a telescopic lens for long distance viewing (4-10x50 magnification).", [{ label: "Range", value: "6,000 feet" }, { label: "Cost (Single)", value: "12,000 credits" }, { label: "Cost (Pair)", value: "20,000 credits" }], "");

cyb("Targeting Sight", "Commercial Cybernetics (Eyes)", 4000, "This is a feature that can be added to any of the mechanical eyes. Cross-hairs are superimposed over the visual image to help focus on a specific target area.", [{ label: "Cost (Single)", value: "4,000 credits" }, { label: "Bonus", value: "Adds a bonus of +1 to strike when using any weapon." }], "Two targeting eyes still provide only a +1 bonus to strike, not +2. Sometimes illegal for the average citizen. Illegal in the CS.");

cyb("Thermo-Imager Eye", "Commercial Cybernetics (Eyes)", 12000, "This artificial eye simulates normal human vision with the added feature of an optical heat sensor. The lens converts the infrared radiation of warm objects into a visible image. The character with thermo-imaging is able to see heat as represented by bands of color and can see in darkness, shadows, and through smoke. Perfect 20/20 vision.", [{ label: "Range", value: "3000 feet" }, { label: "Cost (Single)", value: "12,000 credits" }, { label: "Cost (Pair)", value: "20,000 credits" }], "Sometimes illegal for the average citizen. Illegal in the CS.");

cyb("Third Eye", "Commercial Cybernetics (Eyes)", 350000, "This is a cybernetic eye that is implanted either above a real eye or in the center of the forehead. The mechanical eye can be any of the available artificial eyes, but is typically one of the camera eyes or a multi-optic eye.", [{ label: "Cost (Single)", value: "350,000 credits" }, { label: "Penalty", value: "Reduce the character's P.B . by -2" }], "Sometimes illegal for the average citizen. Illegal in the CS.");

// ═══ CYBERNETIC LUNG IMPLANTS (from Cybernetic_Lung_Implants.xlsx) ═
cyb("Molecular Analyzer", "Cybernetic Lung Implants", 35000, "This micro-chip based sensor is used for testing and analyzing impurities in the air. It can specifically identify any chemical, or strange and dangerous molecules, like the presence of gas, oil, pollution, or other chemicals in the air. Data can be transmitted as an audio report through one of the ear implants or to a wristwatch-like receiver. It does not enable one to track.", [{ label: "Cost", value: "35,000 credits" }], "");

cyb("Oxygen Storage Cell", "Cybernetic Lung Implants", 60000, "A special chemical cell, controlled by micro-processors, that stores oxygen from the character's normal breathing. Then, when oxygen is low, the oxygen is released back into the lungs. The net effect is to give the character the ability to go without breathing for up to 30 minutes.", [{ label: "Cost", value: "60,000 credits" }], "The character must breathe normally for about an hour to recharge the cell between uses.");

cyb("Toxic Filter", "Cybernetic Lung Implants", 40000, "A mechanism designed to filter most toxic gases out before they enter the lungs. The filter is effective against all types of tear gas, smoke, and purely chemical fumes. There is an 80% chance that it will also work against nerve gases and poison gases.", [{ label: "Cost", value: "40,000 credits" }], "");

// ═══ CYBERNETIC-SYSTEM EYES (from Cybernetic-System_Eyes.xlsx) ═
cyb("Infrared/Ultra-V Eye (Cybernetic)", "Cybernetic-System Eyes", 35000, "A special camera lense for robots. This eye enables the character to see into the infrared and ultraviolet spectrums of color. This means that the character can see in the dark equal to an infrared camera (range is about half the distance of normal, day vision), as well as see infrared and ultraviolet light normally invisible to humans. However, this changes the color perception for the character. Normal vision sees the colors blue, green, and red. The Infrared/Ultra-V eye sees the colors blue, green, and ultraviolet, so everything is seen in hues of purple-blues, deep greens, purple, and violet, much like wearing red or purple tinted sunglasses all the time.", [{ label: "Cost (Single)", value: "35,000 credits" }, { label: "Cost (Pair)", value: "62,500 credits" }, { label: "Penalty (P.B.)", value: "-2" }], "The character cannot see the invisible nor see heat emanations, only red light (infrared) and ultraviolet light. 20/20 vision.");

cyb("\"Lifelike\" Simulated Eye (Cybernetic)", "Cybernetic-System Eyes", 10000, "A natural, realistic eye that appears and functions exactly like the real thing, but is created in the laboratory with synthetic tissue and nano-technology. Choice of eye color. Perfect 20/20 vision.", [{ label: "Cost (Single)", value: "10,000 credits" }, { label: "Cost (Pair)", value: "17,500 credits" }, { label: "Penalty (P.B.)", value: "-2" }], "");

cyb("Mood or Color-Changing Eyes (Cybernetic)", "Cybernetic-System Eyes", 12000, "No special powers other than the eyes look robotic, but can change 2-8 different colors to reflect the wearer's moods.", [{ label: "Cost (Pair)", value: "12,000 credits" }, { label: "Penalty (P.B.)", value: "-2" }], "Plus 800 credits per each color it can change to.");

cyb("Nightvision Eyes (Cybernetic)", "Cybernetic-System Eyes", 16000, "Perfect 20/20 daytime vision, robotic looking eyes that give keen nightvision. This is not quite as good as mechanical passive nightvision, but is up there. Can see clearly at night up to 800 feet (244 m); roughly equal to normal vision in a dimly light room. Very popular among guards, police, detectives, thieves, spies, and people who work (or play) at night.", [{ label: "Cost (Single)", value: "16,000 credits" }, { label: "Cost (Pair)", value: "29,000 credits" }, { label: "Penalty (P.B.)", value: "-2" }], "");

cyb("Polarized Eye (Cybernetic)", "Cybernetic-System Eyes", 15000, "Special camers lense for robots. The glare of bright light and sunlight is filtered as if the individual were wearing the best polarized sunglasses available. Can look directly into the sun without being blinded. Engages automatically as needed. Choice of eye color. Perfect 20/20 vision.", [{ label: "Cost (Single)", value: "15,000 credits" }, { label: "Cost (Pair)", value: "26,500 credits" }, { label: "Penalty (P.B.)", value: "-2" }], "");

cyb("Underwater Eye (Cybernetic)", "Cybernetic-System Eyes", 17500, "Robotic eyes designed to automatically distort when submerged underwater, enabling it to compensate to the new watery environment without need of goggles or other eye protection. The character can see with crystal clarity underwater and in low light depths of up to 600 feet ( 183 m). The camera lense also contains a self-replicating oil that is automatically released into the eye whenever the water is murky or bright with sunlight. The oil droplets are haze filters which reduce glare from sunlight and filter out reflections and haze from tiny debris particles floating in the water, allowing for quality vision. The oil droplets are also released above water when exposed to bright light, creating a natural and instant filter/sunglasses effect, reducing glare (not as good as polarized vision, but equal to a cheap pair of sunglasses). 20/20 vision. Choice of eye color.", [{ label: "Cost (Single)", value: "17,500 credits" }, { label: "Cost (Pair)", value: "32,500 credits" }, { label: "Penalty (P.B.)", value: "-2" }], "");

// ═══ BIONIC WEAPONS & TOOLS (from Bionic_Weapons___Tools.xlsx) ═
cyb("Additional Hand and Arm", "Bionic Weapons & Tools", 130000, "A pair of additional hands and arms can be attached to the reinforced rib cage just below the usual pair. The second set of limbs are a bit smaller and lighter than the normal full body replacements, but are still quite formidable additions.", [{ label: "P.S.", value: "10 base, 20 maximum" }, { label: "P.P.", value: "10 base, 20 maximum" }, { label: "M.D.C. (Hand)", value: "5" }, { label: "M.D.C. (Arm)", value: "25" }, { label: "Cost (Single)", value: "130,000 credits" }, { label: "Cost (Pair)", value: "250,000 credits" }, { label: "Bonus — Strike", value: "+1" }, { label: "Bonus — Parry", value: "+1" }], "APPLY MANUALLY: a PAIR grants +1 Strike, +1 Parry and +1 attack per melee — set APM Extra +1 in the Hand to Hand bar and add the strike/parry to the Bonus fields. A single hand and arm adds only +1 to Parry. The arm's own attribute values apply only to that arm.");

cyb("Legs for Leaping", "Bionic Weapons & Tools", 30000, "Bionic legs specifically designed for leaping and quick movement (dodging). Can leap 15 feet (4.6 m) high and 30 feet (9.1m) lengthwise. Increase by 50% if combined with booster jets in the legs.", [{ label: "Cost (Single)", value: "30,000 credits" }, { label: "Bonus — Dodge", value: "+1" }, { label: "Bonus — Initiative", value: "+1" }], "");

cyb("Energy-Clip Hand or Arm Port", "Bionic Weapons & Tools", 3000, "A special connector unit is built into the hand or arm, enabling the 'Borg to slap in additional E-Clips to power his bionic energy weapons. A separate port is needed for each individual energy weapon.", [{ label: "Cost (Single)", value: "3,000 credits" }], "");

cybW("Forearm Light Laser Blaster", "Bionic Weapons & Tools", 25000, "", { damage: "2d6", damageType: "MDC", range: "2,000 ft", rateOfFire: "1", payload: 20, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "25,000 credits" }], "");

cybW("Forearm Medium Laser Blaster", "Bionic Weapons & Tools", 32000, "", { damage: "3d6", damageType: "MDC", range: "2,000 ft", rateOfFire: "1", payload: 15, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "32,000 credits" }], "");

cybW("Forearm Heavy Laser Blaster", "Bionic Weapons & Tools", 40000, "", { damage: "4d6", damageType: "MDC", range: "1,600 ft", rateOfFire: "1", payload: 12, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "40,000 credits" }], "");

cybW("Forearm Ion Blaster Standard", "Bionic Weapons & Tools", 20000, "", { damage: "3d6", damageType: "MDC", range: "1,200 ft", rateOfFire: "1", payload: 20, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "20,000 credits" }], "");

cybW("Forearm Mini-Machine-Gun", "Bionic Weapons & Tools", 20000, "", { damage: "2d4", damageType: "MDC", range: "2,000 ft", rateOfFire: "1", payload: 300, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "20,000 credits" }, { label: "Damage (S.D.C. mode)", value: "1D6 x 10" }], "");

cybW("Forearm or Shoulder Mini-Missile Launcher", "Bionic Weapons & Tools", 40000, "", { damage: "1d4*10", damageType: "MDC", range: "1 mile", rateOfFire: "See Fire Modes", payload: 3, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "40,000 credits" }, { label: "Fire Modes", value: "Aimed, Burst, Wild" }], "");

cybW("Forearm Plasma Ejector Standard", "Bionic Weapons & Tools", 40000, "", { damage: "4d6", damageType: "MDC", range: "1,000 ft", rateOfFire: "1", payload: 10, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "40,000 credits" }], "");

cybW("Forearm Particle Beam", "Bionic Weapons & Tools", 60000, "", { damage: "6d6 + 6", damageType: "MDC", range: "1,000 ft", rateOfFire: "1", payload: 10, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "60,000 credits" }], "");

cyb("Garrote Wrist Wire", "Bionic Weapons & Tools", 200, "A thin, strong wire is hidden inside the bionic wrist junction that can be pulled out and used to strangle an opponent. S.D.C. strangle damage applicable only.", [{ label: "Cost (Single)", value: "200 credits" }], "");

cyb("Grapnel & Launcher", "Bionic Weapons & Tools", 5000, "A launch compartment and housing that like a small weapon nozzle fires a collapsible grappling hook and line. A pneumatic winch reels the line back in, helping characters to scale walls and non-metallic surfaces and hitch rides on giant robots and vehicles. The cord is a super thin, super strong wire with a test strength of 2000 pounds (900 kg).", [{ label: "Cost (Single)", value: "5,000 credits" }, { label: "Range", value: "100 ft" }], "");

cybW("Hand & Forearm Attachment Jackhammer", "Bionic Weapons & Tools", 60000, "Instead of a hand and forearm there is a heavy-duty Jackhammer designed to break rock into small pieces, typically used on rock that has already been drilled, or for construction or demolition of buildings.", { damage: "2d6", damageType: "MDC", range: "", rateOfFire: "1", payload: 0, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "60,000 credits" }, { label: "M.D.C. (item)", value: "50 per" }], "");

cybW("Hand & Forearm Attachment Heavy Mining Drill", "Bionic Weapons & Tools", 66000, "In place of a hand and forearm is a huge, powerful drill for making large holes (a man can fit his arm through these holes and still have room) in rock and metal and drilling away rock. A handful of detachable drill bits in a variety of large sizes are available.", { damage: "3d6", damageType: "MDC", range: "", rateOfFire: "1", payload: 0, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "66,000 credits" }, { label: "M.D.C. (item)", value: "50 per" }], "");

cybW("Hand & Forearm Attachment Precision Mining Drill", "Bionic Weapons & Tools", 60000, "In place of a hand and forearm is a thin, narrow, high-powered drill for making small holes and precision drilling; detachable drill bits come in a variety of sizes. Can be used for mining and building/construction.", { damage: "2d4", damageType: "MDC", range: "", rateOfFire: "1", payload: 0, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "60,000 credits" }, { label: "M.D.C. (item)", value: "30 per" }, { label: "Damage (S.D.C. mode)", value: "4D6" }], "");

cybW("Hand & Forearm Attachment Plasma Torch", "Bionic Weapons & Tools", 75000, "In place of an arm and hand is a versatile plasma torch used for repairs, welding and cutting.", { damage: "4d6", damageType: "MDC", range: "3 ft", rateOfFire: "1", payload: 0, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "75,000 credits" }, { label: "M.D.C. (item)", value: "45 per" }, { label: "Damage (S.D.C. mode)", value: "1D6 x 10" }], "");

cybW("High Explosive Finger Joints", "Bionic Weapons & Tools", 3000, "Usually limited to the little finger, because the explosive finger has no movement.", { damage: "2d4", damageType: "MDC", range: "100 ft", rateOfFire: "1", payload: 12, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "3,000 credits" }], "");

cybW("Knuckle Spikes", "Bionic Weapons & Tools", 1200, "Four sharp metal spikes protrude from the knuckles.", { damage: "1d6", damageType: "SDC", range: "", rateOfFire: "1", payload: 0, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "1,200 credits" }, { label: "M.D.C. (item)", value: "5 per" }], "");

cybW("Laser Eye", "Bionic Weapons & Tools", 130000, "Suitable for robots and 'Borgs. Usually draws its energy from the cyborg's internal power supply rather than any sort of E-Clip. The eye (or eyes) are unusually large or a visor-like implant rather than human-looking eyes.", { damage: "2d6", damageType: "MDC", range: "1,000 ft", rateOfFire: "1", payload: "unlimited", bonusToStrike: 1 }, [{ label: "Cost (Single)", value: "130,000 credits" }, { label: "Bonus — Strike", value: "+1" }], "");

cybW("Laser Finger Blaster", "Bionic Weapons & Tools", 20000, "A tiny Mega-Damage weapon contained in a finger.", { damage: "1d4", damageType: "MDC", range: "300 ft", rateOfFire: "1", payload: 6, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "20,000 credits" }], "");

cybW("Laser Utility Finger", "Bionic Weapons & Tools", 5000, "A simple laser tool similar to the laser soldering torch.", { damage: "3d6", damageType: "SDC", range: "50 ft", rateOfFire: "1", payload: 12, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "5000 credits" }], "");

cybW("Pneumatic Punching Jackhammer Arm", "Bionic Weapons & Tools", 60000, "Designed not for reach but punching and combat. Character's arm is actually a pneumatic piston that strikes with the impact of a jackhammer and inflicts Mega Damage. Another innovation from the whiz kids at W.M. Smith R&D.", { damage: "1d6", damageType: "MDC", range: "", rateOfFire: "1", payload: 0, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "60,000 credits" }, { label: "Bonus — Initiative", value: "+1" }, { label: "Bonus — Disarm", value: "+1" }, { label: "Bonus — Additional Attack", value: "+1" }], "");

cybW("Retractable Finger Blades", "Bionic Weapons & Tools", 1200, "Two to three inch (0.78- 1.18 cm) long, double-edged blades extend from the fingers.", { damage: "1d4", damageType: "SDC", range: "", rateOfFire: "1", payload: 0, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "1,200 credits" }], "");

cybW("Retractable Knuckle Blades", "Bionic Weapons & Tools", 2500, "Four, three to five inch ( 1.18 to 1.96 cm) blades extend from the knuckle housing.", { damage: "3d4", damageType: "SDC", range: "", rateOfFire: "1", payload: 0, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "2,500 credits" }], "");

cybW("Retractable Vibro-Blade", "Bionic Weapons & Tools", 5000, "A standard Vibro-Blade (typically a short sword) is concealed in a housing in one or both of the forearms. The blade is used as both a defensive and offensive weapon. Concealed, retractable Vibro-B lades are commonly installed in cyborgs, robots and, to a lesser degree, power armor.", { damage: "1d6", damageType: "MDC", range: "", rateOfFire: "1", payload: 0, bonusToStrike: 0 }, [{ label: "Cost (Single)", value: "5,000 credits" }], "");

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
  const doc = def.weapon
    ? {
        name: def.name,
        type: "weapon",
        img: "icons/svg/sword.svg",
        folder: folder.id,
        system: {
          specs: def.specs,
          equipped: false,
          damage: def.weapon.damage ?? "",
          damageType: def.weapon.damageType ?? "MDC",
          range: def.weapon.range ?? "",
          rateOfFire: def.weapon.rateOfFire ?? "",
          payload: def.weapon.payload ?? 0,
          weight: "",
          cost: def.cost,
          bonusToStrike: def.weapon.bonusToStrike ?? 0,
          special: def.weapon.special ?? "",
          description: def.description,
          notes: def.notes,
        },
      }
    : {
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
      };
  await Item.create(doc, { pack: pack.collection });
  created++;
}

ui.notifications.info(`${PACK_LABEL}: ${created} item(s) added, ${moved} moved into folders, ${defs.length - created - moved} already in place.`);
