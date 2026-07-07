// ============================================================
// RIFTS RPG - Human Race Setup Macro
// Per RUE "Creating a Character" (attributes ~p.281-284):
// - All eight attributes: 3D6 each
// - Exceptional attribute rule: a natural 16-18 earns a bonus
//   1D6; a 6 on the bonus die chains another (VERIFY chain
//   rule vs your book if it matters at your table)
// - Hit Points: P.E. + 1D6 (+1D6 per level thereafter)
// - P.P.E.: 2D6 (ordinary human base; O.C.C.s adjust)
// S.D.C. comes from the O.C.C. and physical skills, not race.
//
// RUN ORDER: race macro FIRST, then the O.C.C. macro.
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
  title: "Human Race Setup",
  content: `
    <p>This will roll up <strong>${actor.name}</strong> as a <strong>Human</strong>:</p>
    <ul>
      <li>All eight attributes: 3D6 each (16-18 earns a bonus 1D6, chaining on 6s)</li>
      <li>Hit Points: P.E. + 1D6</li>
      <li>P.P.E.: 2D6 base</li>
    </ul>
    <p><em><strong>This OVERWRITES current attributes.</strong> Run this FIRST, then the O.C.C. macro (O.C.C. bonuses stack on top).</em></p>
  `
});

if (!confirmed) return;

// ── 1. ROLL ATTRIBUTES ────────────────────────────────────
async function rollDice(formula) {
  const r = new Roll(formula);
  await r.evaluate();
  return r.total;
}

// 3D6, with the exceptional attribute bonus die on a 16-18
// (bonus die chains while it keeps rolling 6s).
async function rollHumanAttribute() {
  const base = await rollDice("3d6");
  let total = base;
  let bonusDice = [];
  if (base >= 16) {
    let d = await rollDice("1d6");
    total += d;
    bonusDice.push(d);
    while (d === 6) {
      d = await rollDice("1d6");
      total += d;
      bonusDice.push(d);
    }
  }
  return { total, base, bonusDice };
}

const attrKeys = ["iq", "me", "ma", "ps", "pp", "pe", "pb", "spd"];
const rolled = {};
for (const k of attrKeys) rolled[k] = await rollHumanAttribute();

const hpRoll = await rollDice("1d6");
const hp = rolled.pe.total + hpRoll;   // H.P. = P.E. + 1D6
const ppe = await rollDice("2d6");     // Ordinary human base P.P.E.

// ── 2. APPLY TO ACTOR ─────────────────────────────────────
const updates = {
  "system.identity.race": "Human",
  "system.health.hp.value": hp,
  "system.health.hp.max": hp,
  "system.health.ppe.value": ppe,
  "system.health.ppe.max": ppe,
};
for (const k of attrKeys) {
  updates[`system.attributes.${k}.value`] = rolled[k].total;
}
await actor.update(updates);

// ── 3. ABILITY CARD ───────────────────────────────────────
await actor.createEmbeddedDocuments("Item", [
  {
    name: "Human (Race)",
    type: "occ_ability",
    system: {
      level: 1,
      description: `Baseline human of Rifts Earth (RUE character creation).\nAttributes rolled 3D6 each; naturals of 16-18 earned a bonus 1D6 (chaining on 6s).\nHit Points = P.E. + 1D6, and +1D6 per level of experience thereafter (add manually on level up).\nBase P.P.E. 2D6 (O.C.C. may modify).\nS.D.C. comes from the O.C.C. and physical skills, not race.\nLifespan: normal human (~70+ years, barring Rifts Earth).`,
    },
  },
]);

// ── 4. REPORT ─────────────────────────────────────────────
const attrLabel = { iq: "I.Q.", me: "M.E.", ma: "M.A.", ps: "P.S.", pp: "P.P.", pe: "P.E.", pb: "P.B.", spd: "Spd" };
const rows = attrKeys.map((k) => {
  const r = rolled[k];
  const bonus = r.bonusDice.length ? ` <em>(3D6: ${r.base}, bonus +${r.bonusDice.join(" +")})</em>` : "";
  return `<li><strong>${attrLabel[k]}:</strong> ${r.total}${bonus}</li>`;
}).join("");

ui.notifications.info(`${actor.name} rolled up as a Human!`);

ChatMessage.create({
  speaker: { alias: "Race Setup" },
  content: `
    <h2>👤 Human</h2>
    <p><strong>${actor.name}</strong> — attributes rolled (3D6, exceptional bonus dice where earned):</p>
    <ul>${rows}</ul>
    <p><strong>H.P.:</strong> ${hp} (P.E. ${rolled.pe.total} + 1D6 [${hpRoll}]) &nbsp;|&nbsp; <strong>P.P.E.:</strong> ${ppe} (2D6)</p>
    <p><em>Now run the O.C.C. macro — its bonuses stack on these values. Remember +1D6 H.P. per level going forward.</em></p>
  `
});
