// ============================================================
// RIFTS RPG - Create "Rifts O.C.C.s" Compendium
// Run once as GM. Creates a Macro compendium containing the
// OCC setup macros. Safe to re-run — skips existing entries.
// To use an OCC: open the compendium, drag the macro to your
// hotbar (or right-click → Import), select a token, run it.
// ============================================================

const PACK_NAME = "rifts-occs";
const PACK_LABEL = "Rifts O.C.C.s";

// OCC setup macros shipped with the system
const OCC_MACROS = [
  { name: "OCC Setup: Coalition Grunt", file: "CoalitionGrunt.js", img: "icons/svg/combat.svg" },
  { name: "OCC Setup: Combat Cyborg",   file: "CombatCyborg.js",   img: "icons/svg/mystery-man.svg" },
];

// ── Find or create the compendium ─────────────────────────
let pack = game.packs.get(`world.${PACK_NAME}`);
if (!pack) {
  const createFn = foundry.documents?.collections?.CompendiumCollection?.createCompendium
    ?? CompendiumCollection.createCompendium;
  pack = await createFn.call(
    foundry.documents?.collections?.CompendiumCollection ?? CompendiumCollection,
    { label: PACK_LABEL, name: PACK_NAME, type: "Macro" }
  );
  ui.notifications.info(`Created compendium: ${PACK_LABEL}`);
}

// ── Import macros ─────────────────────────────────────────
const index = await pack.getIndex();
const existing = new Set(index.map((e) => e.name));

let created = 0;
for (const m of OCC_MACROS) {
  if (existing.has(m.name)) continue;
  try {
    const resp = await fetch(`systems/rifts/macros/${m.file}`);
    if (!resp.ok) {
      ui.notifications.warn(`Could not fetch ${m.file}`);
      continue;
    }
    const command = await resp.text();
    await Macro.create(
      { name: m.name, type: "script", scope: "global", command, img: m.img },
      { pack: `world.${PACK_NAME}` }
    );
    created++;
  } catch (err) {
    console.warn(`Rifts | Failed to import ${m.file} into compendium`, err);
  }
}

ui.notifications.info(`${PACK_LABEL}: ${created} macro(s) added, ${OCC_MACROS.length - created} already present.`);
