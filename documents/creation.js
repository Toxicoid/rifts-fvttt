// ============================================================
// RIFTS RPG - creation.js
// Drag-and-drop character creation.
//
// Dropping a "Race:", "R.C.C.:", "O.C.C.:" or "Chassis:" item
// onto an actor runs that setup routine against the actor —
// the same dialogs, the same attribute rolls, the same items as
// running the macro by hand. The macro files in systems/rifts/
// macros/ remain the single source of truth; nothing is
// duplicated here.
//
// Each setup script resolves its target as:
//   globalThis.riftsCreationTarget ?? selected token ?? your character
// so this module only has to set that global before running it.
// ============================================================

// The setup scripts shipped with the system. `file` is the script
// in systems/rifts/macros/; `kind` drives the item name prefix.
export const CREATION_ENTRIES = [
  { label: "Human",                     file: "HumanRace.js",     kind: "Race",    img: "icons/svg/mystery-man.svg", book: "Rifts Ultimate Edition" },
  { label: "Grackle Tooth",             file: "GrackleTooth.js",  kind: "R.C.C.",  img: "icons/svg/beast.svg",       book: "D-Bees of North America" },
  { label: "Coalition Grunt",           file: "CoalitionGrunt.js", kind: "O.C.C.", img: "icons/svg/combat.svg",      book: "Rifts Ultimate Edition" },
  { label: "Combat Cyborg",             file: "CombatCyborg.js",  kind: "O.C.C.",  img: "icons/svg/mystery-man.svg", book: "Rifts Ultimate Edition" },
  { label: "Operator",                  file: "Operator.js",      kind: "O.C.C.",  img: "icons/svg/anvil.svg",       book: "Rifts Ultimate Edition" },
  { label: "Assassin",                  file: "Assassin.js",      kind: "O.C.C.",  img: "icons/svg/target.svg",      book: "Rifts Mercenaries" },
  { label: "Special Forces",            file: "SpecialForces.js", kind: "O.C.C.",  img: "icons/svg/tower.svg",       book: "Rifts Mercenaries" },
  { label: "Saloon Girl",               file: "SaloonGirl.js",    kind: "O.C.C.",  img: "icons/svg/tankard.svg",     book: "Rifts New West" },
  { label: "Super Slinger (CSLNGR Mk II)", file: "SuperSlinger.js", kind: "Chassis", img: "icons/svg/combat.svg",    book: "Rifts New West" },
  { label: "Gringo (CSLNGR Mk III)",    file: "Gringo.js",        kind: "Chassis", img: "icons/svg/statue.svg",      book: "Rifts New West" },
  { label: "The Kid (CSLNGR Mk I)",     file: "KidCyborg.js",     kind: "Chassis", img: "icons/svg/cowled.svg",      book: "Rifts New West" },
];

export const creationItemName = (entry) => `${entry.kind}: ${entry.label}`;

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

// ── applyCreation ───────────────────────────────────────────
// Fetches a setup script from the system folder and runs it with
// `actor` as its target. Returns true on success.
export async function applyCreation(actor, file) {
  const path = `systems/${game.system.id}/macros/${file}`;
  let source;
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    source = await response.text();
  } catch (err) {
    console.error("Rifts | could not load setup script", path, err);
    ui.notifications.error(`Rifts: couldn't load ${file} (${err.message}).`);
    return false;
  }

  const previous = globalThis.riftsCreationTarget;
  globalThis.riftsCreationTarget = actor;
  try {
    await new AsyncFunction(source)();
    return true;
  } catch (err) {
    console.error("Rifts | setup script failed", file, err);
    ui.notifications.error(`Rifts: ${file} failed — ${err.message}`);
    return false;
  } finally {
    globalThis.riftsCreationTarget = previous;
  }
}

// ── summarizeForNpc ─────────────────────────────────────────
// The NPC stat block shows weapons and text notes, not skill or
// ability items — so after a setup runs on an NPC, roll those
// items up into the Skills / Abilities note fields. The items
// stay on the actor (harmless, and intact if it ever becomes a
// full character sheet).
export async function summarizeForNpc(actor) {
  if (actor.type !== "npc") return;

  const skills = actor.items.filter((i) => i.type === "skill");
  const abilities = actor.items.filter((i) => i.type === "occ_ability");
  const update = {};

  if (skills.length) {
    const line = skills
      .map((s) => {
        const pct = s.system.totalPercent ?? s.system.basePercent ?? 0;
        return pct > 0 ? `${s.name} ${pct}%` : s.name;
      })
      .sort((a, b) => a.localeCompare(b))
      .join(", ");
    const existing = (actor.system.skillsNote ?? "").trim();
    update["system.skillsNote"] = existing && !existing.includes(line)
      ? `${existing}\n${line}`
      : line;
  }

  if (abilities.length) {
    const line = abilities.map((a) => a.name).sort((a, b) => a.localeCompare(b)).join(", ");
    const existing = (actor.system.abilitiesNote ?? "").trim();
    update["system.abilitiesNote"] = existing && !existing.includes(line)
      ? `${existing}\n${line}`
      : line;
  }

  if (Object.keys(update).length) await actor.update(update);
}
