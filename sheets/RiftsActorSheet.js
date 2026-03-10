// ============================================================
// RIFTS RPG - RiftsActorSheet.js
// Foundry VTT v13 compatible character sheet controller
// ============================================================

export class RiftsActorSheet extends ActorSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["rifts", "sheet", "actor"],
      template: "systems/rifts/templates/actor/character-sheet.html",
      width: 780,
      height: 860,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "attributes",
        },
      ],
      resizable: true,
    });
  }

  getData() {
    const context = super.getData();
    const actor = this.actor;
    const systemData = actor.system;

    context.system = systemData;
    context.flags = actor.flags;

    context.skills = actor.items
      .filter((i) => i.type === "skill")
      .sort((a, b) => a.name.localeCompare(b.name));

    context.weapons = actor.items.filter((i) => i.type === "weapon");
    context.armor = actor.items.filter((i) => i.type === "armor");
    context.equipment = actor.items.filter((i) => i.type === "equipment");

    context.occAbilities = actor.items
      .filter((i) => i.type === "occ_ability")
      .sort((a, b) => a.system.level - b.system.level);

    context.skillsByCategory = {};
    for (const skill of context.skills) {
      const cat = skill.system.category || "uncategorized";
      if (!context.skillsByCategory[cat]) {
        context.skillsByCategory[cat] = [];
      }
      context.skillsByCategory[cat].push(skill);
    }

    context.alignments = {
      principled: "Principled (Good)",
      scrupulous: "Scrupulous (Good)",
      unprincipled: "Unprincipled (Selfish)",
      anarchist: "Anarchist (Selfish)",
      miscreant: "Miscreant (Evil)",
      aberrant: "Aberrant (Evil)",
      diabolic: "Diabolic (Evil)",
    };

    context.damageTypes = {
      sdc: "S.D.C.",
      mdc: "M.D.C.",
      md: "Mega-Damage",
    };

    context.skillCategories = {
      communications: "Communications",
      domestic: "Domestic",
      electrical: "Electrical",
      espionage: "Espionage",
      horsemanship: "Horsemanship",
      mechanical: "Mechanical",
      medical: "Medical",
      military: "Military",
      physical: "Physical",
      pilot: "Pilot",
      pilotRelated: "Pilot Related",
      rogue: "Rogue",
      science: "Science",
      technical: "Technical",
      weaponProficiency: "W.P.",
      wilderness: "Wilderness",
    };

    const attrs = systemData.attributes;
    context.derived = {
      trustPercent: attrs.ma?.trustPercent ?? 0,
      charmPercent: attrs.pb?.charmPercent ?? 0,
      iqSkillBonus: attrs.iq?.skillBonus ?? 0,
      comaPercent: systemData.saves?.coma ?? 0,
      spdYards: attrs.spd?.yardsPerMelee ?? 0,
      spdMph: attrs.spd?.mph ?? 0,
    };

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // ── Rollable attributes ───────────────────────────────
    html.find(".attribute-roll").click(this._onAttributeRoll.bind(this));

    // ── Combat rolls ──────────────────────────────────────
    html.find(".combat-roll").click(this._onCombatRoll.bind(this));

    // ── Skill rolls ───────────────────────────────────────
    html.find(".skill-roll").click(this._onSkillRoll.bind(this));

    if (!this.isEditable) return;

    // ── Character name ────────────────────────────────────
    html.find(".char-name").off("change input keyup");
    html.find(".char-name").on("blur", async (event) => {
      await this.actor.update({ name: event.currentTarget.value.trim() });
    });

    // ── Actor text inputs and textareas ───────────────────
    html.find("input[data-path], textarea[data-path]").on("blur", async (event) => {
      const path = event.currentTarget.dataset.path;
      const value = event.currentTarget.value;
      await this.actor.update({ [path]: value });
    });

    // ── Actor number inputs ───────────────────────────────
    html.find("input[data-path-number]").on("blur", async (event) => {
      const path = event.currentTarget.dataset.pathNumber;
      const value = Number(event.currentTarget.value) || 0;
      await this.actor.update({ [path]: value });
    });

    // ── Actor select dropdowns ────────────────────────────
    html.find("select[data-path]").on("change", async (event) => {
      const path = event.currentTarget.dataset.path;
      const value = event.currentTarget.value;
      await this.actor.update({ [path]: value });
    });

    // ── HP / SDC current value changes ────────────────────
    html.find(".health-input").on("blur", async (event) => {
      const field = event.currentTarget.dataset.field;
      const value = Number(event.currentTarget.value) || 0;
      await this.actor.update({ [field]: value });
    });

    // ── Item text/select fields (gear, skills) ────────────
    html.find("input[data-item-path], textarea[data-item-path]").on("blur", async (event) => {
      const itemId = event.currentTarget.dataset.itemId;
      const path = event.currentTarget.dataset.itemPath;
      const value = event.currentTarget.value;
      const item = this.actor.items.get(itemId);
      if (item) await item.update({ [path]: value });
    });

    // ── Item number fields ────────────────────────────────
    html.find("input[data-item-path][type='number']").on("blur", async (event) => {
      const itemId = event.currentTarget.dataset.itemId;
      const path = event.currentTarget.dataset.itemPath;
      const value = Number(event.currentTarget.value) || 0;
      const item = this.actor.items.get(itemId);
      if (item) await item.update({ [path]: value });
    });

    // ── Item select dropdowns ─────────────────────────────
    html.find("select[data-item-path]").on("change", async (event) => {
      const itemId = event.currentTarget.dataset.itemId;
      const path = event.currentTarget.dataset.itemPath;
      const value = event.currentTarget.value;
      const item = this.actor.items.get(itemId);
      if (item) await item.update({ [path]: value });
    });

    // ── Add item buttons ──────────────────────────────────
    html.find(".item-add").click(this._onItemAdd.bind(this));

    // ── Delete item buttons ───────────────────────────────
    html.find(".item-delete").click(this._onItemDelete.bind(this));

    // ── Edit item ─────────────────────────────────────────
    html.find(".item-edit").click(this._onItemEdit.bind(this));

    // ── Inline item name editing ──────────────────────────
    html.find(".item-name-input").on("blur", this._onItemNameChange.bind(this));
  }

  async _onAttributeRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const attr = element.dataset.attr;
    const attrValue = this.actor.system.attributes[attr]?.value ?? 0;
    const label = element.dataset.label ?? attr.toUpperCase();

    const roll = new Roll("1d20");
    await roll.evaluate();

    const success = roll.total <= attrValue;
    const resultText = success
      ? `<span style="color:green">SUCCESS</span>`
      : `<span style="color:red">FAILURE</span>`;

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `<strong>${label} Check</strong> — Attribute: ${attrValue}<br>
        Rolled: ${roll.total} — ${resultText}`,
    });
  }

  async _onCombatRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const bonus = parseInt(element.dataset.bonus) || 0;
    const label = element.dataset.label ?? element.dataset.roll;
    await this.actor.rollD20(label, bonus);
  }

  async _onSkillRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item-row").dataset.itemId;
    const skill = this.actor.items.get(itemId);
    if (skill) await skill.roll();
  }

  async _onItemAdd(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const type = element.dataset.type;
    const itemData = {
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      type: type,
    };
    await Item.create(itemData, { parent: this.actor });
  }

  async _onItemDelete(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item-row").dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (!item) return;
    const confirmed = await Dialog.confirm({
      title: "Delete Item",
      content: `<p>Delete <strong>${item.name}</strong>? This cannot be undone.</p>`,
    });
    if (confirmed) await item.delete();
  }

  _onItemEdit(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item-row").dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) item.sheet.render(true);
  }

  async _onItemNameChange(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item-row").dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) await item.update({ name: element.value });
  }
}
