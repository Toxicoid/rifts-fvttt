// ============================================================
// RIFTS RPG - Special Forces O.C.C. Setup Macro
// (Rifts Mercenaries, by C.J. Carella)
// VERIFIED vs uploaded book text. XP table pending — book may
// direct to the CS Military Specialist table (already logged).
// ============================================================

// Target: a drag-and-drop creation item sets riftsCreationTarget;
// otherwise fall back to the selected token / assigned character.
const actor = globalThis.riftsCreationTarget
  ?? canvas.tokens.controlled[0]?.actor
  ?? game.user.character;

if (!actor) {
  ui.notifications.warn("Please select a token or assign a character first.");
  return;
}

if (actor.type !== "character" && actor.type !== "npc") {
  ui.notifications.warn(`${actor.name} is a ${actor.type} actor. Race/O.C.C./Chassis setups apply to Character and NPC actors only.`);
  return;
}

const confirmed = await Dialog.confirm({
  title: "Special Forces O.C.C.",
  content: `
    <p>This will set up <strong>${actor.name}</strong> as a <strong>Special Forces O.C.C.</strong> (Mercenaries)</p>
    <ul>
      <li>Attribute requirements: P.S. 10, P.P. 10, I.Q. 10</li>
      <li>Applies +2 initiative, +2 roll w/ impact, +2 pull punch</li>
      <li>OCC skills, equipment (incl. robot vehicle OR power armor), rolled money &amp; cybernetics</li>
    </ul>
    <p><em>Existing items will not be deleted.</em></p>
  `
});

if (!confirmed) return;

// ── 1. CHOICE DIALOG ──────────────────────────────────────
const choices = await new Promise((resolve) => {
  new Dialog({
    title: "Special Forces — O.C.C. Choices",
    content: `
      <style>
        .sf-form .cf-section { margin: 6px 0 2px; font-weight: bold; border-bottom: 1px solid #999; }
        .sf-form .cf-row { display: flex; align-items: center; gap: 6px; margin: 3px 0; }
        .sf-form .cf-row label { flex: 0 0 46%; font-size: 12px; }
        .sf-form .cf-row input, .sf-form .cf-row select { flex: 1; }
        .sf-form input.cf-drop { border-style: dashed; }
        .sf-form input.cf-drop.cf-dropped { border-style: solid; border-color: #e8751a; }
        .sf-form .cf-hint { font-size: 11px; font-style: italic; opacity: 0.8; margin: 2px 0; }
      </style>
      <form class="sf-form">
        <p class="cf-hint">Dashed fields accept drag &amp; drop from a compendium or the Items sidebar — dropped items are copied with full stats. Typing a name still works.</p>
        <div class="cf-section">Skills</div>
        <div class="cf-row"><label>Literacy: choice of one (+10%)</label><input type="text" name="literacy" placeholder="e.g. Literacy: American"/></div>
        <div class="cf-row"><label>Hand to Hand</label>
          <select name="hth">
            <option value="Hand to Hand: Expert">Expert</option>
            <option value="Hand to Hand: Martial Arts">Martial Arts (costs 1 Related Skill)</option>
            <option value="Hand to Hand: Assassin">Assassin (evil only, costs 1 Related Skill)</option>
          </select>
        </div>

        <div class="cf-section">Robot Vehicle or Power Armor (owns one)</div>
        <div class="cf-row"><label>Type</label>
          <select name="rideType">
            <option value="Power Armor">Power Armor suit</option>
            <option value="Robot Vehicle">Robot Vehicle</option>
          </select>
        </div>
        <div class="cf-row"><label>Which one</label><input type="text" name="ride" class="cf-drop" placeholder="e.g. SAMAS, Titan Combat Robot"/></div>

        <div class="cf-section">Signature Gear</div>
        <div class="cf-row"><label>M.D. Body Armor (light or heavy)</label><input type="text" name="armor" class="cf-drop" placeholder="Personalized; CS armor allowed"/></div>
        <div class="cf-row"><label>Energy Handgun</label><input type="text" name="handgun" class="cf-drop"/></div>
        <div class="cf-row"><label>Energy Rifle</label><input type="text" name="rifle" class="cf-drop"/></div>
        <div class="cf-row"><label>Additional Weapon #1</label><input type="text" name="extra1" class="cf-drop"/></div>
        <div class="cf-row"><label>Additional Weapon #2</label><input type="text" name="extra2" class="cf-drop"/></div>
        <div class="cf-row"><label>Additional Weapon #3</label><input type="text" name="extra3" class="cf-drop"/></div>
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
            literacy: val("literacy"),
            hth: val("hth") || "Hand to Hand: Expert",
            rideType: val("rideType") || "Power Armor",
            ride: pick("ride"),
            armor: pick("armor"),
            weapons: [
              { slot: "Energy Handgun", ...pick("handgun") },
              { slot: "Energy Rifle", ...pick("rifle") },
              { slot: "Additional Weapon", ...pick("extra1") },
              { slot: "Additional Weapon", ...pick("extra2") },
              { slot: "Additional Weapon", ...pick("extra3") },
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

// ── 2. ROLLS ──────────────────────────────────────────────
async function rollAttr(formula) {
  const r = new Roll(formula);
  await r.evaluate();
  return r.total;
}

const credits     = await rollAttr("1d6 * 1000");  // 1D6x1,000 credits
const blackMarket = await rollAttr("1d6 * 1000");  // black market item worth 1D6x1,000
const grenades    = await rollAttr("1d6");         // 1D6 grenades
const cyberCount  = await rollAttr("1d6");         // up to 1D6 cybernetic implants

// ── 3. IDENTITY, BONUSES, MONEY ───────────────────────────
await actor.update({
  "system.identity.occ": "Special Forces",
  "system.identity.occType": "Men at Arms (Mercenaries)",
  "system.combat.initiativeBonus": 2,     // OCC bonus: +2 on initiative
  "system.combat.rollBonus": 2,           // OCC bonus: +2 roll with impact/fall
  "system.combat.pullPunchBonus": 2,      // OCC bonus: +2 pull punch
  "system.combat.attacksPerMelee": 4,     // Hand to Hand training base
  "system.money.credits": credits,
  "system.money.blackMarket": blackMarket,
});

// ── 4. OCC SKILLS ─────────────────────────────────────────
// Base % = book base + OCC bonus already applied. VERIFY base values vs book.
const named = (s, fallback) => s || fallback;
const occSkills = [
  { name: "Radio: Basic",                             category: "communications", basePercent: 55, perLevelBonus: 5, notes: "Base 45% +10% OCC bonus" },
  { name: named(choices.literacy, "Literacy (choice)"), category: "communications", basePercent: 40, perLevelBonus: 5, notes: "Base 30% +10% OCC bonus" },
  { name: "Computer Operation",                       category: "technical",      basePercent: 45, perLevelBonus: 5, notes: "Base 40% +5% OCC bonus" },
  { name: "Intelligence",                             category: "espionage",      basePercent: 47, perLevelBonus: 4, notes: "Base 32% +15% OCC bonus" },
  { name: "Pilot: Robots and Power Armor",            category: "pilot",          basePercent: 76, perLevelBonus: 3, notes: "Base 76% — VERIFY vs book" },
  { name: "Pilot: Robot Combat: Elite",               category: "pilot",          basePercent: 0,  perLevelBonus: 0, notes: "Elite combat training for the owned robot/PA type — grants combat bonuses per machine" },
  { name: "Pilot: Tank",                              category: "pilot",          basePercent: 66, perLevelBonus: 3, notes: "Base 56% +10% OCC bonus — VERIFY base vs book (Tanks & APCs convention)" },
  { name: "Weapon Systems",                           category: "military",       basePercent: 55, perLevelBonus: 5, notes: "Base 40% +15% OCC bonus" },
  { name: "Read Sensory Equipment",                   category: "pilotRelated",   basePercent: 40, perLevelBonus: 5, notes: "Base 30% +10% OCC bonus" },
  { name: "Running",                                  category: "physical",       basePercent: 0,  perLevelBonus: 0, notes: "Increases Spd and endurance" },
  { name: "W.P. Energy Pistol",                       category: "weaponProficiency", basePercent: 0, perLevelBonus: 0, notes: "Grants +1 strike per 3 levels" },
  { name: "W.P. Energy Rifle",                        category: "weaponProficiency", basePercent: 0, perLevelBonus: 0, notes: "Grants +1 strike per 3 levels" },
  { name: choices.hth,                                category: "military",       basePercent: 0, perLevelBonus: 0, notes: choices.hth === "Hand to Hand: Expert" ? "4 attacks/melee. Upgradable to Martial Arts (or Assassin if evil) for ONE O.C.C. Related Skill" : "4 attacks/melee. Upgrade cost: remember to select one fewer O.C.C. Related Skill" },
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

// ── 5. GEAR (drag & drop clones or placeholders) ──────────
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

// Body armor
if (choices.armor.uuid) {
  const obj = await cloneFromUuid(choices.armor.uuid);
  if (obj) gearItems.push(obj);
} else {
  gearItems.push({
    name: choices.armor.name || "Personalized M.D. Body Armor (light or heavy, choice)",
    type: "armor",
    system: {
      dcType: "MDC", ar: 0,
      main: { value: 0, max: 0 }, helmet: { value: 0, max: 0 },
      arms: { value: 0, max: 0 }, legs: { value: 0, max: 0 },
      hands: { value: 0, max: 0 }, forearms: { value: 0, max: 0 }, feet: { value: 0, max: 0 },
      mobility: "Good", weight: "", cost: 0, prowlPenalty: 0,
      description: "A suit of personalized light or heavy Mega-Damage body armor, including Coalition armor.",
      notes: "Fill in stats for the chosen armor.",
    },
  });
}

// Robot vehicle or power armor — recorded as equipment (build a Vehicle actor for robot vehicles)
gearItems.push({
  name: `${choices.ride.name || `${choices.rideType} (choice)`}`,
  type: "equipment",
  system: {
    quantity: 1, weight: "", cost: 0,
    notes: `Owned ${choices.rideType}. ${choices.rideType === "Robot Vehicle" ? "Consider building this as a Vehicle actor for MDC-by-location and mounted weapons." : "GM option: may instead be a light, quick power armor, ideally with flight capabilities."} Pilot: Robots and Power Armor + Robot Combat: Elite apply.`,
  },
});

// Choice weapons
for (const w of choices.weapons) {
  if (w.uuid) {
    const obj = await cloneFromUuid(w.uuid);
    if (obj) {
      obj.system.notes = [`${w.slot}.`, obj.system.notes].filter(Boolean).join(" ");
      gearItems.push(obj);
      continue;
    }
  }
  gearItems.push({
    name: w.name || `${w.slot} (choice)`,
    type: "weapon",
    system: {
      damage: "varies", damageType: "MDC", range: "varies", rateOfFire: "varies",
      payload: 0, bonusToStrike: 0,
      notes: `${w.slot}. Fill in stats.`,
    },
  });
}

// ── 6. STANDARD EQUIPMENT ────────────────────────────────
const equipmentItems = [
  { name: "Dress Clothing",           type: "equipment", system: { quantity: 1, weight: "2 lbs", cost: 0, notes: "" } },
  { name: "Camouflage Clothing",      type: "equipment", system: { quantity: 1, weight: "2 lbs", cost: 0, notes: "For covert operations" } },
  { name: "Gas Mask & Air Filter",    type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Tinted Goggles",           type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
  { name: "NG-S2 Basic Survival Pack", type: "equipment", system: { quantity: 1, weight: "20 lbs", cost: 0, notes: "Northern Gun survival pack — tent, sleeping bag, flashlight, mirror, compass, distancer, first aid kit, saw wires, fire starter, rations, water filter, etc." } },
  { name: `Grenades x${grenades}`,    type: "equipment", system: { quantity: grenades, weight: "1 lb", cost: 0, notes: `1D6 rolled: ${grenades} grenades (type per GM)` } },
  { name: "Hand-Held Computer",       type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Robot Medical Kit",        type: "equipment", system: { quantity: 1, weight: "5 lbs", cost: 0, notes: "" } },
  { name: "IRMSS",                    type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "Internal Robot Medical Surgeon System" } },
  { name: "Grappling Hook",           type: "equipment", system: { quantity: 1, weight: "2 lbs", cost: 0, notes: "" } },
  { name: "Handcuffs (pair)",         type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Rope (50 ft)",             type: "equipment", system: { quantity: 1, weight: "5 lbs", cost: 0, notes: "15.2 m" } },
];

// Cybernetic implant placeholders (up to 1D6 rolled)
for (let i = 1; i <= cyberCount; i++) {
  equipmentItems.push({
    name: `Cybernetic Implant #${i} (optional choice)`,
    type: "equipment",
    system: { quantity: 1, weight: "", cost: 0, notes: "Up to this many implants allowed, including black market items — player's choice, may take fewer. Pick from Rifts Armory Cyborg > Bionics or the book." },
  });
}

// ── 7. OCC ABILITY CARDS ──────────────────────────────────
const occAbilities = [
  {
    name: "O.C.C. Requirements & Bonuses",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Attribute Requirements: P.S. 10, P.P. 10, I.Q. 10.\nO.C.C. Bonuses (applied to sheet): +2 on initiative, +2 to roll with impact or fall, +2 to pull punch.\n\nSpecial Forces soldiers operate with little support and engage in covert operations — scouting, sabotage, guerrilla training, kidnapping and hostage rescue. The Coalition Military Specialist is a Special Forces class; this O.C.C. applies to non-Coalition armies (Ishpeming, Manistique Imperium, etc.) and ex-military independents.",
    },
  },
  {
    name: "O.C.C. Related Skills",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Select TWELVE other skills, but AT LEAST TWO must be selected from Espionage. Plus select two additional skills at level 3, two at level 6, one at level 9, and one at level 12. All new skills start at level one proficiency.\n\nAllowed categories:\n• Communications: Any (+10%)\n• Domestic: Any\n• Electrical: Any\n• Espionage: Any (+10%)\n• Mechanical: Any (+5%)\n• Medical: Paramedic only\n• Military: Any\n• Physical: Any\n• Pilot: Any\n• Pilot Related: Any (+5%)\n• Rogue: Any (+8%)\n• Science: Math and Chemistry only (+10%)\n• Technical: Any (+5%)\n• W.P.: Any\n• Wilderness: Any\n\nNote: Hand to Hand upgrade to Martial Arts (or Assassin if evil) costs ONE of these skills.",
    },
  },
  {
    name: "Secondary Skills",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Select SIX secondary skills from the Related Skills category list. No bonuses apply — all start at base skill level. Category limitations (any, only, none) apply as listed.",
    },
  },
  {
    name: "Experience Table",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Uses the CS Technical Officer / CS Military Specialist & Shifter table (RUE p.295 — VERIFIED):\nLevel 1: 0-2,120\nLevel 2: 2,121-4,240\nLevel 3: 4,241-8,480\nLevel 4: 8,481-16,960\nLevel 5: 16,961-24,960\nLevel 6: 24,961-34,960\nLevel 7: 34,961-49,960\nLevel 8: 49,961-69,960\nLevel 9: 69,961-94,960\nLevel 10: 94,961-129,960\nLevel 11: 129,961-179,960\nLevel 12: 179,961-229,960\nLevel 13: 229,961-279,960\nLevel 14: 279,961-329,960\nLevel 15: 329,961-389,961",
    },
  },
];

// ── 8. CREATE ALL ITEMS ───────────────────────────────────
const allItems = [...occSkillItems, ...gearItems, ...equipmentItems, ...occAbilities];
await actor.createEmbeddedDocuments("Item", allItems);

// ── 9. DONE ───────────────────────────────────────────────
ui.notifications.info(`${actor.name} has been set up as Special Forces O.C.C.!`);

ChatMessage.create({
  speaker: { alias: "OCC Setup" },
  content: `
    <h2>🪖 Special Forces O.C.C. (Mercenaries)</h2>
    <p><strong>${actor.name}</strong> is now Special Forces.</p>
    <hr>
    <p><strong>Rolled:</strong></p>
    <ul>
      <li>Starting credits: <strong>${credits.toLocaleString()}</strong> (1D6x1,000)</li>
      <li>Black Market item value: <strong>${blackMarket.toLocaleString()}</strong> cr (1D6x1,000)</li>
      <li>Grenades: <strong>${grenades}</strong> (1D6)</li>
      <li>Cybernetic implants allowed: <strong>up to ${cyberCount}</strong> (1D6, optional)</li>
    </ul>
    <p><strong>Player still needs to:</strong></p>
    <ul>
      <li>Verify attributes meet P.S. 10, P.P. 10, I.Q. 10 — no alignment restriction</li>
      <li>Select 12 O.C.C. Related Skills (at least 2 from Espionage${choices.hth !== "Hand to Hand: Expert" ? "; ONE FEWER due to HtH upgrade" : ""})</li>
      <li>Select 6 Secondary Skills</li>
      <li>Detail the owned ${choices.rideType}${choices.rideType === "Robot Vehicle" ? " (consider a Vehicle actor)" : ""}</li>
      <li>Fill in stats for choice weapon/armor placeholders</li>
    </ul>
  `
});
