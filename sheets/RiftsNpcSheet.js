// ============================================================
// RIFTS RPG - RiftsNpcSheet.js
// Compact one-page stat block for NPCs and monsters.
// Extends RiftsActorSheet to inherit all roll and item
// listeners (combat rolls, weapon strike/damage, item CRUD,
// data-item-path bindings, gear accordion).
// ============================================================

import { RiftsActorSheet } from "./RiftsActorSheet.js";

export class RiftsNpcSheet extends RiftsActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["rifts", "sheet", "actor", "npc"],
      template: "systems/rifts/templates/actor/npc-sheet.html",
      width: 620,
      height: 700,
      tabs: [],
      scrollY: [".rifts-npc-sheet"],
      resizable: true,
    });
  }
}
