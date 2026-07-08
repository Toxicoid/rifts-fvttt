// ============================================================
// RIFTS RPG - RiftsActor.js
// Extends Foundry's Actor class with Rifts-specific logic
// ============================================================

export class RiftsActor extends Actor {

  // ── _preCreate ────────────────────────────────────────────
  // Sets default token configuration for new characters
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    if (this.type === "character") {
      this.updateSource({
        "prototypeToken.bar1": { attribute: "health.hp" },
        "prototypeToken.bar2": { attribute: "health.sdc" },
        "prototypeToken.displayBars": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
        "prototypeToken.displayName": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
        "prototypeToken.sight.enabled": true,
        "prototypeToken.actorLink": true,
        "prototypeToken.texture.src": data.img ?? "icons/svg/mystery-man.svg",
        "prototypeToken.texture.scaleX": 1,
        "prototypeToken.texture.scaleY": 1,
        "prototypeToken.ring.enabled": false,
        "prototypeToken.width": 1,
        "prototypeToken.height": 1,
        "prototypeToken.shape": "circle",
      });
    }

    if (this.type === "npc") {
      this.updateSource({
        "prototypeToken.bar1": { attribute: "health.mdc" },
        "prototypeToken.bar2": { attribute: "health.hp" },
        "prototypeToken.displayBars": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
        "prototypeToken.displayName": CONST.TOKEN_DISPLAY_MODES.HOVER,
        "prototypeToken.sight.enabled": false,
        "prototypeToken.actorLink": false,
        "prototypeToken.disposition": CONST.TOKEN_DISPOSITIONS.HOSTILE,
        "prototypeToken.texture.src": data.img ?? "icons/svg/mystery-man.svg",
        "prototypeToken.width": 1,
        "prototypeToken.height": 1,
        "prototypeToken.shape": "circle",
      });
    }

    if (this.type === "vehicle") {
      this.updateSource({
        "prototypeToken.bar1": { attribute: "health.mdc" },
        "prototypeToken.displayBars": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
        "prototypeToken.displayName": CONST.TOKEN_DISPLAY_MODES.HOVER,
        "prototypeToken.sight.enabled": false,
        "prototypeToken.actorLink": true,
        "prototypeToken.disposition": CONST.TOKEN_DISPOSITIONS.NEUTRAL,
        "prototypeToken.texture.src": data.img ?? "icons/svg/anchor.svg",
        "prototypeToken.width": 2,
        "prototypeToken.height": 2,
      });
    }
  }

  // ── prepareDerivedData ─────────────────────────────────────
  // Foundry calls this automatically whenever actor data changes.
  // This is where we calculate stats that derive from other stats.
  prepareDerivedData() {
    super.prepareDerivedData();

    const systemData = this.system;
    const attrs = systemData.attributes;
    const health = systemData.health;
    const combat = systemData.combat;
    const saves = systemData.saves;

    // Only run for character type actors
    if (this.type === "character") {
      this._prepareAttributeBonuses(attrs, combat, saves);
      this._prepareHealthData(attrs, health);
      this._prepareCombatData(attrs, combat);
    }
  }

  // ── _prepareAttributeBonuses ───────────────────────────────
  // Calculates the standard Palladium bonuses that come
  // directly from raw attribute scores
  _prepareAttributeBonuses(attrs, combat, saves) {

    // ── I.Q. Bonus ─────────────────────────────────────────
    // IQ 16+ grants a bonus to skills (tracked, applied in skill rolls)
    const iq = attrs.iq.value;
    attrs.iq.skillBonus = iq >= 16 ? (iq - 15) * 5 : 0;

    // ── M.E. Bonus ─────────────────────────────────────────
    // ME affects saves vs psionics and insanity
    const me = attrs.me.value;
    saves.attrPsionic = me >= 16 ? me - 15 : 0;
    saves.attrInsanity = me >= 16 ? Math.floor((me - 15) / 2) : 0;

    // ── M.A. Bonus ─────────────────────────────────────────
    // MA determines Trust/Intimidate percentage
    const ma = attrs.ma.value;
    attrs.ma.trustPercent = ma >= 16 ? 30 + ((ma - 16) * 5) : ma * 2;

    // ── P.S. Bonus ─────────────────────────────────────────
    // PS 16+ adds to damage. Stored in a SEPARATE derived field
    // so editing the base bonus never compounds.
    const ps = attrs.ps.value;
    combat.attrDamage = ps >= 16 ? ps - 15 : 0;

    // ── P.P. Bonus ─────────────────────────────────────────
    // PP 16+ adds to strike, parry, and dodge (separate derived
    // fields — the stored bonuses hold HtH/misc only).
    const pp = attrs.pp.value;
    const ppBonus = pp >= 16 ? pp - 15 : 0;
    combat.attrStrike = ppBonus;
    combat.attrParry = ppBonus;
    combat.attrDodge = ppBonus;

    // ── P.E. Bonus ─────────────────────────────────────────
    // PE affects saves vs poison/disease and coma/death
    const pe = attrs.pe.value;
    saves.attrPoison = pe >= 16 ? pe - 15 : 0;
    saves.attrDisease = pe >= 16 ? pe - 15 : 0;
    // Coma/Death % = PE x 2 + 10 (base Palladium formula)
    saves.coma = (pe * 2) + 10;

    // ── P.B. Bonus ─────────────────────────────────────────
    // PB determines Charm/Impress percentage
    const pb = attrs.pb.value;
    attrs.pb.charmPercent = pb >= 16 ? 30 + ((pb - 16) * 5) : 0;

    // ── Spd ────────────────────────────────────────────────
    // Speed in yards per melee (approx), and mph
    const spd = attrs.spd.value;
    attrs.spd.yardsPerMelee = spd * 5;            // Spd x 5 = yards per melee (15 s)
    attrs.spd.feetPerMelee = spd * 15;            // x 15 = feet per melee
    attrs.spd.mph = Math.round(spd * 0.682);
  }

  // ── _prepareHealthData ─────────────────────────────────────
  // Ensures HP/SDC max values are never below 1
  _prepareHealthData(attrs, health) {
    health.hp.max = Math.max(health.hp.max, 1);
    health.sdc.max = Math.max(health.sdc.max, 0);
  }

  // ── _prepareCombatData ────────────────────────────────────
  // Ensures combat values are sensible integers
  _prepareCombatData(attrs, combat) {
    combat.attacksPerMelee = Math.max(combat.attacksPerMelee, 1);
    // Grand totals = stored (HtH/misc) + attribute-derived. These
    // are what rolls and displays use; stored fields stay editable.
    combat.strikeTotal = Math.round((combat.strikeBonus || 0) + (combat.attrStrike || 0));
    combat.parryTotal = Math.round((combat.parryBonus || 0) + (combat.attrParry || 0));
    combat.dodgeTotal = Math.round((combat.dodgeBonus || 0) + (combat.attrDodge || 0));
    combat.damageTotal = Math.round((combat.damageBonus || 0) + (combat.attrDamage || 0));
    // Movement per action: (Spd x 15 ft per melee) / attacks per melee
    const spdVal = attrs.spd?.value ?? 0;
    const apm = Math.max(combat.attacksPerMelee || 1, 1);
    combat.feetPerAction = Math.round((spdVal * 15) / apm);
    combat.yardsPerAction = Math.round((spdVal * 5) / apm);
    const saves = this.system.saves;
    saves.psionicTotal = (saves.psionicBonus || 0) + (saves.attrPsionic || 0);
    saves.insanityTotal = (saves.insanityBonus || 0) + (saves.attrInsanity || 0);
    saves.poisonTotal = (saves.poisonBonus || 0) + (saves.attrPoison || 0);
    saves.diseaseTotal = (saves.diseaseBonus || 0) + (saves.attrDisease || 0);
  }

  // ── roll ──────────────────────────────────────────────────
  // Generic d20 roll with a bonus — used for strike/parry/dodge
  // ── Saving throw roll ──────────────────────────────────
  async rollSave(label, bonus, target) {
    const roll = new Roll(`1d20 + ${bonus}`);
    await roll.evaluate();

    const natural = roll.dice[0].total;
    let resultText = "";
    if (target > 0) {
      if (natural === 20) resultText = ` — <span style="color:#e8751a;font-weight:bold;">NATURAL 20!</span>`;
      else if (roll.total >= target) resultText = ` — <span style="color:#3c3;font-weight:bold;">SAVED (${target}+)</span>`;
      else resultText = ` — <span style="color:#e33;font-weight:bold;">FAILED (needs ${target}+)</span>`;
    } else {
      resultText = ` — <span style="color:#aaa;">vs GM's target</span>`;
    }

    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `<strong>Save ${label}</strong>${resultText}<br>
               <span style="font-size:11px;">d20 ${natural} + ${bonus} bonus</span>`,
    });
  }

  // ── Weapon strike roll ─────────────────────────────────
  async rollWeaponStrike(weapon) {
    const strikeBonus = this.system.combat.strikeTotal ?? this.system.combat.strikeBonus ?? 0;
    const weaponBonus = weapon.system.bonusToStrike ?? 0;
    const total = strikeBonus + weaponBonus;

    const roll = new Roll(`1d20 + ${total}`);
    await roll.evaluate();

    const natural = roll.dice[0].total;
    let resultText = "";
    if (natural === 20) resultText = ` — <span style="color:#e8751a;font-weight:bold;">NATURAL 20! CRITICAL!</span>`;
    else if (natural === 1) resultText = ` — <span style="color:#e33;font-weight:bold;">NATURAL 1!</span>`;
    else if (roll.total >= 5) resultText = ` — <span style="color:#3c3;">HIT (5+)</span>`;
    else resultText = ` — <span style="color:#e33;">MISS (under 5)</span>`;

    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `<strong>${weapon.name}</strong> — Strike Roll${resultText}<br>
               <span style="font-size:11px;">d20 ${natural} + ${total} bonus (dodge/parry may still apply)</span>`,
    });
  }

  // ── Weapon damage roll ─────────────────────────────────
  async rollWeaponDamage(weapon) {
    let dmgString = (weapon.system.damage ?? "").trim();
    const special = (weapon.system.special ?? "").trim();
    const specialHtml = special
      ? `<div class="weapon-special" style="margin-top: 4px; font-size: 12px; border-top: 1px dotted #999; padding-top: 3px; white-space: pre-line;"><em>${special}</em></div>`
      : "";

    // Extract dice expression: handles "3d6", "1d4x10 M.D.", "2d6+2", etc.
    const match = dmgString.match(/(\d+)[dD](\d+)\s*(?:[xX×](\d+))?\s*(?:\+(\d+))?/);
    if (!match) {
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content: `<strong>${weapon.name}</strong> — damage "${dmgString || "not set"}" cannot be auto-rolled. Roll manually.${specialHtml}`,
      });
      return;
    }

    const [, num, sides, mult, plus] = match;
    let formula = `${num}d${sides}`;
    if (mult) formula = `(${formula}) * ${mult}`;
    if (plus) formula = `${formula} + ${plus}`;

    // Add character damage bonus for melee/SDC hand weapons? Keep manual - just roll weapon dice.
    const roll = new Roll(formula);
    await roll.evaluate();

    const dmgType = weapon.system.damageType === "MDC" ? "M.D." : "S.D.C.";

    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `<strong>${weapon.name}</strong> — Damage (${dmgType})${specialHtml}`,
    });
  }

  async rollD20(label, bonus = 0) {
    const roll = new Roll(`1d20 + ${bonus}`);
    await roll.evaluate();
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `${label} (Bonus: +${bonus})`,
    });
    return roll;
  }

  // ── rollSkill ─────────────────────────────────────────────
  // Rolls a percentile skill check against the skill's total %
  async rollSkill(skillName, targetPercent) {
    const roll = new Roll("1d100");
    await roll.evaluate();
    const success = roll.total <= targetPercent;
    const resultText = success
      ? `<span style="color:green">SUCCESS</span>`
      : `<span style="color:red">FAILURE</span>`;

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `
        <strong>${skillName}</strong> — Target: ${targetPercent}%<br>
        Rolled: ${roll.total} — ${resultText}
      `,
    });
    return roll;
  }
}
