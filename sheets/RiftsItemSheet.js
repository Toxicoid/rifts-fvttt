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
      scrollY: [".item-sheet-body"],
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

    // Read-only display blocks with an edit toggle (skills).
    html.find(".is-edit-toggle").on("click", (event) => {
      event.preventDefault();
      const field = event.currentTarget.closest(".is-field");
      field.classList.toggle("editing");
      if (field.classList.contains("editing")) {
        const ta = field.querySelector(".is-editbox");
        if (ta) { ta.focus(); }
      }
    });

    // Name field
    html.find(".item-sheet-name").on("blur", async (event) => {
      const name = event.currentTarget.value;
      if (name === this.item.name || !name.trim()) return;
      await this.item.update({ name });
    });

    // Text/textarea fields
    html.find("input[data-path][type='text'], textarea[data-path]").on("blur", async (event) => {
      const path = event.currentTarget.dataset.path;
      const value = event.currentTarget.value;
      if (String(foundry.utils.getProperty(this.item, path) ?? "") === value) return;
      await this.item.update({ [path]: value });
    });

    // Number fields
    html.find("input[data-path-number]").on("blur", async (event) => {
      const path = event.currentTarget.dataset.pathNumber;
      const value = Number(event.currentTarget.value) || 0;
      if (Number(foundry.utils.getProperty(this.item, path) ?? 0) === value) return;
      await this.item.update({ [path]: value });
    });

    // Selects
    html.find("select[data-path]").on("change", async (event) => {
      const path = event.currentTarget.dataset.path;
      await this.item.update({ [path]: event.currentTarget.value });
    });
  }
}
