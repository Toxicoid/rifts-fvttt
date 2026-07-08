// ============================================================
// RIFTS RPG - Rifts Skills Compendium
// Builds the "Rifts Skills" compendium with skills organized
// into folders by category (Communications, Espionage, etc.),
// verified vs book text. Drag skills onto a character — the
// per-level bonus scales automatically with character Level.
// Safe to re-run: skips existing by name, moves into folders.
// ============================================================

const PACK_NAME = "rifts-skills";
const PACK_LABEL = "Rifts Skills";

let pack = game.packs.get(`world.${PACK_NAME}`);
if (!pack) {
  pack = await foundry.documents.collections.CompendiumCollection.createCompendium({
    label: PACK_LABEL,
    name: PACK_NAME,
    type: "Item",
  }).catch(async () => {
    return await CompendiumCollection.createCompendium({
      label: PACK_LABEL,
      name: PACK_NAME,
      type: "Item",
    });
  });
  ui.notifications.info(`Created compendium: ${PACK_LABEL}`);
}

// ── Category folder helper (created on demand) ─────────────
const folders = {};
async function categoryFolder(name) {
  if (folders[name]) return folders[name];
  let f = pack.folders.find((x) => x.name === name && !x.folder);
  if (!f) {
    f = await Folder.create({ name, type: "Item" }, { pack: pack.collection });
  }
  folders[name] = f;
  return f;
}

// ── Skill helper ───────────────────────────────────────────
// categoryKey = the system's category value (matches the sheet's
// category dropdown); folderName = display folder in the pack.
const skillDefs = [];
const skill = (name, folderName, categoryKey, base, perLevel, description, notes = "") =>
  skillDefs.push({ name, folderName, categoryKey, base, perLevel, description, notes });

// ═══ COMMUNICATIONS ════════════════════════════════════════
skill("Barter", "Communications", "communications", 30, 4,
  "A skill at bargaining with merchants, businessmen, thieves, traders and other characters to get a fair price or fair exchange of trade goods or services. Depending on the character's point of view and effort at bartering, he can raise the amount he gets or lower the price he pays by 3D6+2% — not applicable to rare items and alien technology. Generally, if the haggler rolls under his Bartering skill percentage, he gets the discount when buying, or the better price when he is the one doing the selling or trading. If the price is disputed, the two bartering characters can each make rolls on percentile dice: the highest roll wins and gets their price — and not a penny less or nickel more.",
  "Base Skill: 30% +4% per level.\nRESTRICTION: Available only to Adventurer & Scholar O.C.C.s.\nMathematics and Literacy are not required but helpful — EACH adds a +2% bonus to Barter (enter in Bonus % if known).");

skill("Creative Writing", "Communications", "communications", 25, 5,
  "The ability to write prose/stories, poems, and journalistic reports, studies, news, and otherwise entertaining text (including songs at -15%). Taking the skill TWICE indicates professional quality and gets a bonus of +10%; selecting it once indicates a talented amateur. A failed roll means an awkward and poorly written work that is boring and difficult to understand. Try again.",
  "Base Skill: 25% +5% per level.\nREQUIRES: Literacy.\nSongs: -15%. Taken twice (professional): +10% (enter in Bonus %).\nThis skill does NOT provide the ability to recite written words with any level of charm — see Public Speaking for that.");

skill("Cryptography", "Communications", "communications", 25, 5,
  "Skill in recognizing, designing, and cracking secret codes and messages. The character must study the code for two hours to attempt to break it successfully. A failed roll means the individual must study the code for an additional two hours before he can try to break it again. The character may attempt to break the code sooner, after only 10 minutes of study, but suffers a penalty of -30%.",
  "Base Skill: 25% +5% per level.\nREQUIRES: Literacy.");
  
skill("Electronic Countermeasures", "Communications", "communications", 30, 5,
  "The ability to shield, encrypt and protect electronic transmissions, as well as jamming, scrambling, coding and decoding radio, video and wireless transmissions. This skill also includes knowledge in the use of technology to locate electronic bugs/listening devices and deactivate, undermine and otherwise circumvent them. The use of electronic masking, scrambling and unscrambling equipment, as well as codes to help foil the detection, interception and interpretation of radio and wireless transmissions is all part of this skill. A radio operator who makes a successful scramble roll can transmit coded or scrambled messages without fear that the enemy will intercept or understand his transmission. Jamming military or police communications can cause unit confusion and disrupt communications. Military organization breaks down, causing a loss of effectiveness to all but the best units. Just about any high powered radio can be used for jamming. Armed with a radio, a small guerrilla unit can completely disrupt the maneuvers of large enemy groups. This skill also enables the radio operator to follow the enemy's attempted transmissions over jammed frequencies to trace their location or direction of travel. This tactic is extremely useful in finding and eliminating bugs, transmission units, surveillance teams on a stakeout, small squads and enemies in distress.",
  "Base Skill: 30% +5% per level.\nREQUIRES: Radio: Basic.");



// ── Build items and create ─────────────────────────────────
const index = await pack.getIndex();
const byName = new Map(index.map((e) => [e.name, e]));

let created = 0;
let moved = 0;
for (const def of skillDefs) {
  const folder = await categoryFolder(def.folderName);
  const entry = byName.get(def.name);
  if (entry) {
    if ((entry.folder ?? null) !== folder.id) {
      const doc = await pack.getDocument(entry._id);
      await doc.update({ folder: folder.id });
      moved++;
    }
    continue;
  }
  await Item.create(
    {
      name: def.name,
      type: "skill",
      img: "icons/svg/book.svg",
      folder: folder.id,
      system: {
        category: def.categoryKey,
        description: def.description,
        isSecondary: false,
        basePercent: def.base,
        bonusPercent: 0,
        totalPercent: def.base,
        perLevelBonus: def.perLevel,
        relatedAttribute: "",
        notes: def.notes,
      },
    },
    { pack: pack.collection }
  );
  created++;
}

ui.notifications.info(`${PACK_LABEL}: ${created} skill(s) added, ${moved} moved into folders, ${skillDefs.length - created - moved} already in place.`);
