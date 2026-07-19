// ============================================================
// RIFTS RPG - "The Kid" Cyborg Chassis (CSLNGR Mark I)
// Full Conversion Cyborg chassis (Rifts New West). Human-sized,
// concealable, no built-in weapons — the cheap, deniable 'Borg.
//
// SOURCE NOTE: the provided document was TRUNCATED — the
// Statistical Data block (P.S., P.P., weight, cost) and most of
// the Standard Bionic Features list were missing. Verified data
// is applied; missing values are flagged VERIFY and left for
// manual entry. Re-run is NOT needed after verifying — just
// edit the sheet/cards.
// ============================================================

const actor = canvas.tokens.controlled[0]?.actor ?? game.user.character;

if (!actor) {
  ui.notifications.warn("Please select a token or assign a character first.");
  return;
}

if (actor.type !== "character") {
  ui.notifications.warn(`${actor.name} is a ${actor.type} actor. Chassis setup macros are built for Character actors — create major named NPCs as Characters.`);
  return;
}

const confirmed = await Dialog.confirm({
  title: "The Kid Chassis (CSLNGR Mark I)",
  content: `
    <p>This will set up <strong>${actor.name}</strong> as a <strong>CSLNGR Mark I "Kid"</strong> full conversion cyborg.</p>
    <ul>
      <li>Sets Spd 132 and Main Body 150 M.D.C.; body-location card, combat computer bonuses</li>
      <li><strong>P.S. and P.P. are NOT set</strong> — missing from the source (VERIFY vs book, enter manually)</li>
    </ul>
    <p><em>Mental attributes, skills and existing items are untouched.</em></p>
  `
});

if (!confirmed) return;

// ── 1. ATTRIBUTES, HEALTH, COMBAT BONUSES ─────────────────
await actor.update({
  "system.identity.occ": "Full Conversion Cyborg — CSLNGR Mark I",
  "system.identity.race": "Human (full conversion)",
  "system.health.dcType": "MDC",
  "system.health.mdc.value": 150,
  "system.health.mdc.max": 150,
  "system.attributes.spd.value": 132,    // 90 mph (Speed Factor 132, verified)
  // P.S. / P.P.: NOT SET — missing from source. VERIFY vs Rifts New West and enter manually.
  "system.combat.attacksPerMelee": 4,    // adjust for HtH level
  "system.combat.psType": "robot",
  "system.combat.initiativeBonus": 1,    // combat computer
  "system.combat.dodgeBonus": 1,         // combat computer
  "system.combat.rollBonus": 2,          // combat computer
  "system.combat.pullPunchBonus": 2,     // combat computer
});

// ── 2. BODY LOCATIONS ─────────────────────────────────────
const items = [
  {
    name: "Kid Body — Locations",
    type: "armor",
    system: {
      dcType: "MDC", ar: 0,
      main:     { value: 0,   max: 0 },    // Main Body 150 on the health bar
      helmet:   { value: 35,  max: 35 },   // Head (reinforced)
      arms:     { value: 45,  max: 45 },   // each
      hands:    { value: 15,  max: 15 },   // each
      legs:     { value: 100, max: 100 },  // each
      forearms: { value: 0, max: 0 }, feet: { value: 0, max: 0 },
      mobility: "Human proportions", weight: "VERIFY", cost: 0, prowlPenalty: 0,
      description: "M.D.C. by location for the CSLNGR Mark I. Main Body (150) is tracked on the health bar. The head retains the original face and brain, reinforced to 35 M.D.C.",
      notes: "Targeting the head or hands requires a Called Shot at -4 to strike.\nHuman shape and proportions: the Kid can wear CONVENTIONAL body armor like any normal human.",
    },
  },
];

// ── 3. FEATURES (verified subset — source truncated) ──────
const feat = (name, notes) => ({
  name, type: "equipment",
  system: { quantity: 1, weight: "", cost: 0, notes, description: "Standard CSLNGR Mark I bionic feature." },
});
items.push(
  feat("Head-Jack", ""),
  feat("Climbing Cord", ""),
  feat("Combat Computer", "+1 initiative, +1 dodge, +1 disarm (manual), +2 pull punch, +2 roll (applied to sheet)."),
);

// ── 4. ABILITY CARDS ──────────────────────────────────────
items.push(
  {
    name: "CSLNGR Mark I Chassis ('The Kid')",
    type: "occ_ability",
    system: {
      level: 1,
      description: "The first in the CyberSlinger series — named for Old West gunslinger slang and for being extremely human in proportion, size and shape. A basic cyborg body with enhanced reflexes, not much bigger than a standard human, relatively easy to conceal or pass off as body armor. Retains the original face; natural-looking artificial skin can make the individual seem completely human — popular among those who cherish their humanity and/or like to disguise their true nature. NO built-in weapon systems, arm mounts, or telltale cybernetic appliances. Relatively inexpensive.\n\nSpeed: Spd 132 (90 mph). Leaping: 20 ft (6 m) high or lengthwise; DOUBLE with a running start. No flight; suitable for a jet pack.\n\nSPECIAL BONUS: any skills requiring high dexterity or reflexes — piloting, lock picking, palming, etc. — gain +2% (add to those skills' Bonus %).",
    },
  },
  {
    name: "Life Support & Called Shots",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Reducing the Main Body to zero M.D.C. shatters the 'Borg — but internal life support keeps the brain alive for 4D6 HOURS before failing.\nTargeting the head or hands requires a Called Shot at -4 to strike.\nCan wear conventional human body armor.",
    },
  },
  {
    name: "VERIFY — Truncated Source Data",
    type: "occ_ability",
    system: {
      level: 1,
      description: "The source document for this chassis was cut off. STILL NEEDED from Rifts New West:\n• Bionic P.S. and P.P. values (enter on the sheet)\n• Height, weight and cost\n• The full Standard Bionic Features list (only Head-Jack, Climbing Cord and Combat Computer survived — the Kid likely has more; add them as equipment items)\nDelete this card once verified.",
    },
  },
);

await actor.createEmbeddedDocuments("Item", items);

ui.notifications.info(`${actor.name} is now a CSLNGR Mark I "Kid" — check the VERIFY card!`);

ChatMessage.create({
  speaker: { alias: "Chassis Setup" },
  content: `
    <h2>🤠 "The Kid" — CSLNGR Mark I</h2>
    <p><strong>${actor.name}</strong> is now the concealable gunslinger chassis.</p>
    <hr>
    <p><strong>Applied:</strong> Spd 132, Main Body 150 M.D.C., combat computer bonuses (init +1 / dodge +1 / pull +2 / roll +2).</p>
    <p><strong>⚠ VERIFY (source truncated):</strong> P.S./P.P. not set, height/weight/cost unknown, feature list incomplete — see the VERIFY ability card.</p>
  `
});
