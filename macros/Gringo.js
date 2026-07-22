// ============================================================
// RIFTS RPG - "Gringo" Cyborg Chassis (CSLNGR Mark III)
// Also known as "the Rock." Full Conversion Cyborg chassis,
// verified vs book text (Rifts New West). Big, strong, heavily
// armored — trades the Mark I/II speed for firepower.
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
  title: "Gringo Chassis (CSLNGR Mark III)",
  content: `
    <p>This will set up <strong>${actor.name}</strong> as a <strong>CSLNGR Mark III "Gringo"</strong> full conversion cyborg.</p>
    <ul>
      <li>Sets bionic P.S. 30, P.P. 24, Spd 88 and Main Body 220 M.D.C.</li>
      <li>Sets chassis combat bonuses (<strong>overwrites</strong> current stored bonuses)</li>
      <li>Adds body card, Vibro-Blades, chest ion blaster, mini-missile launchers and all features</li>
    </ul>
    <p><em>Mental attributes, skills and existing items are untouched.</em></p>
  `
});

if (!confirmed) return;

// ── 1. ATTRIBUTES, HEALTH, COMBAT BONUSES ─────────────────
// Special Bonuses line read as grand totals (see ability card).
await actor.update({
  "system.identity.occ": "Full Conversion Cyborg — CSLNGR Mark III",
  "system.identity.race": "Human (full conversion)",
  "system.health.dcType": "MDC",
  "system.health.mdc.value": 220,
  "system.health.mdc.max": 220,
  "system.attributes.ps.value": 30,      // Robot P.S.
  "system.attributes.pp.value": 24,      // Bionic P.P.
  "system.attributes.spd.value": 88,     // 60 mph
  "system.combat.attacksPerMelee": 4,    // adjust for HtH level
  "system.combat.psType": "robot",
  "system.combat.hasBionicLimbs": true,   // show the Bionic Limb panel
  "system.combat.legPS": 18,                 // chassis legs start at 18 (max 24)
  "system.combat.legPP": 18,
  "system.combat.legBase": 18,               // leap bonus counts points bought above this
  "system.combat.armBase": 10,               // standard prosthetic base (Rifts Bionics p.70)
  "system.combat.initiativeBonus": 6,    // hearing +3, holsters +1, combat computer +1, ion blaster +1
  "system.combat.parryBonus": 1,         // amplified hearing (+1 more with Vibro-Blades — on the blade items)
  "system.combat.dodgeBonus": 3,         // hearing +2, combat computer +1
  "system.combat.strikeBonus": 1,        // multi-optic eyes (ranged targeting)
  "system.combat.rollBonus": 2,          // Special Bonuses total
  "system.combat.pullPunchBonus": 3,     // Special Bonuses total
});

// ── 2. BODY LOCATIONS & WEAPONS ───────────────────────────
const items = [
  {
    name: "Gringo Body — Locations",
    type: "armor",
    system: {
      dcType: "MDC", ar: 0,
      main:     { value: 0,   max: 0 },    // Main Body 220 on the health bar
      helmet:   { value: 80,  max: 80 },   // Head (reinforced)
      arms:     { value: 100, max: 100 },  // each
      hands:    { value: 25,  max: 25 },   // each
      legs:     { value: 160, max: 160 },  // each
      forearms: { value: 0, max: 0 }, feet: { value: 0, max: 0 },
      mobility: "Giant humanoid", weight: "1,200 lbs (540 kg)", cost: 0, prowlPenalty: 0,
      description: "M.D.C. by location for the CSLNGR Mark III. Main Body (220) is tracked on the health bar. The head retains the original face and brain, reinforced to 80 M.D.C.",
      notes: "Vibro-Blades (2, retractable): 50 M.D.C. each. Missile Launchers (2): 40 M.D.C. each.\nTargeting the head or hands requires a Called Shot at -4 to strike.\nHUMAN-SIZED BODY ARMOR CANNOT BE WORN — cyborg armor can be (typically 200 M.D.C.; see the Rifts Armory Cyborg Armor folder).",
    },
  },
  {
    name: "Vibro-Blade (Retractable, Right Forearm)",
    type: "weapon",
    system: {
      equipped: true, damage: "2d6", damageType: "MDC", range: "melee",
      rateOfFire: "1 melee attack", payload: 0, weight: "", cost: 0, bonusToStrike: 0,
      special: "Retractable Vibro-Sabre housed in the forearm; the blade has 50 M.D.C. +1 to PARRY when wielding the Vibro-Blades (Special Bonus). Primary purpose: Defense. Secondary: Anti-Personnel Hand to Hand.",
      notes: "", description: "Retractable forearm Vibro-Sabre.",
    },
  },
  {
    name: "Vibro-Blade (Retractable, Left Forearm)",
    type: "weapon",
    system: {
      equipped: true, damage: "2d6", damageType: "MDC", range: "melee",
      rateOfFire: "1 melee attack", payload: 0, weight: "", cost: 0, bonusToStrike: 0,
      special: "Retractable Vibro-Sabre housed in the forearm; the blade has 50 M.D.C. +1 to PARRY when wielding the Vibro-Blades (Special Bonus). Primary purpose: Defense. Secondary: Anti-Personnel Hand to Hand.",
      notes: "", description: "Retractable forearm Vibro-Sabre.",
    },
  },
  {
    name: "Chest Mounted Ion Blaster",
    type: "weapon",
    system: {
      equipped: true, damage: "4d6", damageType: "MDC", range: "800 ft (244 m)",
      rateOfFire: "1 melee attack per blast", payload: 0, weight: "", cost: 0, bonusToStrike: 0,
      special: "High-powered ion blaster built into the chest. Payload: effectively UNLIMITED (nuclear). Grants +1 on initiative (applied to sheet). Primary purpose: Assault. Secondary: Defense.",
      notes: "", description: "A high-powered ion blaster with a very high damage yield, built into the chest.",
    },
  },
  {
    name: "Shoulder Mini-Missile Launchers (2)",
    type: "weapon",
    system: {
      equipped: true, damage: "1d4x10", damageType: "MDC", range: "1 mile (1.6 km)",
      rateOfFire: "One at a time, or volleys of 2, 4, 6 or 12", payload: 12, weight: "", cost: 0, bonusToStrike: 0,
      special: "Two six-pack launching systems, one above each shoulder, used for heavy support. Damage is 1D4x10 M.D. PER MISSILE. Payload: 12 total, six in each launcher. Each launcher has 40 M.D.C. Primary purpose: Assault. Secondary: Anti-Missile.",
      notes: "Track remaining missiles in Payload.", description: "Shoulder-mounted mini-missile six-packs.",
    },
  },
];

// ── 3. STANDARD BIONIC FEATURES ───────────────────────────
const feat = (name, notes) => ({
  name, type: "equipment",
  system: { quantity: 1, weight: "", cost: 0, notes, description: "Standard CSLNGR Mark III bionic feature." },
});
items.push(
  feat("Bionic Lung & Toxic Filter", ""),
  feat("Loudspeaker", ""),
  feat("Voice Modulator", ""),
  feat("Amplified Hearing", "+1 to parry, +2 to dodge, +3 to initiative (applied to sheet)."),
  feat("Sound Filtration System", ""),
  feat("Clock Calendar / Computer / Gyro-Compass", ""),
  feat("Multi-Optic Eyes", "+1 to strike (applied to sheet; ranged targeting)."),
  feat("Quick Draw Holsters (2, legs)", "+1 on initiative (applied to sheet)."),
  feat("Laser Finger", "1D6 M.D., 300 ft (91.5 m) range — see weapon below if used; on one hand."),
  feat("Energy-Clip Arm Port (1)", "On one arm."),
  feat("Head-Jack", ""),
  feat("Climbing Cord", ""),
  feat("Combat Computer", "+1 initiative, +1 dodge, +1 disarm, +2 pull punch, +2 roll (folded into sheet totals — see chassis card)."),
);

// Laser finger as a rollable weapon too
items.push({
  name: "Laser Finger",
  type: "weapon",
  system: {
    equipped: true, damage: "1d6", damageType: "MDC", range: "300 ft (91.5 m)",
    rateOfFire: "1 melee attack", payload: 0, weight: "", cost: 0, bonusToStrike: 0,
    special: "Built into one hand; powered by the nuclear supply / E-Clip arm port.",
    notes: "", description: "A concealed laser built into one finger.",
  },
});

// ── 4. ABILITY CARDS ──────────────────────────────────────
items.push(
  {
    name: "CSLNGR Mark III Chassis ('The Rock')",
    type: "occ_ability",
    system: {
      level: 1,
      description: "A traditional, heavy 'Borg design: big, strong and very well armored. Lacks some of the Mark I/II speed and agility, but makes up for it with size, armor, a chest-mounted ion cannon and a six-pack mini-missile launcher above each shoulder. Integral combat computer for use with its weapons.\n\nSize: giant humanoid, usually 9-10 ft (2.7-3 m). Weight: 1,200 lbs (540 kg).\nLeaping: 20 ft (6 m) high or lengthwise; DOUBLE with a running start. No flight; suitable for a jet pack.\nPower System: Nuclear, average life 25 years.\nCost: 6.1-6.4 million credits.\nCan use any hand-held weapon, from rail guns to laser rifles.\n\nBONUS ACCOUNTING: the book's 'Special Bonuses' line (+1 disarm, +1 parry w/ Vibro-Blades, +3 pull punch, +2 roll) overlaps the Combat Computer's grants — applied here as GRAND TOTALS: pull punch 3 and roll 2 on the sheet, +1 disarm manual, +1 parry on the blade items.",
    },
  },
  {
    name: "Life Support & Called Shots",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Reducing the Main Body to zero M.D.C. shatters the 'Borg — riddled with holes, leaking vital fluids, incapable of movement or speech — but internal life support keeps the brain alive for 4D6 HOURS before failing.\n\nTargeting the head or hands requires a Called Shot at -4 to strike.\n\nHuman-sized body armor CANNOT be worn; cyborg armor can be (typically 200 M.D.C.).",
    },
  },
);

await actor.createEmbeddedDocuments("Item", items);

ui.notifications.info(`${actor.name} is now a CSLNGR Mark III "Gringo"!`);

ChatMessage.create({
  speaker: { alias: "Chassis Setup" },
  content: `
    <h2>🗿 "Gringo" — CSLNGR Mark III</h2>
    <p><strong>${actor.name}</strong> is now the Rock: 9-10 feet of armor, ion fire and mini-missiles.</p>
    <hr>
    <p><strong>Applied:</strong> P.S. 30 / P.P. 24 / Spd 88, Main Body 220 M.D.C., init +6 / parry +1 (+1 w/ blades) / dodge +3 / strike +1 / pull +3 / roll +2.</p>
    <p><strong>Still to do:</strong> adjust A.P.M. for HtH level; +1 disarm manually; consider LI/MI/HI cyborg armor from the Armory (typically ~200 M.D.C.); track missiles in the launcher's Payload.</p>
  `
});
