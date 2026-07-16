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


// ── Combat move definitions (from Combat_Terms___Moves.xlsx) ──
export const MOVE_PATTERNS = [["leap\\s*kick", "Leap Kick"], ["karate[- ].*kick|karate kick", "Karate Kick Attack"], ["karate.*(punch|strike)", "Karate/Martial Arts Strike/Punch"], ["kick attack", "Kick Attack (basic/average)"], ["body flip|flip/throw|flip or throw|judo", "Body Flip/Throw"], ["body block|tackle", "Body Block/Tackle"], ["backward sweep|sweep kick", "Backward Sweep"], ["back flip", "Back Flip"], ["death blow", "Death Blow"], ["critical strike", "Critical Strike"], ["automatic dodge", "Automatic Dodge"], ["paired weapons", "Using Weapons"], ["knockout|stun", "Knockout/Stun"], ["elbow|forearm", "Elbow/Forearm"], ["knee", "Knee"], ["power punch", "Power Punch"], ["power kick", "Power Kick"], ["\\bhold(s)?\\b", "Body Hold"], ["disarm", "Disarm"], ["entangle", "Entangle"]];
export const MOVE_DEFS = {
 "Body Block/Tackle": {
  "name": "Body Block/Tackle",
  "damage": "1D4",
  "addPS": true,
  "text": "This is a combination of moves that involves a body block and a knockdown attack (counts as two melee attacks). A successful strike always inflicts damage from a shoulder, elbow, or tucked head, unless his opponent dodges (no damage and no knockdown). The victim who is hit can avoid being knocked down only by trying to maintain his balance and must roll percentile dice. A typical Body Block ram has a 01 -50% chance of knocking an opponent down and characters with no special balancing ability must roll above that number or fall."
 },
 "Body Flip/Throw": {
  "name": "Body Flip/Throw",
  "damage": "1D6",
  "addPS": true,
  "text": "A Judo style throw or flip that uses an attacker's own momentum and leverage to \"flip\" or \"throw\" him off his feet and onto the ground. victim also loses initiative (if he had it) and one melee attack. A body flip counts as one melee attack. A victim of a throw can try to roll with impact/fall to diminish the damage (half if successful), but other penalties are unchanged."
 },
 "Backhand Strike (average)": {
  "name": "Backhand Strike (average)",
  "damage": "1D4",
  "addPS": false,
  "text": ""
 },
 "Backhand Strike (martial arts)": {
  "name": "Backhand Strike (martial arts)",
  "damage": "1D6",
  "addPS": false,
  "text": ""
 },
 "Body Flip": {
  "name": "Body Flip",
  "damage": "1D6",
  "addPS": false,
  "text": ""
 },
 "Human Fist/Punch": {
  "name": "Human Fist/Punch",
  "damage": "1D4",
  "addPS": false,
  "text": ""
 },
 "Karate/Martial Arts Strike/Punch": {
  "name": "Karate/Martial Arts Strike/Punch",
  "damage": "2D4",
  "addPS": false,
  "text": ""
 },
 "Elbow/Forearm": {
  "name": "Elbow/Forearm",
  "damage": "1D6",
  "addPS": false,
  "text": ""
 },
 "Kick Attack (basic/average)": {
  "name": "Kick Attack (basic/average)",
  "damage": "1D8 (or 2D4)",
  "addPS": false,
  "text": ""
 },
 "Karate Kick Attack": {
  "name": "Karate Kick Attack",
  "damage": "2D6",
  "addPS": false,
  "text": ""
 },
 "Leap Kick": {
  "name": "Leap Kick",
  "damage": "3D8",
  "addPS": false,
  "text": "But counts as two melee attacks/actions."
 },
 "Knee": {
  "name": "Knee",
  "damage": "1D6",
  "addPS": false,
  "text": ""
 },
 "Thrown/Dropped Small Objects": {
  "name": "Thrown/Dropped Small Objects",
  "damage": "1D4 or 1D6",
  "addPS": false,
  "text": ""
 },
 "Thrown/Dropped Large Objects": {
  "name": "Thrown/Dropped Large Objects",
  "damage": "3D6",
  "addPS": false,
  "text": "per 100 Ibs (45 kg) +10 per 40 feet ( 12.2m)"
 },
 "Falling": {
  "name": "Falling",
  "damage": "1D6",
  "addPS": false,
  "text": "1D6 damage per 10 feet (3m)."
 },
 "Collision": {
  "name": "Collision",
  "damage": "2D4",
  "addPS": false,
  "text": "Per 10 mph ( 16km)."
 },
 "Karate Punch/Strike": {
  "name": "Karate Punch/Strike",
  "damage": "2D4",
  "addPS": false,
  "text": "A martial arts strike."
 },
 "Kick Attack": {
  "name": "Kick Attack",
  "damage": "1D8",
  "addPS": false,
  "text": "This is the simple act of using one's legs and feet to kick an opponent."
 },
 "Damage": {
  "name": "Damage",
  "damage": "1D6",
  "addPS": false,
  "text": "for every 20 feet (6m) one falls or is knocked back. And figure 1D6 points of damage for every 20 S.D.C. in an explosion. Round down. If the fall/knock back is 100 feet (30.5 m) or more, there is a 01 -65% chance of being temporarily knocked out for 1D6 melee rounds."
 },
 "Mega-Damage Knockdown": {
  "name": "Mega-Damage Knockdown",
  "damage": "1D6",
  "addPS": false,
  "text": "+1D6 M.D. additional for every 30 mph (48 km) of speed at the time of impact. Furthermore, there is a base chance of 01-60% (or whatever the robot combat or a specific description of a knockdown/ramlbody block attack might indicate for that creature) that the victim is knocked off its feet and loses initiative and two melee attacks/actions for that round. The attacker suffers the equivalent of 25% of the victim's damage, especially from high-speed ram attacks."
 },
 "Punch": {
  "name": "Punch",
  "damage": "1D4",
  "addPS": false,
  "text": "A normal human punch does 1D4 damage. A Karate style punch or chop does 2D4 damage. A power punch does double damage. In all cases, include any P.S. attribute bonus (for P.S. 16 and higher) as well as any damage bonuses from a Hand to Hand Combat skill, or special powers."
 },
 "Attacks per Melee": {
  "name": "Attacks per Melee",
  "damage": "",
  "addPS": false,
  "text": "Characters with no hand to hand combat training get only one attack/action per melee. No automatic parry or dodge, and each attempt counts as one melee action. P.P. and W.P. bonuses apply to combat moves. Characters with any kind of formal hand to hand combat training (Hand to Hand: Basic, Expert, etc.) usually start off with four attacks/\nactions per melee round. Each specific Hand to Hand Combat skill will indicate how many attacks the character starts with. This number grows with experience."
 },
 "Automatic Dodge": {
  "name": "Automatic Dodge",
  "damage": "",
  "addPS": false,
  "text": "Certain characters and creatures are able to automatically dodge an attack without using up a melee attack/action. It is purely a defensive move in which the dodger bobs, weaves, bends or twists his body out of harm's way. Roll for a dodge as normal (the automatic dodge is not an \"automatic\" success). An automatic dodge works just like a (automatic) parry in that the act of dodging does not use up any attacks to perform. Bonuses to auto-dodge come from the character' s P.P. attribute and any special bonus specifically for it (the bonus, skill or enhancement will say \"automatic dodge\"). Unless it specifically says a character has an Automatic Dodge, he does NOT."
 },
 "Attribute Bonuses": {
  "name": "Attribute Bonuses",
  "damage": "",
  "addPS": false,
  "text": "Combat and saving throw bonuses gained through physical or mental strengths that give a character an extra added degree of agility, strength, endurance, etc. (see the eight attributes)."
 },
 "Back Flip": {
  "name": "Back Flip",
  "damage": "",
  "addPS": false,
  "text": "The back flip involves throwing oneself backwards with the arms and shoulders, flipping the legs completely up, over, and back down on the ground into a standing position. The result is that one quickly moves backwards by a full body length. Doing a back flip counts as one melee attack/action and can be used as a dodge or for entertainment. If used in place of a dodge, the character must roll higher than his opponent's strike roll using only the natural die roll (do not include any dodge bonuses). Failure to beat the strike means taking full damage without a chance to Roll with Punch. Success means avoiding the attack like a dodge."
 },
 "Back Flip: Escape": {
  "name": "Back Flip: Escape",
  "damage": "",
  "addPS": false,
  "text": "If used in place of a strike (when it's the back flipping character' s turn to strike) this removes the character from combat and counts as one melee attack/action. To get within striking range, he or his opponent must close ranks (move closer) and whoever does so spends one melee action/attack doing so. A Back Flip Escape also gives the back-flipping character the initiative."
 },
 "Back Flip: Attack": {
  "name": "Back Flip: Attack",
  "damage": "",
  "addPS": false,
  "text": "This is especially useful against someone attempting some kind of back strike. Once the opponent is detected in the rear, the back flip moves one back into combat range. A back flip can also be used as a combined strike against an opponent to the rear of the character. If striking with a back flip use only the bonus to back flip (not strike). Cannot be used with death blow or knockout/stun. This combat maneuver uses up one melee attack/action."
 },
 "Blind or Being Blinded": {
  "name": "Blind or Being Blinded",
  "damage": "",
  "addPS": false,
  "text": "Here are the definitive penalties and conditions for humans being blinded or fighting in absolute darkness with out optical systems to see. Penalties : Ignore all of the character's normal combat bonuses (they don 't count; natural rolls only, minus the penalties) and the blind character is - 10 to strike, parry and dodge, disarm, pull punch and similar combat moves! Speed is reduced by 30-50% (or should be) only because the blind character is unsure of himself and running or moving quickly is likely to cause him to stumble or trip into something and fall down (lose initiative and one melee attack/action), slam into a wall (1D6 S.D.C. damage, triple that if running) or run right into the arms of his opponent or some other danger. Obviously, any skills requiring vision are impossible to perform."
 },
 "Knockdown Modifier": {
  "name": "Knockdown Modifier",
  "damage": "",
  "addPS": false,
  "text": "Add 5% to the roll the victim needs to exceed for every five points of P.S. above 20. So an attacker with a P.S. of 30 requires his opponent to roll 60% to save vs getting bowled over. Characters with a special balancing ability from a skill such as Acrobatics or Gymnastics must roll under their current skill level to keep their balance (if 45% they must roll under 45, if 80% they must roll under 80). A successful maintain balance means the victim is not knocked down but loses one melee attack, and takes full damage. Note: Characters and creatures with Supernatural P.S. and/or greater bulk/weight, or size or speed have an increased likelihood of knocking an opponent down and inflicting greater damage. These special instances are noted under each character description."
 },
 "Knockdown Penalties": {
  "name": "Knockdown Penalties",
  "damage": "",
  "addPS": false,
  "text": "Being knocked down causes the character struck to lose initiative (if he had it) and one attack/action for that melee round, plus he is knocked 1D6 feet (0.3 to 1.8m) away from where he was standing at the moment of the attack. A roll with impact can reduce damage by half, but counts as one melee action."
 },
 "Combat Bonuses": {
  "name": "Combat Bonuses",
  "damage": "",
  "addPS": false,
  "text": "All appropriate bonuses available to the character are added to the various fighting abilities such as strike, parry or dodge, as well as initiative and saving throws. High physical attributes, certain Physical skills, Weapon Proficiencies (W.P.), the occasional O.C.C. bonus, racial bonus, and genetic enhancement may provide one or more combat bonuses. All applicable bonuses are combined and added to the character' s dice rolls. Do not combine the strike bonus with the parry bonus, and so on; each combat maneuver is considered a separate category, so only the various bonuses to strike are added to the strike roll, bonuses to parry added to the parry roll and so forth."
 },
 "Critical Strike": {
  "name": "Critical Strike",
  "damage": "",
  "addPS": false,
  "text": "A powerful, special or nerve shattering strike that inflicts double the usual amount of damage. Critical Strike damage can be inflicted with bare hands or with a weapon."
 },
 "Power Punch": {
  "name": "Power Punch",
  "damage": "",
  "addPS": false,
  "text": "Does double damage, plus any other damage bonuses, but counts as two melee attacks. Applicable to all hand strikes."
 },
 "Backward Sweep": {
  "name": "Backward Sweep",
  "damage": "",
  "addPS": false,
  "text": "No damage, but knocks down opponent if strike is successful (he loses one melee action and initiative)."
 },
 "Trip/Leg Hook": {
  "name": "Trip/Leg Hook",
  "damage": "",
  "addPS": false,
  "text": "No damage, but knocks down opponent if the strike is successful (he loses one melee action and initiative)."
 },
 "Power Kick": {
  "name": "Power Kick",
  "damage": "",
  "addPS": false,
  "text": "Does double damage, but counts as two melee attacks and cannot be done with a Leap Kick."
 },
 "Death Blow": {
  "name": "Death Blow",
  "damage": "",
  "addPS": false,
  "text": "A special attack designed to kill an opponent in one or two strikes! This attack is often limited in hand to hand combat to the roll of a \"Natural\" (no bonuses apply) high strike number; i.e. death blow on a Natural 18-20. Whenever the words \"death blow\" are presented without limitation, the character can use a death strike whenever he desires, however, such a devastating attack counts as two melee attacks/actions"
 },
 "Human vs Human": {
  "name": "Human vs Human",
  "damage": "",
  "addPS": false,
  "text": "Against humans and natural creatures, the deathblow attack does double the normal damage, including P.S. bonuses, direct to Hit Points. This attack can be used with punches and kicks or handheld weapons such as swords, clubs, etc. It is not applicable to guns and does not work through armor; the armor must be removed or penetrated. Note: Does not work on ghosts, spirits, ethereal beings, energy beings or Astral Travelers/Beings, nor robots and other machines."
 },
 "Human vs Supernatural Beings": {
  "name": "Human vs Supernatural Beings",
  "damage": "",
  "addPS": false,
  "text": "Not applicable unless the character is a Mega-Damage being himself (dragon, demon, etc.) or a Demon Slayer (as found in various sourcebooks like Rifts® China 2) fighting another Mega-Damage being. Pretty much the same as above, only a successful \"death blow\" is so devastating to the creature's body that it cannot bio-regenerate injury from a death blow for 1D4 hours!"
 },
 "Disarm": {
  "name": "Disarm",
  "damage": "",
  "addPS": false,
  "text": "The act of disarming is simply getting rid of the opponent's weapon; it does no damage. It can be used as a defensive move in place of a dodge or parry, or can be done as an attack/strike. The disarm move is a strike, hold or grappling maneuver that causes an opponent to drop his weapon or whatever he's holding. Counts as one melee attack/action. Disarm does not give the weapon to the character making the disarm move. True, the item is forced out of the victim's grasp, but it is either knocked away or falls to the ground. Typically an opponent is disarmed on a roll of a Natural 19 or 20 when used as a defensive move. Roll a disarming strike to attack as usual - high roll wins. A failed disarming attack does no damage and means one's opponent remains armed, is probably mad, and ready to strike"
 },
 "Dodge": {
  "name": "Dodge",
  "damage": "",
  "addPS": false,
  "text": "A character dodges by moving out of the way of the attack. Dodging always takes up one attack/action per melee round. To dodge, the defender must roll equal to or higher than the attacker' s strike roll on a twenty-sided die."
 },
 "Entangle": {
  "name": "Entangle",
  "damage": "",
  "addPS": false,
  "text": "A defender can attempt to trap the weapon or arm of an attacker. This is done instead of parrying or dodging, and takes up one attack per melee. An entangle is successful if the defender rolls above the attacker's strike roll. It takes one attack and a roll to entangle to keep an opponent' s arm or weapon entangled every melee round. In order to get free, the entangled opponent must roll a dodge against the entangle roll."
 },
 "Hand to Hand Combat": {
  "name": "Hand to Hand Combat",
  "damage": "",
  "addPS": false,
  "text": "Fighting skills that provide the character with attacks per melee, bonuses, and techniques. Characters without combat training have only one attack per melee and have no automatic chance to parry. Specific combat moves and bonuses are all laid out in the Hand to Hand Combat skills that follow these Combat Terms."
 },
 "Hit Points": {
  "name": "Hit Points",
  "damage": "",
  "addPS": false,
  "text": "This is the number of points of damage a character can take before dying. Characters don't lose Hit Points until their S.D.C. is\ndown to zero. A character's base Hit Points is the P.E. attribute plus 1D6. Another 1D6 Hit Points are gained every time the character advances an experience level. Lost Hit Points are not recovered without medical attention and recuperation."
 },
 "Arm Hold": {
  "name": "Arm Hold",
  "damage": "",
  "addPS": false,
  "text": "This involves twisting the arm around to the victim's back. Any items in the hand of the arm being held can be easily removed."
 },
 "Leg Hold": {
  "name": "Leg Hold",
  "damage": "",
  "addPS": false,
  "text": "The victim is on the ground with his leg held up. There's no way for him to get up until the hold is released."
 },
 "Body Hold": {
  "name": "Body Hold",
  "damage": "",
  "addPS": false,
  "text": "Any number of wrestling holds. The victim can be held on the ground or in a standing position."
 },
 "Neck Hold": {
  "name": "Neck Hold",
  "damage": "",
  "addPS": false,
  "text": "The victim is held around the neck from behind. This leaves the victim totally vulnerable to attacks from any other character."
 },
 "Horror Factor (HF)": {
  "name": "Horror Factor (HF)",
  "damage": "",
  "addPS": false,
  "text": "Some creatures are so al ien, monstrous-looking and frightening, that they exude what is called a Horror Factor. See the Horror Factor description under Psychic Combat for a complete description."
 },
 "Initiative": {
  "name": "Initiative",
  "damage": "",
  "addPS": false,
  "text": "Whoever gets to attack first is considered to have the initiative and is the \"attacker.\" Initiative is automatic in sneak attacks and long-range attacks. In most other cases, each opponent rolls a twenty-sided, highest roll gets the initiative. Rolling for initiative takes place at the beginning of each melee round of combat."
 },
 "Penalties": {
  "name": "Penalties",
  "damage": "",
  "addPS": false,
  "text": "In ALL cases, when a character is knocked down or off his feet he automatically loses initiative and one melee attack/action. If he is knocked several or dozens of yards/meters, the character loses two melee attacks. This is true even if the character is knocked down right where he was standing or only a few feet/meters."
 },
 "Knockout/Stun": {
  "name": "Knockout/Stun",
  "damage": "",
  "addPS": false,
  "text": "Anyone hit by a knockout or stun attack will be temporarily incapacitated. The victim is not necessarily unconscious, just dazed - reduce attacks per melee to one and no combat bonuses for a stunned/dazed character for 1D4 melee rounds."
 },
 "Long-Range Attack or Ranged Attack": {
  "name": "Long-Range Attack or Ranged Attack",
  "damage": "",
  "addPS": false,
  "text": "An attack done at a distance using a long-range weapon, magic or power. Provided the attacker is not seen, the defender automatically loses initiative and may not dodge the first attack that melee round from a long-range attack."
 },
 "Melee or Melee Round": {
  "name": "Melee or Melee Round",
  "damage": "",
  "addPS": false,
  "text": "Exactly 15 seconds. The segment of time combatants have to strike, counter and/or return strike. Generally, player characters have four or more attacks per melee."
 },
 "Miss": {
  "name": "Miss",
  "damage": "",
  "addPS": false,
  "text": "A roll of 1-4 to strike (after bonuses) is always a miss. A roll of one always misses regardless of bonuses."
 },
 "Multiple Attackers": {
  "name": "Multiple Attackers",
  "damage": "",
  "addPS": false,
  "text": "Takes place when an opponent is faced by more than one attacker. Characters with hand to hand combat skills can attempt to parry any attacks within their line of sight, from up to three attackers. The defender from multiple attackers can strike at only one target at a time (see Paired Weapons for a rare exception)."
 },
 "Pull Punch": {
  "name": "Pull Punch",
  "damage": "",
  "addPS": false,
  "text": "The abil ity to control the force of a hand to hand attack, whether it be a punch, kick or with a hand weapon. Usually used to reduce the blow to less than killing force. The character can choose to do half damage, quarter damage, a single point or no damage at all. A character must declare a pulled punch, and the player must roll 11 or better on a twenty-sided die (1D20) to successfully pull his punch. A failed roll to pull means full damage is accidentally inflicted."
 },
 "Roll with Impact": {
  "name": "Roll with Impact",
  "damage": "",
  "addPS": false,
  "text": "Hand to hand combat fighters can reduce the damage from physical blows and falls by rolling with the force of the impact. If the defender is successful, then only half damage is taken from the attack. Roll with punch/fall does not work against energy blasts, bullets, fire, blade weapons, psionics, magic or radiation. Victims must roll higher than the attacker's roll. Falling characters must roll a 14 or higher, on a twenty-sided die, to roll with the fall."
 },
 "Curses:": {
  "name": "Curses:",
  "damage": "",
  "addPS": false,
  "text": "15 or better"
 },
 "Disease:": {
  "name": "Disease:",
  "damage": "",
  "addPS": false,
  "text": "14 or better"
 },
 "Lethal Poison": {
  "name": "Lethal Poison",
  "damage": "",
  "addPS": false,
  "text": "14 or better"
 },
 "Non-Lethal Poison": {
  "name": "Non-Lethal Poison",
  "damage": "",
  "addPS": false,
  "text": "16 or better"
 },
 "Harmful Drugs": {
  "name": "Harmful Drugs",
  "damage": "",
  "addPS": false,
  "text": "15 or better"
 },
 "Acids": {
  "name": "Acids",
  "damage": "",
  "addPS": false,
  "text": "No save possible-dodge!"
 },
 "Insanity": {
  "name": "Insanity",
  "damage": "",
  "addPS": false,
  "text": "12 or better"
 },
 "Magic": {
  "name": "Magic",
  "damage": "",
  "addPS": false,
  "text": "12-16 depending on the power level of the spell caster. 16 or higher to save vs ritual magic."
 },
 "Pisonics": {
  "name": "Pisonics",
  "damage": "",
  "addPS": false,
  "text": "6 or better for Psi-Stalkers. 10 or better for Master Psychics, including Mind Melters, Dog Boys and Bursters. 12 for Major & Minor Psychics. 15 for ordinary people and animals"
 },
 "Simultaneous Attack": {
  "name": "Simultaneous Attack",
  "damage": "",
  "addPS": false,
  "text": "Instead of defending with a parry, dodge or entangle, a character can choose to do a simultaneous attack. In this case, the character does not defend (\"Go ahead, hit me; I can take it! \") and simply attacks in response. The advantage of a simultaneous attack is that neither opponent can parry, dodge or entangle. In all probability, both will take damage. Exception : An opponent skilled with Paired Weapons can engage in simultaneous attack (with one weapon) AND parry (with the other), OR, both the paired weapons can be used to strike with NO parry"
 },
 "Sneak Attack": {
  "name": "Sneak Attack",
  "damage": "",
  "addPS": false,
  "text": "An attacker may lie in wait (ambush), attack from behind, or sneak up (Prowl) on an opponent. If the foe does not discover the attacker, then the sneak attack is successful. The sneak attacker always has initiative, and the defender is not able to parry or dodge the sneak attack."
 },
 "Strike": {
  "name": "Strike",
  "damage": "",
  "addPS": false,
  "text": "Anyone attempting to hit an opponent must roll to strike. As with all combat rolls, a roll to strike is made with a twenty-sided die."
 },
 "Throw": {
  "name": "Throw",
  "damage": "",
  "addPS": false,
  "text": "Simply, this means throwing a weapon or object. Rolling to throw is exactly the same as rolling to strike, except that there are different bonuses per weapon type. See Weapon Proficiency."
 },
 "Using Weapons": {
  "name": "Using Weapons",
  "damage": "",
  "addPS": false,
  "text": "A character may use any type of weapon from a gun to a knife or a rock, but gets no combat bonuses, such as strike or parry, unless he has a Weapon Proficiency (W. P.) in that particular weapon. This applies to modern and ancient weapons."
 }
};

// Match a progression entry's text to a move definition (damage, rules text).
export function matchMove(text) {
  // strip exclusion clauses ('...except Leap Kick') to avoid false matches
  const t = String(text).toLowerCase().replace(/except[^.;)]*/g, "");
  for (const [pattern, defName] of MOVE_PATTERNS) {
    if (new RegExp(pattern, "i").test(t)) return MOVE_DEFS[defName] ?? null;
  }
  return null;
}
