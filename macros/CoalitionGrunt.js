// ============================================================
// RIFTS RPG - Coalition Grunt O.C.C. Setup Macro
// Run this macro on a selected actor to populate all
// Coalition Grunt OCC skills, identity, and starting money.
// ============================================================

const actor = canvas.tokens.controlled[0]?.actor ?? game.user.character;

if (!actor) {
  ui.notifications.warn("Please select a token or assign a character first.");
  return;
}

if (actor.type !== "character") {
  ui.notifications.warn(`${actor.name} is a ${actor.type} actor. OCC/RCC setup macros are built for Character actors — the NPC stat block doesn't display skills, equipment or ability cards. Create major named NPCs as Characters instead.`);
  return;
}

const confirmed = await Dialog.confirm({
  title: "Coalition Grunt O.C.C.",
  content: `
    <p>This will set up <strong>${actor.name}</strong> as a <strong>Coalition Grunt (Dead Boy)</strong>.</p>
    <p>It will:</p>
    <ul>
      <li>Set OCC fields and starting money</li>
      <li>Add all OCC skills with base percentages</li>
      <li>Add standard equipment</li>
    </ul>
    <p><em>Existing items will not be deleted.</em></p>
  `
});

if (!confirmed) return;

// ── 1. SET IDENTITY FIELDS ────────────────────────────────
await actor.update({
  "system.identity.occ": "Coalition Grunt",
  "system.identity.occType": "Warrior",
  "system.identity.race": "Human",
  "system.money.credits": 1700,
  "system.money.salary": 1700,
  "system.combat.attacksPerMelee": 4,  // Hand to Hand: Expert base
});

// ── 2. OCC SKILLS ─────────────────────────────────────────
// Base % is the book base + OCC bonus already applied.
// Per level bonus is the book value.
const occSkills = [
  // Communications
  { name: "Radio: Basic",           category: "communications", basePercent: 55, perLevelBonus: 5,  notes: "Base 45% +10% OCC bonus" },
  // Military
  { name: "Military Etiquette",     category: "military",       basePercent: 50, perLevelBonus: 5,  notes: "Base 35% +15% OCC bonus" },
  { name: "Weapon Systems",         category: "military",       basePercent: 50, perLevelBonus: 5,  notes: "Base 40% +10% OCC bonus" },
  { name: "Robot Combat: Basic",    category: "military",       basePercent: 0,  perLevelBonus: 0,  notes: "Combat training — grants bonuses per HTH table" },
  // Pilot
  { name: "Pilot: Hovercraft",      category: "pilot",          basePercent: 60, perLevelBonus: 5,  notes: "Base 50% +10% OCC bonus" },
  { name: "Pilot: Tank & APCs",     category: "pilot",          basePercent: 70, perLevelBonus: 3,  notes: "Base 56% +14% OCC bonus" },
  // Pilot Related
  { name: "Sensory Equipment",      category: "pilotRelated",   basePercent: 40, perLevelBonus: 5,  notes: "Base 30% +10% OCC bonus" },
  // Physical
  { name: "Body Building",          category: "physical",       basePercent: 0,  perLevelBonus: 0,  notes: "Grants +2 PS and +10 SDC" },
  { name: "Climbing",               category: "physical",       basePercent: 45, perLevelBonus: 5,  notes: "Base 40% +5% OCC bonus" },
  { name: "Running",                category: "physical",       basePercent: 0,  perLevelBonus: 0,  notes: "Increases Spd and endurance" },
  // Weapon Proficiencies
  { name: "W.P. Energy Pistol",     category: "weaponProficiency", basePercent: 0, perLevelBonus: 0, notes: "Grants +1 strike per 3 levels" },
  { name: "W.P. Energy Rifle",      category: "weaponProficiency", basePercent: 0, perLevelBonus: 0, notes: "Grants +1 strike per 3 levels" },
  // Hand to Hand
  { name: "Hand to Hand: Expert",   category: "military",       basePercent: 0,  perLevelBonus: 0,  notes: "4 attacks/melee. Can upgrade to Martial Arts (-1 related skill) or Assassin if Evil (-2 related skills)" },
];

const occSkillItems = occSkills.map(s => ({
  name: s.name,
  type: "skill",
  system: {
    category: s.category,
    basePercent: s.basePercent,
    bonusPercent: 0,
    totalPercent: s.basePercent,
    perLevelBonus: s.perLevelBonus,
    isSecondary: false,
    notes: s.notes,
  }
}));

// ── 3. STANDARD EQUIPMENT ────────────────────────────────
const equipmentItems = [
  { name: "Coalition CA-1 'Dead Boy' Heavy Body Armor", type: "armor", system: { dcType: "MDC", ar: 0, main: { value: 80, max: 80 }, helmet: { value: 50, max: 50 }, arms: { value: 35, max: 35 }, legs: { value: 50, max: 50 }, mobility: "Fair", weight: "18 lbs", cost: 0, prowlPenalty: 10, description: "Standard-issue Coalition infantry environmental body armor.", notes: "-10% to Prowl, Climb, Swim, Acrobatics and similar mobility skills. Arms/Legs values are per limb." } },
  { name: "Energy Rifle (choice)",                   type: "weapon",    system: { damage: "varies", damageType: "MDC", range: "varies", rateOfFire: "varies", payload: 0, bonusToStrike: 0, notes: "Energy rifle of choice + 4 extra E-clips" } },
  { name: "Energy Sidearm (choice)",                 type: "weapon",    system: { damage: "varies", damageType: "MDC", range: "varies", rateOfFire: "varies", payload: 0, bonusToStrike: 0, notes: "Energy pistol of choice + 4 extra E-clips" } },
  { name: "Non-Energy Weapon (choice)",              type: "weapon",    system: { damage: "varies", damageType: "SDC", range: "melee", rateOfFire: "1", payload: 0, bonusToStrike: 0, notes: "Additional non-energy weapon of choice" } },
  { name: "Fragmentation Grenades x2",              type: "equipment", system: { quantity: 2, weight: "1 lb", cost: 0, notes: "Fragmentation grenades" } },
  { name: "Signal Flares x3",                       type: "equipment", system: { quantity: 3, weight: "0.5 lbs", cost: 0, notes: "Survival signal flares" } },
  { name: "Survival Knife",                          type: "weapon",    system: { damage: "1d6", damageType: "SDC", range: "melee", rateOfFire: "1", payload: 0, bonusToStrike: 0, notes: "" } },
  { name: "Utility Belt",                            type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Air Filter & Gas Mask",                  type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Walkie-Talkie",                           type: "equipment", system: { quantity: 1, weight: "0.5 lbs", cost: 0, notes: "Short range, 5 mile range" } },
  { name: "Coalition Uniform",                       type: "equipment", system: { quantity: 1, weight: "2 lbs", cost: 0, notes: "" } },
  { name: "Combat Boots",                            type: "equipment", system: { quantity: 1, weight: "2 lbs", cost: 0, notes: "" } },
  { name: "Canteen",                                 type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "" } },
];

// ── 4. OCC ABILITIES NOTE ────────────────────────────────
const occAbilities = [
  {
    name: "O.C.C. Related Skills",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Select 8 related skills at level 1. Additional skills: +2 skills and a W.P. at levels 3, 6; +1 skill at levels 9, 12.\n\nAllowed categories:\n• Communications: Any (+5%)\n• Domestic: Any\n• Electrical: Basic Electronics only\n• Medical: First Aid only\n• Military: Any (+15%)\n• Physical: Any except Acrobatics\n• Pilot: Any (+5%)\n• Pilot Related: Any\n• Rogue: Any\n• Science: Mathematics Basic only\n• Technical: Any\n• W.P.: Any\n• Wilderness: Carpentry, Hunting, Land Navigation only"
    }
  },
  {
    name: "Secondary Skills",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Select 7 secondary skills at level 1. No OCC bonuses apply. All start at base skill level.\n\nSame category restrictions as Related Skills."
    }
  },
  {
    name: "Cybernetics",
    type: "occ_ability",
    system: {
      level: 1,
      description: "None to start. Usually restricted to medical implants and prosthetics only — not augmentation."
    }
  },
  {
    name: "Experience Table",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Level 1: 0-1,950\nLevel 2: 1,951-3,900\nLevel 3: 3,901-8,800\nLevel 4: 8,801-17,600\nLevel 5: 17,601-25,600\nLevel 6: 25,601-35,600\nLevel 7: 35,601-50,600\nLevel 8: 50,601-70,600\nLevel 9: 70,601-95,600\nLevel 10: 95,601-125,600\nLevel 11: 125,601-175,600\nLevel 12: 175,601-225,600\nLevel 13: 225,601-275,600\nLevel 14: 275,601-325,600\nLevel 15: 325,601-375,600"
    }
  },
];

// ── 5. CREATE ALL ITEMS ───────────────────────────────────
const allItems = [...occSkillItems, ...equipmentItems, ...occAbilities];
await actor.createEmbeddedDocuments("Item", allItems);

// ── 6. DONE ───────────────────────────────────────────────
ui.notifications.info(`${actor.name} has been set up as a Coalition Grunt (Dead Boy)!`);

ChatMessage.create({
  speaker: { alias: "OCC Setup" },
  content: `
    <h2>⚔️ Coalition Grunt O.C.C.</h2>
    <p><strong>${actor.name}</strong> has been set up as a Coalition Grunt.</p>
    <hr>
    <p><strong>Reminder — Player still needs to:</strong></p>
    <ul>
      <li>Choose Energy Rifle and Sidearm</li>
      <li>Choose Non-energy weapon</li>
      <li>Select 8 O.C.C. Related Skills</li>
      <li>Select 7 Secondary Skills</li>
      <li>Optionally upgrade Hand to Hand to Martial Arts (-1 related skill)</li>
      <li>Roll 2d6 for starting PPE</li>
      <li>Roll for HP and SDC per level</li>
    </ul>
    <p><strong>Starting Money:</strong> 1,700 credits (one month's pay)</p>
    <p><strong>Monthly Salary:</strong> 1,700 credits</p>
  `
});
