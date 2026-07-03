// ============================================================
// RIFTS RPG - RiftsItemSheet
// Item sheet for weapons, armor, equipment, skills, abilities.
// Foundry v13 compatible: data-path bindings, no name= attrs.
// ============================================================

export class RiftsItemSheet extends ItemSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["rifts", "sheet", "item"],
      width: 520,
      height: 480,
      template: "systems/rifts/templates/item/item-sheet.html",
    });
  }

  getData() {
    const context = super.getData();
    context.system = this.item.system;
    context.itemType = this.item.type;
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Name field
    html.find(".item-sheet-name").on("blur", async (event) => {
      await this.item.update({ name: event.currentTarget.value });
    });

    // Text/textarea fields
    html.find("input[data-path][type='text'], textarea[data-path]").on("blur", async (event) => {
      const path = event.currentTarget.dataset.path;
      await this.item.update({ [path]: event.currentTarget.value });
    });

    // Number fields
    html.find("input[data-path-number]").on("blur", async (event) => {
      const path = event.currentTarget.dataset.pathNumber;
      await this.item.update({ [path]: Number(event.currentTarget.value) });
    });

    // Selects
    html.find("select[data-path]").on("change", async (event) => {
      const path = event.currentTarget.dataset.path;
      await this.item.update({ [path]: event.currentTarget.value });
    });
  }
}
