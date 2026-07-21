// ============================================================
// RIFTS RPG - "Super Slinger" Cyborg Chassis (CSLNGR Mark II)
// Full Conversion Cyborg chassis setup, verified vs book text.
// Run on a Character actor (e.g. Clementine Draws). Sets bionic
// attributes, M.D.C. by location, all standard features, weapon
// systems and combat bonuses. Mental attributes are untouched.
// ============================================================

// Target: a drag-and-drop creation item sets riftsCreationTarget;
// otherwise fall back to the selected token / assigned character.
const actor = globalThis.riftsCreationTarget
  ?? canvas.tokens.controlled[0]?.actor
  ?? game.user.character;

if (!actor) {
  ui.notifications.warn("Please select a token or assign a character first.");
  return;
}

if (actor.type !== "character" && actor.type !== "npc") {
  ui.notifications.warn(`${actor.name} is a ${actor.type} actor. Race/O.C.C./Chassis setups apply to Character and NPC actors only.`);
  return;
}

const confirmed = await Dialog.confirm({
  title: "Super Slinger Chassis (CSLNGR Mark II)",
  content: `
    <p>This will set up <strong>${actor.name}</strong> as a <strong>CSLNGR Mark II "Super Slinger"</strong> full conversion cyborg.</p>
    <ul>
      <li>Sets bionic P.S. 22, P.P. 24, Spd 132 and Main Body 190 M.D.C.</li>
      <li>Sets chassis combat bonuses (init +6, parry +3, dodge +3, etc. — <strong>overwrites</strong> current stored bonuses)</li>
      <li>Adds body-location card, Vibro-Sabres, Laser Finger and all standard features</li>
    </ul>
    <p><em>Mental attributes, skills and existing items are untouched. Adjust A.P.M. for the character's Hand to Hand level after.</em></p>
  `
});

if (!confirmed) return;

// ── 1. ATTRIBUTES, HEALTH, COMBAT BONUSES ─────────────────
// Stored bonuses = chassis systems only; P.P. 24 attribute bonus
// (+9 strike/parry/dodge) derives automatically on top.
await actor.update({
  "system.identity.occ": "Full Conversion Cyborg — CSLNGR Mark II",
  "system.identity.race": "Human (full conversion)",
  "system.health.dcType": "MDC",
  "system.health.mdc.value": 190,
  "system.health.mdc.max": 190,
  "system.attributes.ps.value": 22,      // Robot P.S.
  "system.attributes.pp.value": 24,      // Bionic P.P.
  "system.attributes.spd.value": 132,    // 90 mph
  "system.combat.attacksPerMelee": 5,    // fallback if no HtH style picked
  "system.combat.apmExtra": 1,           // four arms: +1 attack on top of HtH training
  "system.combat.initiativeBonus": 6,    // amplified hearing +3, quickdraw holsters +1, combat computer +1, special +1
  "system.combat.parryBonus": 3,         // amplified hearing +1, special +2
  "system.combat.dodgeBonus": 3,         // amplified hearing +2, combat computer +1
  "system.combat.strikeBonus": 1,        // multi-optic eyes (+1 to strike, ranged targeting)
  "system.combat.rollBonus": 2,          // combat computer: +2 roll with punch/fall/impact
  "system.combat.pullPunchBonus": 2,     // combat computer
});

// ── 2. BODY LOCATIONS & WEAPONS ───────────────────────────
const items = [
  {
    name: "Super Slinger Body — Locations",
    type: "armor",
    system: {
      dcType: "MDC", ar: 0,
      main:     { value: 0,   max: 0 },    // Main Body 190 on the health bar
      helmet:   { value: 45,  max: 45 },   // Head (reinforced)
      arms:     { value: 60,  max: 60 },   // FOUR arms, each
      hands:    { value: 15,  max: 15 },   // FOUR hands, each
      legs:     { value: 120, max: 120 },  // each
      forearms: { value: 0, max: 0 }, feet: { value: 0, max: 0 },
      mobility: "Human proportions", weight: "600 lbs (270 kg)", cost: 0, prowlPenalty: 0,
      description: "M.D.C. by location for the CSLNGR Mark II. Main Body (190) is tracked on the health bar. The head retains the original face and brain (often the eyes, tongue, voice and other features), reinforced to provide 45 M.D.C.",
      notes: "FOUR arms (60 each) and FOUR hands (15 each). Retractable Vibro-Blades (2): 50 M.D.C. each.\nTargeting the head or hands requires a Called Shot, and even then the shooter is -4 to strike.\nHuman shape: can wear body armor designed for large humans/D-Bees, modified for four arms.",
    },
  },
  {
    name: "Vibro-Sabre (Retractable, Right Pair)",
    type: "weapon",
    system: {
      equipped: true, damage: "2d6", damageType: "MDC", range: "melee",
      rateOfFire: "1 melee attack", payload: 0, weight: "", cost: 0, bonusToStrike: 0,
      special: "Retractable — housed in the forearm of one pair of arms. The blade itself has 50 M.D.C.",
      notes: "One of two Vibro-Sabres.",
      description: "A retractable Vibro-Sabre extending from the forearm.",
    },
  },
  {
    name: "Vibro-Sabre (Retractable, Left Pair)",
    type: "weapon",
    system: {
      equipped: true, damage: "2d6", damageType: "MDC", range: "melee",
      rateOfFire: "1 melee attack", payload: 0, weight: "", cost: 0, bonusToStrike: 0,
      special: "Retractable — housed in the forearm of one pair of arms. The blade itself has 50 M.D.C.",
      notes: "One of two Vibro-Sabres.",
      description: "A retractable Vibro-Sabre extending from the forearm.",
    },
  },
  {
    name: "Laser Finger",
    type: "weapon",
    system: {
      equipped: true, damage: "1d6", damageType: "MDC", range: "300 ft (91.5 m)",
      rateOfFire: "1 melee attack", payload: 0, weight: "", cost: 0, bonusToStrike: 0,
      special: "Built into one hand. Powered by the nuclear power supply / E-Clip arm port.",
      notes: "",
      description: "A concealed laser built into one finger.",
    },
  },
];

// ── 3. STANDARD BIONIC FEATURES ───────────────────────────
const feat = (name, notes) => ({
  name, type: "equipment",
  system: { quantity: 1, weight: "", cost: 0, notes, description: "Standard CSLNGR Mark II bionic feature." },
});
items.push(
  feat("Four Bionic Arms", "+1 attack per melee (included in A.P.M.). The combat computer enables drawing and firing FOUR light weapons simultaneously — each PAIR fired counts as ONE melee attack/action (four weapons = two attacks). CANNOT split attacks between two different targets, unlike a true Gunslinger O.C.C."),
  feat("Bionic Lung", ""),
  feat("Amplified Hearing", "+1 to parry, +2 to dodge, +3 to initiative (applied to sheet)."),
  feat("Sound Filtration System", "Automatically muffles damaging sound levels."),
  feat("Clock Calendar / Computer / Gyro-Compass", ""),
  feat("Multi-Optic Eyes", "+1 to strike (applied to sheet; ranged targeting)."),
  feat("Quick Draw Holsters (2, legs)", "+1 on initiative (applied to sheet)."),
  feat("Finger-Jack (one hand)", ""),
  feat("Energy-Clip Arm Port (1)", "On one arm."),
  feat("Head-Jack", ""),
  feat("Climbing Cord", ""),
  feat("Combat Computer", "+1 initiative, +1 dodge, +1 to DISARM (apply disarm manually), +2 pull punch, +2 roll with punch/fall/impact (applied to sheet)."),
);

// ── 4. ABILITY CARDS ──────────────────────────────────────
items.push(
  {
    name: "CSLNGR Mark II Chassis",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Predominately human-sized, human-looking full conversion cyborg designed for quickdraws, with four lightning-fast arms. The extra pair of arms gives +1 melee attack, and the combat computer enables drawing and firing FOUR light weapons simultaneously.\n\nFIRING RULE: cannot split attacks between two different targets (unlike a true Gunslinger O.C.C.); firing each PAIR of weapons counts as one melee attack/action — four weapons drawn, one in each hand, counts as TWO melee attacks/actions.\n\nSize: large, tall human — usually 6'8\" to 7 ft (~2.1 m). Weight: 600 lbs (270 kg).\nLeaping: 20 ft (6 m) high or lengthwise; DOUBLE with a running start. Not capable of flight, but suitable for a jet pack.\nPower System: Nuclear, average life 25 years.\nCost: 5.6-6 million credits; +130,000 for human-looking skin covering.",
    },
  },
  {
    name: "Life Support & Called Shots",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Reducing the Main Body to zero M.D.C. means the 'Borg is shattered, riddled with holes, leaking vital fluids and incapable of movement or speech — but the internal life support systems keep the brain alive for 4D6 HOURS before failing.\n\nTargeting the head or hands requires a Called Shot, and even then the shooter is -4 to strike.\n\nCan wear body armor designed for large humans and D-Bees, modified for its four arms.",
    },
  },
  {
    name: "Special Bonuses (Dexterity Systems)",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Any skills requiring high dexterity or reflexes — piloting, lock picking, palming, etc. — gain +2% (add to those skills' Bonus %).\n+1 on initiative and +2 to parry (applied to sheet).",
    },
  },
);

await actor.createEmbeddedDocuments("Item", items);

ui.notifications.info(`${actor.name} is now a CSLNGR Mark II "Super Slinger"!`);

ChatMessage.create({
  speaker: { alias: "Chassis Setup" },
  content: `
    <h2>🔫 "Super Slinger" — CSLNGR Mark II</h2>
    <p><strong>${actor.name}</strong> is now a four-armed full conversion gunslinger cyborg. <em>Duck!</em></p>
    <hr>
    <p><strong>Applied:</strong> P.S. 22 / P.P. 24 / Spd 132, Main Body 190 M.D.C., init +6 / parry +3 / dodge +3 / strike +1 / roll +2 / pull +2, A.P.M. 5.</p>
    <p><strong>Still to do:</strong></p>
    <ul>
      <li>Adjust A.P.M. for the character's Hand to Hand style/level (four arms' +1 is included)</li>
      <li>Add +1 to disarm manually when relevant (no sheet field)</li>
      <li>Add +2% to dexterity-based skills (piloting, lock picking, palming...)</li>
      <li>Drag on her sidearms — pairs fire as ONE action each, no splitting targets</li>
      <li>Roll I.Q./M.E./M.A. if this is a fresh character (mentals are untouched)</li>
    </ul>
  `
});
