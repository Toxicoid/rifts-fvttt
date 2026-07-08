// ============================================================
// RIFTS RPG - Combat Cyborg O.C.C. Setup Macro
// VERIFIED vs Rifts Ultimate Edition p.44-48 + XP table p.295.
// Run on a selected actor to apply the full conversion Combat
// Cyborg: identity, bionic attributes, MDC body, OCC skills
// (with choice prompts), starting bionics, gear, and money.
// ============================================================

const actor = canvas.tokens.controlled[0]?.actor ?? game.user.character;

if (!actor) {
  ui.notifications.warn("Please select a token or assign a character first.");
  return;
}

if (actor.type !== "character") {
  ui.notifications.warn(`${actor.name} is a ${actor.type} actor. OCC/RCC setup macros are built for Character actors — the NPC stat block doesn't display skills, equipment or ability cards. Create major named NPCs as Characters instead.`);
  return;
}

const confirmed = await Dialog.confirm({
  title: "Combat Cyborg O.C.C.",
  content: `
    <p>This will set up <strong>${actor.name}</strong> as a <strong>Combat Cyborg (Full Conversion)</strong>.</p>
    <p>It will:</p>
    <ul>
      <li>Set OCC fields, bionic attributes (P.S. 24, P.P. 18, Spd 132) and M.D.C. 180</li>
      <li>Prompt for skill choices and bionic loadout</li>
      <li>Add OCC skills, MI-B2 armor, cyborg body locations, and standard gear</li>
      <li>Roll starting money and Bionics Upgrade Fund live</li>
    </ul>
    <p><em>Existing items will not be deleted. Roll I.Q., M.E., M.A. normally yourself.</em></p>
  `
});

if (!confirmed) return;

// ── 1. CHOICE DIALOG ──────────────────────────────────────
// One form for all OCC picks: skills, sensors, features, bionic weapons.
const choices = await new Promise((resolve) => {
  new Dialog({
    title: "Combat Cyborg — O.C.C. Choices",
    content: `
      <style>
        .cyborg-form .cf-section { margin: 6px 0 2px; font-weight: bold; border-bottom: 1px solid #999; }
        .cyborg-form .cf-row { display: flex; align-items: center; gap: 6px; margin: 3px 0; }
        .cyborg-form .cf-row label { flex: 0 0 46%; font-size: 12px; }
        .cyborg-form .cf-row input, .cyborg-form .cf-row select { flex: 1; }
        .cyborg-form input.cf-drop { border-style: dashed; }
        .cyborg-form input.cf-drop.cf-dropped { border-style: solid; border-color: #e8751a; }
        .cyborg-form .cf-hint { font-size: 11px; font-style: italic; opacity: 0.8; margin: 2px 0; }
      </style>
      <form class="cyborg-form">
        <p class="cf-hint">Dashed fields accept drag &amp; drop from a compendium or the Items sidebar — dropped items are copied with full stats. Typing a name still works.</p>
        <div class="cf-section">Skills</div>
        <div class="cf-row"><label>Language: Other (+20%)</label><input type="text" name="lang" placeholder="e.g. Spanish, Dragonese"/></div>
        <div class="cf-row"><label>Technical skill (+10%)</label>
          <select name="techSkill">
            <option value="Basic Electronics">Basic Electronics</option>
            <option value="Basic Mechanics">Basic Mechanics</option>
          </select>
        </div>
        <div class="cf-row"><label>Pilot of choice (+10%, no Robot/PA)</label><input type="text" name="pilotChoice" placeholder="e.g. Pilot: Hovercycle"/></div>
        <div class="cf-row"><label>W.P. Ancient (choice)</label><input type="text" name="wpAncient" placeholder="e.g. W.P. Sword"/></div>
        <div class="cf-row"><label>W.P. Modern #1</label><input type="text" name="wpModern1" placeholder="e.g. W.P. Heavy Energy"/></div>
        <div class="cf-row"><label>W.P. Modern #2</label><input type="text" name="wpModern2" placeholder="e.g. W.P. Rifles"/></div>

        <div class="cf-section">Sensory Systems (2 of choice; Mech. Eyes w/ Polarized Filters + Clock Calendar included)</div>
        <div class="cf-row"><label>Sensor #1</label><input type="text" name="sensor1" class="cf-drop" placeholder="e.g. Amplified Hearing"/></div>
        <div class="cf-row"><label>Sensor #2</label><input type="text" name="sensor2" class="cf-drop" placeholder="e.g. Eye: Multi-Optics"/></div>

        <div class="cf-section">Bionic Features &amp; Accessories (4 to start)</div>
        <div class="cf-row"><label>Feature #1</label><input type="text" name="feat1" class="cf-drop" placeholder="e.g. E-Clip Port"/></div>
        <div class="cf-row"><label>Feature #2</label><input type="text" name="feat2" class="cf-drop" placeholder="e.g. Secret Compartment (leg)"/></div>
        <div class="cf-row"><label>Feature #3</label><input type="text" name="feat3" class="cf-drop" placeholder="e.g. Headjack Radio"/></div>
        <div class="cf-row"><label>Feature #4</label><input type="text" name="feat4" class="cf-drop" placeholder="e.g. Finger Camera"/></div>

        <div class="cf-section">Bionic Weapons / Tools (2 per hand, 1 per arm — see Bionics Sourcebook)</div>
        <div class="cf-row"><label>Left Hand #1</label><input type="text" name="handL1" class="cf-drop"/></div>
        <div class="cf-row"><label>Left Hand #2</label><input type="text" name="handL2" class="cf-drop"/></div>
        <div class="cf-row"><label>Right Hand #1</label><input type="text" name="handR1" class="cf-drop"/></div>
        <div class="cf-row"><label>Right Hand #2</label><input type="text" name="handR2" class="cf-drop"/></div>
        <div class="cf-row"><label>Left Arm</label><input type="text" name="armL" class="cf-drop"/></div>
        <div class="cf-row"><label>Right Arm</label><input type="text" name="armR" class="cf-drop"/></div>
      </form>
    `,
    render: (html) => {
      // Enable drag & drop of Items onto the dashed inputs.
      html.find("input.cf-drop").each((_, el) => {
        el.addEventListener("dragover", (ev) => ev.preventDefault());
        el.addEventListener("drop", async (ev) => {
          ev.preventDefault();
          let data;
          try {
            data = JSON.parse(ev.dataTransfer.getData("text/plain"));
          } catch {
            return;
          }
          if (data?.type !== "Item" || !data.uuid) return;
          const item = await fromUuid(data.uuid).catch(() => null);
          if (!item) return;
          el.value = item.name;
          el.dataset.uuid = data.uuid;
          el.classList.add("cf-dropped");
        });
        // Clearing/retyping the field breaks the link to the dropped item.
        el.addEventListener("input", () => {
          delete el.dataset.uuid;
          el.classList.remove("cf-dropped");
        });
      });
    },
    buttons: {
      ok: {
        icon: '<i class="fas fa-check"></i>',
        label: "Apply",
        callback: (html) => {
          const val = (n) => html.find(`[name="${n}"]`).val()?.trim() ?? "";
          const uid = (n) => html.find(`[name="${n}"]`)[0]?.dataset?.uuid ?? "";
          const pick = (n) => ({ name: val(n), uuid: uid(n) });
          resolve({
            lang: val("lang"), techSkill: val("techSkill"), pilotChoice: val("pilotChoice"),
            wpAncient: val("wpAncient"), wpModern1: val("wpModern1"), wpModern2: val("wpModern2"),
            sensors: [pick("sensor1"), pick("sensor2")],
            feats: [pick("feat1"), pick("feat2"), pick("feat3"), pick("feat4")],
            weapons: [
              { loc: "Left Hand",  ...pick("handL1") },
              { loc: "Left Hand",  ...pick("handL2") },
              { loc: "Right Hand", ...pick("handR1") },
              { loc: "Right Hand", ...pick("handR2") },
              { loc: "Left Arm",   ...pick("armL") },
              { loc: "Right Arm",  ...pick("armR") },
            ],
          });
        }
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: "Cancel",
        callback: () => resolve(null)
      }
    },
    default: "ok",
    close: () => resolve(null)
  }, { width: 540 }).render(true);
});

if (!choices) return;

// ── 2. ROLL MONEY & UPGRADE FUND ──────────────────────────
async function rollAttr(formula) {
  const r = new Roll(formula);
  await r.evaluate();
  return r.total;
}

const credits     = await rollAttr("1d4 * 1000");        // 1D4x1,000 credits/cash
const blackMarket = await rollAttr("4d4 * 100");         // 4D4x100 saleable BM items
const upgradeFund = await rollAttr("3d6 * 1000 + 15000"); // Bionics Upgrade Fund

// ── 3. SET IDENTITY, ATTRIBUTES, HEALTH ───────────────────
await actor.update({
  "system.identity.occ": "Combat Cyborg",
  "system.identity.occType": "Men at Arms",
  "system.health.dcType": "MDC",
  "system.health.mdc.value": 180,
  "system.health.mdc.max": 180,          // Main Body base; purchasable to 280 max
  "system.attributes.ps.value": 24,      // Robot P.S. (max 36; 2,000 cr/pt)
  "system.attributes.pp.value": 18,      // Arm P.P. (max 26; 2,000 cr/pt)
  "system.attributes.spd.value": 132,    // 90 mph (max 176; 1,500 cr/pt)
  "system.combat.attacksPerMelee": 4,    // Hand to Hand: Expert base
  "system.money.credits": credits,
  "system.money.blackMarket": blackMarket,
});

// ── 4. OCC SKILLS ─────────────────────────────────────────
// Common RUE pilot skill bases — fuzzy-matched against the typed name.
// VERIFY these bases vs RUE p.302-303; unmatched names fall back to 0.
const PILOT_BASES = [
  { match: /hovercycle|skycycle|rocket ?bike/i, base: 70, per: 3 },
  { match: /hover ?craft/i,                     base: 50, per: 5 },
  { match: /automobile|(^|\s)car(\s|$)/i,       base: 60, per: 2 },
  { match: /motorcycle|snowmobile/i,            base: 60, per: 4 },
  { match: /truck/i,                            base: 40, per: 4 },
  { match: /tank|apc/i,                         base: 56, per: 3 },
  { match: /jet ?pack/i,                        base: 42, per: 4 },
  { match: /jet/i,                              base: 40, per: 4 },
  { match: /helicopter/i,                       base: 35, per: 5 },
  { match: /airplane|plane/i,                   base: 50, per: 4 },
  { match: /sail/i,                             base: 60, per: 5 },
  { match: /boat|ship/i,                        base: 55, per: 5 },
];
function pilotBase(name, occBonus) {
  for (const p of PILOT_BASES) {
    if (p.match.test(name ?? "")) return { base: p.base + occBonus, per: p.per, note: `Base ${p.base}% +${occBonus}% OCC bonus — VERIFY base vs RUE p.302-303` };
  }
  return { base: 0, per: 0, note: `Vehicle not recognized — enter its base % +${occBonus}% OCC bonus manually` };
}

// Base % = RUE base + OCC bonus already applied. VERIFY base values vs book.
const named = (s, fallback) => s || fallback;
const occSkills = [
  { name: "Language: Native",                       category: "communications", basePercent: 96, perLevelBonus: 0, notes: "Native tongue at 96%" },
  { name: `Language: ${named(choices.lang, "Other (choice)")}`, category: "communications", basePercent: 70, perLevelBonus: 3, notes: "Base 50% +20% OCC bonus" },
  { name: choices.techSkill || "Basic Electronics", category: choices.techSkill === "Basic Mechanics" ? "mechanical" : "electrical", basePercent: 40, perLevelBonus: 5, notes: "Base 30% +10% OCC bonus (pick: Electronics or Mechanics)" },
  { name: "General Repair & Maintenance",           category: "mechanical",     basePercent: 50, perLevelBonus: 5, notes: "Base 35% +15% OCC bonus" },
  { name: "Land Navigation",                        category: "wilderness",     basePercent: 51, perLevelBonus: 4, notes: "Base 36% +15% OCC bonus" },
  { name: "Pilot: Tanks & APCs",                    category: "pilot",          basePercent: 61, perLevelBonus: 3, notes: "Base 56% +5% OCC bonus" },
  (() => { const p = pilotBase(choices.pilotChoice, 10); return { name: named(choices.pilotChoice, "Pilot: One of choice"), category: "pilot", basePercent: p.base, perLevelBonus: p.per, notes: p.note + " (no Robot/Power Armor skills)" }; })(),
  { name: "Radio: Basic",                           category: "communications", basePercent: 55, perLevelBonus: 5, notes: "Base 45% +10% OCC bonus" },
  { name: "Read Sensory Equipment",                 category: "pilotRelated",   basePercent: 40, perLevelBonus: 5, notes: "Base 30% +10% OCC bonus" },
  { name: "Weapon Systems",                         category: "military",       basePercent: 45, perLevelBonus: 5, notes: "Base 40% +5% OCC bonus" },
  { name: "Climbing",                               category: "physical",       basePercent: 45, perLevelBonus: 5, notes: "Base 40% +5% OCC bonus" },
  { name: named(choices.wpAncient, "W.P. Ancient (choice)"),  category: "weaponProficiency", basePercent: 0, perLevelBonus: 0, notes: "Ancient W.P. of choice" },
  { name: "W.P. Energy Rifle",                      category: "weaponProficiency", basePercent: 0, perLevelBonus: 0, notes: "Grants +1 strike per 3 levels" },
  { name: named(choices.wpModern1, "W.P. Modern #1 (choice)"), category: "weaponProficiency", basePercent: 0, perLevelBonus: 0, notes: "Modern W.P. of choice (may be Heavy Energy)" },
  { name: named(choices.wpModern2, "W.P. Modern #2 (choice)"), category: "weaponProficiency", basePercent: 0, perLevelBonus: 0, notes: "Modern W.P. of choice (may be Heavy Energy)" },
  { name: "Hand to Hand: Expert",                   category: "military",       basePercent: 0, perLevelBonus: 0, notes: "4 attacks/melee. Upgradable at creation ONLY to Martial Arts (or Assassin if evil) for TWO O.C.C. Related Skills" },
];

const occSkillItems = occSkills.map((s) => ({
  name: s.name,
  type: "skill",
  system: {
    category: s.category,
    basePercent: s.basePercent,
    bonusPercent: 0,
    totalPercent: s.basePercent,
    perLevelBonus: s.perLevelBonus,
    isSecondary: false,
    notes: s.notes,
  },
}));

// ── 5. CYBORG BODY & ARMOR ────────────────────────────────
const bodyAndArmor = [
  {
    name: "Cyborg Body — Locations",
    type: "armor",
    system: {
      dcType: "MDC", ar: 0,
      main:     { value: 0,  max: 0 },   // Main Body 180 tracked on the M.D.C. health bar
      helmet:   { value: 60, max: 60 },  // Head (purchase max 90)
      arms:     { value: 47, max: 47 },  // Upper Arms, each (purchase max 70)
      legs:     { value: 60, max: 60 },  // each (purchase max 90)
      hands:    { value: 33, max: 33 },  // each (purchase max 50)
      forearms: { value: 33, max: 33 },  // each (purchase max 50)
      feet:     { value: 13, max: 13 },  // each (purchase max 20)
      mobility: "—", weight: "~1,000 lbs total", cost: 0, prowlPenalty: 0,
      description: "M.D.C. by location for the full conversion cyborg body. Main Body (180, max 280) is tracked on the health bar. Helmet field = Head.",
      notes: "Purchase maximums: Head 90, Upper Arms 70 ea, Legs 90 ea, Hands/Forearms 50 ea, Feet 20 ea, Main Body 280. Additional M.D.C.: 2,000 cr/point at a bionics facility.",
    },
  },
  {
    name: "MI-B2 Medium Infantry Cyborg Armor",
    type: "armor",
    system: {
      dcType: "MDC", ar: 0,
      main:   { value: 230, max: 230 },
      helmet: { value: 30,  max: 30 },
      arms:   { value: 38,  max: 38 },
      legs:   { value: 60,  max: 60 },
      hands: { value: 0, max: 0 }, forearms: { value: 0, max: 0 }, feet: { value: 0, max: 0 },
      mobility: "Bulky", weight: "", cost: 52000, prowlPenalty: 15,
      description: "External M.D.C. plating snapped onto the 'Borg's body. Included at character creation.",
      notes: "-15% to Physical skills (Acrobatics, Climbing, Gymnastics, Pick Pockets, Prowl). Arms/Legs values are per limb. Book value 52,000 cr.",
    },
  },
];

// ── 6. BIONIC WEAPONS, SENSORS & FEATURES ─────────────────
// Dropped items are cloned with their full stats; typed names get placeholders.
async function cloneFromUuid(uuid) {
  const src = await fromUuid(uuid).catch(() => null);
  if (!src) return null;
  const obj = src.toObject();
  delete obj._id;
  delete obj.folder;
  delete obj.sort;
  delete obj.ownership;
  return obj;
}

const bionicItems = [];

for (const w of choices.weapons) {
  if (!w.name && !w.uuid) continue;
  if (w.uuid) {
    const obj = await cloneFromUuid(w.uuid);
    if (obj) {
      obj.name = `${obj.name} (${w.loc})`;
      obj.system.notes = [`Built into ${w.loc}.`, obj.system.notes].filter(Boolean).join(" ");
      bionicItems.push(obj);
      continue;
    }
  }
  bionicItems.push({
    name: `${w.name} (${w.loc})`,
    type: "weapon",
    system: {
      damage: "varies", damageType: "MDC", range: "varies", rateOfFire: "varies",
      payload: 0, bonusToStrike: 0,
      notes: `Bionic weapon/tool built into ${w.loc}. Fill in stats from Bionics Sourcebook.`,
    },
  });
}

// Included sensory systems (always placeholders — part of the base package).
for (const n of ["Mechanical Eyes w/ Polarized Filters", "Clock Calendar"]) {
  bionicItems.push({
    name: n,
    type: "equipment",
    system: { quantity: 1, weight: "", cost: 0, notes: "Built-in bionic sensory system" },
  });
}

// Chosen sensors and features.
async function pushChosen(pickList, fallbackName, fallbackNotes) {
  for (const [i, p] of pickList.entries()) {
    if (p.uuid) {
      const obj = await cloneFromUuid(p.uuid);
      if (obj) {
        bionicItems.push(obj);
        continue;
      }
    }
    bionicItems.push({
      name: p.name || `${fallbackName} #${i + 1} (choice)`,
      type: "equipment",
      system: { quantity: 1, weight: "", cost: 0, notes: fallbackNotes },
    });
  }
}

await pushChosen(choices.sensors, "Sensory System", "Built-in bionic sensory system");
await pushChosen(choices.feats, "Bionic Feature", "Bionic feature/accessory (4 at creation)");

bionicItems.push({
  name: "Bionics Upgrade Fund",
  type: "equipment",
  system: {
    quantity: 1, weight: "", cost: upgradeFund,
    notes: `${upgradeFund.toLocaleString()} credits (3D6x1,000 + 15,000, rolled). For bionic attributes, M.D.C., or features. Can be saved for repairs/upgrades.`,
  },
});

// ── 6b. NATURAL ATTACKS (Robot P.S.) ──────────────────────
bionicItems.push(
  {
    name: "Punch (Robot P.S.)",
    type: "weapon",
    system: {
      equipped: true, damage: "varies", damageType: "MDC", range: "melee",
      rateOfFire: "1 melee attack", payload: 0, weight: "", cost: 0, bonusToStrike: 0,
      special: "Robot Strength: inflicts Mega-Damage with an ordinary punch. Damage per the Robot P.S. damage table (RUE Strength Tables) for the character's P.S. — fill in the dice once verified.",
      notes: "Natural attack. Kicks and other strikes use the same table.",
      description: "A bare-handed strike from the cyborg's bionic arms.",
    },
  },
  {
    name: "POWER PUNCH (Robot P.S.)",
    type: "weapon",
    system: {
      equipped: true, damage: "varies", damageType: "MDC", range: "melee",
      rateOfFire: "Counts as TWO melee attacks", payload: 0, weight: "", cost: 0, bonusToStrike: 0,
      special: "POWER PUNCH: the character winds up and delivers DOUBLE the normal Robot P.S. punch damage — and it COUNTS AS TWO MELEE ATTACKS/ACTIONS. Announce before rolling; mark off two attacks from A.P.M.",
      notes: "Fill damage with double the Punch dice once the Robot P.S. table is verified (e.g. Punch 1d6 -> Power Punch 2d6).",
      description: "A full wind-up strike putting the machine body's entire power behind the blow.",
    },
  },
);

// ── 7. STANDARD EQUIPMENT & WEAPONS ───────────────────────
const largeSacks = await rollAttr("1d4");
const equipmentItems = [
  { name: "Ancient Weapon (choice)",  type: "weapon", system: { damage: "varies", damageType: "SDC", range: "melee",  rateOfFire: "1",      payload: 0, bonusToStrike: 0, notes: "One weapon for W.P. Ancient" } },
  { name: "Energy Rifle (choice)",    type: "weapon", system: { damage: "varies", damageType: "MDC", range: "varies", rateOfFire: "varies", payload: 0, bonusToStrike: 0, notes: "One weapon for W.P. Energy Rifle + 4 E-Clips" } },
  { name: "Modern Weapon #1 (choice)", type: "weapon", system: { damage: "varies", damageType: "varies", range: "varies", rateOfFire: "varies", payload: 0, bonusToStrike: 0, notes: "One weapon for W.P. Modern #1 + 4 clips" } },
  { name: "Modern Weapon #2 (choice)", type: "weapon", system: { damage: "varies", damageType: "varies", range: "varies", rateOfFire: "varies", payload: 0, bonusToStrike: 0, notes: "One weapon for W.P. Modern #2 + 4 clips" } },
  { name: "Hovercycle or Motorcycle", type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "Choice of hovercycle or motorcycle" } },
  { name: "Flares",                   type: "equipment", system: { quantity: 4, weight: "0.5 lbs", cost: 0, notes: "" } },
  { name: "Walkie-Talkies (pair)",    type: "equipment", system: { quantity: 2, weight: "0.5 lbs", cost: 0, notes: "" } },
  { name: "Poncho or Hooded Cloak",   type: "equipment", system: { quantity: 1, weight: "2 lbs", cost: 0, notes: "" } },
  { name: "Tinted Goggles or Sunglasses", type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
  { name: "Air Filter",               type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
  { name: "Flashlight",               type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Cigarette Lighter",        type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
  { name: "Pocket Magnifying Glass",  type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
  { name: "Pocket Mirror",            type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
  { name: "Heavy Cord or Cable (100 ft)", type: "equipment", system: { quantity: 1, weight: "5 lbs", cost: 0, notes: "30.5 m" } },
  { name: "Small Portable Tool Kit",  type: "equipment", system: { quantity: 1, weight: "3 lbs", cost: 0, notes: "" } },
  { name: "Language Translator",      type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "Unless built-in as a bionic feature" } },
  { name: "Utility Belts",            type: "equipment", system: { quantity: 2, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Knapsack",                 type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Backpack",                 type: "equipment", system: { quantity: 1, weight: "2 lbs", cost: 0, notes: "" } },
  { name: "Small Sacks",              type: "equipment", system: { quantity: 4, weight: "", cost: 0, notes: "" } },
  { name: "Large Sacks",              type: "equipment", system: { quantity: largeSacks, weight: "", cost: 0, notes: "1D4 rolled" } },
  { name: "Canteens",                 type: "equipment", system: { quantity: 2, weight: "1 lb", cost: 0, notes: "" } },
];

// ── 8. OCC ABILITY CARDS ──────────────────────────────────
const occAbilities = [
  {
    name: "Robot Strength & Bionic Body",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Robot P.S. 24 (max 36) — inflicts Mega-Damage with an ordinary punch. Power punch = double damage, counts as two attacks.\nArm P.P. 18 (max 26). Leg P.S. & P.P. 18 (max 24).\nSpd 132 / 90 mph (max 176 / 120 mph). Leap 7 ft high, 15 ft across (+20% with running start).\nUpgrade costs: P.S./P.P./leg attributes & M.D.C. 2,000 cr per point; Spd 1,500 cr per point. Bionics facility required.\nAverage height 8-9 ft, weight ~1,000 lbs.\nConsidered a Mega-Damage being: impervious to attacks/weapons that damage Hit Points directly.",
    },
  },
  {
    name: "Full Conversion Penalties",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Sense of touch only 35-55% of normal.\nProwl -20% (impossible in HI-B3 Heavy armor).\nSkills requiring sensitive, nimble fingers -40%: Art, Forgery, Locksmith, Palming, Pick Locks, Play Musical Instrument, and similar.\nAdditional penalties may apply for armor and stress situations.",
    },
  },
  {
    name: "Psionics, Magic & Mind",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Full conversion DESTROYS all psionics and I.S.P. Magic abilities destroyed; P.P.E. reduced by 90%. Cannot operate Techno-Wizard devices or practice magic.\nBonuses: +5 to save vs possession, +3 to save vs magic.\nImpervious to: psionic Bio-Manipulation, Telemechanics (all), See Aura, and Hit Point-direct attacks.\nStill vulnerable to: mind control, Empathic Transmission, Telepathy, Hypnotic Suggestion, illusions, and any mind-affecting psionic or magic.",
    },
  },
  {
    name: "Bionic Feature Slots",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Maximum features by location:\nHead: 6 (4 if large). Eyes: Multi-Optics or up to 3 enhanced optic features each (HUD standard with bionic eyes, doesn't count).\nEars: 4. Mouth/Jaw: 5. Neck/Throat: 3. Chest: 4. Cosmetics (general body): 10.\nHands: 2 weapons each (3 if small) or multi-system sensor hand. Wrist: 1. Knuckles: 1 each. Fingers: 1 per digit. Forearm: 2-3. Shoulder & Upper Arm: 1 each.\nFoot: clawed toes/blades only. Leg: 3 weapon systems + 1 small/medium compartment, OR 3-6 compartments.\nOnce an area is maxed out, must stop or replace an existing feature.",
    },
  },
  {
    name: "O.C.C. Related Skills",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Select FIVE related skills at level 1; +1 additional at levels 3, 7, 10 and 13. All new skills start at level one proficiency.\n\nAllowed categories:\n• Communications: Any (+10%)\n• Cowboy: None\n• Domestic: Any\n• Electrical: Basic Electronics (+5%) only\n• Espionage: Intelligence and Tracking only\n• Horsemanship: General only\n• Mechanical: Basic Mechanics and Automotive only (+5%)\n• Medical: First Aid only (+5%)\n• Military: Any (+10%)\n• Physical: Any (only those still appropriate)\n• Pilot: Any (+5%), except robots and power armor\n• Pilot Related: Any\n• Rogue: Gambling and Find Contraband only\n• Science: Basic and Advanced Math only\n• Technical: Any (+5%)\n• W.P.: Any\n• Wilderness: None",
    },
  },
  {
    name: "Secondary Skills",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Select FOUR secondary skills at level 1 from the Secondary Skills List; +1 additional at levels 4, 8 and 12.\nNo bonuses apply (other than possible I.Q. bonus). All start at base skill level.",
    },
  },
  {
    name: "Experience Table",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Level 1: 0-2,100\nLevel 2: 2,101-4,200\nLevel 3: 4,201-8,400\nLevel 4: 8,401-17,200\nLevel 5: 17,201-25,400\nLevel 6: 25,401-35,800\nLevel 7: 35,801-51,000\nLevel 8: 51,001-71,200\nLevel 9: 71,201-96,400\nLevel 10: 96,401-131,600\nLevel 11: 131,601-181,800\nLevel 12: 181,801-232,000\nLevel 13: 232,001-282,200\nLevel 14: 282,201-342,400\nLevel 15: 342,401-402,600\n(Shared with Headhunter & Robot Pilot, RUE p.295)",
    },
  },
];

// ── 9. CREATE ALL ITEMS ───────────────────────────────────
const allItems = [...occSkillItems, ...bodyAndArmor, ...bionicItems, ...equipmentItems, ...occAbilities];
await actor.createEmbeddedDocuments("Item", allItems);

// ── 10. DONE ──────────────────────────────────────────────
ui.notifications.info(`${actor.name} has been set up as a Combat Cyborg (Full Conversion)!`);

ChatMessage.create({
  speaker: { alias: "OCC Setup" },
  content: `
    <h2>🦾 Combat Cyborg O.C.C.</h2>
    <p><strong>${actor.name}</strong> is now a full conversion Combat Cyborg.</p>
    <hr>
    <p><strong>Rolled:</strong></p>
    <ul>
      <li>Starting credits: <strong>${credits.toLocaleString()}</strong> (1D4x1,000)</li>
      <li>Black Market items: <strong>${blackMarket.toLocaleString()}</strong> cr value (4D4x100)</li>
      <li>Bionics Upgrade Fund: <strong>${upgradeFund.toLocaleString()}</strong> cr (3D6x1,000 + 15,000)</li>
    </ul>
    <p><strong>Player still needs to:</strong></p>
    <ul>
      <li>Roll I.Q., M.E. and M.A. normally (3D6); M.E. 10+ suggested</li>
      <li>Fill in stats for bionic weapons from the Bionics Sourcebook</li>
      <li>Select 5 O.C.C. Related Skills and 4 Secondary Skills</li>
      <li>Optionally upgrade HtH Expert → Martial Arts/Assassin (costs 2 Related Skills, creation only)</li>
      <li>Point token bar to health.mdc if desired</li>
    </ul>
    <p><em>Race limit: humans, D-Bees, mortals, and sub-demons (Brodkil, Daemonix, Gargoyles). No supernatural/magic beings.</em></p>
  `
});
