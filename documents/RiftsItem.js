// ============================================================
// RIFTS RPG - RiftsItem.js
// Extends Foundry's Item class with Rifts-specific logic
// ============================================================

export class RiftsItem extends Item {
  // ── prepareDerivedData ─────────────────────────────────────
  // Foundry calls this automatically when item data changes
  prepareDerivedData() {
    super.prepareDerivedData();

    // Route to the correct preparation method by item type
    if (this.type === "skill") this._prepareSkillData();
    if (this.type === "weapon") this._prepareWeaponData();
    if (this.type === "armor") this._prepareArmorData();
  }

  // ── _prepareSkillData ──────────────────────────────────────
  // Calculates total skill % from base + misc bonus + automatic
  // per-level progression: perLevelBonus x (character level - 1).
  _prepareSkillData() {
    const skill = this.system;

    // Owned skills scale with the owning character's level.
    const level = Math.max(this.actor?.system?.identity?.level ?? 1, 1);
    const levelGain = (skill.perLevelBonus || 0) * (level - 1);

    // Total = base + misc bonuses + level progression (capped at 98%)
    skill.totalPercent = Math.min(
      (skill.basePercent || 0) + (skill.bonusPercent || 0) + levelGain,
      98,
    );
  }

  // ── _prepareWeaponData ────────────────────────────────────
  // Any derived weapon calculations go here
  _prepareWeaponData() {
    // Damage type is stored uppercase ("SDC" / "MDC"). Older items and
    // hand-edited data may hold lowercase, which broke the gear-tab
    // dropdown (nothing matched, so it displayed the first option and
    // could silently save an M.D. weapon as S.D.C.).
    const dt = String(this.system.damageType ?? "").toUpperCase();
    this.system.damageType = dt === "MD" ? "MDC" : (dt || "SDC");

    // Melee weapons keep the quick damage button: no ammo, no power
    // settings, and their damage gets rolled over and over. Ranged
    // weapons roll damage inside the attack dialog instead.
    this.system.isMelee = /melee|hand|punch|kick|bite|claw/i.test(this.system.range ?? "");

    const weapon = this.system;

    // Ensure payload is never negative
    weapon.payload = Math.max(weapon.payload || 0, 0);
  }

  // ── _prepareArmorData ─────────────────────────────────────
  // Ensures armor SDC max is never below current
  _prepareArmorData() {
    const armor = this.system;
    armor.sdc.max = Math.max(armor.sdc.max || 0, 0);
    armor.sdc.value = Math.min(armor.sdc.value || 0, armor.sdc.max);
  }

  // ── roll ──────────────────────────────────────────────────
  // Called when rolling a skill item directly from the sheet
  async roll(options = {}) {
    if (this.type === "skill") {
      const actor = this.actor;
      if (!actor) return;
      return actor.rollSkill(this.name, this.system.totalPercent, options);
    }
  }
}
