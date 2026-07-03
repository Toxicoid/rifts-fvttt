// ============================================================
// RIFTS RPG - Grackle Tooth R.C.C. Setup Macro
// Source: D-Bees of North America (WB30), p.97-98.
// Rolls racial attributes live and applies racial abilities.
//
// ORDER: Run the chosen O.C.C. macro FIRST, then this one —
// racial combat bonuses are ADDED on top of O.C.C. values.
// Available O.C.C.: Any Men at Arms except Combat Cyborg,
// Crazy and Juicer (plus New West classes except Psi-Slinger,
// Wired Gunslinger and CyberSlinger Cyborg).
// ============================================================

const actor = canvas.tokens.controlled[0]?.actor ?? game.user.character;

if (!actor) {
  ui.notifications.warn("Please select a token or assign a character first.");
  return;
}

const confirmed = await Dialog.confirm({
  title: "Grackle Tooth R.C.C.",
  content: `
    <p>This will set up <strong>${actor.name}</strong> as a <strong>Grackle Tooth</strong> D-Bee.</p>
    <p>Racial attributes will be <strong>rolled live</strong> and racial bonuses <strong>added</strong> to current combat values.</p>
    <p><em>Run your chosen O.C.C. macro first — this stacks on top.</em></p>
  `,
});

if (!confirmed) return;

// ── 1. ROLL RACIAL ATTRIBUTES ─────────────────────────────
async function rollAttr(formula) {
  const r = new Roll(formula);
  await r.evaluate();
  return r.total;
}

const iq = await rollAttr("1d6 + 8");
const me = await rollAttr("1d6 + 9");
const ma = await rollAttr("2d6 + 14");
const ps = await rollAttr("2d6 + 22");   // Supernatural
const pp = await rollAttr("2d6 + 10");
const pe = await rollAttr("2d6 + 10");   // Supernatural
const pb = await rollAttr("1d6 + 6");
const spd = await rollAttr("2d6 + 10");

// M.D.C.: 2d4x10 + P.E. (plus 3d6 per level from level 1)
const mdcBase = (await rollAttr("2d4")) * 10 + pe;
const mdcLevel1 = await rollAttr("3d6");
const mdcTotal = mdcBase + mdcLevel1;

// P.P.E.: 3d6
const ppe = await rollAttr("3d6");

// Life span: 2d4x10 + 120 years
const lifeSpan = (await rollAttr("2d4")) * 10 + 120;

// ── 2. APPLY ATTRIBUTES & RACIAL DATA ────────────────────
const c = actor.system.combat;

await actor.update({
  "system.identity.race": "Grackle Tooth (D-Bee)",
  "system.identity.lifeSpan": `${lifeSpan} years`,
  "system.identity.height": "8-10 ft",
  "system.identity.weight": "600-800 lbs",

  "system.attributes.iq.value": iq,
  "system.attributes.me.value": me,
  "system.attributes.ma.value": ma,
  "system.attributes.ps.value": ps,
  "system.attributes.pp.value": pp,
  "system.attributes.pe.value": pe,
  "system.attributes.pb.value": pb,
  "system.attributes.spd.value": spd,

  "system.health.dcType": "MDC",
  "system.health.mdc.value": mdcTotal,
  "system.health.mdc.max": mdcTotal,
  "system.health.ppe.value": ppe,
  "system.health.ppe.max": ppe,

  // Racial bonuses ADDED to current values (run OCC first!)
  "system.combat.attacksPerMelee": (c.attacksPerMelee ?? 2) + 1, // +1 from tail
  "system.combat.initiativeBonus": (c.initiativeBonus ?? 0) + 2,
  "system.combat.strikeBonus": (c.strikeBonus ?? 0) + 1,
  "system.combat.parryBonus": (c.parryBonus ?? 0) + 2,
  "system.combat.pullPunchBonus": (c.pullPunchBonus ?? 0) + 3,
  "system.combat.rollBonus": (c.rollBonus ?? 0) + 2,

  "system.saves.poisonBonus": (actor.system.saves.poisonBonus ?? 0) + 2,
  "system.saves.diseaseBonus": (actor.system.saves.diseaseBonus ?? 0) + 6,
  "system.saves.psionicBonus": (actor.system.saves.psionicBonus ?? 0) + 1,
  "system.saves.horrorBonus": (actor.system.saves.horrorBonus ?? 0) + 5,
});

// ── 3. R.C.C. SKILLS ─────────────────────────────────────
const rccSkills = [
  { name: "W.P. Modern (choice)", category: "weaponProficiency", basePercent: 0, perLevelBonus: 0, notes: "Free racial W.P. — pick any Modern weapon proficiency" },
  { name: "Basic Electronics", category: "electrical", basePercent: 40, perLevelBonus: 5, notes: "Base 30% +10% racial bonus" },
  { name: "Basic Mechanics", category: "mechanical", basePercent: 40, perLevelBonus: 5, notes: "Base 30% +10% racial bonus" },
];

const skillItems = rccSkills.map((s) => ({
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
  },
}));

// ── 4. NATURAL WEAPONS ───────────────────────────────────
const naturalWeapons = [
  { name: "Bite", type: "weapon", system: { equipped: false, description: "Natural bite attack.", damage: "2d6", damageType: "MDC", range: "melee", rateOfFire: "1", payload: 0, weight: "", cost: 0, bonusToStrike: 0, notes: "Supernatural P.S. bite" } },
  { name: "Prehensile Tail Strike", type: "weapon", system: { equipped: false, description: "12-15 ft prehensile tail. Damage as Supernatural Punch. Can wield handheld melee weapons and handguns (-3 to strike on Aimed Shots).", damage: "varies", damageType: "MDC", range: "12-15 ft", rateOfFire: "1", payload: 0, weight: "", cost: 0, bonusToStrike: 0, notes: "Grants +1 attack per melee (already applied). Regenerates 1 ft/month if damaged." } },
];

// ── 5. RACIAL ABILITIES ──────────────────────────────────
const abilities = [
  {
    name: "Grackle Tooth Racial Traits",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Mega-Damage being with Supernatural P.S. and P.E.\nHorror/Awe Factor: 12.\nSharp vision, quick wit, excellent reflexes.\nFast healer: recovers 2d6 M.D.C. per 12 hours.\n+3d6 M.D.C. per level of experience (level 1 already included).\n+2 to Perception Rolls.\nImpervious to carcinogens and heat.\n+1 to save vs mind controlling drugs and magical illusions (in addition to psionic save bonus).",
    },
  },
  {
    name: "Prehensile Tail",
    type: "occ_ability",
    system: {
      level: 1,
      description: "12-15 foot (3.6-4.6 m) prehensile tail used for balance, grabbing supplies and swatting attackers.\n+1 extra attack per melee round (already applied).\nCan use handheld melee weapons (Vibro-Blades, clubs) and even handguns — but a weapon fired by the tail is -3 to strike even on an Aimed Shot.\nIf damaged or lost, regenerates at 1 ft (0.3 m) per month.",
    },
  },
  {
    name: "Vulnerabilities & Restrictions",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Cold: uncomfortable below 35°F — skill performance -5% and combat bonuses -1.\nLarge size and warrior reputation make them prime targets.\nMagic: None. Psionics: None.\nAvoids bionic augmentation; M.O.M. and Juicer augmentation do not work on Grackle Tooth.\nMechanical aptitude: all mechanical and repair/building skills taken under an O.C.C. enjoy an extra +5% skill bonus.",
    },
  },
];

await actor.createEmbeddedDocuments("Item", [...skillItems, ...naturalWeapons, ...abilities]);

// ── 6. CHAT SUMMARY ──────────────────────────────────────
ChatMessage.create({
  speaker: { alias: "R.C.C. Setup" },
  content: `
    <h2>🦖 Grackle Tooth R.C.C.</h2>
    <p><strong>${actor.name}</strong> — rolled racial attributes:</p>
    <p style="font-family:monospace;">
      I.Q. ${iq} | M.E. ${me} | M.A. ${ma} | P.S. ${ps} (SN)<br>
      P.P. ${pp} | P.E. ${pe} (SN) | P.B. ${pb} | Spd ${spd}
    </p>
    <p><strong>M.D.C.:</strong> ${mdcTotal} (2d4x10 [${mdcBase - pe}] + P.E. [${pe}] + level 1 3d6 [${mdcLevel1}])<br>
    <strong>P.P.E.:</strong> ${ppe} &nbsp;|&nbsp; <strong>Life Span:</strong> ${lifeSpan} years<br>
    <strong>Horror/Awe Factor:</strong> 12</p>
    <hr>
    <p><strong>Player still needs to:</strong></p>
    <ul>
      <li>Pick the free racial W.P. Modern</li>
      <li>Remember +3d6 M.D.C. each new level</li>
      <li>Add +5% to mechanical/repair skills from the O.C.C.</li>
      <li>Note tail damage = Supernatural Punch (based on P.S. ${ps})</li>
    </ul>
    <p><em>Bonuses were added on top of existing values — if the O.C.C. macro wasn't run first, run it now and manually merge.</em></p>
  `,
});

ui.notifications.info(`${actor.name} is now a Grackle Tooth!`);
