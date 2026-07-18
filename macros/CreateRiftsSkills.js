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
const skill = (name, folderName, categoryKey, base, perLevel, description, notes = "", extra = {}) =>
  skillDefs.push({ name, folderName, categoryKey, base, perLevel, description, notes, extra });

// Horsemanship variants carry a structured `horsemanship` block
// (sub-skills, mounted bonuses, charge data) consumed by the
// character sheet's MOUNTED toggle and CHARGE button.
const horseSkill = (name, base, perLevel, description, notes, hm) =>
  skillDefs.push({
    name, folderName: "Horsemanship", categoryKey: "horsemanship",
    base, perLevel, description, notes, horsemanship: hm,
  });

// ═══ COMMUNICATIONS ════════════════════════════════════════
skill("Barter", "Communications", "communications", 30, 4,
  "A skill at bargaining with merchants, businessmen, thieves, traders and other characters to get a fair price or fair exchange of trade goods or services. Generally, if the haggler rolls under his Bartering skill percentage, he gets the discount when buying or the better price when he is the one doing the selling or trading. If the price is disputed, the two bartering characters can each make rolls on percentile dice, the highest roll wins and gets their price and not a penny less or nickle more.",
  "Base Skill: 30% +4% per level.\nMathematics and Literacy are not required but helpful, with each adding a +2% bonus to Barter.",
  { requiredOCC: "Adventurer, Scholar", requiredLocation: "", requiredSkills: "", selectModifiers: "3D6+2%", bonusesText: "" });

skill("Creative Writing", "Communications", "communications", 25, 5,
  "The ability to write prose/stories, poems, and journalistic reports, studies, news, and otherwise entertaining text (including songs at -15%) This skill does not provide a character with the ability to recite his or her written words with any level of charm. See Public Speaking for that.",
  "Base Skill: 25% +5% per level.\nTaking the skill twice indicates a professional quality and gets a bonus of +10%.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Literacy.", selectModifiers: "", bonusesText: "" });

skill("Cryptography", "Communications", "communications", 25, 5,
  "Skill in recognizing, designing, and cracking secret codes and messages. The character must study the code for two hours to attempt to break it successfully. A failed roll means the individual must study the code for an additional two hours before he can try to break it again.",
  "Base Skill: 25% +5% per level.\nThe character may attempt to break the code sooner, after only 10 minutes of study, but suffers a penalty of -30%.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Literacy.", selectModifiers: "", bonusesText: "" });

skill("Electronic Countermeasures", "Communications", "communications", 30, 5,
  "The ability to shield, encrypt and protect electronic transmissions, as well as jamming, scrambling, coding and decoding radio, video and wireless transmissions. This skill also includes knowledge in the use of technology to locate electronic bugs/listening devices and deactivate, underm ine and otherwise circumvent them. The use of electronic masking, scrambling and unscrambling equipment, as well as codes to help foil the detection, interception and interpretation of radio and wireless transmissions is all part of this skill. A radio operator who makes a successful scramble roll can transmit coded or scrambled messages without fear that the enemy will intercept or understand his transmission.",
  "Base Skill: 30% +5% per level.\nJamming military or police communications can cause unit confusion and disrupt communications. Military organization breaks down, causing a loss of effectiveness to all but the best units. Just about any high-powered radio can be used for jamming.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Radio: Basic.", selectModifiers: "", bonusesText: "" });

skill("Language: Native Tongue", "Communications", "communications", 88, 1,
  "The character has a very good to excellent understanding of his native language. It is not, however, an absolute and total understanding, because there are always words, scientific terms, slang and fancy or outdated words and terms a character may not know. Thus, the necessity for dictionaries, thesauruses, grammar guides and computer spelling programs.",
  "Base Skill: 88% +1% per level.\nAn O.C.C. skill bonus usually applies to \"other\" languages and communication skills, not the Native Tongue.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Language: Other", "Communications", "communications", 50, 3,
  "The character can understand and speak in a language other than his own. Language is one of the few skills that can be selected repeatedly in order to speak several different languages. Each selection gives the character knowledge of one different language, but each language counts as one skill selection.",
  "Base Skill: 50% +3% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Laser Communications", "Communications", "communications", 30, 5,
  "This skill provides the character with an in depth knowledge of advanced electronics, laser communication systems and fiber optic communications.",
  "Base Skill: 30% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Radio: Basic, Electrical Engineer, Computer Operation", selectModifiers: "", bonusesText: "" });

skill("Literacy: Native Language", "Communications", "communications", 40, 5,
  "The character can read and write the language of his culture. This is usually the common language where he was born and grew up (or has lived most of his life). For example, most of us born in America speak, read and write American English, complete with contemporary slang. English is our predominant language, even if our ethnic heritage has roots in another country (Mexico, Poland, Russia, Cuba, etc.). Reading and writing means the character can read and comprehend the written word, read written instructions, printed books, etc. This skill has no bearing on creative writing.",
  "Base Skill: 40% +5% per level.\nThe ability to read and write is a rare and valuable commodity on Rifts Earth. The majority of the world's population cannot read.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Literacy: Other", "Communications", "communications", 30, 5,
  "The character may read and write one or more different languages, but each language counts as a separate skill selection. American English is the official written language of the Coalition States and North America in general. Note that just because a character can \"read\" a foreign language does NOT mean he can speak it or understand others speaking it (has only the most basic understanding of the spoken language, catching one or two words out of ten. (See Language: Other to \"speak\" other languages.) Usually, only the Rogue Scholar, Rogue Scientist and practitioners of magic can read even one language let alone two or more.",
  "Base Skill: 30% +5% per level.\nIf a character fails his attempt to read a book (such as a character with Literacy: Dragonese/Elven at 50% ), it means the book is currently too difficult for his skill level. The character may again attempt to read the book when his Literacy score changes, such as when it goes up an experience level and gains a +5% bonus.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Optic Systems", "Communications", "communications", 30, 5,
  "Provides expert training in the use of special optical enhancement equipment such as telescopic lenses, laser targeting, thermal imagers, passive light intensifiers, infrared and ultraviolet systems, polarization, light filters, optical scanners, video and digital cameras, holograms and related devices.",
  "Base Skill: 30% +5% per level.\nAdds a special one time bonus of +5% to the T. V./Video skill if both are selected.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Performance", "Communications", "communications", 30, 5,
  "The methods and fundamentals used by actors, entertainers, politicians and other public figures to impress and sway the public. A character with this skill knows how to do things with flair. If a skill roll is successful, it works like an attempt to charm, captivate, impress, intimidate, or incense (or motivate) the audience.",
  "Base Skill: 30% +5% per level.\nBonus: +5% to the Undercover Ops and Impersonation skills.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Public Speaking", "Communications", "communications", 30, 5,
  "Training in the quality of sound, tone, pitch, enunciation, clarity, and pacing when speaking to the public. The character speaks loudly, distinctly and in a pleasing manner. Also includes the practice of good, enticing storytelling, dramatic pauses and composition of the spoken word. A successful roll indicates the overall quality and charisma of the speaker and the spoken word; people are enjoying listening to the character.",
  "Base Skill: 30% +5% per level.\nThis skill adds a +5% bonus to the Performance skill.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Radio: Basic", "Communications", "communications", 45, 5,
  "The rudimentary knowledge of the operation and maintenance of all sorts of radio equipment, including military radio systems, field radios and walkie-talkies, audio recording devices, wire laying, installation, radio procedure, communication security and Morse code. It does not include the ability to make repairs nor operate video equipment.",
  "Base Skill: 45% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Sensory Equipment", "Communications", "communications", 30, 5,
  "Individuals with this training can operate, maintain, understand, and \"read\" or interpret sensory data from all types of conventional, military, medical and scientific equipment, scanners, and sensory devices. These devices include radar, sonar, motion detectors, surveillance equipment, optical enhancements, industrial gauges, instrument panels, medical monitors (EKGs, CAT scans, etc.), life support systems, and so on. Note that characters without this skill cannot understand or operate advanced aircraft, medical equipment or sensor/detection equipment. Radar & Sonar Note : The character can expertly use radar equipment (radio echo bounces) and sonar (underwater sound echo bounces) and correctly read the information to precisely locate and track aircraft, ships and submarines, as the case may be.",
  "Base Skill: 30% +5% per level.\nMost vessels will not use active sonar unless absolutely necessary, most rely on passive sonar systems. This is much more difficult since the sonar operator must sift through the background noise to find any enemy targets. Sometimes they will not be able to distinguish the location of a ship from the background static. Despite this fact, passive sonar is used because it does not give away the location of the vessel. -15% skill penalty when using passive sonar or radar.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Sign Language", "Communications", "communications", 25, 5,
  "The universal sign language of the deaf, Requires line of sight ( i.e., one must be able to see the signer). Signing for the hearing impaired requires the sender to do a skill check per every 20 words \"signed\" to successfully transmit his message. Likewise, the interpreter must roll to interpret every batch of 20 words. A failed roll means a misunderstanding to no idea of what has been said.",
  "Base Skill: 25% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Military Sign Language", "Communications", "communications", 25, 5,
  "The military sign language of hand signals used to indicate action, response and combat positions in the field when verbal or radio communication would alert the enemy.",
  "Base Skill: 25% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Military Etiquette", selectModifiers: "", bonusesText: "" });

skill("Sing", "Communications", "communications", 35, 5,
  "The simple ability to read music and carry a pleasant tune.",
  "Base Skill: 35% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Surveillance", "Communications", "communications", 30, 5,
  "The use and deployment of bugs and spy equipment, tailing and stakeouts. The character understands the methods, operation, techniques, tools and devices used in surveillance operations. Includes motion detectors, simple and complex alarm systems, audio/visual recording and display equipment, recording methods, amplified sound systems, miniature listening devices (bugs, line tapping, parabolic electronic ears, etc.), miniature \"hidden\" cameras, and optical enhancement systems specifically as they relate to camera lenses and spy devices.",
  "Base Skill: 30% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Basic Electronics, Electrical Engineering, Computer Operation, Literacy", selectModifiers: "", bonusesText: "" });

skill("TV/Video", "Communications", "communications", 25, 5,
  "In depth training in the use of video, digital and audio recording equipment as well as filming, editing, dubbing, title making, duplication, and transmission. Includes the use of field equipment; i.e., portable video or digital camera and studio equipment.",
  "Base Skill: 25% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Laser", "Communications", "communications", 30, 5,
  "This skill provides the character with an in-depth knowledge of sophisticated laser communication systems and fiber optic communications.",
  "Base Skill: 30% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "The Radio: Basic, Electrical Engineer, Computer Operation", selectModifiers: "", bonusesText: "" });

// ═══ COWBOY ═══════════════════════════════════════════════
skill("Branding", "Cowboy", "cowboy", 50, 5,
  "The techniques and methods for tethering, controlling and marking, or \"branding,\" animals. A brand is a mark burned on the skin to identify and show ownership of an animal; typically used on horses and cattle, sometimes on human and D-Bee slaves. This skill also includes a basic knowledge of common and notable insignias and emblems.",
  "Base Skill: 50% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Breaking/Taming a Wild Horse", "Cowboy", "cowboy", 20, 5,
  "To \"break\" a horse, first the trainer must get the horse used to being around people, then used to having a saddle on its back (this takes 3D4 days), and then you \"bit\" train it (gets used to having a bit in its mouth and reins). Finally, the trainer must get the horse used to having a rider on its back. Depending on the horse, this can take a couple weeks (making an attempt every day) to several weeks with moderate success. It takes a lot of skill to stay on a wild horse when the animal wants you off. Some horses are never completely tame, and some will allow certain people to ride it, while bucking and throwing other riders. During this initial training period the rider must hang on for dear life while the horse does every thing in its power to throw him. This battle of wills can last hours and take up to 12 weeks.",
  "Base Skill: 20% +5% per level.\n-10% when breaking exotic and alien animals. Also includes riding wild bulls (cannot be broken), wild broncos, and other wild animals, as well as steer wrestling, but all at -15%.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Herding Cattle", "Cowboy", "cowboy", 30, 5,
  "The techniques and methods of leading, directing and controlling cattle in a contained and orderly herd. Also includes keeping animals calm, basic care and feeding, how to tend cattle, recognize disease and illness, give birth to young, how to survive and regain control of a stampede, gather strays, how best to pen and corral livestock, mend fences, etc.",
  "Base Skill: 30% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Roping", "Cowboy", "cowboy", 20, 5,
  "The rope is the cowboy' s most important and famous tool. Characters with the roping skill can expertly throw a rope to snare/lasso a cow's horns, a horse's neck, or the hoofs of either, to enable a 140 pound (63 kg) man to capture and subdue a half ton animal! Hitched around the saddle hom, a lariat can be used to pull a mired animal out of a bog, mud or river, as well as keep a hobbled horse or other animal from straying away in the night or rain, and the rope can even be used to create an instant, makeshift corral, when stretched taut by several men, to contain and hold a herd of animals, and even for quick justice at the end of a hangman's noose. Against human and intelligent opponents, roll to lasso as if it were a combat attack to strike and ensnare. The intended victim can try to dodge; parry is not applicable.",
  "Base Skill: 20% +5% per level.\nIt takes 1D4 melee actions to cut through a lasso, but it is impossible to draw a weapon and cut oneself loose if both arms are pinned or while being dragged. In this combat usage, the roping character is +1 to strike and entangle for every 20 points of skill, so a skill of 65% means +3 to strike ensnare/entangle.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Trick Riding", "Cowboy", "cowboy", 0, 0,  // SPECIAL: % comes from Horsemanship
  "Riding bareback, standing on the animal's back, hanging from the side, or under its belly (usually for rodeo tricks or to hide from enemies), side saddle, as well as quick mounts and dismounts, mounting a horse by leaping down from above or with a running start, leaping from the back of a horse onto another horse or wagon, and similar.",
  "Base Skill: SPECIAL — equal to the FIRST (larger) number of your Horsemanship skill; enter that value in Base % and keep it matched as you level.\nThe first (larger) number of the Horsemanship skill; Characters without this skill can try any of these tricks, but must roll on the second percentage number of their Horsemanship skill after reducing it by half.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Horsemanship", selectModifiers: "", bonusesText: "" });

// ═══ ELECTRICAL ═══════════════════════════════════════════
skill("Basic Electronics", "Electrical", "electrical", 30, 5,
  "This is a rudimentary understanding of the principles of electricity, simple circuits, wiring, and so on. This person can do basic wiring, repair appliances, and read schematics as well as assist electrical engineers.",
  "Base Skill: 30% +5% per level.\nThe character can attempt to hot-wire a commercial vehicle (not military) using Basic Electronics but with a -20% skill penalty and it takes 1D4+2 melee rounds ( 45-90 seconds) to do so.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Computer Repair", "Electrical", "electrical", 30, 5,
  "Knowledge of the internal electronics of computers and related devices (terminals, printers, modems, circuit boards, etc.). The character can attempt to repair or sabotage computers. Note that figuring out the repair or sabotage procedure counts as one roll, and the actual repair is a second roll. A failed roll means the repair is faulty and does not work (try again).",
  "Base Skill: 30% +5% per level.\nNo computer operation or programming skills are included nor required to fix computers. Many computer repair personnel don't even know how to tum the computer on!",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Electrical Engineer", "Electrical", "electrical", 35, 5,
  "Knowledge of electricity. Characters can diagnose and locate electrical problems, repair complex electrical devices, wire entire buildings or vehicles, and build electrical equipment. The character can also attempt to bypass security systems, alarms, and surveillance systems, but at a penalty of -20% for simple systems and -50% for complex systems (reduce these penalties by half if the character also has the Surveillance Skill. The character can hot-wire any vehicle without penalty but it takes 1D4 melee rounds (15-60 seconds) to do so.",
  "Base Skill: 35% +5% per level.\nThere is a -30% penalty when working on alien or extremely unfamiliar electronics. This includes Techno-Wizard devices.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Advanced Mathematics, Literacy", selectModifiers: "", bonusesText: "" });

skill("Electricity Generation", "Electrical", "electrical", 50, 5,
  "Electricity is generated in from a variety of ways: from sunlight, wind and hydro systems (using solar panels, windmills and water turbines) to batteries, combustion engines and generators. This skill gives the character the understanding of how and why these generation systems work and he is able to use, link and repair such motors, turbines and generator systems, but not to build them from scratch. He can even install small nuclear energy systems like those used in power armor and vehicles, as well as hook up a means to \"recharge\" E-Clips and E-Packs from generators.",
  "Base Skill: 50% +5% per level.\n-40% skill penalty when working on alien or magical systems, including Techno-Wizard devices.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Basic Math, Basic Electronics, Basic Mechanic.", selectModifiers: "", bonusesText: "" });

skill("Robot Electronics", "Electrical", "electrical", 30, 5,
  "This is the complex and specialized study of robotics and robot/military engineering, micro-circuitry, and artificial intelligence. It includes knowledge of the Coalition robot assault units, exoskeletons, and robot systems.",
  "Base Skill: 30% +5% per level.\nThere is a -40% penalty when working on alien or extremely unfamiliar robot electronics",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Electrical Engineering, Computer Programming", selectModifiers: "", bonusesText: "" });

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

// ═══ HORSEMANSHIP ═════════════════════════════════════════
horseSkill("Horsemanship: General", 40, 4,
  "Basic riding skill, not trained for combat.",
  "Base Skill: 40% +4% per level. Source: RUE p. 311.",
  {
    recognizeBreed: 40, breedHorses: 40, hitchWagon: 40,
    jumpingTricksCombat: 20, controlPanicked: 20, racing: 20,
    recognizeBreedPer: 4, breedHorsesPer: 4, hitchWagonPer: 4,
    jumpingTricksCombatPer: 4, controlPanickedPer: 4, racingPer: 4,
    parry: 1, dodge: 1,
    initiative: 0, initiativeSchedule: "", initiativePerLevel: 0,
    rollFall: 0, rollFallCond: "",
    rope: 0, ensnare: 0, entangle: 0,
    kickDamage: "+1D4",
    chargeDamage: "+1D6", chargeActions: 2, chargeNotes: "e.g. 'counts as 2 attacks; horse must move 60+ ft'",
    horseAttackBonus: ""
  });

horseSkill("Horsemanship: Cowboy", 66, 3,
  "Not available to most O.C.C.s. Most skilled and versatile horseman; pairs with Roping/Herding cowboy skills.",
  "Base Skill: 66% +3% per level. Source: RUE p. 311.",
  {
    recognizeBreed: 66, breedHorses: 66, hitchWagon: 66,
    jumpingTricksCombat: 50, controlPanicked: 50, racing: 50,
    recognizeBreedPer: 3, breedHorsesPer: 3, hitchWagonPer: 3,
    jumpingTricksCombatPer: 3, controlPanickedPer: 3, racingPer: 3,
    parry: 2, dodge: 2,
    initiative: 0, initiativeSchedule: "2,5,10,15", initiativePerLevel: 1,
    rollFall: 2, rollFallCond: "unhorsed",
    rope: 2, ensnare: 2, entangle: 2,
    kickDamage: "+1D4",
    chargeDamage: "+2D6", chargeActions: 2, chargeNotes: "e.g. 'counts as 2 attacks; horse must move 60+ ft'",
    horseAttackBonus: "+4"
  });

horseSkill("Horsemanship: Cossack (Russia)", 55, 5,
  "Exclusive to the Cossack O.C.C. in World Book 17: Warlords of Russia.",
  "Base Skill: 55% +5% per level. Source: RUE p. 311.",
  {
    recognizeBreed: 55, breedHorses: 55, hitchWagon: 55,
    jumpingTricksCombat: 45, controlPanicked: 45, racing: 45,
    recognizeBreedPer: 5, breedHorsesPer: 5, hitchWagonPer: 5,
    jumpingTricksCombatPer: 5, controlPanickedPer: 5, racingPer: 5,
    parry: 2, dodge: 2,
    initiative: 0, initiativeSchedule: "1,4,8,12,15", initiativePerLevel: 1,
    rollFall: 2, rollFallCond: "unhorsed",
    rope: 0, ensnare: 0, entangle: 0,
    kickDamage: "+6",
    chargeDamage: "+2D6", chargeActions: 2, chargeNotes: "e.g. 'counts as 2 attacks; horse must move 60+ ft'",
    horseAttackBonus: "+3"
  });

horseSkill("Horsemanship: Cyber-Knight", 70, 5,
  "Exclusive to the Cyber-Knight O.C.C.",
  "Base Skill: 70% +5% per level. Source: RUE p. 311.",
  {
    recognizeBreed: 70, breedHorses: 70, hitchWagon: 70,
    jumpingTricksCombat: 50, controlPanicked: 50, racing: 50,
    recognizeBreedPer: 5, breedHorsesPer: 5, hitchWagonPer: 5,
    jumpingTricksCombatPer: 5, controlPanickedPer: 5, racingPer: 5,
    parry: 2, dodge: 2,
    initiative: 0, initiativeSchedule: "1,5,9,14", initiativePerLevel: 1,
    rollFall: 2, rollFallCond: "unhorsed",
    rope: 0, ensnare: 0, entangle: 0,
    kickDamage: "+6",
    chargeDamage: "+3D6", chargeActions: 2, chargeNotes: "e.g. 'counts as 2 attacks; horse must move 60+ ft'",
    horseAttackBonus: "+2"
  });

horseSkill("Horsemanship: Equestrian", 40, 5,
  "Knight/paladin combat riding.",
  "Base Skill: 40% +5% per level. Source: RUE p. 311.",
  {
    recognizeBreed: 40, breedHorses: 40, hitchWagon: 40,
    jumpingTricksCombat: 30, controlPanicked: 30, racing: 30,
    recognizeBreedPer: 5, breedHorsesPer: 5, hitchWagonPer: 5,
    jumpingTricksCombatPer: 5, controlPanickedPer: 5, racingPer: 5,
    parry: 2, dodge: 2,
    initiative: 1, initiativeSchedule: "", initiativePerLevel: 0,
    rollFall: 1, rollFallCond: "",
    rope: 0, ensnare: 0, entangle: 0,
    kickDamage: "+1D6",
    chargeDamage: "+2D6", chargeActions: 2, chargeNotes: "e.g. 'counts as 2 attacks; horse must move 60+ ft'",
    horseAttackBonus: "+1"
  });

horseSkill("Horsemanship: Exotic Animals", 30, 5,
  "Riding unusual mounts (Fury Beetles, Ostrosaurus, etc.)",
  "Base Skill: 30% +5% per level. Source: RUE p. 311-312.",
  {
    recognizeBreed: 30, breedHorses: 30, hitchWagon: 30,
    jumpingTricksCombat: 20, controlPanicked: 20, racing: 20,
    recognizeBreedPer: 5, breedHorsesPer: 5, hitchWagonPer: 5,
    jumpingTricksCombatPer: 5, controlPanickedPer: 5, racingPer: 5,
    parry: 1, dodge: 1,
    initiative: 0, initiativeSchedule: "", initiativePerLevel: 0,
    rollFall: 0, rollFallCond: "",
    rope: 0, ensnare: 0, entangle: 0,
    kickDamage: "+1D4",
    chargeDamage: "+1D6", chargeActions: 2, chargeNotes: "e.g. 'counts as 2 attacks; horse must move 60+ ft'",
    horseAttackBonus: ""
  });

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
        isHorsemanship: !!def.horsemanship,
        basePercent: def.base,
        bonusPercent: 0,
        totalPercent: def.base,
        perLevelBonus: def.perLevel,
        relatedAttribute: "",
        notes: def.notes,
        requiredOCC: def.extra?.requiredOCC ?? "",
        requiredLocation: def.extra?.requiredLocation ?? "",
        requiredSkills: def.extra?.requiredSkills ?? "",
        selectModifiers: def.extra?.selectModifiers ?? "",
        bonusesText: def.extra?.bonusesText ?? "",
        ...(def.horsemanship ? { horsemanship: def.horsemanship } : {}),
      },
    },
    { pack: pack.collection }
  );
  created++;
}

ui.notifications.info(`${PACK_LABEL}: ${created} skill(s) added, ${moved} moved into folders, ${skillDefs.length - created - moved} already in place.`);
