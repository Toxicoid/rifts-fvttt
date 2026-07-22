// ============================================================
// RIFTS RPG - RiftsActor.js
// Extends Foundry's Actor class with Rifts-specific logic
// ============================================================

import { HTH_STYLES, hthBonus, hthCrit, hthMoves, matchMove } from "./hth-data.js";
import { applyCreation, summarizeForNpc } from "./creation.js";
import { SHOT_TYPES, SITUATIONAL, shotType } from "./shot-data.js";

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

    // ── Bionic limb attributes ─────────────────────────────
    // Limb attributes are SEPARATE from the character's own P.S./P.P.
    // (Rifts Bionics p.70: a standard prosthetic starts at 10; caps are
    // 20 for partial cyborgs, 32 for full conversions — full-conversion
    // chassis legs start higher, e.g. 18.)
    // Bonuses use the same attribute tables the character uses, applied
    // to the limb doing the work:
    //   ARM  P.P. -> strike & parry, ARM P.S. -> melee damage
    //        (applies to attacks made WITH that bionic arm)
    //   LEG  -> leaping and speed; explicitly NOT hand-to-hand strike/parry
    const armPS = combat.armPS ?? 0;
    const armPP = combat.armPP ?? 0;
    const legPS = combat.legPS ?? 0;
    combat.armDamageBonus = armPS >= 16 ? armPS - 15 : 0;
    combat.armStrikeBonus = armPP >= 16 ? armPP - 15 : 0;
    combat.armParryBonus = combat.armStrikeBonus;
    // House rule (no book formula exists): each P.S. point bought above the
    // limb's base adds 1 ft to leap distance. Purchased Spd is tracked
    // separately on the chassis, so legs don't add speed twice.
    combat.legLeapBonus = Math.max(0, legPS - (combat.legBase ?? 10));

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

    // Ranged strike total. VERIFIED RULE: "A Character's P.P. Bonuses do
    // NOT count when shooting a gun." Hand to Hand training bonuses are
    // melee too, so guns use only the stored strike bonus — which is
    // where W.P. bonuses are tracked.
    combat.strikeRanged = Math.round(combat.strikeBonus || 0);

    // ── Hand to Hand style (auto level progression) ────────
    // The selected style contributes cumulative bonuses by the
    // character's level, landing in derived totals only. The
    // style's APM value is the TOTAL trained attacks per melee
    // (book "APM: +4" at L1 = 4 attacks).
    const hthStyle = combat.hthStyle || "none";
    const hthLvl = Math.max(this.system.identity?.level ?? 1, 1);
    combat.hthActive = false;
    combat.hthMoves = [];
    if (hthStyle && hthStyle !== "none" && HTH_STYLES[hthStyle]) {
      combat.hthActive = true;
      combat.hthName = HTH_STYLES[hthStyle].name;
      const styleApm = hthBonus(hthStyle, "apm", hthLvl);
      combat.hthApm = styleApm;
      // Trained attacks + extras (extra arms, chassis, etc.)
      if (styleApm > 0) combat.attacksPerMelee = styleApm + (combat.apmExtra || 0);
      combat.strikeTotal += hthBonus(hthStyle, "strike", hthLvl);
      combat.parryTotal += hthBonus(hthStyle, "parry", hthLvl);
      combat.dodgeTotal += hthBonus(hthStyle, "dodge", hthLvl);
      combat.damageTotal += hthBonus(hthStyle, "damage", hthLvl);
      combat.hthInit = hthBonus(hthStyle, "initiative", hthLvl);
      combat.hthPullPunch = hthBonus(hthStyle, "pullPunch", hthLvl);
      combat.hthRollPunch = hthBonus(hthStyle, "rollPunch", hthLvl);
      combat.hthRollFall = hthBonus(hthStyle, "rollFall", hthLvl);
      combat.hthRollImpact = hthBonus(hthStyle, "rollImpact", hthLvl);
      combat.hthDisarm = hthBonus(hthStyle, "disarm", hthLvl);
      combat.criticalOn = hthCrit(hthStyle, hthLvl);
      combat.hthMoves = hthMoves(hthStyle, hthLvl).map((m) => {
        const def = matchMove(m.text);
        return {
          ...m,
          moveName: def?.name ?? "",
          damage: def?.damage ?? "",
          addPS: def?.addPS ?? false,
          ruleText: def?.text ?? "",
        };
      });
    }

    combat.attacksPerMelee = Math.max(combat.attacksPerMelee, 1);
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

    // ── Mounted combat (Horsemanship) ──────────────────────
    // When mounted, the equipped/selected horsemanship variant
    // adds its rider bonuses on top. Kept in derived fields so
    // toggling never mutates stored bonuses.
    combat.mountedActive = false;
    if (combat.mounted) {
      const hs = this._activeHorsemanship();
      if (hs) {
        const level = Math.max(this.system.identity?.level ?? 1, 1);
        const sched = (flat, schedule, per) => {
          // flat bonus, OR (per-threshold points x thresholds reached)
          let v = flat || 0;
          if (schedule) {
            const levels = String(schedule).split(",").map((n) => parseInt(n.trim(), 10)).filter(Boolean);
            v += (per || 1) * levels.filter((l) => level >= l).length;
          }
          return v;
        };
        combat.parryTotal += hs.parry || 0;
        combat.dodgeTotal += hs.dodge || 0;
        combat.mountedInit = sched(hs.initiative, hs.initiativeSchedule, hs.initiativePerLevel);
        combat.mountedActive = true;
        combat.mountedName = this._activeHorsemanshipName;
        combat.mountedRollFall = hs.rollFall || 0;
        combat.mountedRollFallCond = hs.rollFallCond || "";
        combat.mountedKick = hs.kickDamage || "";
        combat.mountedRope = hs.rope || 0;
        combat.mountedEnsnare = hs.ensnare || 0;
        combat.mountedEntangle = hs.entangle || 0;
        combat.mountedChargeDamage = hs.chargeDamage || "";
        combat.mountedChargeActions = hs.chargeActions || 0;
        combat.mountedChargeNotes = hs.chargeNotes || "";
        combat.mountedHorseAttack = hs.horseAttackBonus || "";
        // Initiative folds into the init total the tracker/roll uses.
        combat.initiativeBonus = (combat.initiativeBonus || 0); // stored untouched
        combat.mountedInitTotal = (combat.initiativeBonus || 0) + combat.mountedInit;
      }
    }

    // ── Physical capability auto-values (verified formulas) ──
    // Normal-human RUE formulas. Augmented/Robot P.S. use the
    // Strength Tables (pending upload) — enter those manually.
    const psVal = attrs.ps?.value ?? 0;
    combat.autoRunMph = attrs.spd?.mph ?? 0;          // Spd x 0.682
    // Carry/Lift by P.S. type (RUE Carry Weight rules, verified):
    //  normal:       P.S. 3-16 carry x10; 17+ carry x20; lift = 2x carry
    //  robot:        P.S. <17 as normal human; 17+ lift AND carry x25
    //                (giant robots 40+ carry x100 / pull x200 — enter manually)
    //  supernatural: P.S. <=17 carry x20 (as strong human); 18+ carry x50; lift = 2x carry
    const psType = combat.psType || "normal";
    let carry, lift;
    if (psType === "robot") {
      if (psVal >= 17) { carry = psVal * 25; lift = psVal * 25; }
      else { carry = psVal * 10; lift = carry * 2; }
    } else if (psType === "supernatural") {
      carry = psVal * (psVal >= 18 ? 50 : 20);
      lift = carry * 2;
    } else {
      carry = psVal * (psVal >= 17 ? 20 : 10);
      lift = carry * 2;
    }
    combat.autoCarryLbs = carry;
    combat.autoLiftLbs = lift;

    // Leaping (player-sourced rule; adjust if the book differs):
    // base leap ~5 ft long / 4 ft high; +2 ft length per level after 1st;
    // a running start boosts the numbers by 50%.
    const charLvl = Math.max(this.system.identity?.level ?? 1, 1);
    const legLeap = combat.legLeapBonus ?? 0;
    combat.autoLeapStanding = 5 + 2 * (charLvl - 1) + legLeap;
    combat.autoLeapRunning = Math.round(combat.autoLeapStanding * 1.5);
    combat.autoLeapHeight = 4 + legLeap;

    // Running endurance (RUE Running skill, verified from provided text):
    // even pace (HALF speed) for 1/2 mile per P.E. point without fatigue;
    // at MAXIMUM speed, one third that distance before collapsing.
    // Max-speed melees = (P.E. x 880 ft) / (Spd x 15 ft per melee).
    const peVal = attrs.pe?.value ?? 0;
    const spdForRun = attrs.spd?.value ?? 0;
    combat.autoRunMaxMelees = spdForRun > 0 ? Math.floor((peVal * 880) / (spdForRun * 15)) : 0;

    // Swimming (RUE Swimming skill, verified from provided text):
    // 3 x P.S. yards per melee round; sustainable for P.E. minutes
    // (4 melees per minute) before starting to feel fatigued.
    combat.autoSwimYdMelee = psVal * 3;
    combat.autoSwimMph = Math.round(((psVal * 3 * 240) / 1760) * 10) / 10; // yd/melee -> mph
    combat.autoSwimMaxMelees = peVal * 4;

    // ── Unified display/roll totals ─────────────────────────
    combat.initiativeTotal = (combat.initiativeBonus || 0)
      + (combat.hthInit || 0)
      + (combat.mountedActive ? (combat.mountedInit || 0) : 0);
    combat.pullPunchTotal = (combat.pullPunchBonus || 0) + (combat.hthPullPunch || 0);
    combat.rollTotal = (combat.rollBonus || 0)
      + Math.max(combat.hthRollPunch || 0, combat.hthRollFall || 0, combat.hthRollImpact || 0);
  }

  // Returns the horsemanship data block currently driving mounted
  // combat: the one named in combat.mountedSkillId, else the first
  // equipped horsemanship skill, else the first one owned.
  _activeHorsemanship() {
    const skills = this.items.filter((i) => i.type === "skill" && i.system?.isHorsemanship);
    if (!skills.length) return null;
    const id = this.system.combat?.mountedSkillId;
    let chosen = id ? skills.find((s) => s.id === id) : null;
    if (!chosen) chosen = skills.find((s) => s.system.equipped) ?? skills[0];
    this._activeHorsemanshipName = chosen?.name ?? "";
    return chosen?.system?.horsemanship ?? null;
  }

  // ── roll ──────────────────────────────────────────────────
  // Generic d20 roll with a bonus — used for strike/parry/dodge
  // ── Saving throw roll ──────────────────────────────────
  // ── rollHthMove ───────────────────────────────────────────
  async rollHthMove({ moveName, damage, addPS, ruleText }) {
    // HtH special moves are melee attacks, so the P.S. damage bonus
    // applies (RUE: bonus is for melee combat). It's an S.D.C.-scale
    // bonus, so it is NOT added to moves that already deal M.D.
    const dealsMD = /\bM\.?D\b/i.test(String(damage) + " " + String(ruleText ?? ""));
    const dmgBonus = dealsMD ? 0 : (this.system.combat.damageTotal ?? 0);
    const base = String(damage).replace(/D/g, "d").replace(/\s*\(.*\)\s*/, "").trim();
    const formula = `${base}${dmgBonus ? ` + ${dmgBonus}` : ""}`;
    const roll = new Roll(formula);
    await roll.evaluate();
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `
        <strong>${moveName}</strong> — damage${dmgBonus ? ` (incl. +${dmgBonus} damage bonus)` : ""}<br>
        <em style="font-size:11px;">${ruleText || ""}</em>
      `,
    });
    return roll;
  }

  // ── HtH skill drag-sync ───────────────────────────────────
  // Dropping a "Hand to Hand: X" skill onto the sheet also sets
  // the combat H2H style so the auto-progression engine engages.
  async _onCreateDescendantDocuments(parent, collection, documents, result, options, userId) {
    super._onCreateDescendantDocuments(parent, collection, documents, result, options, userId);
    // Only the client that made the drop acts on it — otherwise every
    // connected owner would run the same setup.
    if (userId && userId !== game.user.id) return;

    // ── Hand to Hand style sync (characters) ────────────────
    if (this.type === "character") {
      for (const doc of documents) {
        if (doc.type !== "skill") continue;
        const m = /^hand to hand[:\s]+(.+)$/i.exec(doc.name ?? "");
        if (!m) continue;
        const key = {
          basic: "basic", expert: "expert", "martial arts": "martialArts",
          assassin: "assassin", commando: "commando", dragon: "dragon",
        }[m[1].trim().toLowerCase()];
        if (key) this.update({ "system.combat.hthStyle": key });
      }
    }

    // ── Drag-and-drop creation (Race / R.C.C. / O.C.C. / Chassis) ──
    // Items created BY a setup script never carry the flag, so this
    // cannot recurse; the guard is belt and braces.
    if (this._riftsApplyingCreation) return;
    for (const doc of documents) {
      const file = doc.flags?.rifts?.creationFile ?? doc.getFlag?.("rifts", "creationFile");
      if (file) await this._applyCreationItem(doc, file);
    }
  }

  // ── _applyCreationItem ────────────────────────────────────
  // Runs a dropped setup item against this actor. Confirms first
  // if the same setup has already been applied.
  async _applyCreationItem(item, file) {
    if (this.type === "vehicle") {
      ui.notifications.warn(`${this.name} is a vehicle — Race/O.C.C. setups apply to characters and NPCs.`);
      return;
    }

    const applied = this.getFlag("rifts", "appliedCreations") ?? [];
    if (applied.includes(file)) {
      const again = await Dialog.confirm({
        title: "Already Applied",
        content: `<p><strong>${item.name}</strong> has already been applied to ${this.name}.</p>
                  <p>Applying it again will add another set of skills, equipment and bonuses.</p>
                  <p>Apply it a second time?</p>`,
        defaultYes: false,
      });
      if (!again) return;
    }

    this._riftsApplyingCreation = true;
    try {
      const ok = await applyCreation(this, file);
      if (!ok) return;
      await this.setFlag("rifts", "appliedCreations", [...new Set([...applied, file])]);
      if (this.type === "npc") await summarizeForNpc(this);
    } finally {
      this._riftsApplyingCreation = false;
    }
  }

  // ── promptRollModifier ─────────────────────────────────────
  // Quick situational-modifier dialog. Enter = roll (default 0),
  // Cancel/Escape = abort. Returns a number or null.
  async promptRollModifier({ title = "Situational Modifier", percent = false } = {}) {
    return new Promise((resolve) => {
      new Dialog({
        title,
        content: `
          <form>
            <div class="form-group">
              <label>${percent ? "Modifier (%)" : "Modifier (±)"}</label>
              <input type="number" name="mod" value="0" step="1" autofocus />
            </div>
            <p class="notes" style="font-size:11px;">${percent
              ? "GM-set bonus/penalty, e.g. -20 for darkness, +10 for easy conditions."
              : "e.g. -2 called shot / aiming penalties, +1 high ground."} Tip: Shift-click a roll to skip this dialog.</p>
          </form>`,
        buttons: {
          roll: {
            icon: '<i class="fas fa-dice-d20"></i>',
            label: "Roll",
            callback: (html) => resolve(Number(html.find('[name="mod"]').val()) || 0),
          },
          cancel: { icon: '<i class="fas fa-times"></i>', label: "Cancel", callback: () => resolve(null) },
        },
        default: "roll",
        close: () => resolve(null),
      }, { width: 320 }).render(true);
    });
  }

  async rollSave(label, bonus, target, { skipDialog = false } = {}) {
    const mod = skipDialog ? 0 : await this.promptRollModifier({ title: `Save ${label} — Modifier` });
    if (mod === null) return;
    const roll = new Roll(`1d20 + ${bonus} + ${mod}`);
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
               <span style="font-size:11px;">d20 ${natural} + ${bonus} bonus${mod ? ` ${mod > 0 ? "+" : ""}${mod} mod` : ""}</span>`,
    });
  }

  // ── Weapon strike roll ─────────────────────────────────
  // ── Horsemanship sub-skill roll ────────────────────────────
  // Rolls one of the six sub-skills at base + per-level*(lvl-1),
  // capped 98, with the standard modifier dialog.
  async rollHorseSub(skillId, subKey, subLabel, { skipDialog = false } = {}) {
    const item = this.items.get(skillId);
    const hm = item?.system?.horsemanship;
    if (!hm) return;
    const level = Math.max(this.system.identity?.level ?? 1, 1);
    const base = hm[subKey] || 0;
    const per = hm[`${subKey}Per`] || 0;
    const target = Math.min(base + per * (level - 1), 98);
    const mod = skipDialog ? 0 : await this.promptRollModifier({ title: `${subLabel} — Modifier`, percent: true });
    if (mod === null) return;
    const effective = Math.max(target + mod, 1);
    const roll = new Roll("1d100");
    await roll.evaluate();
    const success = roll.total <= effective;
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `<strong>${item.name}: ${subLabel}</strong> — Target: ${effective}%${mod ? ` (${target}% ${mod > 0 ? "+" : ""}${mod}%)` : ""}<br>Rolled: ${roll.total} — ${success ? '<span style="color:green">SUCCESS</span>' : '<span style="color:red">FAILURE</span>'}`,
    });
    return roll;
  }

  // ── Charge attack (mounted) ────────────────────────────────
  async rollCharge({ skipDialog = false } = {}) {
    const c = this.system.combat;
    if (!c.mountedActive) {
      ui.notifications.warn("Not mounted — enable Mounted to charge.");
      return;
    }
    const strikeBonus = c.strikeTotal ?? c.strikeBonus ?? 0;
    const mod = skipDialog ? 0 : await this.promptRollModifier({ title: "Charge — Strike Modifier" });
    if (mod === null) return;
    const total = strikeBonus + mod;
    const roll = new Roll(`1d20 + ${total}`);
    await roll.evaluate();
    const natural = roll.dice[0]?.results?.[0]?.result ?? "?";
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `
        <div style="border-left:3px solid #e8751a;padding-left:6px;">
        <strong>⚡ Charge Attack — ${c.mountedName}</strong><br>
        <span style="font-size:11px;">d20 ${natural} + ${strikeBonus} strike${mod ? ` ${mod > 0 ? "+" : ""}${mod} mod` : ""} to strike</span><br>
        <strong>Charge Damage:</strong> ${c.mountedChargeDamage || "(see weapon)"} &nbsp;|&nbsp;
        <strong>Costs:</strong> ${c.mountedChargeActions || 2} melee actions<br>
        <em style="font-size:11px;">${c.mountedChargeNotes || "Horse must move 60+ ft for a full charge."}</em>
        </div>
      `,
    });
    return roll;
  }

  // ── Attack dialog ─────────────────────────────────────────
  // One prompt covering shot type, situational modifiers, power
  // setting and ammo, so a player fires without leaving the sheet.
  async rollWeaponAttack(weapon) {
    const w = weapon.system;
    const isMelee = /melee/i.test(w.range ?? "");

    const settings = [
      { key: "normal", label: `Standard — ${w.damage || "?"} ${w.damageType === "MDC" ? "M.D." : "S.D.C."}`, damage: w.damage, type: w.damageType, cost: 1 },
    ];
    if (w.settingHigh) settings.push({ key: "high", label: `High — ${w.settingHigh} M.D.`, damage: w.settingHigh, type: "MDC", cost: 1 });
    if (w.settingSdc) settings.push({ key: "sdc", label: `S.D.C. — ${w.settingSdc}`, damage: w.settingSdc, type: "SDC", cost: 1 });

    const burstRounds = Number(w.burstRounds) || 0;
    const payload = Number(w.payload) || 0;
    const payloadMax = Number(w.payloadMax) || 0;
    const reloadActions = Number(w.reloadActions) || 0;
    const tracksAmmo = !isMelee && (payloadMax > 0 || payload > 0);
    const clipLabel = w.clipType === "long" ? "long E-Clip" : "standard E-Clip";

    // Melee weapons only need the plain strike path.
    const typeKeys = Object.keys(SHOT_TYPES).filter((k) => (k !== "burst" || burstRounds > 0));

    const ammoLine = tracksAmmo
      ? `<p class="rifts-ammo">Ammo: <strong>${payload}</strong>${payloadMax ? ` / ${payloadMax}` : ""} <span class="rifts-clip">(${clipLabel})</span>${payload <= 0 ? ' — <span style="color:#e33;">EMPTY</span>' : ""}</p>`
      : "";

    const content = `
      <form class="rifts-attack-dialog">
        ${ammoLine}
        <div class="form-group">
          <label>Shot Type</label>
          <select name="shot">
            ${typeKeys.map((k) => `<option value="${k}">${SHOT_TYPES[k].label}</option>`).join("")}
          </select>
        </div>
        ${settings.length > 1 ? `
        <div class="form-group">
          <label>Power Setting</label>
          <select name="setting">
            ${settings.map((s) => `<option value="${s.key}">${s.label}</option>`).join("")}
          </select>
        </div>` : ""}
        <div class="form-group rifts-sit">
          <label>Situation</label>
          <div class="rifts-sit-list">
            ${Object.entries(SITUATIONAL).map(([k, v]) =>
              `<label class="rifts-sit-item"><input type="checkbox" name="${k}" /> ${v.label}</label>`).join("")}
          </div>
        </div>
        <div class="form-group">
          <label>Other Modifier</label>
          <input type="number" name="mod" value="0" />
        </div>
        <div class="form-group">
          <label><input type="checkbox" name="dmg" checked /> Also roll damage</label>
        </div>
      </form>`;

    const choice = await new Promise((resolve) => {
      new Dialog({
        title: `${weapon.name} — Attack`,
        content,
        buttons: {
          fire: {
            label: "Fire",
            callback: (html) => {
              const sit = {};
              for (const k of Object.keys(SITUATIONAL)) sit[k] = html.find(`[name="${k}"]`).is(":checked");
              resolve({
                shot: html.find('[name="shot"]').val() ?? "normal",
                setting: html.find('[name="setting"]').val() ?? "normal",
                mod: Number(html.find('[name="mod"]').val()) || 0,
                dmg: html.find('[name="dmg"]').is(":checked"),
                sit,
              });
            },
          },
          cancel: { label: "Cancel", callback: () => resolve(null) },
        },
        default: "fire",
        close: () => resolve(null),
      }).render(true);
    });
    if (!choice) return;

    const shot = shotType(choice.shot);
    const setting = settings.find((s) => s.key === choice.setting) ?? settings[0];
    const isBurst = !!shot.isBurst;
    const shotsUsed = isBurst ? burstRounds : setting.cost;

    // ── Ammo check ──
    if (tracksAmmo && payload < shotsUsed) {
      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content: `<div class="rifts-chat"><strong>${weapon.name}</strong> — <span style="color:#e33;">OUT OF AMMO</span><br>
          <span style="font-size:11px;">Needs ${shotsUsed} charge(s), has ${payload}. RELOAD — ${reloadActions || "?"} action(s).</span></div>`,
      });
      return;
    }

    // ── Strike total ──
    // Guns: P.P. and Hand to Hand bonuses do NOT apply (verified) — only
    // the stored strike bonus, which is where W.P. bonuses live.
    // Melee weapons keep the full total.
    const c = this.system.combat;
    let base = isMelee ? (c.strikeTotal ?? 0) : (c.strikeRanged ?? c.strikeBonus ?? 0);
    const notes = [];

    if (shot.wpHalf) { base = Math.floor(base / 2); notes.push("W.P. bonus halved (burst)"); }
    if (shot.halfIfAimed) notes.push("aimed/called with this mode uses half the strike bonus");
    if (shot.wild) { base = 0; notes.push("wild — no bonuses apply"); }

    const weaponStrike = Number(w.bonusToStrike) || 0;
    const aimedLike = ["aimed", "called", "aimedCalled", "quickCalled"].includes(choice.shot);
    const aimedBonus = aimedLike ? Number(w.aimedStrike) || 0 : 0;

    let sitMod = 0;
    for (const [k, on] of Object.entries(choice.sit)) {
      if (!on) continue;
      if (k === "noWp" && !isBurst) continue;   // the -3 is a burst penalty
      sitMod += SITUATIONAL[k].mod;
    }

    const total = (shot.wild ? 0 : base + weaponStrike + aimedBonus) + shot.mod + sitMod + choice.mod;

    const roll = new Roll(`1d20 + ${total}`);
    await roll.evaluate();
    const natural = roll.dice[0].total;
    let resultText = "";
    if (natural === 20) resultText = ` — <span style="color:#e8751a;font-weight:bold;">NATURAL 20! CRITICAL!</span>`;
    else if (natural === 1) resultText = ` — <span style="color:#e33;font-weight:bold;">NATURAL 1!</span>`;
    else if (roll.total >= 5) resultText = ` — <span style="color:#3c3;">HIT (5+)</span>`;
    else resultText = ` — <span style="color:#e33;">MISS (under 5)</span>`;

    const parts = [
      `d20 ${natural}`,
      shot.wild ? "no bonuses (wild)" : (base ? `+${base} strike` : ""),
      !shot.wild && weaponStrike ? `+${weaponStrike} weapon` : "",
      aimedBonus ? `+${aimedBonus} aimed` : "",
      shot.mod ? `${shot.mod > 0 ? "+" : ""}${shot.mod} shot` : "",
      sitMod ? `${sitMod} situational` : "",
      choice.mod ? `${choice.mod > 0 ? "+" : ""}${choice.mod} mod` : "",
    ].filter(Boolean);

    const apmLine = `Costs ${shot.apm} of your ${c.attacksPerMelee ?? "?"} attacks per melee.`;
    const extra = notes.length ? `<br><em style="font-size:11px;">${notes.join(" · ")}</em>` : "";

    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `<strong>${weapon.name}</strong> — ${shot.label}${resultText}<br>
               <span style="font-size:11px;">${parts.join(" ")}</span><br>
               <span style="font-size:11px;opacity:0.75;">${apmLine}</span>${extra}`,
    });

    // ── Damage ──
    if (choice.dmg) {
      const formula = isBurst && w.burstDamage ? w.burstDamage : setting.damage;
      const dtype = isBurst && w.burstDamage ? (w.damageType ?? "MDC") : setting.type;
      if (formula) {
        const dmgRoll = new Roll(String(formula).replace(/D/g, "d"));
        await dmgRoll.evaluate();
        const note = isBurst && !w.burstDamage
          ? ' <em style="font-size:11px;">(burst — apply your table\'s burst rule)</em>'
          : "";
        await dmgRoll.toMessage({
          speaker: ChatMessage.getSpeaker({ actor: this }),
          flavor: `<strong>${weapon.name}</strong> — Damage (${dtype === "MDC" ? "M.D." : "S.D.C."})${note}`,
        });
      }
    }

    // ── Spend ammo ──
    if (tracksAmmo) {
      const left = Math.max(0, payload - shotsUsed);
      await weapon.update({ "system.payload": left });
      if (left <= 0) {
        await ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor: this }),
          content: `<div class="rifts-chat"><strong>${weapon.name}</strong> — <span style="color:#e33;">EMPTY</span><br>
            <span style="font-size:11px;">RELOAD — ${reloadActions || "?"} action(s).</span></div>`,
        });
      }
    }
  }

  // ── Reload ────────────────────────────────────────────────
  // Choose which clip goes in; the weapon's capacity follows the
  // clip, so ammo stays accurate without hand-editing numbers.
  async reloadWeapon(weapon) {
    const w = weapon.system;
    const std = Number(w.payloadMax) || 0;
    const long = Number(w.payloadLong) || 0;
    const reloadActions = Number(w.reloadActions) || 0;
    if (!std && !long) {
      ui.notifications.warn(`${weapon.name} has no clip capacity set — add a Payload (max) on the item sheet.`);
      return;
    }

    const options = [{ key: "standard", label: `Standard E-Clip — ${std} charges`, size: std }];
    if (long) options.push({ key: "long", label: `Long E-Clip — ${long} charges`, size: long });

    const pick = await new Promise((resolve) => {
      new Dialog({
        title: `${weapon.name} — Reload`,
        content: `
          <form class="rifts-attack-dialog">
            <p class="rifts-ammo">Currently: <strong>${w.payload ?? 0}</strong> / ${std || long} (${w.clipType === "long" ? "long E-Clip" : "standard E-Clip"})</p>
            <div class="form-group">
              <label>Load</label>
              <select name="clip">
                ${options.map((o) => `<option value="${o.key}" ${o.key === (w.clipType || "standard") ? "selected" : ""}>${o.label}</option>`).join("")}
              </select>
            </div>
          </form>`,
        buttons: {
          reload: { label: "Reload", callback: (html) => resolve(html.find('[name="clip"]').val()) },
          cancel: { label: "Cancel", callback: () => resolve(null) },
        },
        default: "reload",
        close: () => resolve(null),
      }).render(true);
    });
    if (!pick) return;

    const chosen = options.find((o) => o.key === pick) ?? options[0];
    await weapon.update({
      "system.clipType": chosen.key,
      "system.payload": chosen.size,
    });
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `<div class="rifts-chat"><strong>${weapon.name}</strong> — RELOADED<br>
        <span style="font-size:11px;">${chosen.label}. Takes ${reloadActions || "?"} melee action(s).</span></div>`,
    });
  }

  async rollWeaponStrike(weapon, { skipDialog = false } = {}) {
    const strikeBonus = this.system.combat.strikeTotal ?? this.system.combat.strikeBonus ?? 0;
    const weaponBonus = weapon.system.bonusToStrike ?? 0;
    const mod = skipDialog ? 0 : await this.promptRollModifier({ title: `${weapon.name} — Strike Modifier` });
    if (mod === null) return;
    const total = strikeBonus + weaponBonus + mod;

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
               <span style="font-size:11px;">d20 ${natural} + ${strikeBonus} strike + ${weaponBonus} weapon${mod ? ` ${mod > 0 ? "+" : ""}${mod} mod` : ""} (dodge/parry may still apply)</span>`,
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

    // Damage bonus (RUE): applies to MELEE combat only, and it's S.D.C.-scale —
    // never guns/bows/thrown, and not on top of M.D. dice (Robot P.S. tables
    // already incorporate strength). So: melee + S.D.C. weapons only.
    const isMelee = /melee/i.test(weapon.system.range ?? "");
    const dmgBonus = this.system.combat?.damageTotal ?? 0;
    let bonusNote = "";
    if (isMelee && weapon.system.damageType !== "MDC" && dmgBonus > 0) {
      formula = `${formula} + ${dmgBonus}`;
      bonusNote = ` (incl. +${dmgBonus} damage bonus)`;
    }
    const roll = new Roll(formula);
    await roll.evaluate();

    const dmgType = weapon.system.damageType === "MDC" ? "M.D." : "S.D.C.";

    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `<strong>${weapon.name}</strong> — Damage (${dmgType})${bonusNote}${specialHtml}`,
    });
  }

  async rollD20(label, bonus = 0, { skipDialog = false } = {}) {
    const mod = skipDialog ? 0 : await this.promptRollModifier({ title: `${label} — Modifier` });
    if (mod === null) return;
    const roll = new Roll(`1d20 + ${bonus} + ${mod}`);
    await roll.evaluate();
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `${label} (Bonus: +${bonus}${mod ? `, Mod: ${mod > 0 ? "+" : ""}${mod}` : ""})`,
    });
    return roll;
  }

  // ── rollSkill ─────────────────────────────────────────────
  // Rolls a percentile skill check against the skill's total %
  async rollSkill(skillName, targetPercent, { skipDialog = false } = {}) {
    const mod = skipDialog ? 0 : await this.promptRollModifier({ title: `${skillName} — Modifier`, percent: true });
    if (mod === null) return;
    const effective = Math.max(targetPercent + mod, 1);
    const roll = new Roll("1d100");
    await roll.evaluate();
    const success = roll.total <= effective;
    const resultText = success
      ? `<span style="color:green">SUCCESS</span>`
      : `<span style="color:red">FAILURE</span>`;

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `
        <strong>${skillName}</strong> — Target: ${effective}%${mod ? ` (${targetPercent}% ${mod > 0 ? "+" : ""}${mod}%)` : ""}<br>
        Rolled: ${roll.total} — ${resultText}
      `,
    });
    return roll;
  }
}
