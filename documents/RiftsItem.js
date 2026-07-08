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
