// ============================================================
// RIFTS RPG - RiftsActorSheet.js
// Controls the character sheet window, data binding,
// and all user interactions on the sheet
// ============================================================

export class RiftsActorSheet extends ActorSheet {
  // ── defaultOptions ─────────────────────────────────────────
  // Tells Foundry the basic properties of this sheet window
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
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

  // ── getData ────────────────────────────────────────────────
  // Prepares all data that gets sent to the HTML template.
  // Anything you want available in your Handlebars HTML
  // must be returned from this method.
  getData() {
    // Start with Foundry's base context
    const context = super.getData();

    // Grab the actor and its system data
    const actor = this.actor;
    const systemData = actor.system;

    // Pass through core data
    context.system = systemData;
    context.flags = actor.flags;

    // ── Sort items by type ─────────────────────────────────
    // Split the actor's items into typed arrays for the template
    context.skills = actor.items
      .filter((i) => i.type === "skill")
      .sort((a, b) => a.name.localeCompare(b.name));

    context.weapons = actor.items.filter((i) => i.type === "weapon");

    context.armor = actor.items.filter((i) => i.type === "armor");

    context.equipment = actor.items.filter((i) => i.type === "equipment");

    context.occAbilities = actor.items
      .filter((i) => i.type === "occ_ability")
      .sort((a, b) => a.system.level - b.system.level);

    // ── Group skills by category ───────────────────────────
    // Organizes skills into their category groups for display
    context.skillsByCategory = {};
    for (const skill of context.skills) {
      const cat = skill.system.category || "uncategorized";
      if (!context.skillsByCategory[cat]) {
        context.skillsByCategory[cat] = [];
      }
      context.skillsByCategory[cat].push(skill);
    }

    // ── Pass config data for dropdowns ────────────────────
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

    // ── Derived display values ─────────────────────────────
    // Pre-calculate things that are handy to show in the sheet
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

  // ── activateListeners ──────────────────────────────────────
  // Wires up all the interactive elements on the sheet.
  // This runs every time the sheet is rendered.
  activateListeners(html) {
    super.activateListeners(html);

    // ── Rollable attributes (click an attribute to roll) ───
    html.find(".attribute-roll").click(this._onAttributeRoll.bind(this));

    // ── Combat rolls ───────────────────────────────────────
    html.find(".combat-roll").click(this._onCombatRoll.bind(this));

    // ── Skill rolls ────────────────────────────────────────
    html.find(".skill-roll").click(this._onSkillRoll.bind(this));

    // ── Only allow editing if sheet is editable ───────────
    if (!this.isEditable) return;

    // ── Add item buttons ───────────────────────────────────
    html.find(".item-add").click(this._onItemAdd.bind(this));

    // ── Delete item buttons ────────────────────────────────
    html.find(".item-delete").click(this._onItemDelete.bind(this));

    // ── Edit item (open item sheet) ────────────────────────
    html.find(".item-edit").click(this._onItemEdit.bind(this));

    // ── Inline item name editing ───────────────────────────
    html.find(".item-name-input").change(this._onItemNameChange.bind(this));

    // ── HP / SDC current value changes ────────────────────
    html.find(".health-input").change(this._onHealthChange.bind(this));
  }

  // ── _onAttributeRoll ──────────────────────────────────────
  // Handles clicking on an attribute to roll a check
  async _onAttributeRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const attr = element.dataset.attr;
    const attrValue = this.actor.system.attributes[attr]?.value ?? 0;
    const label = element.dataset.label ?? attr.toUpperCase();

    // Attribute checks in Palladium are typically roll-under on d20
    // or a straight d20 roll depending on context
    const roll = new Roll("1d20");
    await roll.evaluate();

    const success = roll.total <= attrValue;
    const resultText = success
      ? `<span style="color:green">SUCCESS</span>`
      : `<span style="color:red">FAILURE</span>`;

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `
        <strong>${label} Check</strong> — Attribute: ${attrValue}<br>
        Rolled: ${roll.total} — ${resultText}
      `,
    });
  }

  // ── _onCombatRoll ─────────────────────────────────────────
  // Handles strike / parry / dodge / initiative rolls
  async _onCombatRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const rollType = element.dataset.roll;
    const bonus = parseInt(element.dataset.bonus) || 0;
    const label = element.dataset.label ?? rollType;

    await this.actor.rollD20(label, bonus);
  }

  // ── _onSkillRoll ──────────────────────────────────────────
  // Handles clicking the roll button next to a skill
  async _onSkillRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item-row").dataset.itemId;
    const skill = this.actor.items.get(itemId);
    if (skill) await skill.roll();
  }

  // ── _onItemAdd ────────────────────────────────────────────
  // Creates a new blank item of the specified type
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

  // ── _onItemDelete ─────────────────────────────────────────
  // Deletes an item after confirmation
  async _onItemDelete(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item-row").dataset.itemId;
    const item = this.actor.items.get(itemId);

    if (!item) return;

    // Ask the user to confirm before deleting
    const confirmed = await Dialog.confirm({
      title: "Delete Item",
      content: `<p>Delete <strong>${item.name}</strong>? This cannot be undone.</p>`,
    });

    if (confirmed) await item.delete();
  }

  // ── _onItemEdit ───────────────────────────────────────────
  // Opens the item's own sheet for detailed editing
  _onItemEdit(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item-row").dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) item.sheet.render(true);
  }

  // ── _onItemNameChange ─────────────────────────────────────
  // Saves an inline name edit directly on the sheet
  async _onItemNameChange(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest(".item-row").dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) await item.update({ name: element.value });
  }

  // ── _onHealthChange ───────────────────────────────────────
  // Saves HP or SDC current value changes
  async _onHealthChange(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const field = element.dataset.field;
    const value = parseInt(element.value) || 0;
    await this.actor.update({ [field]: value });
  }
}
