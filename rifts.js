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
    formula: "1d20 + @combat.initiativeBonus",
    decimals: 0,
  };

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
    { name: "Create Rifts Armory",        file: "CreateRiftsArmory.js", img: "icons/svg/chest.svg" },
    { name: "Armory: Cyborg Bionics",     file: "CreateCyborgBionics.js", img: "icons/svg/pawprint.svg" },
    { name: "Create Rifts OCCs Compendium", file: "CreateRiftsOCCs.js",  img: "icons/svg/book.svg" },
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
    if (existing) {
      // Already imported — just make sure it sits in the right book folder.
      if (existing.folder?.id !== target.id) {
        await existing.update({ folder: target.id });
        console.log(`Rifts | Moved macro into ${m.book ?? "Rifts"}: ${m.name}`);
      }
      continue;
    }
    try {
      const resp = await fetch(`systems/rifts/macros/${m.file}`);
      if (!resp.ok) continue;
      const command = await resp.text();
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
