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
      scrollY: [".sheet-body"],
      resizable: true,
      // Gear rows and armor cards are draggable: within the sheet this
      // reorders them, and dragging one OUT still works normally
      // (e.g. onto an Item Piles merchant token).
      dragDrop: [
        { dragSelector: ".item-row[data-item-id]", dropSelector: ".sheet-body" },
        { dragSelector: ".armor-card[data-item-id]", dropSelector: ".sheet-body" },
      ],
    });
  }

  // ── Drag feedback ─────────────────────────────────────────
  // Foundry handles the actual reordering (_onDropItem -> _onSortItem);
  // these only add the visual cues.
  _onDragStart(event) {
    event.currentTarget.classList.add("dragging");
    return super._onDragStart(event);
  }

  _onDragOver(event) {
    const row = event.target.closest?.(".item-row[data-item-id], .armor-card[data-item-id]");
    this.element?.[0]
      ?.querySelectorAll(".drop-above, .drop-below")
      .forEach((el) => el.classList.remove("drop-above", "drop-below"));
    if (row && !row.classList.contains("dragging")) {
      const box = row.getBoundingClientRect();
      row.classList.add(event.clientY < box.top + box.height / 2 ? "drop-above" : "drop-below");
    }
    return super._onDragOver(event);
  }

  async _onDrop(event) {
    this.element?.[0]
      ?.querySelectorAll(".dragging, .drop-above, .drop-below")
      .forEach((el) => el.classList.remove("dragging", "drop-above", "drop-below"));
    return super._onDrop(event);
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

    // Gear keeps the player's own order (drag a row to reorder).
    const bySort = (a, b) => (a.sort || 0) - (b.sort || 0);
    context.weapons = actor.items.filter((i) => i.type === "weapon").sort(bySort);
    context.armor = actor.items.filter((i) => i.type === "armor").sort(bySort);
    context.equipment = actor.items.filter((i) => i.type === "equipment").sort(bySort);

    context.occAbilities = actor.items
      .filter((i) => i.type === "occ_ability")
      .sort((a, b) => a.system.level - b.system.level);

    context.primarySkills = context.skills.filter(s => !s.system.isSecondary);
    context.secondarySkills = context.skills.filter(s => s.system.isSecondary);

    context.skillsByCategory = {};
    for (const skill of context.primarySkills) {
      const cat = skill.system.category || "uncategorized";
      if (!context.skillsByCategory[cat]) context.skillsByCategory[cat] = [];
      context.skillsByCategory[cat].push(skill);
    }

    context.secondaryByCategory = {};
    for (const skill of context.secondarySkills) {
      const cat = skill.system.category || "uncategorized";
      if (!context.secondaryByCategory[cat]) context.secondaryByCategory[cat] = [];
      context.secondaryByCategory[cat].push(skill);
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
      cowboy: "Cowboy",
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

    const attrs = systemData.attributes ?? {};
    context.derived = {
      trustPercent: attrs.ma?.trustPercent ?? 0,
      charmPercent: attrs.pb?.charmPercent ?? 0,
      iqSkillBonus: attrs.iq?.skillBonus ?? 0,
      comaPercent: systemData.saves?.coma ?? 0,
      spdYards: attrs.spd?.yardsPerMelee ?? 0,
      spdMph: attrs.spd?.mph ?? 0,
    };

    // ── Equipped weapons for attributes tab panel ────────
    context.equippedWeapons = actor.items.filter(
      (i) => i.type === "weapon" && i.system.equipped
    );

    // ── Encumbrance calculation ──────────────────────────
    const ps = actor.system.attributes?.ps?.value ?? 10;
    // Carry/Lift from the P.S.-Type engine (RiftsActor derived values);
    // a numeric manual override in Physical Capabilities wins.
    const combatSys = actor.system.combat ?? {};
    const manualCarry = parseFloat(String(combatSys.carryCapacity ?? "").replace(/[^\d.]/g, ""));
    const manualLift = parseFloat(String(combatSys.liftCapacity ?? "").replace(/[^\d.]/g, ""));
    context.carryLimit = (manualCarry > 0 ? manualCarry : null) ?? combatSys.autoCarryLbs ?? ps * 10;
    context.liftLimit = (manualLift > 0 ? manualLift : null) ?? combatSys.autoLiftLbs ?? ps * 20;

    let totalWeight = 0;
    for (const item of actor.items) {
      if (!["weapon", "armor", "equipment"].includes(item.type)) continue;
      const w = parseFloat(item.system.weight);
      if (isNaN(w)) continue;
      const qty = item.type === "equipment" ? (item.system.quantity ?? 1) : 1;
      totalWeight += w * qty;
    }
    context.totalWeight = Math.round(totalWeight * 10) / 10;
    context.encumbered = totalWeight > context.carryLimit;
    context.weightPercent = Math.min(100, Math.round((totalWeight / context.carryLimit) * 100));

    // Pre-build skill category options HTML to avoid nested Handlebars context issues
    context.skillCategoryOptions = Object.entries(context.skillCategories)
      .map(([key, label]) => `<option value="${key}">${label}</option>`)
      .join('');

    // Horsemanship / mounted combat context
    const horseSkills = actor.items.filter((i) => i.type === "skill" && i.system?.isHorsemanship);
    context.hasHorsemanship = horseSkills.length > 0;
    const activeId = systemData.combat?.mountedSkillId;
    context.horsemanshipSkills = horseSkills.map((s) => ({
      id: s.id, name: s.name,
      selected: activeId ? s.id === activeId : (s.system.equipped || false),
    }));
    // ensure exactly one shows selected if none chosen
    if (context.horsemanshipSkills.length && !context.horsemanshipSkills.some((s) => s.selected)) {
      context.horsemanshipSkills[0].selected = true;
    }

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

    // Horsemanship inline panel: toggle open/closed (persists via _openHmPanel)
    const openHmPanel = (itemId) => {
      html.find(".hm-inline-panel").removeClass("open");
      html.find(".hm-expand-toggle").removeClass("active");
      this._openHmPanel = null;
      if (!itemId) return;
      const panel = html.find(`.hm-inline-panel[data-hm-for="${itemId}"]`)[0];
      const toggle = html.find(`.hm-expand-toggle[data-item-id="${itemId}"]`)[0];
      if (!panel) return;
      panel.classList.add("open");
      if (toggle) toggle.classList.add("active");
      this._openHmPanel = itemId;
    };
    // Skill description accordion (single-open, persists across renders)
    const openSkillDetail = (itemId) => {
      html.find(".skill-detail-panel").removeClass("open");
      html.find(".skill-detail-toggle").removeClass("active");
      this._openSkillDetail = null;
      if (!itemId) return;
      const panel = html.find(`.skill-detail-panel[data-skill-detail-for="${itemId}"]`)[0];
      const toggle = html.find(`.skill-detail-toggle[data-item-id="${itemId}"]`)[0];
      if (!panel) return;
      panel.classList.add("open");
      if (toggle) toggle.classList.add("active");
      this._openSkillDetail = itemId;
    };
    html.find(".skill-detail-toggle").click((event) => {
      event.preventDefault();
      const itemId = event.currentTarget.dataset.itemId;
      openSkillDetail(this._openSkillDetail === itemId ? null : itemId);
    });
    if (this._openSkillDetail) openSkillDetail(this._openSkillDetail);

    html.find(".hm-expand-toggle").click((event) => {
      event.preventDefault();
      const itemId = event.currentTarget.dataset.itemId;
      openHmPanel(this._openHmPanel === itemId ? null : itemId);
    });
    if (this._openHmPanel) openHmPanel(this._openHmPanel);

    // Sub-skill rolls from the inline panel
    html.find(".hm-sub").click(async (event) => {
      event.preventDefault();
      const el = event.currentTarget;
      await this.actor.rollHorseSub(el.dataset.itemId, el.dataset.sub, el.dataset.subLabel, { skipDialog: event.shiftKey });
    });

    // ── Mounted combat (Horsemanship) ──────────────────────
    // Hand to Hand style picker
    html.find(".hth-style-select").on("change", async (event) => {
      await this.actor.update({ "system.combat.hthStyle": event.currentTarget.value });
    });
    html.find(".hth-move-roll").click(async (event) => {
      event.preventDefault();
      const idx = Number(event.currentTarget.dataset.moveIndex);
      const move = this.actor.system.combat.hthMoves?.[idx];
      if (move?.damage) await this.actor.rollHthMove(move);
    });
    html.find(".hth-moves-toggle").click((event) => {
      event.preventDefault();
      html.find(".hth-moves-panel").toggleClass("open");
    });

    html.find(".mounted-check").on("change", async (event) => {
      await this.actor.update({ "system.combat.mounted": event.currentTarget.checked });
    });
    html.find(".mounted-skill-select").on("change", async (event) => {
      await this.actor.update({ "system.combat.mountedSkillId": event.currentTarget.value });
    });
    html.find(".charge-roll").click(async (event) => {
      event.preventDefault();
      await this.actor.rollCharge({ skipDialog: event.shiftKey });
    });

    // Saving throw rolls
    html.find(".save-roll").click(async (event) => {
      const el = event.currentTarget;
      const label = el.dataset.saveLabel;
      const target = Number(el.dataset.saveTarget) || 0;
      const path = el.dataset.savePath;
      const bonus = foundry.utils.getProperty(this.actor, path) ?? 0;
      await this.actor.rollSave(label, bonus, target, { skipDialog: event.shiftKey });
    });

    // Weapon strike & damage rolls
    html.find(".weapon-strike-roll").click(async (event) => {
      const itemId = event.currentTarget.dataset.itemId;
      const weapon = this.actor.items.get(itemId);
      // Shift-click keeps the old quick strike roll; a normal click opens
      // the full attack dialog (shot type, power setting, ammo).
      if (!weapon) return;
      if (event.shiftKey) await this.actor.rollWeaponStrike(weapon, { skipDialog: true });
      else await this.actor.rollWeaponAttack(weapon);
    });

    html.find(".weapon-damage-roll").click(async (event) => {
      const itemId = event.currentTarget.dataset.itemId;
      const weapon = this.actor.items.get(itemId);
      if (weapon) await this.actor.rollWeaponDamage(weapon);
    });

    // ── Gear accordion ────────────────────────────────────
    // Click a row's book icon to unfold its description, specs
    // and notes; opening one folds up the previous one. Same
    // pattern as the Skills accordion.
    const openGearDetail = (itemId) => {
      // Fold everything, reset all chevrons.
      html.find(".gear-detail.open").removeClass("open");
      html.find(".gear-expand-toggle").removeClass("active");
      this._openGearDetail = null;
      if (!itemId) return;
      const detail = html.find(`.gear-detail[data-detail-for="${itemId}"]`)[0];
      const toggle = html.find(`.gear-expand-toggle[data-item-id="${itemId}"]`)[0];
      if (!detail) return;
      detail.classList.add("open");
      if (toggle) toggle.classList.add("active");
      this._openGearDetail = itemId;
    };

    html.find(".gear-expand-toggle").click((event) => {
      event.preventDefault();
      const itemId = event.currentTarget.dataset.itemId;
      openGearDetail(this._openGearDetail === itemId ? null : itemId);
    });

    // Re-open the panel that was open before this re-render (if its item still exists).
    if (this._openGearDetail) openGearDetail(this._openGearDetail);

    // Weapon equip toggle
    html.find(".weapon-equip-toggle").click(async (event) => {
      const itemId = event.currentTarget.dataset.itemId;
      const item = this.actor.items.get(itemId);
      if (item) await item.update({"system.equipped": !item.system.equipped});
    });

    // Toggle primary <-> secondary
    html.find(".skill-toggle-secondary").click(async (event) => {
      const itemId = event.currentTarget.dataset.itemId;
      const item = this.actor.items.get(itemId);
      if (item) await item.update({"system.isSecondary": !item.system.isSecondary});
    });

    if (!this.isEditable) return;

    // ── Character name ────────────────────────────────────
    html.find(".char-name").off("change input keyup");
    html.find(".char-name").on("blur", async (event) => {
      const name = event.currentTarget.value.trim();
      if (name === this.actor.name || !name) return;
      await this.actor.update({ name });
    });

    // ── Actor text inputs and textareas ───────────────────
    html.find("input[data-path], textarea[data-path]").on("blur", async (event) => {
      const path = event.currentTarget.dataset.path;
      const value = event.currentTarget.value;
      if (String(foundry.utils.getProperty(this.actor, path) ?? "") === value) return;
      await this.actor.update({ [path]: value });
    });

    // ── Actor number inputs ───────────────────────────────
    html.find("input[data-path-number]").on("blur", async (event) => {
      const path = event.currentTarget.dataset.pathNumber;
      const value = Number(event.currentTarget.value) || 0;
      if (Number(foundry.utils.getProperty(this.actor, path) ?? 0) === value) return;
      await this.actor.update({ [path]: value });
    });

    // ── Actor checkboxes ──────────────────────────────────
    html.find("input[data-path-bool]").on("change", async (event) => {
      const path = event.currentTarget.dataset.pathBool;
      await this.actor.update({ [path]: event.currentTarget.checked });
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
      if (Number(foundry.utils.getProperty(this.actor, field) ?? 0) === value) return;
      await this.actor.update({ [field]: value });
    });

    // ── Item text/select fields (gear, skills) ────────────
    html.find("input[data-item-path]:not([type='number']), textarea[data-item-path]").on("blur", async (event) => {
      const itemId = event.currentTarget.dataset.itemId;
      const path = event.currentTarget.dataset.itemPath;
      const value = event.currentTarget.value;
      const item = this.actor.items.get(itemId);
      if (!item) return;
      if (String(foundry.utils.getProperty(item, path) ?? "") === value) return;
      await item.update({ [path]: value });
    });

    // ── Item number fields ────────────────────────────────
    html.find("input[data-item-path][type='number']").on("blur", async (event) => {
      const itemId = event.currentTarget.dataset.itemId;
      const path = event.currentTarget.dataset.itemPath;
      const value = Number(event.currentTarget.value) || 0;
      const item = this.actor.items.get(itemId);
      if (!item) return;
      if (Number(foundry.utils.getProperty(item, path) ?? 0) === value) return;
      await item.update({ [path]: value });
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

    // Initiative: if this actor is in the active encounter, roll INTO
    // the Combat Tracker (uses CONFIG.Combat.initiative formula).
    if (element.dataset.roll === "initiative" && game.combat) {
      const combatant = game.combat.combatants.find((c) =>
        this.actor.isToken
          ? c.tokenId === this.actor.token?.id
          : c.actor?.id === this.actor.id
      );
      if (combatant) {
        await game.combat.rollInitiative([combatant.id]);
        return;
      }
    }

    await this.actor.rollD20(label, bonus, { skipDialog: event.shiftKey });
  }

  async _onSkillRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest("[data-item-id]").dataset.itemId;
    const skill = this.actor.items.get(itemId);
    if (skill) await skill.roll({ skipDialog: event.shiftKey });
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
    const itemId = element.closest("[data-item-id]").dataset.itemId;
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
    const itemId = element.closest("[data-item-id]").dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) item.sheet.render(true);
  }

  async _onItemNameChange(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const itemId = element.closest("[data-item-id]").dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (!item || item.name === element.value) return;
    await item.update({ name: element.value });
  }
}
