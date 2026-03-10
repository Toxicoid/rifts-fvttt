// ============================================================
// RIFTS RPG - Foundry VTT System
// rifts.js - Main Entry Point
// ============================================================

// ── Imports ─────────────────────────────────────────────────
import { RiftsActorSheet } from "./sheets/RiftsActorSheet.js";
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

  // ── Register Actor Sheet ───────────────────────────────────
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("rifts", RiftsActorSheet, {
    types: ["character"],
    makeDefault: true,
    label: "RIFTS.SheetTitle",
  });

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
    // Tab partials (we'll add these later as the sheet grows)
    "systems/rifts/templates/actor/tabs/attributes.html",
    "systems/rifts/templates/actor/tabs/combat.html",
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
