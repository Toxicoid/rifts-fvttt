// ============================================================
// RIFTS RPG - Assassin O.C.C. Setup Macro (Rifts Mercenaries)
// VERIFIED vs uploaded book text (Secondary Skills line and
// XP table still pending — see ability card placeholders).
// Run on a selected actor. Applies OCC bonuses, skills (with
// choice prompts), equipment (drag & drop enabled), rolled
// money and cybernetics count.
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
  title: "Assassin O.C.C. (Mercenaries)",
  content: `
    <p>This will set up <strong>${actor.name}</strong> as an <strong>Assassin O.C.C.</strong></p>
    <ul>
      <li>Attribute requirements: I.Q. 11, M.E. 10, P.P. 10</li>
      <li><strong>Alignment restricted to Anarchist or Evil only</strong></li>
      <li>Applies +3 initiative, OCC skills, equipment, rolled money &amp; cybernetics</li>
    </ul>
    <p><em>Existing items will not be deleted.</em></p>
  `
});

if (!confirmed) return;

// ── 1. CHOICE DIALOG ──────────────────────────────────────
const choices = await new Promise((resolve) => {
  new Dialog({
    title: "Assassin — O.C.C. Choices",
    content: `
      <style>
        .assn-form .cf-section { margin: 6px 0 2px; font-weight: bold; border-bottom: 1px solid #999; }
        .assn-form .cf-row { display: flex; align-items: center; gap: 6px; margin: 3px 0; }
        .assn-form .cf-row label { flex: 0 0 46%; font-size: 12px; }
        .assn-form .cf-row input, .assn-form .cf-row select { flex: 1; }
        .assn-form input.cf-drop { border-style: dashed; }
        .assn-form input.cf-drop.cf-dropped { border-style: solid; border-color: #e8751a; }
        .assn-form .cf-hint { font-size: 11px; font-style: italic; opacity: 0.8; margin: 2px 0; }
      </style>
      <form class="assn-form">
        <p class="cf-hint">Dashed fields accept drag &amp; drop from a compendium or the Items sidebar — dropped items are copied with full stats. Typing a name still works.</p>
        <div class="cf-section">Skills</div>
        <div class="cf-row"><label>Literacy: choice of one (+10%)</label><input type="text" name="literacy" placeholder="e.g. Literacy: American"/></div>
        <div class="cf-row"><label>Language #1 (+20%)</label><input type="text" name="lang1" placeholder="e.g. Spanish"/></div>
        <div class="cf-row"><label>Language #2 (+20%)</label><input type="text" name="lang2" placeholder="e.g. Techno-Can"/></div>
        <div class="cf-row"><label>W.P. of choice #1</label><input type="text" name="wp1" placeholder="e.g. W.P. Knife"/></div>
        <div class="cf-row"><label>W.P. of choice #2</label><input type="text" name="wp2" placeholder="e.g. W.P. Heavy Energy"/></div>
        <div class="cf-row"><label>W.P. of choice #3</label><input type="text" name="wp3" placeholder="e.g. W.P. Rifles"/></div>
        <div class="cf-row"><label>Hand to Hand</label>
          <select name="hth">
            <option value="Hand to Hand: Assassin">Assassin</option>
            <option value="Hand to Hand: Martial Arts">Martial Arts</option>
          </select>
        </div>

        <div class="cf-section">Signature Gear</div>
        <div class="cf-row"><label>M.D. Body Armor (usually light)</label><input type="text" name="armor" class="cf-drop" placeholder="Personalized armor of choice"/></div>
        <div class="cf-row"><label>Energy Sniper Rifle</label><input type="text" name="sniper" class="cf-drop"/></div>
        <div class="cf-row"><label>Energy Handgun (choice)</label><input type="text" name="handgun" class="cf-drop" placeholder="CS, Triax or contraband"/></div>
        <div class="cf-row"><label>Energy Rifle (choice)</label><input type="text" name="rifle" class="cf-drop" placeholder="CS, Triax or contraband"/></div>
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
            literacy: val("literacy"), lang1: val("lang1"), lang2: val("lang2"),
            wp1: val("wp1"), wp2: val("wp2"), wp3: val("wp3"),
            hth: val("hth") || "Hand to Hand: Assassin",
            armor: pick("armor"),
            weapons: [
              { slot: "Energy Sniper Rifle", ...pick("sniper") },
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

const credits     = await rollAttr("3d6 * 1000");  // 3D6x1,000 credits
const blackMarket = await rollAttr("1d6 * 1000");  // 1D6x1,000 black market items
const knives      = await rollAttr("1d4");         // 1D4 knives
const cyberCount  = await rollAttr("1d6 + 1");     // 1D6+1 cybernetic implants of choice

// ── 3. IDENTITY, BONUSES, MONEY ───────────────────────────
await actor.update({
  "system.identity.occ": "Assassin",
  "system.identity.occType": "Men at Arms (Mercenaries)",
  "system.combat.initiativeBonus": 3,       // OCC bonus: +3 on initiative
  "system.combat.attacksPerMelee": 4,       // Hand to Hand training base
  "system.money.credits": credits,
  "system.money.blackMarket": blackMarket,
});

// ── 4. OCC SKILLS ─────────────────────────────────────────
// Base % = book base + OCC bonus already applied. VERIFY base values vs book.
const named = (s, fallback) => s || fallback;
const occSkills = [
  { name: "Radio: Basic",                            category: "communications", basePercent: 55, perLevelBonus: 5, notes: "Base 45% +10% OCC bonus" },
  { name: named(choices.literacy, "Literacy (choice)"), category: "communications", basePercent: 40, perLevelBonus: 5, notes: "Base 30% +10% OCC bonus" },
  { name: `Language: ${named(choices.lang1, "Choice #1")}`, category: "communications", basePercent: 70, perLevelBonus: 3, notes: "Base 50% +20% OCC bonus" },
  { name: `Language: ${named(choices.lang2, "Choice #2")}`, category: "communications", basePercent: 70, perLevelBonus: 3, notes: "Base 50% +20% OCC bonus" },
  { name: "Detect Ambush",                           category: "espionage",      basePercent: 40, perLevelBonus: 5, notes: "Base 30% +10% OCC bonus" },
  { name: "Intelligence",                            category: "espionage",      basePercent: 42, perLevelBonus: 4, notes: "Base 32% +10% OCC bonus" },
  { name: "Demolitions",                             category: "military",       basePercent: 70, perLevelBonus: 3, notes: "Base 60% +10% OCC bonus" },
  { name: "Demolitions Disposal",                    category: "military",       basePercent: 70, perLevelBonus: 3, notes: "Base 60% +10% OCC bonus" },
  { name: "Tracking",                                category: "espionage",      basePercent: 40, perLevelBonus: 5, notes: "Base 25% +15% OCC bonus" },
  { name: "Sniper",                                  category: "military",       basePercent: 0,  perLevelBonus: 0, notes: "+2 to strike on an aimed shot with any weapon the character has a W.P. for" },
  { name: "Prowl",                                   category: "physical",       basePercent: 45, perLevelBonus: 5, notes: "Base 25% +20% OCC bonus" },
  { name: "Concealment",                             category: "rogue",          basePercent: 32, perLevelBonus: 4, notes: "Base 20% +12% OCC bonus" },
  { name: "Computer Operation",                      category: "technical",      basePercent: 50, perLevelBonus: 5, notes: "Base 40% +10% OCC bonus" },
  { name: "W.P. Energy Pistol",                      category: "weaponProficiency", basePercent: 0, perLevelBonus: 0, notes: "Grants +1 strike per 3 levels" },
  { name: "W.P. Energy Rifle",                       category: "weaponProficiency", basePercent: 0, perLevelBonus: 0, notes: "Grants +1 strike per 3 levels" },
  { name: named(choices.wp1, "W.P. Choice #1"),      category: "weaponProficiency", basePercent: 0, perLevelBonus: 0, notes: "W.P. of choice" },
  { name: named(choices.wp2, "W.P. Choice #2"),      category: "weaponProficiency", basePercent: 0, perLevelBonus: 0, notes: "W.P. of choice" },
  { name: named(choices.wp3, "W.P. Choice #3"),      category: "weaponProficiency", basePercent: 0, perLevelBonus: 0, notes: "W.P. of choice" },
  { name: choices.hth,                               category: "military",       basePercent: 0, perLevelBonus: 0, notes: "4 attacks/melee at level 1" },
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

// ── 5. SIGNATURE GEAR (drag & drop clones or placeholders) ─
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
    name: choices.armor.name || "Personalized M.D. Body Armor (light, choice)",
    type: "armor",
    system: {
      dcType: "MDC", ar: 0,
      main: { value: 0, max: 0 }, helmet: { value: 0, max: 0 },
      arms: { value: 0, max: 0 }, legs: { value: 0, max: 0 },
      hands: { value: 0, max: 0 }, forearms: { value: 0, max: 0 }, feet: { value: 0, max: 0 },
      mobility: "Good", weight: "", cost: 0, prowlPenalty: 0,
      description: "A suit of personalized Mega-Damage body armor, usually light.",
      notes: "Fill in stats for the chosen armor.",
    },
  });
}

// Choice weapons
for (const w of choices.weapons) {
  if (w.uuid) {
    const obj = await cloneFromUuid(w.uuid);
    if (obj) {
      obj.system.notes = [`${w.slot}.`, w.slot !== "Additional Weapon" ? "Includes 6 extra ammo-clips." : "", obj.system.notes].filter(Boolean).join(" ");
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
      notes: `${w.slot}. CS, Triax or contraband allowed.${w.slot !== "Additional Weapon" ? " Includes 6 extra ammo-clips." : ""} Fill in stats.`,
    },
  });
}

// Fixed weapons
gearItems.push(
  { name: "Vibro-Blade",     type: "weapon", system: { damage: "varies", damageType: "MDC", range: "melee", rateOfFire: "1", payload: 0, bonusToStrike: 0, notes: "Fill in blade type/damage (vibro-knife, saber, etc.)" } },
  { name: "Survival Knife",  type: "weapon", system: { damage: "1d6",    damageType: "SDC", range: "melee", rateOfFire: "1", payload: 0, bonusToStrike: 0, notes: "" } },
  { name: `Knives x${knives}`, type: "weapon", system: { damage: "1d4",  damageType: "SDC", range: "melee/thrown", rateOfFire: "1", payload: 0, bonusToStrike: 0, notes: `1D4 rolled: ${knives} knives` } },
);

// ── 6. STANDARD EQUIPMENT ────────────────────────────────
const equipmentItems = [
  { name: "Black Jump Suit",        type: "equipment", system: { quantity: 1, weight: "2 lbs", cost: 0, notes: "" } },
  { name: "Military Fatigues",      type: "equipment", system: { quantity: 1, weight: "2 lbs", cost: 0, notes: "" } },
  { name: "Camouflage Clothing",    type: "equipment", system: { quantity: 1, weight: "2 lbs", cost: 0, notes: "" } },
  { name: "Dress Clothing",         type: "equipment", system: { quantity: 1, weight: "2 lbs", cost: 0, notes: "" } },
  { name: "Small Wardrobe",         type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
  { name: "Gas Mask & Air Filter",  type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Tinted Goggles",         type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
  { name: "Robot Medical Kit",      type: "equipment", system: { quantity: 1, weight: "5 lbs", cost: 0, notes: "" } },
  { name: "IRMSS",                  type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "Internal Robot Medical Surgeon System" } },
  { name: "Knapsack",               type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Backpack",               type: "equipment", system: { quantity: 1, weight: "2 lbs", cost: 0, notes: "" } },
  { name: "Canteen",                type: "equipment", system: { quantity: 1, weight: "1 lb", cost: 0, notes: "" } },
  { name: "Personal Items",         type: "equipment", system: { quantity: 1, weight: "", cost: 0, notes: "" } },
];

// Cybernetic implant placeholders (1D6+1 rolled)
for (let i = 1; i <= cyberCount; i++) {
  equipmentItems.push({
    name: `Cybernetic Implant #${i} (choice)`,
    type: "equipment",
    system: { quantity: 1, weight: "", cost: 0, notes: "Cybernetic implant of choice — pick from the Rifts Armory Cyborg > Bionics folder or the book." },
  });
}

// ── 7. OCC ABILITY CARDS ──────────────────────────────────
const occAbilities = [
  {
    name: "O.C.C. Requirements & Bonuses",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Attribute Requirements: I.Q. 11, M.E. 10, P.P. 10.\nAlignment: RESTRICTED to Anarchist or Evil characters only.\nO.C.C. Bonuses: +3 on initiative (applied to sheet), +1 to save vs mind control (apply manually when relevant).",
    },
  },
  {
    name: "O.C.C. Related Skills",
    type: "occ_ability",
    system: {
      level: 1,
      description: "Select SEVEN other skills. Plus select two additional skills at level 3, two at level 6, one at level 9, and one at level 12. All new skills start at level one proficiency.\n\nAllowed categories:\n• Communications: Any (+5%)\n• Domestic: Any\n• Electrical: Any\n• Espionage: Any (+10%)\n• Mechanical: Any\n• Medical: Paramedic only\n• Military: See O.C.C. skills\n• Physical: Any\n• Pilot: Any (+10%)\n• Pilot Related: Any (+5%)\n• Rogue: Any (+10%)\n\n(Categories not listed above were not in the book excerpt — verify Science/Technical/W.P./Wilderness availability.)",
    },
  },
  {
    name: "Secondary Skills",
    type: "occ_ability",
    system: {
      level: 1,
      description: "PLACEHOLDER — Secondary Skills line not yet provided from the book. Paste the count and level progression to complete this card.",
    },
  },
  {
    name: "Experience Table",
    type: "occ_ability",
    system: {
      level: 1,
      description: "PLACEHOLDER — Assassin XP table (Rifts Mercenaries) not yet provided. Paste levels 1-15 to complete this card.",
    },
  },
];

// ── 8. CREATE ALL ITEMS ───────────────────────────────────
const allItems = [...occSkillItems, ...gearItems, ...equipmentItems, ...occAbilities];
await actor.createEmbeddedDocuments("Item", allItems);

// ── 9. DONE ───────────────────────────────────────────────
ui.notifications.info(`${actor.name} has been set up as an Assassin O.C.C.!`);

ChatMessage.create({
  speaker: { alias: "OCC Setup" },
  content: `
    <h2>🎯 Assassin O.C.C. (Mercenaries)</h2>
    <p><strong>${actor.name}</strong> is now an Assassin.</p>
    <hr>
    <p><strong>Rolled:</strong></p>
    <ul>
      <li>Starting credits: <strong>${credits.toLocaleString()}</strong> (3D6x1,000)</li>
      <li>Black Market items: <strong>${blackMarket.toLocaleString()}</strong> cr value (1D6x1,000)</li>
      <li>Knives: <strong>${knives}</strong> (1D4)</li>
      <li>Cybernetic implants of choice: <strong>${cyberCount}</strong> (1D6+1)</li>
    </ul>
    <p><strong>Player still needs to:</strong></p>
    <ul>
      <li>Verify attributes meet I.Q. 11, M.E. 10, P.P. 10 — alignment must be Anarchist or Evil</li>
      <li>Pick ${cyberCount} cybernetic implants (placeholders created)</li>
      <li>Select 7 O.C.C. Related Skills</li>
      <li>Fill in stats for choice weapons/armor placeholders</li>
      <li>Secondary Skills &amp; XP table pending book text (see ability cards)</li>
    </ul>
    <p><em>Assassins tend to live for the moment and spend money extravagantly on life's many pleasures.</em></p>
  `
});
