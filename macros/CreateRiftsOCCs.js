// ============================================================
// RIFTS RPG - Create "Rifts O.C.C.s" Compendium
// Run once as GM. Creates a Macro compendium containing the
// OCC setup macros. Safe to re-run — skips existing entries.
// To use an OCC: open the compendium, drag the macro to your
// hotbar (or right-click → Import), select a token, run it.
// ============================================================

const PACK_NAME = "rifts-occs";
const PACK_LABEL = "Rifts O.C.C.s";

// OCC setup macros shipped with the system, organized by source book
const OCC_MACROS = [
  { name: "OCC Setup: Coalition Grunt", file: "CoalitionGrunt.js", img: "icons/logo-scifi-blank.png",      book: "Rifts Ultimate Edition" },
  { name: "OCC Setup: Combat Cyborg",   file: "CombatCyborg.js",   img: "icons/logo-scifi-blank.png", book: "Rifts Ultimate Edition" },
  { name: "OCC Setup: Operator",        file: "Operator.js",       img: "icons/logo-scifi-blank.png",       book: "Rifts Ultimate Edition" },
  { name: "OCC Setup: Assassin (Mercs)", file: "Assassin.js",      img: "icons/logo-scifi-blank.png",      book: "Rifts Mercenaries" },
  { name: "OCC Setup: Special Forces (Mercs)", file: "SpecialForces.js", img: "icons/logo-scifi-blank.png", book: "Rifts Mercenaries" },
  { name: "RCC Setup: Grackle Tooth",   file: "GrackleTooth.js",   img: "icons/logo-scifi-blank.png",       book: "D-Bees of North America" },
  { name: "Race Setup: Human",          file: "HumanRace.js",      img: "icons/logo-scifi-blank.png", book: "Rifts Ultimate Edition" },
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

// ── Book folders inside the compendium ────────────────────
const bookFolders = {};
async function bookFolder(book) {
  if (bookFolders[book]) return bookFolders[book];
  let f = pack.folders.find((x) => x.name === book);
  if (!f) {
    f = await Folder.create({ name: book, type: "Macro" }, { pack: pack.collection });
  }
  bookFolders[book] = f;
  return f;
}

// ── Import macros; move existing into their book folders ──
const index = await pack.getIndex();
const byName = new Map(index.map((e) => [e.name, e]));

let created = 0;
let moved = 0;
for (const m of OCC_MACROS) {
  const target = await bookFolder(m.book);
  const entry = byName.get(m.name);
  if (entry) {
    if ((entry.folder ?? null) !== target.id) {
      const doc = await pack.getDocument(entry._id);
      await doc.update({ folder: target.id });
      moved++;
    }
    continue;
  }
  try {
    const resp = await fetch(`systems/rifts/macros/${m.file}`);
    if (!resp.ok) {
      ui.notifications.warn(`Could not fetch ${m.file}`);
      continue;
    }
    const command = await resp.text();
    await Macro.create(
      { name: m.name, type: "script", scope: "global", command, img: m.img, folder: target.id },
      { pack: `world.${PACK_NAME}` }
    );
    created++;
  } catch (err) {
    console.warn(`Rifts | Failed to import ${m.file} into compendium`, err);
  }
}

ui.notifications.info(`${PACK_LABEL}: ${created} macro(s) added, ${moved} moved into book folders, ${OCC_MACROS.length - created - moved} already in place.`);
