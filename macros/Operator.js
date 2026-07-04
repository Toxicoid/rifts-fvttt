// ============================================================
// RIFTS RPG - Operator O.C.C. Setup Macro
// VERIFIED vs Rifts Ultimate Edition p.91-92 + XP table p.295
// (Operator & Wilderness Scout table).
//
// RUN ORDER: roll/enter attributes FIRST — and run any RACE
// macro (e.g. Grackle Tooth) BEFORE this one. This macro
// INCREMENTS attributes, A.P.M. and S.D.C. so racial rolls
// and bonuses are preserved.
// ============================================================

const actor = canvas.tokens.controlled[0]?.actor ?? game.user.character;

if (!actor) {
  ui.notifications.warn("Please select a token or assign a character first.");
  return;
}

const confirmed = await Dialog.confirm({
  title: "Operator O.C.C.",
  content: `
    <p>This will set up <strong>${actor.name}</strong> as an <strong>Operator O.C.C.</strong></p>
    <ul>
      <li>Attribute requirement: I.Q. 9+ (high P.P./P.S. handy, not mandatory)</li>
      <li><strong>ADDS</strong> +1 I.Q., +2 P.S., +1 P.P., +2D6+6 S.D.C., +2 A.P.M. to current values</li>
      <li>Adds OCC skills, special abilities, equipment and rolled money</li>
    </ul>
    <p><em><strong>Run AFTER rolling attributes and AFTER any race macro (e.g. Grackle Tooth)</strong> — bonuses stack on current values. Existing items will not be deleted.</em></p>
  `
});

if (!confirmed) return;

// ── 1. CHOICE DIALOG ──────────────────────────────────────
const choices = await new Promise((resolve) => {
  new Dialog({
    title: "Operator — O.C.C. Choices",
    content: `
      <style>
        .op-form .cf-section { margin: 6px 0 2px; font-weight: bold; border-bottom: 1px solid #999; }
        .op-form .cf-row { display: flex; align-items: center; gap: 6px; margin: 3px 0; }
        .op-form .cf-row label { flex: 0 0 46%; font-size: 12px; }
        .op-form .cf-row input, .op-form .cf-row select { flex: 1; }
        .op-form input.cf-drop { border-style: dashed; }
        .op-form input.cf-drop.cf-dropped { border-style: solid; border-color: #e8751a; }
        .op-form .cf-hint { font-size: 11px; font-style: italic; opacity: 0.8; margin: 2px 0; }
      </style>
      <form class="op-form">
        <p class="cf-hint">Dashed fields accept drag &amp; drop from a compendium or the Items sidebar. Typing a name still works.</p>
        <div class="cf-section">Skills</div>
        <div class="cf-row"><label>Language: Other (+20%)</label><input type="text" name="lang" placeholder="e.g. Techno-Can"/></div>
        <div class="cf-row"><label>Pilot #1 (+15%)</label><input type="text" name="pilot1" placeholder="e.g. Pilot: Automobile"/></div>
        <div class="cf-row"><label>Pilot #2 (+15%)</label><input type="text" name="pilot2" placeholder="e.g. Pilot: Truck"/></div>
        <div class="cf-row"><label>Pilot #3 (+15%)</label><input type="text" name="pilot3" placeholder="e.g. Pilot: Hovercycle"/></div>
        <div class="cf-row"><label>W.P. Modern (choice)</label><input type="text" name="wpModern" placeholder="e.g. W.P. Energy Rifle"/></div>
        <div class="cf-row"><label>Hand to Hand</label>
          <select name="hth">
            <option value="Hand to Hand: Basic">Basic</option>
            <option value="Hand to Hand: Expert">Expert (costs 1 Related Skill)</option>
            <option value="Hand to Hand: Martial Arts">Martial Arts (costs 2 Related Skills)</option>
            <option value="Hand to Hand: Assassin">Assassin (evil only, costs 2 Related Skills)</option>
          </select>
        </div>
        <div class="cf-row"><label>Psi-Operator (optional, 15-20% of Operators)</label>
          <select name="psi">
            <option value="no">No</option>
            <option value="yes">Yes — Major psychic (halves Related Skills)</option>
          </select>
        </div>

        <div class="cf-section">Lifestyle &amp; Money</div>
        <div class="cf-row"><label>Operator type</label>
          <select name="opType">
            <option value="wandering">Wandering (5D6x100 cr + 3D4x1,000 BM)</option>
            <option value="city">City (4D4x1,000 cr)</option>
          </select>
        </div>

        <div class="cf-section">Gear</div>
        <div class="cf-row"><label>M.D. Body Armor (light/medium)</label><input type="text" name="armor" class="cf-drop" placeholder="+10% MDC from Operator buddy"/></div>
        <div class="cf-row"><label>W.P. Modern weapon</label><input type="text" name="modernWeapon" class="cf-drop" placeholder="One weapon for the chosen W.P."/></div>
      </form>
    `,
    render: (html) => {
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
            lang: val("lang"),
            pilots: [val("pilot1"), val("pilot2"), val("pilot3")],
            wpModern: val("wpModern"),
            hth: val("hth") || "Hand to Hand: Basic",
            psi: val("psi") === "yes",
            opType: val("opType") || "wandering",
            armor: pick("armor"),
            modernWeapon: pick("modernWeapon"),
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

// ── 2. ROLLS ──────────────────────────────────────────────
async function rollAttr(formula) {
  const r = new Roll(formula);
  await r.evaluate();
  return r.total;
}

const sdcBonus     = await rollAttr("2d6 + 6");   // +2D6+6 S.D.C.
const doctorGloves = await rollAttr("1d4");       // 1D4 pairs of thin doctor's gloves
let credits, blackMarket;
if (choices.opType === "city") {
  credits = await rollAttr("4d4 * 1000");         // City Operator: 4D4x1,000
  blackMarket = 0;
} else {
  credits = await rollAttr("5d6 * 100");          // Wandering: 5D6x100
  blackMarket = await rollAttr("3d4 * 1000");     // + 3D4x1,000 BM saleable items
}

// ── 3. IDENTITY, INCREMENTED BONUSES, MONEY ───────────────
const sys = actor.system;
await actor.update({
  "system.identity.occ": "Operator",
  "system.identity.occType": "Adventurer / Scholar",
  // O.C.C. Bonuses — INCREMENTED so racial rolls/bonuses are preserved:
  "system.attributes.iq.value": (sys.attributes.iq.value ?? 10) + 1,   // +1 I.Q.
  "system.attributes.ps.value": (sys.attributes.ps.value ?? 10) + 2,   // +2 P.S.
  "system.attributes.pp.value": (sys.attributes.pp.value ?? 10) + 1,   // +1 P.P.
  "system.health.sdc.value": (sys.health.sdc.value ?? 0) + sdcBonus,   // +2D6+6 S.D.C.
  "system.health.sdc.max": (sys.health.sdc.max ?? 0) + sdcBonus,
  "system.combat.attacksPerMelee": (sys.combat.attacksPerMelee ?? 2) + 2, // HtH training: +2 over base
  "system.saves.diseaseBonus": (sys.saves.diseaseBonus ?? 0) + 2,      // +2 vs disease (fatigue: see card)
  "system.money.credits": credits,
  "system.money.blackMarket": blackMarket,
});

// ── 4. OCC SKILLS ─────────────────────────────────────────
// Base % = RUE base + OCC bonus already applied. VERIFY base values vs book.
const named = (s, fallback) => s || fallback;
const occSkills = [
  { name: "Language: Native",                     category: "communications", basePercent: 92, perLevelBonus: 0, notes: "Operator native tongue is 92% (book)" },
  { name: `Language: ${named(choices.lang, "Other (choice)")}`, category: "communications", basePercent: 70, perLevelBonus: 3, notes: "Base 50% +20% OCC bonus" },
  { name: "Mathematics: Basic",                   category: "science",        basePercent: 65, perLevelBonus: 5, notes: "Base 45% +20% OCC bonus" },
  { name: "Computer Operation",                   category: "technical",      basePercent: 50, perLevelBonus: 5, notes: "Base 40% +10% OCC bonus" },
  { name: "Computer Repair",                      category: "technical",      basePercent: 40, perLevelBonus: 5, notes: "Base 30% +10% OCC bonus" },
  { name: "Electrical Engineer",                  category: "electrical",     basePercent: 55, perLevelBonus: 5, notes: "Base 35% +20% OCC bonus" },
  { name: "Find Contraband",                      category: "rogue",          basePercent: 41, perLevelBonus: 4, notes: "Base 26% +15% OCC bonus. +20% more for machine parts/components (see Find Parts ability)" },
  { name: "Jury-Rig",                             category: "technical",      basePercent: 45, perLevelBonus: 5, notes: "Base 25% +20% OCC bonus — VERIFY base. Temporary repairs in half the time, lasting twice as long" },
  { name: "Mechanical Engineer",                  category: "mechanical",     basePercent: 45, perLevelBonus: 5, notes: "Base 25% +20% OCC bonus" },
  { name: named(choices.pilots[0], "Pilot: Choice #1"), category: "pilot",    basePercent: 0, perLevelBonus: 0, notes: "Enter chosen vehicle's base % +15% OCC bonus" },
  { name: named(choices.pilots[1], "Pilot: Choice #2"), category: "pilot",    basePercent: 0, perLevelBonus: 0, notes: "Enter chosen vehicle's base % +15% OCC bonus" },
  { name: named(choices.pilots[2], "Pilot: Choice #3"), category: "pilot",    basePercent: 0, perLevelBonus: 0, notes: "Enter chosen vehicle's base % +15% OCC bonus" },
  { name: "Radio: Basic",                         category: "communications", basePercent: 60, perLevelBonus: 5, notes: "Base 45% +15% OCC bonus" },
  { name: "Sensory Equipment",                    category: "pilotRelated",   basePercent: 50, perLevelBonus: 5, notes: "Base 30% +20% OCC bonus" },
  { name: "Weapons Engineer",                     category: "military",       basePercent: 40, perLevelBonus: 5, notes: "Base 25% +15% OCC bonus" },
  { name: "Recognize Machine Quality",            category: "technical",      basePercent: 58, perLevelBonus: 3, notes: "EXCLUSIVE Operator skill (book: 58% +3%/level). New/used, defective, rebuilt, quality, fair price" },
  { name: "W.P. Blunt",                           category: "weaponProficiency", basePercent: 0, perLevelBonus: 0, notes: "Includes large wrench and hammer (each 2D6 S.D.C.)" },
  { name: named(choices.wpModern, "W.P. Modern (choice)"), category: "weaponProficiency", basePercent: 0, perLevelBonus: 0, notes: "Modern W.P. of choice" },
  { name: choices.hth,                            category: "military",       basePercent: 0, perLevelBonus: 0, notes: choices.hth === "Hand to Hand: Basic" ? "4 attacks/melee at level 1. Upgradable at creation: Expert (1 Related Skill), Martial Arts or Assassin if evil (2 Related Skills)" : "4 attacks/melee at level 1. Remember the Related Skill cost of this upgrade" },
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

// ── 5. GEAR ───────────────────────────────────────────────
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

const gearItems = [];

// Body armor (+10% MDC buddy bonus)
if (choices.armor.uuid) {
  const obj = await cloneFromUuid(choices.armor.uuid);
  if (obj) {
    obj.system.notes = ["+10% more M.D.C. provided by an Operator buddy — adjust values up 10%.", obj.system.notes].filter(Boolean).join(" ");
    gearItems.push(obj);
  }
} else {
  gearItems.push({
    name: choices.armor.name || "Light or Medium M.D. Body Armor (choice)",
    type: "armor",
    system: {
      dcType: "MDC", ar: 0,
      main: { value: 0, max: 0 }, helmet: { value: 0, max: 0 },
      arms: { value: 0, max: 0 }, legs: { value: 0, max: 0 },
      hands: { value: 0, max: 0 }, forearms: { value: 0, max: 0 }, feet: { value: 0, max: 0 },
      mobility: "Good", weight: "", cost: 0, prowlPenalty: 0,
      description: "A suit of light or medium M.D.C. body armor with good flexibility.",
      notes: "+10% more M.D.C. provided by an Operator buddy — fill in stats, then adjust up 10%.",
    },
  });
}

// W.P. weapons
gearItems.push(
  { name: "Large Wrench", type: "weapon", system: { damage: "2d6", damageType: "SDC", range: "melee", rateOfFire: "1", payload: 0, bonusToStrike: 0, notes: "W.P. Blunt weapon — also a tool" } },
  { name: "Hammer",       type: "weapon", system: { damage: "2d6", damageType: "SDC", range: "melee", rateOfFire: "1", payload: 0, bonusToStrike: 0, notes: "W.P. Blunt weapon — also a tool" } },
);
if (choices.modernWeapon.uuid) {
  const obj = await cloneFromUuid(choices.modernWeapon.uuid);
  if (obj) gearItems.push(obj);
} else {
  gearItems.push({
    name: choices.modernWeapon.name || "W.P. Modern Weapon (choice)",
    type: "weapon",
    system: { damage: "varies", damageType: "MDC", range: "varies", rateOfFire: "varies", payload: 0, bonusToStrike: 0, notes: "One weapon for the chosen Modern W.P. Fill in stats." },
  });
}
gearItems.push(
  { name: "Knives (couple)", type: "weapon", system: { damage: "1d4", damageType: "SDC", range: "melee/thrown", rateOfFire: "1", payload: 0, bonusToStrike: 0, notes: "" } },
);

// ── 6. STANDARD EQUIPMENT ────────────────────────────────
const equipmentItems = [
  { name: "Portable Tool Kit (electric screwdriver + heads, wrenches)", type: "equipment", system: { quantity: 1, weight: "3 lbs", cost: 0, notes: "Interchangeable heads and additional attachments" } },
  { name: "Large Tool Kit",             type: "equipment", system: { quantity: 1, weight: "10 lbs", cost: 0, notes: "" } },
  { name: "Soldering Iron",             type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Laser Torch",                type: "equipment", system: { quantity: 1, weight: "2 lbs", cost: 0, notes: "For welding" } },
  { name: "Duct Tape (roll)",           type: "equipment", system: { quantity: 1, weight: "0.5 lbs", cost: 0, notes: "" } },
  { name: "Electrical Tape",            type: "equipment", system: { quantity: 2, weight: "", cost: 0, notes: "Two rolls" } },
  { name: "Pen Flashlight",             type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
  { name: "Large Flashlight",           type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Flares",                     type: "equipment", system: { quantity: 12, weight: "0.5 lbs", cost: 0, notes: "A dozen" } },
  { name: "Super Lightweight Rope (200 ft)", type: "equipment", system: { quantity: 1, weight: "10 lbs", cost: 0, notes: "60 m total, 10 lbs / 4.5 kg" } },
  { name: "Notebook",                   type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
  { name: "Portable Disc Recorder",     type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Portable Language Translator", type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Protective Goggles",         type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
  { name: "Work Gloves",                type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
  { name: `Thin Doctor's Gloves x${doctorGloves} pairs`, type: "equipment", system: { quantity: doctorGloves, weight: "", cost: 0, notes: `1D4 rolled: ${doctorGloves} pairs` } },
  { name: "Backpack",                   type: "equipment", system: { quantity: 1, weight: "2 lbs", cost: 0, notes: "" } },
  { name: "Satchel",                    type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Large Sack",                 type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
  { name: "Canteens",                   type: "equipment", system: { quantity: 2, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Commercial Vehicles (two, as per Pilot skills)", type: "equipment", system: { quantity: 2, weight: "", cost: 0, notes: "Consider building each as a Vehicle actor (e.g. Briggs's Jeep)" } },
  { name: "Work Clothes & Overalls",    type: "equipment", system: { quantity: 1, weight: "3 lbs", cost: 0, notes: "" } },
  { name: "Utility Belt",               type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Goggles (pair)",             type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
  { name: "Air Filter",                 type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
  { name: "Pocket Note Pad & Two Pens", type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
  { name: "Personal Items",             type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "More expensive diagnostic equipment, computers, optical enhancements and sensory equipment may be purchased later" } },
];

// ── 7. OCC ABILITY CARDS ──────────────────────────────────
const occAbilities = [
  {
    name: "O.C.C. Bonuses & Limits",
    type: "occ_ability",
    system: {
      level: 1,
      description: `Applied to sheet: +1 I.Q., +2 P.S., +1 P.P., +${sdcBonus} S.D.C. (2D6+6 rolled), +2 save vs disease.\nApply manually when relevant: +2 on Perception Rolls, +2 to save vs fatigue.\n\nLIMITS: None of the special Operator abilities apply to bionics or cybernetics (can't do it). -20% skill penalty when working on robots and power armor (unless the character also has the Robot Mechanics and Electronics skills).\nCybernetics: None to start; most Operators prefer to use machines, not become one.`,
    },
  },
  {
    name: "Jury-Rig Repairs",
    type: "occ_ability",
    system: {
      level: 1,
      description: "The Operator can slap together solid temporary repairs in HALF the time, and they last TWICE as long. See the Jury-Rig skill for details.",
    },
  },
  {
    name: "Find Parts & Components",
    type: "occ_ability",
    system: {
      level: 1,
      description: "+20% to Find Contraband related to vehicular M.D. weapons, M.D.C. materials, power supplies, communications systems, electronics, generators, fuel, mechanical parts and components (added to normal Find Contraband when such items are involved).\n\nDiscounts: 30% off as professional courtesy from most other Operators and the Black Market; 50% from junkyards and salvage companies; 65% if he trades at least 12 hours of his time working at a garage, machine shop or factory for free. Every 12 hours he puts in, he can get up to 100,000 credits worth of parts or materials at the discount (35,000 credits his cost).",
    },
  },
  {
    name: "Repair & Soup-Up Machines & Vehicles",
    type: "occ_ability",
    system: {
      level: 1,
      description: "REPAIRS FOR CHEAP: Completely repair most parts, machines and vehicles at 25% of original list price (plus his time if charging — typically another 30-50%). Requires the right parts and time.\n\nREPLACE M.D.C.: Main body and key sections at 1,200 credits per M.D.C. point restored. Cannot exceed the original M.D.C. amount.\n\nADD M.D.C.: To brand new vehicles and body armor. Percentage increase depends on level: +5% at levels 2, 4, 6, 8, 10, 12, and 14.\n\nMAXIMIZE PERFORMANCE: Tweak a vehicle or most any machine — increase Spd 20%, range (of weapons, radio signals, sensors, etc.) by 10%, reduce weight by 10%, and add one extra weapon or feature per body area of a vehicle or standing fortification (front/nose, mid-section, rear, top/roof, bottom/undercarriage, and wing).",
    },
  },
  {
    name: "O.C.C. Related Skills",
    type: "occ_ability",
    system: {
      level: 1,
      description: `Select EIGHT other skills${choices.psi ? " — HALVED to FOUR (Psi-Operator)" : ""}, but at least TWO must be from Mechanical. +2 additional skills at levels 3, 6, 9 and 12. All new skills start at level one proficiency.\n\nAllowed categories:\n• Communications: Any (+15%)\n• Cowboy: None\n• Domestic: Any\n• Electrical: Any (+10%)\n• Espionage: None\n• Horsemanship: None\n• Mechanical: Any (+10%)\n• Medical: First Aid only\n• Military: Any (+5%; +10% to Field Armorer and Military Fortification)\n• Physical: Any except Acrobatics, Gymnastics or Wrestling (+10% to SCUBA)\n• Pilot: Any (+10%)\n• Pilot Related: Any (+10%)\n• Rogue: Computer Hacking, Lock Picking, and Roadwise only (+15%)\n• Science: Math: Advanced, Chemistry, and Chemistry: Analytical only (+5%)\n• Technical: Any (+10%)\n• W.P.: Any\n• Wilderness: Boat Building and Carpentry (+5%) only\n\nNote: Hand to Hand upgrades cost Related Skills — Expert: 1, Martial Arts/Assassin: 2.`,
    },
  },
  {
    name: "Secondary Skills",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Select FOUR Secondary Skills at level 1 from the Secondary Skills list; +1 additional at levels 4, 8, 12 and 14. No bonuses apply (other than possible I.Q. bonus). All start at base skill level.",
    },
  },
  {
    name: "Experience Table",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Level 1: 0-1,900\nLevel 2: 1,901-3,800\nLevel 3: 3,801-7,300\nLevel 4: 7,301-14,300\nLevel 5: 14,301-21,000\nLevel 6: 21,001-30,000\nLevel 7: 30,001-40,000\nLevel 8: 40,001-53,000\nLevel 9: 53,001-73,000\nLevel 10: 73,001-103,000\nLevel 11: 103,001-138,000\nLevel 12: 138,001-188,000\nLevel 13: 188,001-238,000\nLevel 14: 238,001-288,000\nLevel 15: 288,001-328,000\n(Operator & Wilderness Scout table, RUE p.295 — VERIFIED)",
    },
  },
];

if (choices.psi) {
  occAbilities.push({
    name: "Psi-Operator (Major Psychic)",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Approximately 15-20% of Operators are psychic; their psychic focus is mechanics. All Psi-Operators are MAJOR psychics. O.C.C. Related Skills are HALVED.\n\nPick THREE abilities from the list below, plus one additional at levels 4, 8, and 12:\n• Electrokinesis (Super, varies; counts as 2 selections)\n• Machine Ghost (12)\n• Object Read (6; limited to the history and operation of the device)\n• Resist Fatigue (4)\n• Sense Magic (3)\n• Sense Time (2)\n• Speed Reading (2)\n• Total Recall (2)\n• Telemechanics (Super, 10)\n• Telemechanic Mental Operation (Super, 12; counts as 2 selections)\n• Telemechanic Paralysis (Super, 20; counts as 2 selections)\n\nSet I.S.P. per Major psychic rules.",
    },
  });
}

// ── 8. CREATE ALL ITEMS ───────────────────────────────────
const allItems = [...occSkillItems, ...gearItems, ...equipmentItems, ...occAbilities];
await actor.createEmbeddedDocuments("Item", allItems);

// ── 9. DONE ───────────────────────────────────────────────
ui.notifications.info(`${actor.name} has been set up as an Operator O.C.C.!`);

ChatMessage.create({
  speaker: { alias: "OCC Setup" },
  content: `
    <h2>🔧 Operator O.C.C.</h2>
    <p><strong>${actor.name}</strong> is now an Operator${choices.psi ? " (Psi-Operator)" : ""}.</p>
    <hr>
    <p><strong>Rolled &amp; applied (ADDED to current values):</strong></p>
    <ul>
      <li>+1 I.Q., +2 P.S., +1 P.P. — applied to attributes</li>
      <li>+${sdcBonus} S.D.C. (2D6+6)</li>
      <li>+2 A.P.M. (Hand to Hand training over base)</li>
      <li>Credits: <strong>${credits.toLocaleString()}</strong>${blackMarket ? ` + Black Market items worth <strong>${blackMarket.toLocaleString()}</strong> cr` : ""} (${choices.opType} Operator)</li>
    </ul>
    <p><strong>Player still needs to:</strong></p>
    <ul>
      <li>Verify I.Q. is 9+ (after the +1)</li>
      <li>Select ${choices.psi ? "4 (halved)" : "8"} O.C.C. Related Skills — at least 2 from Mechanical${choices.hth !== "Hand to Hand: Basic" ? ", minus the HtH upgrade cost" : ""}</li>
      <li>Select 4 Secondary Skills</li>
      <li>Fill in Pilot skill base percentages and any gear placeholders</li>
      <li>Detail the two commercial vehicles (build as Vehicle actors!)</li>
      ${choices.psi ? "<li>Pick 3 Psi-Operator abilities and set I.S.P.</li>" : ""}
    </ul>
    <p><em>If this character has a race macro (e.g. Grackle Tooth), it should have been run BEFORE this one.</em></p>
  `
});
