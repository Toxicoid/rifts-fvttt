// ============================================================
// RIFTS RPG - Create "Rifts Races & O.C.C.s" Compendium
// Run once as GM. Builds an ITEM compendium whose entries are
// dragged straight onto a character or NPC sheet to apply that
// Race / R.C.C. / O.C.C. / Chassis — same dialogs and attribute
// rolls as running the setup macro by hand.
//
// Safe to re-run: skips entries that already exist, and files
// loose ones into their book folder.
// ============================================================

const PACK_NAME = "rifts-creation";
const PACK_LABEL = "Rifts Races & O.C.C.s";

// Mirrors CREATION_ENTRIES in documents/creation.js
const ENTRIES = [
  { label: "Human", file: "HumanRace.js", kind: "Race", img: "icons/svg/mystery-man.svg", book: "Rifts Ultimate Edition",
    blurb: "Baseline human. Rolls attributes, sets starting values and the human racial profile." },
  { label: "Grackle Tooth", file: "GrackleTooth.js", kind: "R.C.C.", img: "icons/svg/beast.svg", book: "D-Bees of North America",
    blurb: "Grackle Tooth R.C.C. — natural M.D.C. hide, supernatural strength profile and racial abilities." },
  { label: "Coalition Grunt", file: "CoalitionGrunt.js", kind: "O.C.C.", img: "icons/svg/combat.svg", book: "Rifts Ultimate Edition",
    blurb: "Coalition Grunt O.C.C. — military skill package, weapon proficiencies and standard issue kit." },
  { label: "Combat Cyborg", file: "CombatCyborg.js", kind: "O.C.C.", img: "icons/svg/mystery-man.svg", book: "Rifts Ultimate Edition",
    blurb: "Full-conversion Combat Cyborg — chassis stats, Robot P.S. attacks, bionic package and skills." },
  { label: "Operator", file: "Operator.js", kind: "O.C.C.", img: "icons/svg/anvil.svg", book: "Rifts Ultimate Edition",
    blurb: "Operator O.C.C. — mechanical and electrical skill package, tools and salvage gear." },
  { label: "Assassin", file: "Assassin.js", kind: "O.C.C.", img: "icons/svg/target.svg", book: "Rifts Mercenaries",
    blurb: "Assassin O.C.C. — espionage and rogue skills, hand to hand assassin, starting equipment." },
  { label: "Special Forces", file: "SpecialForces.js", kind: "O.C.C.", img: "icons/svg/tower.svg", book: "Rifts Mercenaries",
    blurb: "Special Forces O.C.C. — military and espionage package, weapon proficiencies and field kit." },
  { label: "Saloon Girl", file: "SaloonGirl.js", kind: "O.C.C.", img: "icons/svg/tankard.svg", book: "Rifts New West",
    blurb: "Saloon Girl O.C.C. — social and rogue skills, M.A. and S.D.C. gains, horror factor progression." },
  { label: "Super Slinger (CSLNGR Mk II)", file: "SuperSlinger.js", kind: "Chassis", img: "icons/svg/combat.svg", book: "Rifts New West",
    blurb: "CSLNGR Mk II chassis — four arms, gunfighter bionics and chassis M.D.C. by location." },
  { label: "Gringo (CSLNGR Mk III)", file: "Gringo.js", kind: "Chassis", img: "icons/svg/statue.svg", book: "Rifts New West",
    blurb: "CSLNGR Mk III chassis — heavy borg frame, chest ion blaster, shoulder mini-missile launchers." },
  { label: "The Kid (CSLNGR Mk I)", file: "KidCyborg.js", kind: "Chassis", img: "icons/svg/cowled.svg", book: "Rifts New West",
    blurb: "CSLNGR Mk I chassis — light, fast juvenile-frame borg." },
];

// ── Find or create the compendium ─────────────────────────
let pack = game.packs.get(`world.${PACK_NAME}`);
if (!pack) {
  const CC = foundry.documents?.collections?.CompendiumCollection ?? CompendiumCollection;
  pack = await CC.createCompendium.call(CC, { label: PACK_LABEL, name: PACK_NAME, type: "Item" });
  ui.notifications.info(`Created compendium: ${PACK_LABEL}`);
}

// ── Book folders ──────────────────────────────────────────
const folders = {};
async function bookFolder(name) {
  if (folders[name]) return folders[name];
  let f = pack.folders.find((x) => x.name === name && !x.folder);
  if (!f) f = await Folder.create({ name, type: "Item" }, { pack: pack.collection });
  folders[name] = f;
  return f;
}

// ── Build ─────────────────────────────────────────────────
const index = await pack.getIndex();
const byName = new Map(index.map((e) => [e.name, e]));

let created = 0, moved = 0;
for (const entry of ENTRIES) {
  const name = `${entry.kind}: ${entry.label}`;
  const folder = await bookFolder(entry.book);
  const existing = byName.get(name);

  if (existing) {
    if ((existing.folder ?? null) !== folder.id) {
      const doc = await pack.getDocument(existing._id);
      await doc.update({ folder: folder.id });
      moved++;
    }
    continue;
  }

  await Item.create(
    {
      name,
      type: "occ_ability",
      img: entry.img,
      folder: folder.id,
      flags: { rifts: { creationFile: entry.file, creationKind: entry.kind } },
      system: {
        level: 1,
        description:
          `${entry.blurb}\n\n` +
          `HOW TO USE: drag this onto a character or NPC sheet. ` +
          `It runs the ${entry.kind} setup — attribute rolls, skills, equipment and ability cards — ` +
          `exactly as the setup macro does, then stays on the sheet as a record of what was applied.\n\n` +
          `Source: ${entry.book}.`,
      },
    },
    { pack: pack.collection }
  );
  created++;
}

ui.notifications.info(
  `${PACK_LABEL}: ${created} entr(ies) added, ${moved} moved into folders, ` +
  `${ENTRIES.length - created - moved} already in place.`
);
