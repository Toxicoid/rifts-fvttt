// ============================================================
// RIFTS RPG - Cyborg Armor & Black Market Bionics
// Adds verified items (RUE p.46-50) to the "Rifts Armory"
// compendium. Run once as GM after Create Rifts Armory (or
// standalone — it will create the pack if missing).
// Safe to re-run: skips items that already exist by name.
// ============================================================

const ARMORY_NAME = "rifts-armory";
const ARMORY_LABEL = "Rifts Armory";
const CYB_NAME = "rifts-cybernetics";
const CYB_LABEL = "Rifts Cybernetics & Bionics";

async function getPack(name, label) {
  let pack = game.packs.get(`world.${name}`);
  if (!pack) {
    pack = await foundry.documents.collections.CompendiumCollection.createCompendium({
      label, name, type: "Item",
    }).catch(async () => {
      return await CompendiumCollection.createCompendium({ label, name, type: "Item" });
    });
    ui.notifications.info(`Created compendium: ${label}`);
  }
  return pack;
}

const armoryPack = await getPack(ARMORY_NAME, ARMORY_LABEL);
const cybPack = await getPack(CYB_NAME, CYB_LABEL);

// ── Folder helper (per pack) ───────────────────────────────
async function getOrCreateFolder(pack, name, parent = null) {
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

// Cyborg external armor stays in the Armory; bionic systems live
// in the Cybernetics & Bionics compendium.
const armorFolder = await getOrCreateFolder(armoryPack, "Cyborg Armor");
const bionicsFolder = await getOrCreateFolder(cybPack, "Bionics");
const bionicWeaponsFolder = await getOrCreateFolder(cybPack, "Bionic Weapons & Tools");

// ── Helpers ────────────────────────────────────────────────
const cyborgArmor = (name, main, arm, leg, head, cost, prowl, notes) => ({
  _destPack: "armory",
  name,
  type: "armor",
  img: "icons/svg/shield.svg",
  folder: armorFolder.id,
  system: {
    dcType: "MDC", ar: 0,
    main: { value: main, max: main },
    helmet: { value: head, max: head },
    arms: { value: arm, max: arm },
    legs: { value: leg, max: leg },
    hands: { value: 0, max: 0 }, forearms: { value: 0, max: 0 }, feet: { value: 0, max: 0 },
    mobility: "", weight: "", cost, prowlPenalty: prowl,
    description: "External M.D.C. plating designed to snap onto a full conversion cyborg's arms, legs and artificial body. Cheaper than environmental armor (no environmental systems) but superior M.D.C.",
    notes,
  },
});

const bionicWeapon = (name, cost, damage, range, payload, description, special, notes = "") => ({
  _destPack: "cyb",
  name,
  type: "weapon",
  img: "icons/weapons/guns/gun-blaster-orange.webp",
  folder: bionicWeaponsFolder.id,
  system: {
    equipped: false, description, damage, damageType: "MDC", range,
    rateOfFire: "Each blast = 1 melee attack/action", payload, weight: "",
    cost, bonusToStrike: 0, special, notes,
  },
});

const bionicTool = (name, cost, description, notes = "") => ({
  _destPack: "cyb",
  name,
  type: "equipment",
  img: "icons/svg/upgrade.svg",
  folder: bionicWeaponsFolder.id,
  system: { quantity: 1, weight: "", cost, description, notes },
});

const bionic = (name, cost, description, notes = "") => ({
  _destPack: "cyb",
  name,
  type: "equipment",
  img: "icons/svg/upgrade.svg",
  folder: bionicsFolder.id,
  system: { quantity: 1, weight: "", cost, description, notes },
});

// ── Item definitions ──────────────────────────────────────
const items = [

  // ═══ CYBORG ARMOR (RUE p.46) ═════════════════════════════
  cyborgArmor("LE-B1 Light Espionage Cyborg Armor", 135, 15, 25, 12, 20000, 5,
    "-5% to Physical skills (Acrobatics, Climbing, Gymnastics, Pick Pockets, Prowl). Arms/Legs per limb."),
  cyborgArmor("LI-B1 Light Infantry Cyborg Armor", 150, 20, 35, 15, 28000, 5,
    "-5% to Physical skills (Acrobatics, Climbing, Gymnastics, Pick Pockets, Prowl). Arms/Legs per limb."),
  cyborgArmor("MI-B2 Medium Infantry Cyborg Armor", 230, 38, 60, 30, 52000, 15,
    "Bulky: -15% to Physical skills. Arms/Legs per limb. Standard issue for starting Combat Cyborgs."),
  cyborgArmor("HI-B3 Heavy Infantry Cyborg Armor", 360, 50, 100, 40, 74000, 25,
    "Full conversion cyborgs ONLY. -20% running/swimming speed, -25% to Physical skills (Prowl impossible), -2 to strike, parry and dodge. Arms/Legs per limb."),

  // ═══ BIONIC FEATURES & ACCESSORIES (RUE p.48-49) ═════════
  bionic("Bionic Booster Jets", 20000,
    "Usually built into the feet and legs to rocket the cyborg to greater heights and distances when leaping.",
    "Leap 20 ft (6.1 m) high and 30 ft (9.1 m) across."),
  bionic("Bionic Lung w/ Gas Filter & Oxygen Storage Cell", 250000,
    "Artificial lung with a microprocessor-controlled chemical cell that stores oxygen from normal breathing and releases it when needed. Includes a gas filtration system effective against tear gas, smoke, and chemical fumes.",
    "Go without breathing up to 2 hours (3 hours normal breathing to recharge). 94% likelihood to work against nerve gases and poison gases."),
  bionic("Built-In Loudspeaker", 6000,
    "Amplifies the 'Borg's voice like a bullhorn.",
    "Up to 80 decibels."),
  bionic("Built-In Radio Receiver & Transmitter Headjack", 22000,
    "Fully operational radio built inside the head. Channels switched by working the jaw; transmissions received directly in the ear (identical to cybernetic Headjack). Send by mental command and quietly talking out loud.",
    "Range: 20 miles (32 km). Add 10,000 cr for scrambling radio messages and decoding."),
  bionic("Climb Cord", 1500,
    "20 ft (6.1 m) of 1,500 lb (675 kg) test cord, thinner than string, concealed in an artificial wrist or arm. Primarily used for espionage. A weight can be attached for use as a chain-type weapon (1D6 S.D.C.), or a small grappling hook attached for climbing.",
    "Grappling hook and other attachments extra (under 30 cr)."),
  bionic("Clock Calendar", 200,
    "Implanted almost anywhere on the body. Continuously tracks exact time to 1/100th of a second, plus calendar date. Data transmitted as audio report through ear implant, or to wristwatch-like receiver, cybernetic eye and/or computer screen (latter requires Fingerjack or Headjack)."),
  bionic("Computer & Calculator (Arm)", 1200,
    "Miniature computer built into the forearm, upper arm, or inner thigh.",
    "Requires Computer Operation skill and literacy to utilize."),
  bionic("Customized Paint Job", 3000,
    "Custom colors, designs, insignias and so forth — same as customizing body armor.",
    "Cost range: 1,000-5,000 cr depending on complexity."),
  bionic("Customized Face or Armored Face Plate", 10000,
    "Handsome, beautiful, monstrous, robotic, ornate, or whatever the purchaser may desire.",
    "Cost range: 2,000-20,000 cr depending on complexity."),
  bionic("Cyber-Nano-Robot Repair Systems (CNRRS)", 250000,
    "Nano-bots released when needed to make minor repairs, similar to RMK/IRMSS medical systems. Uses available spare materials for mechanical and armor repairs; can reroute, patch and secure internal circuits and repair internal organs to some degree.",
    "Restores up to 40 M.D.C. to armor, any one limb, head or main body — or repairs one optic system, sensor, implant, weapon or internal organ. Time: 10 M.D.C. or less 3D6 min; 15-25 M.D.C. 1D6x10+30 min; large/complicated (40 M.D.C. max) 2D6x10+90 min. Good for about two repair jobs before used up."),
  bionic("Depth Gauge & Alarm", 3000,
    "Internal implant that calculates underwater depth via internal audio or HUD.",
    "Warning sounds when within 100 ft (30.5 m) of maximum depth tolerance."),
  bionic("E-Clip Port", 3000,
    "Standard E-Clip port similar to the connector unit on most energy weapons. Powers a built-in weapon, serves as power backup for weapons, or powers independent modular units and non-weapon systems like special sensors and cameras."),
  bionic("Finger Camera", 1200,
    "Tiny still camera in the tip of one finger. Shoots 48 photos on microfilm; auto-adjusts for low light and bright light exposures. Picture taken by pressing a concealed stud in the finger.",
    "Film ~50 cr per micro roll, ~30 seconds to reload."),
  bionic("Fingerjack", 2400,
    "Artificial finger plugs directly into communication systems, radios, sensory equipment, and robots to receive direct data transmissions.",
    "Needs amplified hearing or other cybernetic/bionic ear augmentation to receive the transmitted data."),
  bionic("Gyro-Compass", 600,
    "Implanted almost anywhere. Always locates North and other directions, as well as up and down. Ideal for pilots of aircraft and power armor, and underwater operations.",
    "Data transmitted as audio report through ear implant or to wristwatch-like receiver/cybernetic eye/computer screen (latter requires Fingerjack or Headjack)."),
  bionic("Internal Comp-Calculator", 1000,
    "Tiny computerized calculator usually connected to a Headjack, ear implant or artificial eye. Responds to spoken, radio or computer transmitted math equations; answer transmitted through the Headjack, ear or eye implant.",
    "Basic math: 1,000 cr. Advanced math (algebra, geometry, calculus): 5,000 cr."),
  bionic("Language Translator (Internal)", 16000,
    "Miniaturized language translator placed inside the body. Starts with 10 languages; 8 additional can be added.",
    "Accuracy 98.7% (1-2 speakers, phrases and languages at a time); drops to 70% with 6-second delay for 3-6 simultaneous speakers, -22% more if greater. Requires an ear implant if none exists. Half cost if Headjack/audio ear implant pre-exists (cyber-translator integration)."),
  bionic("Modulating Voice Synthesizer", 25000,
    "Change and disguise voice by altering tone, bass, pitch, etc. Can also speak in a sound frequency inaudible to normal humans but audible to canines, bats, mutant dogs, other 'Borgs, and characters with a cybernetic Ultra-Ear.",
    "Base skill at imitating voices: 10% +5% per level of experience. Add 12,000 cr for a voice disguise program with 200+ human and D-Bee accents and inflections."),
  bionic("Molecular Analyzer", 50000,
    "Microchip-based sensor for testing and analyzing impurities in the air. Specifically identifies any chemical or strange/dangerous molecules — gas, oil, pollution, other chemicals.",
    "Data transmitted as audio report through ear or computer implants. Does NOT enable tracking."),
  bionic("Monitor Jack / Connector Plug", 1000,
    "Simple connector enabling Cyber-Docs and technicians to plug in diagnostic readers and monitors to access bio-comp readings and basic sensor and communications/video data.",
    "1,000 cr each."),
  bionic("Secret Compartment (Small)", 1000,
    "Hollow compartment built into the body. Smallest are about the size of a change purse — a few credit cards, coins, lock picking tools, electronic bugs or components/chips.",
    "Legs & chest: up to six small each. Arms: one small in forearm and upper arm, only if no weapon systems are built into the arm."),
  bionic("Secret Compartment (Medium)", 2500,
    "Hollow compartment for storing supplies, tools, hand-size equipment, hand grenades, and small handguns.",
    "Each leg and chest can accommodate two medium-size compartments."),
  bionic("Secret Compartment (Large)", 4000,
    "Largest hollow compartment: approximately 12 inches (0.3 m) long and four to six inches (1.6-2.36 cm) deep.",
    "Each leg and chest can accommodate one large compartment (in place of two medium/six small)."),

  // ═══ SENSORY & OPTIC SYSTEMS (RUE p.49-50) ═══════════════
  bionic("Amplified Hearing", 20000,
    "Tiny sound amplifiers, microphones and receivers built into the ear canal. Hear almost inaudible sounds up to 360 ft (110 m): 1 decibel at 75 ft, 10 decibels (whisper) at 150 ft, normal conversation (30 dB) at 360 ft. Eavesdrop on 70+ dB sounds from 500-1,000 ft. Accurately estimate distance/location of sound source; recognize specific sounds and voices at 35% +5% per level.",
    "Bonuses: +1 to parry, +2 to dodge, +3 on initiative. Background noise, closed doors and walls decrease range and clarity."),
  bionic("Eye: Cyber-Camera Eye", 30000,
    "Looks like an ordinary cybernetic eye, provides 20/20 sight, and is also a digital/video camera that records and/or transmits everything seen. Live feed most common; up to one hour of filming can be recorded on a memory chip.",
    "Transmission range 20 mi (32 km) city / 60 mi (96 km) wilderness. 30,000 cr single basic color+sound; 50,000 pair. +20,000 synchronized digital audio recording/transmission; +40,000 broadband (doubles transmission range). Sometimes illegal for average citizens. Illegal in the CS."),
  bionic("Eye: Infrared", 6000,
    "Relies on a pencil-thin beam of infrared light projected from the eye to the target; narrow beam limits viewing to ~7 ft (2.1 m) area. Also simulates normal human vision.",
    "Range 1,200 ft (366 m). 6,000 cr single / 9,000 pair."),
  bionic("Eye: Macro", 20000,
    "Robot-looking eye that magnifies tiny objects at close range (within 3 ft / 0.9 m) — magnifying glass to microscope ranges (2x to 50x). Equipped with filters to block glare and dust. Popular among medics, doctors, forgers and engineers.",
    "20,000 cr per eye. Photographic camera (still or video) feature +10,000 cr."),
  bionic("Eye: Multi-Optics", 60000,
    "Mechanical optic system combining multiple systems in a single cyber-eye: Telescopic (4-8x30, 6,000 ft), Macro Lens (2x-20x, 3 ft), Passive Nightvision (2,000 ft), Thermal-Imaging (2,000 ft), Light Filters (reduces glare), and Targeting Display (cross-hairs, +1 strike with ranged weapons — same bonus whether one or two eyes).",
    "55,000-60,000 cr per single eye; 100,000 for a pair installed at the same time."),
  bionic("Eye: Optic Nerve Video Implant", 35000,
    "Optical sensor implanted on the optic nerve of a real eye. Works like the inner-ear Headjack but for video: see video transmissions in the head/eyes. Combined with a Headjack, enables both seeing and hearing audio-visual messages.",
    "Experiments have restored sight in blind people: 1-45% full restoration, 46-80% restores 65%, 81-95% restores 40%, 96-00% restores only 10% (legally blind). Sometimes illegal for average citizens. Illegal in the CS."),
  bionic("Eye: Passive Nightvision", 50000,
    "Light amplification system using ambient light (moon, starlight, etc.) to see clearly in the dark.",
    "Range 2,000 ft (610 m); can be increased if combined with a telescopic lens feature."),
  bionic("Eye: Telescopic", 12000,
    "In addition to normal 20/20 vision, the eye has a telescopic lens for long-distance viewing (4-10x50 magnification).",
    "Range 6,000 ft (1,829 m). 12,000 cr single / 20,000 pair."),
  bionic("Eye: Targeting Sight", 4000,
    "Addable to any mechanical eye. Cross-hairs superimposed over the visual image to help focus on a specific target area.",
    "+1 to strike with any weapon. Two targeting eyes still provide only +1, not +2. Sometimes illegal for average citizens. Illegal in the CS."),
  bionic("Eye: Thermal-Imager", 12000,
    "Simulates normal human vision plus an optical heat sensor: converts infrared radiation of warm objects into a visible image (bands of color). See in darkness, shadows, and through smoke. Perfect 20/20 vision.",
    "Range 3,000 ft (914 m). 12,000 cr single / 20,000 pair. Sometimes illegal for average citizens. Illegal in the CS."),
  bionic("Motion Detector", 15000,
    "Usually built into a sensor hand or prosthetic with hair-like sensor wires (may also be implanted in arm, leg or head with wires hidden among the hair — sensor wires must not be covered). Measures noticeable movement near the character: wind direction/speed, rapid approach of large moving objects (usually within 500 ft / 152 m), movement of somebody/thing nearby within 40 ft (12 m) if the user is motionless or barely moving, and sudden air pressure changes (doors/windows opening).",
    "15,000 cr for an implant, half that if built into a prosthetic. Especially useful in the dark."),
  bionic("Radar Sensor", 2000,
    "A warning is transmitted whenever the sensor detects it is being scanned by radar.",
    "Accuracy for determining direction of the scan: only 68% (roll percentile)."),

  // ═══ BIONIC WEAPONS & TOOLS (verified vs book text) ══════
  bionicTool("Additional Hand and Arm (Bionic)", 250000,
    "A pair of additional hands and arms attached to the reinforced rib cage just below the usual pair. The second set of limbs are a bit smaller and lighter than the normal full body replacements, but are still quite formidable additions.",
    "Maximum P.S. and P.P. attributes: 20 (base is 10). M.D.C.: each hand 5, each arm 25.\nBonuses: a PAIR adds ONE attack per melee and +1 to strike and parry to the character's overall combat skills. The arm's individual attribute bonuses apply only to that arm, not the character's cumulative combat abilities. A SINGLE hand and arm adds only +1 to parry.\nCost: 250,000 cr for a pair; 130,000 cr for one."),
  bionicTool("Legs for Leaping (Bionic)", 30000,
    "Bionic legs specifically designed for leaping and quick movement (dodging).",
    "Leap 15 ft (4.6 m) high and 30 ft (9.1 m) lengthwise; increase by 50% if combined with booster jets in the legs.\nBonus: +1 to dodge and +1 on initiative when attempting a dodge or leap of any kind.\nCost: 30,000 cr IN ADDITION to the usual leg costs."),
  bionicTool("Energy-Clip Hand or Arm Port", 3000,
    "A special connector unit built into the hand or arm, enabling the 'Borg to slap in additional E-Clips to power his bionic energy weapons. A SEPARATE port is needed for each individual energy weapon.",
    "E-Clips: a typical E-Clip costs 5,000 cr new and fully charged; the energy battery can be recharged hundreds of times at an average cost of 1,000-1,500 cr.\nCost: 3,000 cr per E-Clip port. (Same device as the E-Clip Port in the Bionics folder — this entry adds the per-weapon rule and E-Clip pricing.)"),
  bionicWeapon("Forearm Light Laser Blaster", 25000, "2d6", "2,000 ft (609 m)", 20,
    "A light laser blaster built into the forearm.",
    "Payload: 20 blasts per E-Clip. An E-Clip port is part of the basic system. UNLIMITED payload if tied to a full conversion cyborg's power supply.",
    "Weapon cost: 25,000 cr."),
  bionicWeapon("Forearm Medium Laser Blaster", 32000, "3d6", "2,000 ft (609 m)", 15,
    "A medium laser blaster built into the forearm.",
    "Payload: 15 blasts per E-Clip. An E-Clip port is part of the basic system. UNLIMITED payload if tied to a full conversion cyborg's power supply.",
    "Weapon cost: 32,000 cr."),
  bionicWeapon("Forearm Heavy Laser Blaster", 40000, "4d6", "1,600 ft (488 m)", 12,
    "A heavy laser blaster built into the forearm.",
    "Payload: 12 blasts per E-Clip. An E-Clip port is part of the basic system, as backup if nothing else. UNLIMITED payload if tied to a full conversion cyborg's power supply.",
    "Weapon cost: 40,000 cr."),

];

// ── Create items in their destination packs ───────────────
const packs = { armory: armoryPack, cyb: cybPack };
const indexes = {
  armory: new Map((await armoryPack.getIndex()).map((e) => [e.name, e])),
  cyb: new Map((await cybPack.getIndex()).map((e) => [e.name, e])),
};

let created = 0;
let moved = 0;
for (const itemData of items) {
  const dest = itemData._destPack;
  const pack = packs[dest];
  const entry = indexes[dest].get(itemData.name);
  const { _destPack, ...docData } = itemData;
  if (entry) {
    if ((entry.folder ?? null) !== docData.folder) {
      const doc = await pack.getDocument(entry._id);
      await doc.update({ folder: docData.folder });
      moved++;
    }
    continue;
  }
  await Item.create(docData, { pack: pack.collection });
  created++;
}

ui.notifications.info(`Cyborg gear: ${created} item(s) added, ${moved} moved into folders, ${items.length - created - moved} already in place (armor -> ${ARMORY_LABEL}, bionics -> ${CYB_LABEL}).`);
