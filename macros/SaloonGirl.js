// ============================================================
// RIFTS RPG - Saloon Girl/Barmaid O.C.C. Setup Macro
// (Rifts New West) — also known as Barmaid, Gold-digger,
// Tease, and Seductress. VERIFIED vs book text; XP table
// pending (placeholder card).
//
// RUN ORDER: roll/enter attributes FIRST (and any race macro).
// This macro INCREMENTS M.A. (+1D4+1) and S.D.C. (+2D6).
// ============================================================

const actor = canvas.tokens.controlled[0]?.actor ?? game.user.character;

if (!actor) {
  ui.notifications.warn("Please select a token or assign a character first.");
  return;
}

if (actor.type !== "character") {
  ui.notifications.warn(`${actor.name} is a ${actor.type} actor. OCC/RCC setup macros are built for Character actors — create major named NPCs as Characters instead.`);
  return;
}

const confirmed = await Dialog.confirm({
  title: "Saloon Girl/Barmaid O.C.C.",
  content: `
    <p>This will set up <strong>${actor.name}</strong> as a <strong>Saloon Girl O.C.C.</strong></p>
    <ul>
      <li>Attribute requirements: I.Q. 9, M.A. 10, P.B. 12 or higher</li>
      <li><strong>ADDS</strong> +1D4+1 M.A. and +2D6 S.D.C. to current values; +2 init, +2 roll</li>
      <li>Adds OCC skills, equipment, weapons and rolled money</li>
    </ul>
    <p><em><strong>Run AFTER rolling attributes</strong> — bonuses stack on current values. Existing items untouched.</em></p>
  `
});

if (!confirmed) return;

// ── 1. CHOICE DIALOG ──────────────────────────────────────
const choices = await new Promise((resolve) => {
  new Dialog({
    title: "Saloon Girl — O.C.C. Choices",
    content: `
      <style>
        .sg-form .cf-row { display: flex; align-items: center; gap: 6px; margin: 3px 0; }
        .sg-form .cf-row label { flex: 0 0 46%; font-size: 12px; }
        .sg-form .cf-row input, .sg-form .cf-row select { flex: 1; }
      </style>
      <form class="sg-form">
        <div class="cf-row"><label>Language #1 (+20%)</label><input type="text" name="lang1" placeholder="e.g. Spanish"/></div>
        <div class="cf-row"><label>Language #2 (+20%)</label><input type="text" name="lang2" placeholder="e.g. Techno-Can"/></div>
        <div class="cf-row"><label>Cooking or Brewing (+15%)</label>
          <select name="cookBrew"><option value="Cooking">Cooking</option><option value="Brewing">Brewing</option></select>
        </div>
        <div class="cf-row"><label>Riding skill (+10%)</label>
          <select name="ride"><option value="Horsemanship: General">Horsemanship: General</option><option value="Pilot: Hover Vehicles">Pilot: Hover Vehicles</option></select>
        </div>
        <div class="cf-row"><label>Lore #1 (+15%)</label><input type="text" name="lore1" placeholder="e.g. Lore: Demons & Monsters"/></div>
        <div class="cf-row"><label>Lore #2 (+15%)</label><input type="text" name="lore2" placeholder="e.g. Lore: Psychics"/></div>
        <div class="cf-row"><label>W.P. of choice</label><input type="text" name="wp" placeholder="e.g. W.P. Knife"/></div>
        <div class="cf-row"><label>Hand to Hand</label>
          <select name="hth">
            <option value="Hand to Hand: Basic">Basic</option>
            <option value="Hand to Hand: Expert">Expert (costs 1 Related Skill)</option>
            <option value="Hand to Hand: Martial Arts">Martial Arts (costs 2 Related Skills)</option>
            <option value="Hand to Hand: Assassin">Assassin (evil only, costs 2 Related Skills)</option>
          </select>
        </div>
      </form>
    `,
    buttons: {
      ok: {
        icon: '<i class="fas fa-check"></i>',
        label: "Apply",
        callback: (html) => {
          const val = (n) => html.find(`[name="${n}"]`).val()?.trim() ?? "";
          resolve({
            lang1: val("lang1"), lang2: val("lang2"),
            cookBrew: val("cookBrew") || "Cooking",
            ride: val("ride") || "Horsemanship: General",
            lore1: val("lore1"), lore2: val("lore2"),
            wp: val("wp"),
            hth: val("hth") || "Hand to Hand: Basic",
          });
        }
      },
      cancel: { icon: '<i class="fas fa-times"></i>', label: "Cancel", callback: () => resolve(null) }
    },
    default: "ok",
    close: () => resolve(null)
  }, { width: 520 }).render(true);
});

if (!choices) return;

// ── 2. ROLLS ──────────────────────────────────────────────
async function rollAttr(formula) {
  const r = new Roll(formula);
  await r.evaluate();
  return r.total;
}

const maBonus  = await rollAttr("1d4 + 1");    // +1D4+1 M.A.
const sdcBonus = await rollAttr("2d6");        // +2D6 S.D.C.
const credits  = await rollAttr("1d4 * 1000"); // 1D4x1,000 credits
const jewelry  = await rollAttr("3d6 * 1000"); // 3D6x1,000 in jewelry
const whiskey  = await rollAttr("1d4");        // 1D4 bottles of whiskey

// ── 3. IDENTITY, INCREMENTED BONUSES, MONEY ───────────────
const sys = actor.system;
await actor.update({
  "system.identity.occ": "Saloon Girl",
  "system.identity.occType": "Adventurer (New West)",
  "system.attributes.ma.value": (sys.attributes.ma.value ?? 10) + maBonus,
  "system.health.sdc.value": (sys.health.sdc.value ?? 0) + sdcBonus,
  "system.health.sdc.max": (sys.health.sdc.max ?? 0) + sdcBonus,
  "system.combat.initiativeBonus": (sys.combat.initiativeBonus ?? 0) + 2,
  "system.combat.rollBonus": (sys.combat.rollBonus ?? 0) + 2,
  "system.combat.attacksPerMelee": (sys.combat.attacksPerMelee ?? 2) + 2, // HtH training over base
  "system.money.credits": credits,
  "system.money.blackMarket": jewelry, // jewelry as saleable value
});

// ── 4. OCC SKILLS ─────────────────────────────────────────
// Base % = book base + OCC bonus already applied. VERIFY bases vs RUE/New West.
const named = (s, fallback) => s || fallback;
const occSkills = [
  { name: "Language: Native",                   category: "communications", basePercent: 98, perLevelBonus: 0, notes: "Native tongue at 98% (book)" },
  { name: `Language: ${named(choices.lang1, "Choice #1")}`, category: "communications", basePercent: 70, perLevelBonus: 3, notes: "Base 50% +20% OCC bonus" },
  { name: `Language: ${named(choices.lang2, "Choice #2")}`, category: "communications", basePercent: 70, perLevelBonus: 3, notes: "Base 50% +20% OCC bonus" },
  { name: choices.cookBrew,                     category: "domestic",       basePercent: choices.cookBrew === "Cooking" ? 50 : 40, perLevelBonus: 5, notes: `Base ${choices.cookBrew === "Cooking" ? "35%" : "25%"} +15% OCC bonus — VERIFY base` },
  { name: "Singing",                            category: "domestic",       basePercent: 50, perLevelBonus: 5, notes: "Base 35% +15% OCC bonus — PROFESSIONAL quality" },
  { name: "Dancing",                            category: "domestic",       basePercent: 50, perLevelBonus: 5, notes: "Base 30% +20% OCC bonus — PROFESSIONAL quality" },
  { name: "Seduction",                          category: "rogue",          basePercent: 0,  perLevelBonus: 0, notes: "+23% OCC bonus — enter the base % from the skill description (not in RUE core), then add 23" },
  { name: choices.ride,                         category: choices.ride.startsWith("Pilot") ? "pilot" : "horsemanship", basePercent: choices.ride.startsWith("Pilot") ? 60 : 0, perLevelBonus: choices.ride.startsWith("Pilot") ? 5 : 0, notes: choices.ride.startsWith("Pilot") ? "Base 50% +10% OCC bonus — VERIFY base" : "Enter Horsemanship: General base % +10% OCC bonus" },
  { name: named(choices.lore1, "Lore: Choice #1"), category: "technical",   basePercent: 0, perLevelBonus: 0, notes: "Enter the chosen Lore's base % +15% OCC bonus" },
  { name: named(choices.lore2, "Lore: Choice #2"), category: "technical",   basePercent: 0, perLevelBonus: 0, notes: "Enter the chosen Lore's base % +15% OCC bonus" },
  { name: "Streetwise",                         category: "rogue",          basePercent: 34, perLevelBonus: 4, notes: "Base 20% +14% OCC bonus" },
  { name: "W.P. Energy Pistol",                 category: "weaponProficiency", basePercent: 0, perLevelBonus: 0, notes: "Grants +1 strike per 3 levels" },
  { name: named(choices.wp, "W.P. (choice)"),   category: "weaponProficiency", basePercent: 0, perLevelBonus: 0, notes: "W.P. of choice" },
  { name: choices.hth,                          category: "military",       basePercent: 0, perLevelBonus: 0, notes: choices.hth === "Hand to Hand: Basic" ? "4 attacks/melee at level 1. Upgradable at creation: Expert (1 Related Skill), Martial Arts or Assassin if evil (2 Related Skills)" : "4 attacks/melee at level 1. Remember the Related Skill cost of this upgrade" },
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

// ── 5. WEAPONS & EQUIPMENT ────────────────────────────────
const gearItems = [
  { name: "S.D.C. Six Shooter (Revolver)", type: "weapon", system: { equipped: true, damage: "varies", damageType: "SDC", range: "varies", rateOfFire: "single", payload: 6, weight: "2 lbs", cost: 0, bonusToStrike: 0, special: "", notes: "Two E-Clips/speedloaders' worth of ammo. Fill in caliber/damage." } },
  { name: "M.D. Pistol (choice)",          type: "weapon", system: { equipped: true, damage: "varies", damageType: "MDC", range: "varies", rateOfFire: "varies", payload: 0, weight: "", cost: 0, bonusToStrike: 0, special: "", notes: "Plus two E-Clips. Fill in stats." } },
  { name: "M.D. Derringer (Concealed)",    type: "weapon", system: { equipped: true, damage: "varies", damageType: "MDC", range: "short", rateOfFire: "1-2", payload: 2, weight: "", cost: 0, bonusToStrike: 0, special: "Concealed — holster may be concealed.", notes: "Plus two E-Clips. Fill in stats." } },
  { name: "Folding Straight Razor",        type: "weapon", system: { equipped: true, damage: "2d4", damageType: "SDC", range: "melee", rateOfFire: "1", payload: 0, weight: "", cost: 0, bonusToStrike: 0, special: "", notes: "" } },
  { name: "Work & Casual Clothing/Dresses", type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "Plus riding boots, dress shoes, hat, gloves, stockings" } },
  { name: "Cosmetics & Make-up",           type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
  { name: "Purse & Pocket Mirror",         type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
  { name: `Whiskey x${whiskey} bottles`,   type: "equipment", system: { quantity: whiskey, weight: "2 lbs", cost: 0, notes: `1D4 rolled: ${whiskey}` } },
  { name: "Excellent Bourbon (bottle)",    type: "equipment", system: { quantity: 1, weight: "2 lbs", cost: 0, notes: "" } },
  { name: "Excellent Wine (bottle)",       type: "equipment", system: { quantity: 1, weight: "2 lbs", cost: 0, notes: "" } },
  { name: "Silver Cross on a Chain",       type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "The New West essential." } },
  { name: "Sunglasses",                    type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
  { name: "Handcuffs (pair)",              type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Backpack & Sleeping Bag",       type: "equipment", system: { quantity: 1, weight: "4 lbs", cost: 0, notes: "" } },
  { name: "Language Translator",           type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Pocket Audio Disk Recorder",    type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "Plus a dozen disks. Worth remembering what people say when they drink." } },
  { name: "Cigarette Lighter & Pen Flashlight", type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "Plus a few personal items. No vehicle to start." } },
];

// ── 6. OCC ABILITY CARDS ──────────────────────────────────
const occAbilities = [
  {
    name: "O.C.C. Abilities & Bonuses",
    type: "occ_ability",
    system: {
      level: 1,
      description: `Also known as Barmaid, Gold-digger, Tease, and Seductress.\nAttribute Requirements: I.Q. 9, M.A. 10, P.B. 12 or higher (the higher the M.A. and P.B., the better). Alignment: any, but often selfish or evil.\n\n1. TOLERANCE TO ALCOHOL: can drink TWICE as much as the average character — see 'Drinking others under the table' under the Saloon Bum for details.\n\n2. Other bonuses (applied to sheet): +${maBonus} M.A. (1D4+1 rolled), +${sdcBonus} S.D.C. (2D6 rolled), +2 on initiative, +2 to roll with punch/fall/impact.\nApply when relevant: +10% to Charm/Impress IF P.B. is over 20.\n+1 to save vs Horror Factor at levels 2, 4, 6, 8, 10 and 12 (add to the HF save bonus as she levels).`,
    },
  },
  {
    name: "O.C.C. Related Skills",
    type: "occ_ability",
    system: {
      level: 1,
      description: "At first level select TWO Rogue skills plus SIX 'other' skills. Select one additional skill at levels 3, 6, 9 and 12.\n\nAllowed categories:\n• Communications: Any (+5%)\n• Cowboy: Trick Riding and Whittling only\n• Domestic: Any (+15%)\n• Electrical: Basic only\n• Espionage: Any\n• Mechanical: Basic and Automotive only\n• Medical: Brewing, Paramedic, or Holistic Medicine (+5%)\n• Military: None\n• Physical: Any\n• Pilot: Any non-military\n• Pilot Related: None\n• Rogue: Any (+10%)\n• Science: Math only (+10%)\n• Technical: Any (+5%; +15% to Language and Lore skills)\n• W.P.: Any\n• Wilderness: Preserve Food, I.D. Plants, & Land Navigation only (+5%)\n\nHand to Hand upgrades cost Related Skills — Expert: 1, Martial Arts/Assassin: 2.",
    },
  },
  {
    name: "Secondary Skills",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Select three Secondary Skills from the list at levels 1, 3, 6, 10, and 14 (read as: three at EACH listed level — verify your table's preference). No bonuses apply; all start at base skill level and are limited (any, only, none) as indicated in the Related Skills list.",
    },
  },
  {
    name: "Salary & Lifestyle",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Typical salary: 50-75 credits a week, plus tips (usually another 3D4x10 credits a week), and may include free room and board at the saloon or nearby. Those extremely skilled at getting customers to spend — especially at the gambling tables — are likely to get a small cut, typically about 2D4x100 credits a week at saloons that cater to gambling.\n\nCybernetics: none to start. Avoids unsightly cybernetics except concealed implants and Bio-Systems necessary for medical reasons — needs to look soft, pretty and nice.",
    },
  },
  {
    name: "Experience Table",
    type: "occ_ability",
    system: {
      level: 1,
      description: "PLACEHOLDER — Saloon Girl XP table (Rifts New West) not yet provided. Paste levels 1-15 to complete this card.",
    },
  },
];

// ── 7. CREATE ALL ITEMS ───────────────────────────────────
await actor.createEmbeddedDocuments("Item", [...occSkillItems, ...gearItems, ...occAbilities]);

ui.notifications.info(`${actor.name} has been set up as a Saloon Girl O.C.C.!`);

ChatMessage.create({
  speaker: { alias: "OCC Setup" },
  content: `
    <h2>🥃 Saloon Girl O.C.C. (New West)</h2>
    <p><strong>${actor.name}</strong> is now a Saloon Girl.</p>
    <hr>
    <p><strong>Rolled &amp; applied (ADDED to current values):</strong></p>
    <ul>
      <li>+${maBonus} M.A. (1D4+1) — new M.A. applied</li>
      <li>+${sdcBonus} S.D.C. (2D6)</li>
      <li>+2 initiative, +2 roll with punch/fall/impact</li>
      <li>Credits: <strong>${credits.toLocaleString()}</strong> + jewelry worth <strong>${jewelry.toLocaleString()}</strong> cr (in Black Market)</li>
    </ul>
    <p><strong>Player still needs to:</strong></p>
    <ul>
      <li>Verify I.Q. 9 / M.A. 10 / P.B. 12+ (after the M.A. bonus)</li>
      <li>Select 2 Rogue + 6 other Related Skills${choices.hth !== "Hand to Hand: Basic" ? " (minus the HtH upgrade cost)" : ""}, and Secondary Skills per the card</li>
      <li>Fill in Seduction and Lore base percentages; +10% Charm/Impress if P.B. 20+</li>
      <li>Fill in pistol/derringer stats; XP table pending</li>
    </ul>
  `
});
