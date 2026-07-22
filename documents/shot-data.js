// ============================================================
// RIFTS RPG - shot-data.js
// Shot types and situational modifiers for ranged attacks.
// Transcribed from the Weapon Modifiers table (book-verified).
//
// apm  = melee attacks/actions the shot costs
// mod  = flat bonus/penalty to strike
// wpHalf  = the shooter's W.P. strike bonus is halved
// noBurst = cannot be combined with burst or wild fire
// ============================================================

export const SHOT_TYPES = {
  normal: {
    label: "Normal shot",
    mod: 0, apm: 1,
  },
  aimed: {
    label: "Aimed shot (+2, 2 actions)",
    mod: 2, apm: 2, noBurst: true,
  },
  called: {
    label: "Called shot (2 actions)",
    mod: 0, apm: 2, noBurst: true, smallTarget: true,
  },
  aimedCalled: {
    label: "Aimed called shot (+2, 3 actions)",
    mod: 2, apm: 3, noBurst: true, smallTarget: true,
  },
  quickCalled: {
    label: "Quickly aimed called shot (2 actions)",
    mod: 0, apm: 2, noBurst: true,
  },
  rapidPulse: {
    label: "Rapid-fire pulse (1 action)",
    mod: 0, apm: 1,
    note: "On an aimed or called shot, only HALF the strike bonus applies.",
    halfIfAimed: true,
  },
  dual: {
    label: "Simultaneous dual / twin (1 action)",
    mod: 0, apm: 1,
    note: "Both barrels/weapons fire as a single action.",
  },
  burst: {
    label: "Burst",
    mod: 0, apm: 1, isBurst: true, wpHalf: true,
    note: "W.P. strike bonus is halved. Without the W.P. for this weapon: -3 to strike.",
  },
  wild: {
    label: "Shooting wild (-6)",
    mod: -6, apm: 1, wild: true,
  },
  blind: {
    label: "Shooting blind (-10)",
    mod: -10, apm: 1,
  },
};

// Checkbox modifiers that stack on top of the shot type.
export const SITUATIONAL = {
  smallTarget: { label: "Small / partially exposed target (-4)", mod: -4 },
  movingTarget: { label: "Moving target (-1)", mod: -1 },
  evasive: { label: "Target taking evasive action (-1)", mod: -1 },
  fastTarget: { label: "Target over 20 mph — extra -1 per 50 mph", mod: -1 },
  beyondRange: { label: "Beyond effective range (-5)", mod: -5 },
  noWp: { label: "No W.P. for this weapon (-3 on bursts)", mod: -3 },
};

export const shotType = (key) => SHOT_TYPES[key] ?? SHOT_TYPES.normal;
