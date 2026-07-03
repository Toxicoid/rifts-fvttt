// ============================================================
// RIFTS RPG - Combat Cyborg O.C.C. Setup Macro (TEST)
// Run on a selected actor to populate a Combat Cyborg
// test character with skills, abilities and gear.
// NOTE: Verify OCC skill list/bonuses against Rifts Ultimate
// Edition before using in a real game.
// ============================================================

const actor = canvas.tokens.controlled[0]?.actor ?? game.user.character;

if (!actor) {
  ui.notifications.warn("Please select a token or assign a character first.");
  return;
}

const confirmed = await Dialog.confirm({
  title: "Combat Cyborg O.C.C.",
  content: `
    <p>This will set up <strong>${actor.name}</strong> as a <strong>Combat Cyborg ('Borg)</strong> test character.</p>
    <p><em>Existing items will not be deleted.</em></p>
  `
});

if (!confirmed) return;

// ── 1. IDENTITY, ATTRIBUTES & MONEY ───────────────────────
await actor.update({
  "system.identity.occ": "Combat Cyborg",
  "system.identity.occType": "Warrior / Machine",
  "system.identity.race": "Human (full-conversion cyborg)",
  "system.identity.description": "Full-conversion combat 'Borg. Human brain and spinal cord in a Mega-Damage bionic frame.",

  // Bionic attributes — cyborg frame overrides rolled physical stats
  "system.attributes.iq.value": 11,
  "system.attributes.me.value": 12,
  "system.attributes.ma.value": 9,
  "system.attributes.ps.value": 24,   // Bionic P.S.
  "system.attributes.pp.value": 20,   // Bionic P.P.
  "system.attributes.pe.value": 14,
  "system.attributes.pb.value": 8,
  "system.attributes.spd.value": 44,  // Bionic legs

  // Cyborg body — using SDC field to track main body M.D.C.
  "system.health.hp.value": 12,
  "system.health.hp.max": 12,
  "system.health.sdc.value": 0,
  "system.health.sdc.max": 0,
  "system.health.mdc.value": 180,     // Main body M.D.C. (light 'Borg frame)
  "system.health.mdc.max": 180,
  "system.health.ppe.value": 2,       // Cyborgs have minimal PPE
  "system.health.ppe.max": 2,

  "system.money.credits": 1200,
  "system.money.salary": 0,

  "system.combat.attacksPerMelee": 5, // HTH Expert + bionics
  "system.combat.strikeBonus": 2,
  "system.combat.parryBonus": 4,
  "system.combat.dodgeBonus": 2,
  "system.combat.damageBonus": 9,     // From bionic P.S. 24
  "system.combat.punchDamage": "1d6 M.D.",
  "system.combat.powerPunch": "2d6 M.D.",
  "system.combat.kickDamage": "1d8 M.D.",
  "system.combat.leapKick": "2d8 M.D.",
});

// ── 2. OCC SKILLS ─────────────────────────────────────────
// Base % from RUE skill list + OCC bonus applied. VERIFY vs book.
const occSkills = [
  { name: "Radio: Basic",            category: "communications",    basePercent: 55, perLevelBonus: 5, notes: "Base 45% +10% OCC (verify)" },
  { name: "Basic Electronics",       category: "electrical",        basePercent: 40, perLevelBonus: 5, notes: "Base 30% +10% OCC (verify)" },
  { name: "Basic Mechanics",         category: "mechanical",        basePercent: 40, perLevelBonus: 5, notes: "Base 30% +10% OCC (verify)" },
  { name: "Climbing",                category: "physical",          basePercent: 50, perLevelBonus: 5, notes: "Base 40% +10% OCC (verify)" },
  { name: "Military Etiquette",      category: "military",          basePercent: 45, perLevelBonus: 5, notes: "Base 35% +10% OCC (verify)" },
  { name: "Pilot: Automobile",       category: "pilot",             basePercent: 66, perLevelBonus: 2, notes: "Base 60% +6% (verify)" },
  { name: "Pilot: Motorcycles & Snowmobiles", category: "pilot",    basePercent: 66, perLevelBonus: 4, notes: "Base 60% +6% (verify)" },
  { name: "Sensory Equipment",       category: "pilotRelated",      basePercent: 40, perLevelBonus: 5, notes: "Base 30% +10% OCC (verify)" },
  { name: "W.P. Energy Rifle",       category: "weaponProficiency", basePercent: 0,  perLevelBonus: 0, notes: "+1 strike at levels 1, 3, 6, 10, 14" },
  { name: "W.P. Heavy M.D. Weapons", category: "weaponProficiency", basePercent: 0,  perLevelBonus: 0, notes: "+1 strike at levels 1, 3, 6, 10, 14" },
  { name: "W.P. Sword",              category: "weaponProficiency", basePercent: 0,  perLevelBonus: 0, notes: "Vibro-blade proficiency. +1 strike/parry per WP table" },
  { name: "Hand to Hand: Expert",    category: "military",          basePercent: 0,  perLevelBonus: 0, notes: "Included in OCC. Upgrade to Martial Arts for 1 related skill" },
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

// ── 3. SECONDARY SKILLS (test data) ──────────────────────
const secondarySkills = [
  { name: "Cook",             category: "domestic",  basePercent: 35, perLevelBonus: 5 },
  { name: "Fishing",          category: "domestic",  basePercent: 40, perLevelBonus: 5 },
  { name: "Land Navigation",  category: "wilderness", basePercent: 36, perLevelBonus: 4 },
  { name: "Prowl",            category: "physical",  basePercent: 25, perLevelBonus: 5 },
];

const secondarySkillItems = secondarySkills.map(s => ({
  name: s.name,
  type: "skill",
  system: {
    category: s.category,
    basePercent: s.basePercent,
    bonusPercent: 0,
    totalPercent: s.basePercent,
    perLevelBonus: s.perLevelBonus,
    isSecondary: true,
    notes: "Secondary skill — no OCC bonus",
  }
}));

// ── 4. CYBORG WEAPONS & GEAR ─────────────────────────────
const gearItems = [
  { name: "CR-4T Laser Rifle", type: "weapon", system: { damage: "3d6 M.D.", damageType: "MDC", range: "2000 ft", rateOfFire: "Single/Burst", payload: 20, bonusToStrike: 0, notes: "Standard 'Borg long arm. E-clip powered." } },
  { name: "Forearm Vibro-Blade (retractable)", type: "weapon", system: { damage: "2d4 M.D.", damageType: "MDC", range: "melee", rateOfFire: "1", payload: 0, bonusToStrike: 0, notes: "Built-in bionic weapon, right forearm" } },
  { name: "Shoulder Mini-Missile Launcher", type: "weapon", system: { damage: "varies", damageType: "MDC", range: "1 mile", rateOfFire: "1 or volley", payload: 4, bonusToStrike: 0, notes: "4 mini-missiles. Built-in." } },
  { name: "M.D.C. Body Plating (light frame)", type: "armor", system: { dcType: "MDC", ar: 0, main: { value: 180, max: 180 }, helmet: { value: 70, max: 70 }, arms: { value: 60, max: 60 }, legs: { value: 90, max: 90 }, mobility: "Good", weight: "—", cost: 0, prowlPenalty: 20, description: "Integral cyborg body plating.", notes: "Main body mirrors the M.D.C. field in the header. Arms/Legs per limb." } },
  { name: "E-Clips x4", type: "equipment", system: { quantity: 4, weight: "1 lb", cost: 0, notes: "Standard energy clips for CR-4T" } },
  { name: "Maintenance Kit", type: "equipment", system: { quantity: 1, weight: "5 lbs", cost: 0, notes: "Bionic self-maintenance tools" } },
];

// ── 5. OCC / CYBORG ABILITIES ────────────────────────────
const occAbilities = [
  {
    name: "M.D.C. Bionic Body",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Full-conversion cyborg. The main body is a Mega-Damage structure (tracked in the S.D.C. field). Impervious to S.D.C. weapons, disease, and most toxins. Hit Points represent the organic brain — only reachable after main body M.D.C. is depleted."
    }
  },
  {
    name: "Bionic Sensor Suite",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Built-in multi-optic eyes (telescopic, macro, passive nightvision 2000 ft, thermal-imaging), amplified hearing, and built-in radio receiver/transmitter (5 mile range). +1 on initiative from combat computer (verify exact bonuses vs book)."
    }
  },
  {
    name: "Cybernetic Maintenance",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Requires monthly maintenance by a Cyber-Doc or Operator. Field repairs possible with Basic Mechanics/Electronics at -20%. Full repairs need a body shop."
    }
  },
];

// ── 6. CREATE ALL ITEMS ───────────────────────────────────
const allItems = [...occSkillItems, ...secondarySkillItems, ...gearItems, ...occAbilities];
await actor.createEmbeddedDocuments("Item", allItems);

ui.notifications.info(`${actor.name} is now a Combat Cyborg!`);

ChatMessage.create({
  speaker: { alias: "OCC Setup" },
  content: `
    <h2>🤖 Combat Cyborg O.C.C.</h2>
    <p><strong>${actor.name}</strong> has been set up as a full-conversion Combat 'Borg.</p>
    <p><strong>Test coverage:</strong> primary skills, secondary skills, built-in weapons, armor, equipment, OCC abilities, bionic attributes, M.D. combat stats.</p>
    <p><em>⚠ Verify OCC skill bonuses against Rifts Ultimate Edition before real play.</em></p>
  `
});
