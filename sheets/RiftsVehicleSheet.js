// ============================================================
// RIFTS RPG - RiftsVehicleSheet.js
// Compact sheet for vehicles: stats, per-location MDC notes,
// mounted weapons (with strike/damage rolls) and cargo.
// Extends RiftsActorSheet to inherit item CRUD and roll
// listeners.
// ============================================================

import { RiftsActorSheet } from "./RiftsActorSheet.js";

export class RiftsVehicleSheet extends RiftsActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["rifts", "sheet", "actor", "vehicle"],
      template: "systems/rifts/templates/actor/vehicle-sheet.html",
      width: 620,
      height: 640,
      tabs: [],
      scrollY: [".rifts-vehicle-sheet"],
      resizable: true,
    });
  }
}
