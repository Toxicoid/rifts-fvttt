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
    if (me >= 16) {
      saves.psionicBonus += me - 15;
      saves.insanityBonus += Math.floor((me - 15) / 2);
    }

    // ── M.A. Bonus ─────────────────────────────────────────
    // MA determines Trust/Intimidate percentage
    const ma = attrs.ma.value;
    attrs.ma.trustPercent = ma >= 16 ? 30 + ((ma - 16) * 5) : ma * 2;

    // ── P.S. Bonus ─────────────────────────────────────────
    // PS 16+ adds to damage
    const ps = attrs.ps.value;
    if (ps >= 16) {
      combat.damageBonus += ps - 15;
    }

    // ── P.P. Bonus ─────────────────────────────────────────
    // PP 16+ adds to strike, parry, and dodge
    const pp = attrs.pp.value;
    if (pp >= 16) {
      const ppBonus = pp - 15;
      combat.strikeBonus += ppBonus;
      combat.parryBonus += ppBonus;
      combat.dodgeBonus += ppBonus;
    }

    // ── P.E. Bonus ─────────────────────────────────────────
    // PE affects saves vs poison/disease and coma/death
    const pe = attrs.pe.value;
    if (pe >= 16) {
      saves.poisonBonus += pe - 15;
      saves.diseaseBonus += pe - 15;
    }
    // Coma/Death % = PE x 2 + 10 (base Palladium formula)
    saves.coma = (pe * 2) + 10;

    // ── P.B. Bonus ─────────────────────────────────────────
    // PB determines Charm/Impress percentage
    const pb = attrs.pb.value;
    attrs.pb.charmPercent = pb >= 16 ? 30 + ((pb - 16) * 5) : 0;

    // ── Spd ────────────────────────────────────────────────
    // Speed in yards per melee (approx), and mph
    const spd = attrs.spd.value;
    attrs.spd.yardsPerMelee = spd * 10;
    attrs.spd.mph = Math.round(spd * 0.68);
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
    combat.strikeBonus = Math.round(combat.strikeBonus);
    combat.parryBonus = Math.round(combat.parryBonus);
    combat.dodgeBonus = Math.round(combat.dodgeBonus);
    combat.damageBonus = Math.round(combat.damageBonus);
  }

  // ── roll ──────────────────────────────────────────────────
  // Generic d20 roll with a bonus — used for strike/parry/dodge
  // ── Weapon strike roll ─────────────────────────────────
  async rollWeaponStrike(weapon) {
    const strikeBonus = this.system.combat.strikeBonus ?? 0;
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

    // Extract dice expression: handles "3d6", "1d4x10 M.D.", "2d6+2", etc.
    const match = dmgString.match(/(\d+)[dD](\d+)\s*(?:[xX×](\d+))?\s*(?:\+(\d+))?/);
    if (!match) {
      ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content: `<strong>${weapon.name}</strong> — damage "${dmgString || "not set"}" cannot be auto-rolled. Roll manually.`,
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
      flavor: `<strong>${weapon.name}</strong> — Damage (${dmgType})`,
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
