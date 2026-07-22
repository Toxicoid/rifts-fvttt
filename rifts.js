// ============================================================
// RIFTS RPG - Foundry VTT System
// rifts.js - Main Entry Point
// ============================================================

// ── Imports ─────────────────────────────────────────────────
import { RiftsActorSheet } from "./sheets/RiftsActorSheet.js";
import { RiftsNpcSheet } from "./sheets/RiftsNpcSheet.js";
import { RiftsVehicleSheet } from "./sheets/RiftsVehicleSheet.js";
import { RiftsItemSheet } from "./sheets/RiftsItemSheet.js";
import { RiftsActor } from "./documents/RiftsActor.js";
import { RiftsItem } from "./documents/RiftsItem.js";

// ── Init Hook ────────────────────────────────────────────────
// Runs once when Foundry is ready to load your system
Hooks.once("init", function () {
  console.log("RIFTS | Initializing Rifts RPG System");

  // ── Register Custom Document Classes ──────────────────────
  // These extend Foundry's base Actor/Item with Rifts-specific logic
  CONFIG.Actor.documentClass = RiftsActor;
  CONFIG.Item.documentClass = RiftsItem;

  // ── Combat Tracker Initiative ──────────────────────────────
  // Palladium: 1d20 + initiative bonus, highest goes first.
  CONFIG.Combat.initiative = {
    formula: "1d20 + @combat.initiativeTotal",
    decimals: 0,
  };

  // ── Palladium per-round initiative ──────────────────────────
  // Advancing to a new round clears everyone's initiative so
  // players can roll fresh from their sheets. Forward only —
  // rewinding a round does not wipe rolls.
  Hooks.on("combatRound", async (combat, updateData, updateOptions) => {
    if (!game.user.isGM) return;
    if (updateOptions?.direction !== 1) return;
    await combat.resetAll();
    ChatMessage.create({
      speaker: { alias: "Combat" },
      content: `<h3>⚔️ Round ${combat.round}</h3><p>Initiative reset — roll from your sheets!</p>`,
    });
  });

  // ── Register Actor Sheet ───────────────────────────────────
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("rifts", RiftsActorSheet, {
    types: ["character"],
    makeDefault: true,
    label: "RIFTS.SheetTitle",
  });
  Actors.registerSheet("rifts", RiftsNpcSheet, {
    types: ["npc"],
    makeDefault: true,
    label: "Rifts NPC Sheet",
  });
  Actors.registerSheet("rifts", RiftsVehicleSheet, {
    types: ["vehicle"],
    makeDefault: true,
    label: "Rifts Vehicle Sheet",
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("rifts", RiftsItemSheet, { makeDefault: true });

  // ── Register Item Sheets ───────────────────────────────────
  Items.unregisterSheet("core", ItemSheet);

  // ── Preload Handlebars Templates ───────────────────────────
  preloadHandlebarsTemplates();
});

// ── Handlebars Template Preloader ────────────────────────────
// Loads all your HTML templates into memory for faster rendering
async function preloadHandlebarsTemplates() {
  const templatePaths = [
    // Main character sheet
    "systems/rifts/templates/actor/character-sheet.html",
    "systems/rifts/templates/actor/npc-sheet.html",
    "systems/rifts/templates/actor/vehicle-sheet.html",
    // Tab partials (we'll add these later as the sheet grows)
    "systems/rifts/templates/actor/tabs/attributes.html",
    "systems/rifts/templates/actor/tabs/abilities.html",
    "systems/rifts/templates/actor/tabs/skills.html",
    "systems/rifts/templates/actor/tabs/gear.html",
    "systems/rifts/templates/actor/tabs/background.html",
    "systems/rifts/templates/actor/tabs/notes.html",
  ];

  return loadTemplates(templatePaths);
}

// ── Ready Hook ───────────────────────────────────────────────
// Runs after Foundry has fully loaded — good place for
// anything that needs the game world to exist first
Hooks.once("ready", function () {
  console.log("RIFTS | System Ready");
});

// ── Handlebars Helpers ───────────────────────────────────────
// Custom helpers you can use inside your HTML templates

Hooks.once("init", function () {
  // Helper: Check if two values are equal
  // Usage in HTML: {{#if (eq alignment "principled")}} ... {{/if}}
  Handlebars.registerHelper("eq", function (a, b) {
    return a === b;
  });

  // Helper: Check if a value is greater than another
  // Usage in HTML: {{#if (gt level 5)}} ... {{/if}}
  Handlebars.registerHelper("gt", function (a, b) {
    return a > b;
  });

  // Helper: Check if a value is less than another
  Handlebars.registerHelper("lt", function (a, b) {
    return a < b;
  });

  // Helper: Add two numbers together
  // Usage in HTML: {{add basePercent bonusPercent}}
  Handlebars.registerHelper("add", function (a, b) {
    return Number(a) + Number(b);
  });

  // Helper: Capitalize first letter of a string
  Handlebars.registerHelper("capitalize", function (str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
});

/* ── Auto-import system macros into a "Rifts" folder ─────────
   Add new macros to systems/rifts/macros/ and list them here.
   They are created once per world (skipped if a macro with the
   same name already exists — delete the macro to re-import). */
Hooks.once("ready", async () => {
  if (!game.user.isGM) return;

  // "book" files OCC/RCC macros into a subfolder by source book.
  const SYSTEM_MACROS = [
    { name: "OCC Setup: Coalition Grunt", file: "CoalitionGrunt.js",  img: "icons/svg/combat.svg",      book: "Rifts Ultimate Edition" },
    { name: "OCC Setup: Combat Cyborg",   file: "CombatCyborg.js",    img: "icons/svg/mystery-man.svg", book: "Rifts Ultimate Edition" },
    { name: "OCC Setup: Operator",        file: "Operator.js",        img: "icons/svg/anvil.svg",       book: "Rifts Ultimate Edition" },
    { name: "OCC Setup: Assassin (Mercs)", file: "Assassin.js",       img: "icons/svg/target.svg",      book: "Rifts Mercenaries" },
    { name: "OCC Setup: Special Forces (Mercs)", file: "SpecialForces.js", img: "icons/svg/tower.svg",  book: "Rifts Mercenaries" },
    { name: "RCC Setup: Grackle Tooth",   file: "GrackleTooth.js",    img: "icons/svg/beast.svg",       book: "D-Bees of North America" },
    { name: "Race Setup: Human",          file: "HumanRace.js",       img: "icons/svg/mystery-man.svg", book: "Rifts Ultimate Edition" },
    { name: "Chassis: Super Slinger (CSLNGR Mk II)", file: "SuperSlinger.js", img: "icons/svg/combat.svg", book: "Rifts New West" },
    { name: "Chassis: Gringo (CSLNGR Mk III)", file: "Gringo.js", img: "icons/svg/statue.svg", book: "Rifts New West" },
    { name: "Chassis: The Kid (CSLNGR Mk I)", file: "KidCyborg.js", img: "icons/svg/cowled.svg", book: "Rifts New West" },
    { name: "OCC Setup: Saloon Girl", file: "SaloonGirl.js", img: "icons/svg/tankard.svg", book: "Rifts New West" },
    { name: "Create Rifts Armory",        file: "CreateRiftsArmory.js", img: "icons/svg/chest.svg" },
    { name: "Create Rifts Skills",          file: "CreateRiftsSkills.js", img: "icons/svg/book.svg" },
    { name: "Create Cybernetics (Data)",     file: "CreateCyberneticsData.js", img: "icons/svg/upgrade.svg" },
    { name: "Create Races & O.C.C.s (Drag-Drop)", file: "CreateRiftsCreationItems.js", img: "icons/svg/card-hand.svg" },
  ];

  let folder = game.folders.find((f) => f.type === "Macro" && f.name === "Rifts");
  if (!folder) {
    folder = await Folder.create({ name: "Rifts", type: "Macro", color: "#e8751a" });
  }

  // Book subfolders under "Rifts"
  const bookFolders = {};
  async function bookFolder(book) {
    if (!book) return folder;
    if (bookFolders[book]) return bookFolders[book];
    let bf = game.folders.find(
      (f) => f.type === "Macro" && f.name === book && f.folder?.id === folder.id
    );
    if (!bf) {
      bf = await Folder.create({ name: book, type: "Macro", color: "#4db8b0", folder: folder.id });
    }
    bookFolders[book] = bf;
    return bf;
  }

  for (const m of SYSTEM_MACROS) {
    const target = await bookFolder(m.book);
    const existing = game.macros.find((x) => x.name === m.name);

    // Always read the shipped script so an already-imported macro can be
    // refreshed when the system updates. Without this, an old copy of the
    // macro sits in the world forever and system updates appear to do
    // nothing (the "delete the macro to get the new one" trap).
    let command = null;
    try {
      const resp = await fetch(`systems/rifts/macros/${m.file}`);
      if (resp.ok) command = await resp.text();
    } catch (err) {
      console.warn(`Rifts | Failed to read macro file ${m.file}`, err);
    }

    if (existing) {
      const changes = {};
      if (existing.folder?.id !== target.id) changes.folder = target.id;
      if (command !== null && existing.command !== command) changes.command = command;
      if (Object.keys(changes).length) {
        await existing.update(changes);
        console.log(
          `Rifts | Updated macro: ${m.name}${changes.command ? " (script refreshed)" : ""}`
        );
      }
      continue;
    }

    if (command === null) continue;
    try {
      await Macro.create({
        name: m.name,
        type: "script",
        scope: "global",
        command,
        folder: target.id,
        img: m.img,
      });
      console.log(`Rifts | Imported macro: ${m.name}`);
    } catch (err) {
      console.warn(`Rifts | Failed to import macro ${m.file}`, err);
    }
  }
});

/* ════════════════════════════════════════════════════════════
   ITEM PILES INTEGRATION (optional module)
   Registers Rifts currencies and item config with the Item
   Piles module for loot piles, chests, merchants and trading.
   Does nothing if the module is not installed/enabled.
   ════════════════════════════════════════════════════════════ */
function riftsItemPilesConfig() {
  return {
    VERSION: "1.0.0",
    // NPC actors represent piles: kill a bandit, loot the token.
    ACTOR_CLASS_TYPE: "npc",
    ITEM_PRICE_ATTRIBUTE: "system.cost",
    ITEM_QUANTITY_ATTRIBUTE: "system.quantity",
    // Skills and OCC abilities are not lootable or tradeable.
    ITEM_FILTERS: [{ path: "type", filters: "skill,occ_ability" }],
    ITEM_SIMILARITIES: ["name", "type"],
    // Weapons and armor have no quantity field — never stack them.
    UNSTACKABLE_ITEM_TYPES: ["weapon", "armor"],
    CURRENCIES: [
      {
        type: "attribute",
        name: "Universal Credits",
        img: "icons/commodities/currency/coins-plain-stack-gold.webp",
        abbreviation: "{#} cr",
        data: { path: "system.money.credits" },
        primary: true,
        exchangeRate: 1,
      },
      {
        type: "attribute",
        name: "Black Market Credits",
        img: "icons/commodities/currency/coin-embossed-skull-gold.webp",
        abbreviation: "{#} BM",
        data: { path: "system.money.blackMarket" },
        primary: false,
        exchangeRate: 1,
      },
    ],
  };
}

let riftsItemPilesRegistered = false;
function registerItemPiles() {
  if (riftsItemPilesRegistered) return;
  if (!game.itempiles?.API?.addSystemIntegration) return;
  try {
    game.itempiles.API.addSystemIntegration(riftsItemPilesConfig());
    riftsItemPilesRegistered = true;
    console.log("RIFTS | Item Piles integration registered");
  } catch (err) {
    console.warn("RIFTS | Item Piles integration failed", err);
  }
}

Hooks.once("item-piles-ready", registerItemPiles);
// Fallback in case the module readied before us or hook timing shifts.
Hooks.once("ready", () => setTimeout(registerItemPiles, 1000));
