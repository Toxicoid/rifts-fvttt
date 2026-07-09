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

// ═══ DOMESTIC ═════════════════════════════════════════════
skill("Bonsai", "Domestic", "domestic", 50, 4,
  "Tending, trimming and growing tiny miniature trees known as the \"Bonsai.\" Experts can tell the difference between new (under 50 years old) and truly ancient bonsai (hundreds of years old). The character can also estimate the value and quality of the miniature tree. Bonsai is a common pastime of the noble castes in the New Empire of Japan and is unlikely to be practiced by anybody outside of the Japanese Is lands.",
  "Base Skill: 50% +4% per level.");

skill("Brewing", "Domestic", "domestic", 25, 5,
  "The understanding and methods of making fermented alcoholic beverages from grains and fruits. This specifically includes wine, mead, ale, beer and moonshine. Stronger alcohol, such as brandy, rum, and whiskey, is not included, nor are champagnes or fine wines.",
  "Base Skill: 25% +5% per level.");

skill("Brewing — Quality of Drink", "Domestic", "domestic", 30, 5,
  "Indicates the quality of the brew; the lower the number rolled the tastier the drink.",
  "Base Skill: 30% +5% per level.");

skill("Cook", "Domestic", "domestic", 35, 5,
  "Skill in selecting, planning, and preparing meals. A cooking roll failure means that the cooked food is not properly prepared. It is edible but tastes bad (greasy, too spicy, sour, burnt, leaves a bad after taste in mouth, etc.).",
  "Base Skill: 35% +5% per level.");

skill("Corroboree (Australian Dance)", "Domestic", "domestic", 30, 4,
  "This is perhaps the most important skill to any Australian Aboriginal character who believes in his people and his culture. The Corroboree is more than just a dance, it is a way to interact with the spirits and contact the Dreamtime. It requires at least 10 minutes or more of stomping, dancing and singing on a clear patch of earth. Without the Corroboree, Aboriginal society would crumble.",
  "Base Skill: 30% +4% per level.\nREQUIRES: Available ONLY to Aboriginal characters in Australia. Nowhere else.\nWhen performed on a Songline (the Aboriginal name for ley lines), the Corroboree provides all sorts of mystical knowledge about the land and the line; see Use Songlines in the Wilderness Skill Category for details.");

skill("Dance", "Domestic", "domestic", 30, 5,
  "A practiced skill in the art of dancing. The character is especially smooth and graceful, a joy to dance with. Can learn new dance steps/moves much more quickly than somebody who can not dance.",
  "Base Skill: 30% +5% per level.");

skill("Fishing", "Domestic", "domestic", 40, 5,
  "The fundamental methods and enjoyment of the relaxing sport of fishing. Areas of knowledge include the use of lures, bait, poles, hooks, lines, and the cleaning and preparation of fish for eating. Also includes a basic knowledge of freshwater fish, their habits and taste.",
  "Base Skill: 40% +5% per level.");

skill("Floral Arrangement (Ikebana)", "Domestic", "domestic", 30, 3,
  "The artful and creative arrangement of flowers appreciated by everyone throughout the orient. A painstakingly difficult art that takes years to really master. The creation of a good floral arrangement is a matter of honor to those who practice Ikebana; a bad job will be scorned even if done by the most heroic of warriors. This \"art\" is appreciated in modem and traditional Japan. It is unlikely to be practiced by anybody outside of the Japanese Islands.",
  "Base Skill: 30% +3% per level.");

skill("Gardening", "Domestic", "domestic", 35, 5,
  "This skill offers a basic understanding of plant care and garden design. It can be both the ability to grow enough food to eat well, and/or the skill at creating beautiful, decorative gardens (with flowers, and other plants and rocks). This can be practiced by anyone.",
  "Base Skill: 35% +5% per level.");

skill("Zen Gardening", "Domestic", "domestic", 34, 4,
  "The \"art\" of Zen Gardening creates a feeling of tranquility and harmony with nature that is greatly appreciated in modem and traditional Japan and by Druids of all kinds.",
  "Base Skill: 34% +4% per level.");

skill("Go", "Domestic", "domestic", 30, 5,
  "As chess is the most widely accepted intellectual game of the west, so Go is accepted as the most \"enlightening\" game of the eastern world. In many cases one's skill at Go is seen as much more important than ability in the fighting arts. A victory at the intelligent game of Go easily outweighs any ten wins in single combat. It is unlikely to be practiced by anybody outside of the Japanese Islands. North American characters can substitute Chess.",
  "Base Skill: 30% +5% per level.");

skill("Play Musical Instrument", "Domestic", "domestic", 35, 5,
  "The individual has learned to play a particular musical instrument with a fair amount of skill. The sound is generally pleasant (except when a bad roll is made). Note that each specific instrument requires the selection of this skill. For example: A character who can play the guitar, violin, and harmonica must select the play musical instrument skill three different times, once for each instrument.",
  "Base Skill: 35% +5% per level.\nThere is a -10% modifier (at the G.M.' s discretion) when the character tries to learn a musical instrument indigenous to a particular region and the character himself is not from that region (e.g., somebody from North America trying to learn a uniquely Australian instrument, like the didgeridoo). Likewise, particularly difficult instruments might also get a -10% modifer to play them.");

skill("Poetry (Haiku)", "Domestic", "domestic", 35, 5,
  "Creating good, and sometimes inspirational, poetry. \"Haiku\" are short, three line, seventeen syllable poems that are the national poetry of Japan but whose style and rhythm is known around the world. Poetry often accompanies important events in Japanese society. For example, a samurai compelled to commit ritual suicide is expected to compose a \"death poem.\" In North America, City Rats have taken to writing Haiku and other forms of poetry.",
  "Base Skill: 35% +5% per level.");

skill("Recycle", "Domestic", "domestic", 30, 5,
  "Recycling covers everything. In space that includes oxygen, but more typically includes paper, lumber, scrap metal and plastic. In a post-Apocalyptic world, recycling and rebuilding old and used items and material is commonplace. This is not like the Jury-Rig skill; a character with Recycle cannot make something out of odd components but, given some time and equipment, he can reduce the components to their basic elements for reuse to build something new. Has a rudimentary understanding of metallurgy.",
  "Base Skill: 30% +5% per level.");

skill("Rock Painting and Engraving (Australia)", "Domestic", "domestic", 36, 4,
  "Aboriginal art is very unique and special to them. They decorate bark, skins and rocks with pigments. Each painting tells a story and describes a myth in a way that only a character with this skill can interpret or read. Elders and Mabarn are the most common painters, and they take great pleasure in describing their works to those who wish to listen. Outbackers nickname this \"X-ray painting\" because the depictions of people and animals are stylized to show what looks like their bones. This skill is unlikely to be practiced by anybody outside of Australia. Some American Indians also engage in rock painting, but not to the same degree.",
  "Base Skill: 36% +4% per level.");

skill("Sewing", "Domestic", "domestic", 40, 5,
  "The practiced skill with the needle and thread to mend clothing, do minor alterations, and layout, cut and sew simple patterns.",
  "Base Skill: 40% +5% per level.");

skill("Tailoring", "Domestic", "domestic", 40, 5,
  "Tailoring skills combine precise technical abilities—such as pattern drafting, accurate measuring, and garment construction—with creative design principles. Mastering this craft requires a deep understanding of fabric behavior, proper needle techniques, and meticulous attention to detail to achieve a custom, long-lasting fit.",
  "Base Skill: 40% +5% per level.\nREQUIRES: Requires Sewing skill as well.");

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
