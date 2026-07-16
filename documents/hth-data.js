// AUTO-GENERATED from Hand_to_Hand_Combat_Skills.xlsx — verified.
// Each style: numeric bonuses gained per level (cumulative at runtime),
// special moves unlocked per level, and crit-threshold changes.
export const HTH_STYLES = {
  "none": {
    "name": "NO Hand to Hand Combat Skill",
    "note": "",
    "maxLevel": 15,
    "numeric": {
      "apm": {
        "3": 1,
        "9": 1
      },
      "dodge": {
        "3": 1
      }
    },
    "moves": {
      "1": [
        "HTHA: +1",
        "NCMA: +2"
      ],
      "3": [
        "NCMA: +1"
      ],
      "6": [
        "NCMA: +2"
      ],
      "9": [
        "NCMA: +1"
      ]
    },
    "crit": {}
  },
  "basic": {
    "name": "Hand to Hand: Basic",
    "note": "Basic combat training enables the character to use any basic/common attacks, including Punch, Elbow, Kick, Knee, Disarm, Dodge, Entangle, Body Block/Tackle, Roll with Impact, Power Punch (but not a Power Kick) and Pull Punch - but no special moves or martial art attacks such as Automatic Dodge, Back Flip, Holds, Karate Punches, Leap Kick or other moves.",
    "maxLevel": 15,
    "numeric": {
      "apm": {
        "1": 4,
        "4": 1,
        "9": 1,
        "15": 1
      },
      "pullPunch": {
        "1": 2,
        "10": 2
      },
      "rollPunch": {
        "1": 2,
        "10": 2
      },
      "rollFall": {
        "1": 2,
        "10": 2
      },
      "rollImpact": {
        "1": 2,
        "10": 2
      },
      "parry": {
        "2": 2,
        "11": 1
      },
      "dodge": {
        "2": 2,
        "11": 1
      },
      "strike": {
        "5": 1,
        "12": 1
      },
      "disarm": {
        "5": 1
      },
      "damage": {
        "7": 2,
        "14": 2
      }
    },
    "moves": {
      "3": [
        "Kick Attack: 1D8"
      ],
      "8": [
        "Judo-style body flip/throw; does 1D6 damage, and victim loses initiative and one attack."
      ],
      "13": [
        "Critical Strike or knockout from behind."
      ]
    },
    "crit": {
      "6": 19
    }
  },
  "expert": {
    "name": "Hand to Hand: Expert",
    "note": "Expert combat training enables the character to use any basic/common attacks, including Punch, Elbow, Kick, Knee, Disarm, Dodge, Entangle, Body Block/Tackle, Body Flip/Throw, Roll with Impact, Power Punch, Power Kick, and Pull Punch and even some martial arts moves (as noted below) - but unless noted below, the character does not have special moves or martial art attacks such as Automatic Dodge, Back Flip, Holds, Karate Punches, Leap Kick or other moves.",
    "maxLevel": 15,
    "numeric": {
      "apm": {
        "1": 4,
        "4": 1,
        "9": 1,
        "14": 1
      },
      "pullPunch": {
        "1": 2,
        "2": 1
      },
      "rollPunch": {
        "1": 2
      },
      "rollFall": {
        "1": 2
      },
      "rollImpact": {
        "1": 2
      },
      "parry": {
        "2": 3,
        "12": 2
      },
      "dodge": {
        "2": 3,
        "12": 2
      },
      "strike": {
        "3": 2
      },
      "disarm": {
        "3": 2,
        "9": 1
      },
      "damage": {
        "10": 3
      }
    },
    "moves": {
      "1": [
        "Kick Attack: 1D8"
      ],
      "3": [
        "Can perform a Karate Punch."
      ],
      "5": [
        "Can perform a Karate Kick, does 2D6 damage."
      ],
      "7": [
        "W.P. Paired Weapons and backhand strike (average, does 1D4 damage)."
      ],
      "8": [
        "Body flip/throw; does 1D6 damage, and victim loses initiative and one attack."
      ],
      "11": [
        "Knockout/stun on an unmodified roll of 18, 19 or 20."
      ],
      "13": [
        "Critical Strike or knockout from behind (triple damage)."
      ],
      "15": [
        "Death blow on a roll of Natural 20."
      ]
    },
    "crit": {
      "6": 18
    }
  },
  "martialArts": {
    "name": "Hand to Hand: Martial Arts",
    "note": "Martial arts combat training enables the character to use any basic/common attacks, including Punch, Elbow, Kick, Knee, Disarm, Dodge, Entangle, Body Block/Tackle, Body Flip/Throw, Roll with Impact, Power Punch, Power Kick, and Pull Punch as well as the martial arts moves noted below.",
    "maxLevel": 15,
    "numeric": {
      "apm": {
        "1": 4,
        "4": 1,
        "9": 1,
        "14": 1
      },
      "pullPunch": {
        "1": 3
      },
      "rollPunch": {
        "1": 3
      },
      "rollFall": {
        "1": 3
      },
      "rollImpact": {
        "1": 3
      },
      "parry": {
        "2": 3,
        "12": 2
      },
      "dodge": {
        "2": 3,
        "12": 2
      },
      "strike": {
        "2": 2
      },
      "initiative": {
        "3": 1,
        "11": 1
      },
      "disarm": {
        "7": 2,
        "10": 2
      },
      "damage": {
        "11": 4
      }
    },
    "moves": {
      "1": [
        "body flip/throw; does 1D6 damage, victim loses initiative and one attack."
      ],
      "2": [
        "May perform Karate and any hand strike/punch"
      ],
      "3": [
        "May perform a Karate-style kick (does 2D6 damage) and any foot strike except Leap Kick."
      ],
      "5": [
        "Leap Kick (3D8 damage, but counts as two melee attacks)",
        "Entangle: +2"
      ],
      "7": [
        "W.P. Paired Weapons, can perform Holds"
      ],
      "8": [
        "Back flip and back flip escape."
      ],
      "10": [
        "Back flip attack"
      ],
      "13": [
        "Knockout/stun on an unmodified roll of 18, 19 or 20."
      ],
      "15": [
        "Death blow on a roll of a Natural 20."
      ]
    },
    "crit": {
      "6": 18
    }
  },
  "assassin": {
    "name": "Hand to Hand: Assassin",
    "note": "Assassin combat training enables the character to use any basic/common attacks, including Punch, Elbow, Kick, Knee, Disarm, Dodge, Entangle, Body Block/Tackle, Body Flip/Throw, Roll with Impact, Power Punch, Power Kick, and Pull Punch and even many martial art moves (as noted below) - but unless noted below,the character does not have special martial art moves",
    "maxLevel": 15,
    "numeric": {
      "apm": {
        "1": 3,
        "2": 2,
        "5": 1,
        "8": 1,
        "13": 1
      },
      "strike": {
        "1": 2,
        "5": 1,
        "6": 2,
        "11": 2,
        "15": 2
      },
      "initiative": {
        "2": 1,
        "4": 1,
        "8": 1,
        "9": 1
      },
      "pullPunch": {
        "3": 3,
        "12": 2
      },
      "rollPunch": {
        "3": 2
      },
      "rollFall": {
        "3": 2
      },
      "rollImpact": {
        "3": 2
      },
      "damage": {
        "4": 4,
        "14": 2
      },
      "parry": {
        "6": 3
      },
      "dodge": {
        "6": 3
      }
    },
    "moves": {
      "1": [
        "W.P. Paired Weapons."
      ],
      "3": [
        "Karate Punch (2D4 damage)"
      ],
      "4": [
        "Karate Kick (2D6 damage),"
      ],
      "6": [
        "Entangle: +2"
      ],
      "7": [
        "Knockout/stun: 17,20",
        "Leap kick: (3D8 damage, but counts as two melee attacks)."
      ],
      "8": [
        "Strike w/guns: +1"
      ],
      "9": [
        "Can perform back flip."
      ],
      "11": [
        "Strike with a thrown weapon & gun: +1",
        "Can perform back flip attack"
      ],
      "12": [
        "Death Blow: Natural 19, 20"
      ],
      "14": [
        "Can perform Holds"
      ],
      "15": [
        "Strike w/guns: +1"
      ]
    },
    "crit": {
      "10": 19
    }
  },
  "commando": {
    "name": "Hand to Hand: Commando",
    "note": "Expert combat training enables the character to use any basic/common attacks, including Punch, Elbow, Kick, Knee, Disarm, Dodge, Entangle, Body Block/Tackle, Roll with Impact, Power Punch, Power Kick, and Pull Punch and even some martial arts moves (as noted below) - but unless noted below, the character does not have special moves or martial art attacks such as Automatic Dodge, Back Flip, Holds, Karate Punches, Leap Kick or other moves.",
    "maxLevel": 15,
    "numeric": {
      "apm": {
        "1": 4,
        "4": 1,
        "8": 1,
        "13": 1
      },
      "initiative": {
        "2": 1,
        "3": 1,
        "6": 2,
        "10": 1,
        "14": 1
      },
      "strike": {
        "2": 1,
        "6": 1,
        "10": 1
      },
      "parry": {
        "2": 2,
        "6": 1,
        "12": 1
      },
      "dodge": {
        "2": 2,
        "5": 2,
        "6": 1,
        "7": 1,
        "12": 2
      },
      "rollPunch": {
        "2": 3,
        "8": 1
      },
      "rollFall": {
        "2": 3,
        "8": 1
      },
      "rollImpact": {
        "2": 3,
        "8": 1
      },
      "pullPunch": {
        "2": 3,
        "7": 2,
        "9": 2,
        "11": 1
      },
      "disarm": {
        "3": 1,
        "7": 1,
        "11": 1
      },
      "damage": {
        "7": 2,
        "12": 2
      }
    },
    "moves": {
      "1": [
        "W.P. Paired Weapons",
        "body flip/throw",
        "body block/tackle",
        "HFS: +2"
      ],
      "2": [
        "Backward sweep kick : Purely Knockdown attack (same penalties as body flip) Cannot be parried, only dodged. Opponent Dodge: -2"
      ],
      "3": [
        "Karate punch/strike (does 2D4 damage) ."
      ],
      "4": [
        "Karate kick (does 2D6)."
      ],
      "5": [
        "Foot Strikes: +2"
      ],
      "6": [
        "Body Flip/Throw: +1"
      ],
      "7": [
        "HFS: +1"
      ],
      "8": [
        "Jump Kick",
        "Body Flip/Throw +2"
      ],
      "9": [
        "Death Blow: 18, 19, 20"
      ],
      "10": [
        "HFS: +2"
      ],
      "11": [
        "Body Flip/Throw +2"
      ],
      "14": [
        "Can Perfrom Holds"
      ]
    },
    "crit": {
      "15": 17
    }
  },
  "dragon": {
    "name": "Hand to Hand: Dragon",
    "note": "",
    "maxLevel": 20,
    "numeric": {
      "apm": {
        "1": 3,
        "4": 1,
        "8": 1,
        "12": 1,
        "16": 1,
        "20": 1
      },
      "rollImpact": {
        "1": 2,
        "9": 1,
        "19": 2
      },
      "pullPunch": {
        "1": 1,
        "7": 2,
        "9": 1
      },
      "parry": {
        "2": 2,
        "5": 1,
        "8": 1,
        "18": 1
      },
      "dodge": {
        "2": 2,
        "12": 1,
        "14": 1,
        "17": 1,
        "19": 1
      },
      "strike": {
        "5": 1,
        "8": 1,
        "12": 1,
        "18": 1
      },
      "disarm": {
        "7": 2,
        "19": 1
      },
      "initiative": {
        "10": 1,
        "13": 1
      }
    },
    "moves": {
      "1": [
        "Bite/Punch/Kick attack",
        "Claw Swipe",
        "Breath Weapon: 1 Melee",
        "DM: 15 seconds"
      ],
      "2": [
        "Tail Slap",
        "Wing Attack: Basic",
        "Crush"
      ],
      "3": [
        "DM: 7 seconds",
        "Inflicts +2 M.D in physical combat",
        "Tail Slap Power Strike"
      ],
      "4": [
        "Bite & Grip",
        "Tail Sweep"
      ],
      "5": [
        "Dodge Flight: +2",
        "Tail Parry"
      ],
      "6": [
        "SS: +1",
        "Wing Sweep",
        "Grappling Hold"
      ],
      "7": [
        "Wing Attack: Advanced",
        "Entangle: +2"
      ],
      "8": [
        "Dodge Flight: +1",
        "Wings Gliding Sweep Attack"
      ],
      "9": [
        "Breath Weapon Concentrated Beam",
        "DT: +5%"
      ],
      "10": [
        "Teleport Dodge"
      ],
      "11": [
        "Inflicts +2 M.D in physical attacks",
        "Dodge Flight: +2",
        "SS: +1"
      ],
      "13": [
        "Breath Weapon Cone"
      ],
      "14": [
        "Dodge Flight: +1"
      ],
      "15": [
        "SS: +1",
        "M.D.C: 1D4x10"
      ],
      "16": [
        "Inflicts +2 M.D in physical attacks"
      ],
      "17": [
        "Dodge Flight: +1"
      ],
      "18": [
        "SS: +1"
      ],
      "19": [
        "M.D.C: 1D4x10"
      ]
    },
    "crit": {
      "10": 19
    }
  }
};

export function hthBonus(styleKey, field, level) {
  const s = HTH_STYLES[styleKey];
  if (!s || !s.numeric[field]) return 0;
  let t = 0;
  for (const [lvl, v] of Object.entries(s.numeric[field])) {
    if (Number(lvl) <= level) t += v;
  }
  return t;
}

export function hthCrit(styleKey, level) {
  const s = HTH_STYLES[styleKey];
  if (!s || !s.crit) return 20;
  let thr = 20;
  for (const [lvl, v] of Object.entries(s.crit)) {
    if (Number(lvl) <= level) thr = Math.min(thr, v);
  }
  return thr;
}

export function hthMoves(styleKey, level) {
  const s = HTH_STYLES[styleKey];
  if (!s || !s.moves) return [];
  const out = [];
  for (const [lvl, arr] of Object.entries(s.moves)) {
    if (Number(lvl) <= level) for (const m of arr) out.push({ level: Number(lvl), text: m });
  }
  return out.sort((a, b) => a.level - b.level);
}
