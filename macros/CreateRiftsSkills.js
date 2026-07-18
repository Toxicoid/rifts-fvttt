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

// ═══ ESPIONAGE ════════════════════════════════════════════
skill("Detect Ambush", "Espionage", "espionage", 30, 5,
  "Training which develops an eye for spotting locations and terrains suitable for ambushes and being ambushed. It also provides a rudimentary knowledge of guerilla tactics used by the enemy.",
  "Base Skill: 30% +5% per level.\nThe Detect Ambush skill gives its user the ability to spot potential ambush sites based on terrain and possible modes of attack. It is not specific enough to detect individuals prowling.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Detect Concealment", "Espionage", "espionage", 25, 5,
  "This is a skill which enables the individual to spot and recognize camouflage, concealed structures/buildings and vehicles, as well as the ability to construct unobtrusive shelters, use camouflage and blend into the environment.",
  "Base Skill: 25% +5% per level.\nThe Detect Concealment skill is specifically designed to help a character to spot things that are deliberately hidden. For spotting \"normal\" things, the character can use the rules for Perception rolls.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "+5% to the Camouflage skill", bonusesText: "" });

skill("Disguise", "Espionage", "espionage", 25, 5,
  "The character knows how to apply make-up, wigs, skin putty, dyes, and other special effects in order to alter his appearance or that of somebody else.",
  "Base Skill: 25% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "+5% to the Undercover Ops and Impersonation skills.", bonusesText: "" });

skill("Escape Artist", "Espionage", "espionage", 30, 5,
  "The methods, principles, and tricks of escape artists. Includes muscle control (tensing and relaxing muscles), flexing and popping joints, knowledge of knots, and the ability to conceal tiny objects on the person. The character can try slipping out of handcuffs, ropes, straightjacket, etc.",
  "Base Skill: 30% +5% per level.\nPicking locks is a separate and distinct skill.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "+5% to the Pick Locks skill.", bonusesText: "" });

skill("Forgery", "Espionage", "espionage", 20, 5,
  "The techniques of making false copies of official documents, signatures, passports, I.D.s, and other printed material. The forger must have an original or photocopy to work from in order to make an accurate copy.",
  "Base Skill: 20% +5% per level.\nSkilled forgers can recognize other counterfeits but with a skill penalty of -10%.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "+10% if the Art skill is also known to the forger.", bonusesText: "" });

skill("Impersonation", "Espionage", "espionage", 30, 4,
  "This skill enables a character to impersonate another person or general type of person (soldier, worker, etc.). This means he must have a rudimentary (if not comprehensive) knowledge of the person or general type of personnel that he plans to impersonate. This includes a knowledge of that person or type of person or job, work procedure or protocol, local laws and customs, individual habits, dress/uniform/lifestyle, hierarchy of command/leadership, rank, and speaking the proper language(s).",
  "Base Skill: 30% +4% per level.\nA successful impersonation requires the player to roll under his character's Impersonation skill for each of his first THREE encounters. Afterward, the character must roll under his skill for each encounter with an officer, high ranking official or any close friend or close family member who knows the person he is impersonating.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "+10% to the Undercover Ops skill.", bonusesText: "" });

skill("Impersonate Specific", "Espionage", "espionage", 16, 4,
  "To impersonate a specific individual (which may require weeks of study and special disguise)",
  "Base Skill: 16% +4% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "+10% to the Undercover Ops skill.", bonusesText: "" });

skill("Intelligence", "Espionage", "espionage", 32, 4,
  "This is the specific training in the practices and principles of recognizing and analyzing sources of information about the enemy, observation techniques, counterintelligence measures and proper procedure. This includes the practical assessment of sights and sounds, estimation of ranges, what to report, handling prisoners of war, and handling captured documents and equipment (tagging and reporting to group leader or proper authority). This means the character will be able to accurately estimate ranges, the number of enemies, direction, purpose, and assess the importance of specific information. Further intelligence training includes a working knowledge of indigenous guerilla warfare, enemy practices, appearance, and current activities.",
  "Base Skill: 32% +4% per level.\nA failed roll in any of the areas of Intelligence means that the evidence is inconclusive, or that the character has incorrectly assessed the information or situation, and is uncertain what it all means. A failed roll involving individual clues may mean the character has dismissed clues and information as being meaningless.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Interrogation", "Espionage", "espionage", 30, 5,
  "This skill is common among policemen, intelligence officers, and assassins/spies/bounty hunters. The character knows the techniques to get information from (typically unwilling) subjects. This includes such old methods as \"good cop, bad cop\" (one interrogator is threatening and intimidating, the other is sympathetic and friendly), deceiving and misleading the subject into giving away information, and similar. The character can also judge if the subject is lying (the Game Master might assess bonuses and penalties depending on how good a liar the subject is, and/or on the victim's M.E., M.A. and/or P.B.; the higher any or each of these attributes, the more convincing the lies). This skill also includes some basic knowledge on methods of torture, from basic tactics like depriving the subject of sleep, to the use of \"medieval\" instruments, drugs and psionics.",
  "Base Skill: 30% +5% per level.\nOnly evil characters will engage in actual torture. -20% on supernatural creatures, monsters and dragons.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Pick Locks", "Espionage", "espionage", 30, 5,
  "The character knows the methods and tools for picking/opening key and basic tumbler type locks. This does not include sophisticated computer or electronic locks.",
  "Base Skill: 30% +5% per level.\nIt takes 1D6 melee rounds for each attempt to pick a lock. A failed roll means the lock holds; try again.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Pick Pockets", "Espionage", "espionage", 25, 5,
  "An ability to remove items from a person without their being aware of it.",
  "Base Skill: 25% +5% per level.\nIf a pick pocket attempt fails, the item has not been removed and there is a 01-67% likelihood of the intended victim recognizing the intent of the action.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Sniper", "Espionage", "espionage", 0, 0,
  "This skill represents special training in long-range rifle firing and marksmanship. Only rifles that can be made to fire a single round or blast can be used for sniping (no automatic/multi-firing rifles).",
  "COMBAT BONUS SKILL — not a percentile roll. Enter the aimed-shot strike bonus from the book in the Bonuses field (RUE lists +2 to strike on an aimed shot — VERIFY vs your copy).",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "+2 to strike on a Called or Aimed Shot only.", bonusesText: "" });

skill("Tracking", "Espionage", "espionage", 25, 5,
  "Visual tracking is the identification of tracks, and following the path of men or animals by the signs they leave on the ground and vegetation. Tracking is a precise art, requiring much practice. The skill includes the evaluation of tracks, indicating whether the person being tracked is loaded down with equipment, running, moving slowly (by measuring the space between steps), and so on. By this means, the tracker can estimate the person's rate of movement, apparent direction, the number of persons in the party, and whether the person knows he is being followed. Other methods of tracking require recognizing other telltale signs, such as blood and other stains, broken and displaced vegetation, overturned rocks, litter (such as cigarette butts, ration cans, candy wrappers, soiled bandages and campfire remains), and even odors carried by the wind. Counter-Tracking techniques are also known, such as covering one's trail, misdirection, parallel trails, avoiding obvious pitfalls like littering and others.",
  "Base Skill: 25% +5% per level.\nCharacters attempting to follow a skilled tracker who is deliberately trying to conceal his trail suffer a penalty of -25% to stay on him.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Undercover Ops", "Espionage", "espionage", 30, 5,
  "Training in undercover operations in which the character learns the methods and techniques of blending smoothly into the background and appearing as if he belongs there. Just another unmemorable face in the crowd or one of the guys), as well as assuming a false identity and playing a \"role\" to track, spy upon or gather information or evidence.",
  "Base Skill: 30% +5% per level.\nThis skill is typically reserved for law enforcement, espionage agents, mercenaries, con artists and other criminal types.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Wilderness Survival", "Espionage", "espionage", 30, 5,
  "Techniques for finding and getting water, food, shelter, and help when stranded in wild forests, deserts, or mountains.",
  "Base Skill: 30% +5% per level.\nCharacters without this skill will not be able to stay healthy for more than a few days in the wilderness once their supplies run out.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

// ═══ MECHANICAL ═══════════════════════════════════════════
skill("Aircraft Mechanics", "Mechanical", "mechanical", 25, 5,
  "The understanding of aerodynamics and the training to repair, rebuild, modify and redesign conventional aircraft, including propeller types, jets, helicopters, hovercycles, rocket bikes, and hovercraft. Work on military aircraft is limited to body work unless the character also has the Weapon Systems skill. Experimental aircraft and spacecraft are not included.",
  "Base Skill: 25% +5% per level.\nWorking on the wings and flight systems of power armor and robots is very different from true aircraft and suffers a -40% skill penalty. However, the character can assist an engineer or robotics specialist by following his instructions with only a -15% skill penalty.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Armorer/Field Armorer", "Mechanical", "mechanical", 40, 5,
  "This is a somewhat simplistic and basic version of the weapons engineer skill as it applies to infantry weapons. A competent armorer character can maintain, fix, modify, mount, reload/charge ammunition, and figure out most small arms. The armorer can repair all types of pistols and rifles, repair minor damage to body armor (20 M.D. maximum), adjust targeting sights, use and repair optical enhancements, reload missiles and ammo drums, recharge E-Clips, install/mount a rail gun or machine-gun on a vehicle, and even fix most simple robot and bionic weapons like forearm blasters and retractable blades, as well as make arrows and arrowheads, sharpen blades/weapons, make horseshoes and basic metal items (including nails, spikes, and chain links). He can also deactivate, reset and fix simple traps (roll for each attempt).",
  "Base Skill: 40% +5% per level.\nAutomatically gets the Basic Mechanics skill at 30% +5% per level as part of this package.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Automotive Mechanics", "Mechanical", "mechanical", 25, 5,
  "The ability to repair, rebuild, modify, and redesign conventional vehicles with internal combustion (gas) engines. It also includes body work, turbine engines, methanol, ethanol and diesel truck engines.",
  "Base Skill: 25% +5% per level.\nWorking on hover jet systems for ground vehicles is possible, but with a -20% penalty. Working on reactor engines there is a -40% penalty.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Basic Mechanics", "Mechanical", "mechanical", 30, 5,
  "A general familiarity and understanding of basic mechanics. This character can fix a toaster, repair a bicycle, replace a belt on a motor, repair or replace a switch, handle or knob, replace a spark plug, change oil, assist in automobile repairs, maintain machinery, read a schematic and similar fundamental tasks.",
  "Base Skill: 30% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Bioware Mechanics", "Mechanical", "mechanical", 30, 5,
  "\"Bioware\" is cybernetics. A character with this skill can identify, service and repair all cybernetic and bionic systems, from the simplest data plug to the most sophisticated of the artificial eyes. This, however, is limited to the actual machine and electronics of cybernetics, not designing or building bionic components (unless part of a kit to be assembled). Nor does the skill apply to living Bio-Systems. like artificial skin, organic eyes, and internal organs.",
  "Base Skill: 30% +5% per level.\nA Bioware Mechanic can fix a cybernetic or bionic machine part-hand, arm, leg, mechanical implant, weapon but cannot install it or attach it to a living body unless he also has the Cyber-Doc skill. -20% when working with sophisticated bionic systems including bionic weaponry or alien cybernetic units.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Mechanical Engineering, Basic Math", selectModifiers: "", bonusesText: "" });

skill("Locksmith", "Mechanical", "mechanical", 25, 5,
  "The study of lock designs and the ability to repair, build, modify and open locks. The methods, techniques, and tools of lock picking include the old-style key and tumbler, combination, and modem electrical locking systems. Time requirements: 1D4 melees to open an antiquated key type lock or simple tumbler/combination type, 1D4 minutes to open an elaborate tumbler type, 2D4 minutes to open a simple electronic lock (usually by patching in a bypass system), and 1D4 hours to break a complex, state-of-the-art electronic lock system such as those used in high security and restricted areas. Super high-tech systems, such as those used by the Coalition's military and government, will require 3D4 hours and have a skill penalty of -20%.",
  "Base Skill: 25% +5% per level.\nIf an unsuccessful skill roll is made, the lock is not opened and the process must be repeated. If an attempt to open an electronic lock fails, roll again. A second failed roll means that the lock is irreparably damaged and can not be opened! (-5% penalty when working on complex or high-tech locks)",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Basic Electronics", selectModifiers: "Electrical Engineer (+5% bonus).", bonusesText: "" });

skill("Mechanical Engineer", "Mechanical", "mechanical", 25, 5,
  "Training, understanding, and knowledge of how machinery is designed, operated, built, and maintained. Characters can attempt to redesign, modify, repair, construct, or sabotage mechanical devices (includes nuclear reactor driven turbines and atomic engines). The player must first roll to see if his character can figure out how to operate, analyze and design a machine. When a successful diagnostic roll has been made, roll again to determine when the charactercan fix/change/build the mechanism.",
  "Base Skill: 25% +5% per level.\nAdd a one time bonus of 5% to the Locksmith and Surveillance Systems skills if Mechanical Engineering is also known. There is a -30% penalty when working on alien or extremely unfamiliar mechanics. This includes Techno-Wizard mechanics. The mechanic may be able to puzzle out some of the basic aspects of a device created by Techno-Wizardry, and may be able to figure out how to operate the machine, but will not be able to fully fathom how it works nor how to repair it.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Basic Math, Advanced Mathematics, Basic Electronics, Literacy", selectModifiers: "", bonusesText: "" });

skill("Robot Mechanics", "Mechanical", "mechanical", 20, 5,
  "This is the specific study of advanced mechanics as it applies to robotics. Those skilled in this discipline can repair, modity, build, and sabotage robots, including the creations of the Coalition, power armor, and exoskeletons. There is a -30% penalty when working with alien or extremely unfamiliar mechanics.",
  "Base Skill: 20% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Mechanical Engineer", selectModifiers: "", bonusesText: "" });

skill("Space Drive Repair Ion", "Mechanical", "mechanical", 30, 5,
  "A space technology not appropriate for 99.9% of those on Rifts Earth. Character has complete knowledge of Ion drives, can tune, repair and build if the character has access to spare parts.",
  "Base Skill: 30% +5% per level.\nA character can attempt to repair other types of drives, but at a penalty of -40%.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Space Drive Repair Plasma", "Mechanical", "mechanical", 30, 5,
  "A space technology not appropriate for 99.9% of those on Rifts Earth. Character has complete knowledge of Plasma drives, can tune, repair and build if the character has access to spare parts.",
  "Base Skill: 30% +5% per level.\nA character can attempt to repair other types of drives, but at a penalty of -40%.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Space Drive Repair Traction", "Mechanical", "mechanical", 30, 5,
  "A space technology not appropriate for 99.9% of those on Rifts Earth. Character has complete knowledge of Traction drives, can tune, repair and build if the character has access to spare parts.",
  "Base Skill: 30% +5% per level.\nA character can attempt to repair other types of drives, but at a penalty of -40%.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Space Drive Repair Rift", "Mechanical", "mechanical", 30, 5,
  "A space technology not appropriate for 99.9% of those on Rifts Earth. Character has complete knowledge of Rift drives, can tune, repair and build if the character has access to spare parts.",
  "Base Skill: 30% +5% per level.\nA character can attempt to repair other types of drives, but at a penalty of -40%.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Space Satellite Systems", "Mechanical", "mechanical", 30, 5,
  "A space technology not appropriate for 99.9% of those on Rifts Earth, but which is common knowledge on Phase World® and other space settings. Satellites range from communication models to navigation beacons, spy systems, burnt-out husks with salvageable parts and military killer satellites. This skill allows a character to identity, strip down and repair any of them.",
  "Base Skill: 30% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Mechanical Engineering, Basic Electronics.", selectModifiers: "", bonusesText: "" });

skill("Spaceship Mechanics", "Mechanical", "mechanical", 22, 5,
  "A space technology not appropriate for 99.9% of those on Rifts Earth, but which is common knowledge on Phase World® and other space settings. The ability to repair, rebuild, modify and redesign conventional vehicles. This skill covers a basic understanding of gravitonic systems, but only includes the most rudimentary knowledge of Phase technology, and no skills on Rift drives. Conventional ship systems (communications, hull, life support) are pretty much the same everywhere.",
  "Base Skill: 22% +5% per level.\n-30% penalty on alien systems.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Mechanical Engineer, Basic Electronics", selectModifiers: "", bonusesText: "" });

skill("Submersible Vehicle Mechanics", "Mechanical", "mechanical", 25, 5,
  "Training in the diagnosis and repair of submersible vehicles, including submarines, underwater robots, probes and stations.",
  "Base Skill: 25% +5% per level.\nMechanical engineers can also effect repairs but at -15% and aircraft mechanics are at -40%",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Vehicle Armorer", "Mechanical", "mechanical", 30, 5,
  "A specialized skill in which the character can do more than just tinker with the mechanics of a vehicle. Extra Armor: Replace S.D.C. body with M.D.C. body or add more M.D.C. to M.D.C. armor at 12 M.D.C. per level of experience to military/combat vehicles, full-sized vans and large trucks; 5 M.D.C. per level on commercial (non-combat) vehicles. Add a ram prow: (does an extra 2D6 M.D. damage on ram attacks, plus 1D6 M.D. for every 40 mph/64 km of speed; ram prow has 1D4x 10 M.D.C. +7 M.D.C. per level experience. Custom Body Modifications: Repaint, modify or completely reconfigure the body of a vehicle to change or disguise its original appearance, or to make it look innocent, old, new, scary or sleek. Replace S.D.C. components and parts with M D. C. equivalents.",
  "Base Skill: 30% +5% per level.\nAutomatically gets the Basic Mechanics skill at +20% as part of this package. Taking this skill in conjunction with Automotive Mechanics provides a +10% bonus to the automotive skill.",
  { requiredOCC: "Military Technical Officer, Operator, Engineers, Mechanics", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Weapons Engineer", "Mechanical", "mechanical", 25, 5,
  "The complete understanding of military class weapon systems, cannons, recoilless rifles, launch systems, missiles, rockets, heavy energy weapons, and their incorporation into military vehicles. The character can handle, maintain, repair, unjam, clean, modify, mount, and figure out most weapon systems and power supplies, and recharge batteries and E-Clips. He can repair an assault rifle, handle heavy weapons and install a missile system into a vehicle or a suitcase launcher. The engineer can also add and repair armor and is an expert welder.",
  "Base Skill: 25% +5% per level.\n-30% when working on TW or very alien weapon systems or vehicles.",
  { requiredOCC: "Mechanical Engineering", requiredLocation: "", requiredSkills: "", selectModifiers: "+1 to strike when using heavy weapons or vehicular weapon systems.", bonusesText: "" });

// ═══ MEDICAL ══════════════════════════════════════════════
skill("Animal Husbandry", "Medical", "medical", 35, 5,
  "Knowledge in the behavior, care, feeding, breeding, reproduction habits and health of domesticated animals such as cattle, sheep, goats, horses, ducks, chickens, dogs, cats, and similar livestock and pets. The percentile number indicates the degree of knowledge and skill one has about animals and their care. Reduce the skill ability by half when caring for captive or injured wild animals.",
  "Base Skill: 35% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Brewing Medicinal", "Medical", "medical", 25, 5,
  "This is the making of teas, elixirs, tonics, vapors (breathed in rather than drunken) and other \"brews\" for medicinal purposes.",
  "Base Skill: 25% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "Adds a +5% to Holistic Medicine if the skill is known.", bonusesText: "" });

skill("Medicinal Effectiveness", "Medical", "medical", 30, 5,
  "The effectiveness of the medicinal teas, elixirs, tonics, vapors (breathed in rather than drunken) and other \"brews\".",
  "Base Skill: 30% +5% per level.\nBonus Skill to Brewing Medicinal. Add to sheet",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Brewing Medicinal", selectModifiers: "", bonusesText: "" });

skill("Crime Scene Investigation", "Medical", "medical", 35, 5,
  "The procedures, methods, and techniques in police crime scene investigation, including protecting the integrity of a crime scene, gathering and preserving evidence, fingerprinting, recognizing and preserving DNA evidence, ballistics (matching bullets to weapons and angles of impact), and finding, processing and analyzing clues and evidence.",
  "Base Skill: 35% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Biology, Chemistry, Chemistry: Analytical, Advanced Mathematics, Literacy", selectModifiers: "+1 to Perception Rolls.", bonusesText: "" });

skill("Entomological Medicine", "Medical", "medical", 40, 5,
  "This skill involves the unique specialization in insect biology and its applications to medicine and science. Body Fixers/Doctors versed in Entomological Medicine will be able to cure most insect complaints and injury, from diseases to broken limbs and cracked chitin, but even they work at a -10% skill penalty (applied to M.D. skill).",
  "Base Skill: 40% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Basic Math, Chemistry, or Chemistry: Analytical", selectModifiers: "", bonusesText: "" });

skill("Entomological Medicine Treatment", "Medical", "medical", 20, 5,
  "Treat insectoids and create anti-venoms and drugs using insect chemicals.",
  "Base Skill: 20% +5% per level.\nBonus Skill to Entomological Medicine. Add to sheet",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Entomological Medicine", selectModifiers: "", bonusesText: "" });

skill("Field Surgery", "Medical", "medical", 16, 4,
  "This skill reflects training in emergency, life-saving surgical procedures that can be performed \"in the field\" to keep critically wounded individuals alive. Given the proper tools, the field surgeon can perform amputations, suture tom arteries, check internal bleeding, cauterize wounds, give blood transfusions and even install cybernetic implants (the latter is done with a penalty of -15% unless the character has basic cybernetics skill). Field expedient surgery is a dangerous proposition that all too often results in the death of the patient. Because of the risk involved, field surgery is attempted only when it is the only chance the wounded character has for survival! If the operation is successful the patient lives and can be evacuated to a hospital, but a failed roll results in the immediate death of the patient.",
  "Base Skill: 16% +4% per level.\n+14% if the character is also a Medical Doctor.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "+14 if the character is also an M.D.", bonusesText: "" });

skill("First Aid", "Medical", "medical", 45, 5,
  "Rudimentary medical treatment which includes how to bandage wounds, stop bleeding, administer CPR, artificial respiration, and use antiseptics and common anti-inflammatory drugs and painkillers.",
  "Base Skill: 45% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Forensics", "Medical", "medical", 35, 5,
  "Forensic medicine, the proper medical procedure of performing an autopsy on a corpse, finding evidence regarding the time of death, cause of death, age and sex of the victim, identifying physical trauma, internal injury, the presence of toxins, and other details related to the condition of the body and cause of death.",
  "Base Skill: 35% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Biology, Chemistry", selectModifiers: "", bonusesText: "" });

skill("Holistic Medicine", "Medical", "medical", 30, 5,
  "Training in the recognition, preparation, and application of natural medicines usually made from whole plants and/or their parts (roots, leaves, fruit). The Holistic Doctor is basically a pharmacist and naturalist who creates drugs from herbs and vegetation, as well as studies and treats common ailments. He can find and use plants to create salves, balms, ointments, and lotions to soothe bums, boils, rashes, and insect bites, reduce swelling, as well as create local anesthetics, and to heal wounds faster (twice as quick as normal). Potions and tonics are created to settle upset stomachs, induce drowsiness, or hallucinations. The individual can also make poison (hemlock and mandrake for example).",
  "Base Skill: 30% +5% per level.\n+10% to the Brewing, IdentifY Plants & Fruits and Preserve Food skills.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Holistic Medicine Effectiveness", "Medical", "medical", 20, 5,
  "The healer's skill at successfully treating the problem with herbs and making healing teas, tonics and salves.",
  "Base Skill: 20% +5% per level.\nBonus skill to Holistic Medicine. Add to sheet",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Holistic Medicine", selectModifiers: "", bonusesText: "" });

skill("Juicer Technology", "Medical", "medical", 40, 5,
  "This is a medical specialty dealing with the Juicer! Note: A character needs this skill and an M.D. in Medicine or Cybernetics to install the bio-comp and other Juicer implants. This skill allows a doctor to supply and administer the right drugs to a Juicer, recognize Juicer variants, diagnose most Juicer side effects and syndromes, tell if the Juicer is beyond detoxification, administer detox, and assist in the Juicer creation process at a Juicer Augmentation facility.",
  "Base Skill: 40% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Paramedic", "Medical", "medical", 40, 5,
  "An advanced form of emergency medical treatment which includes all first-aid techniques, the setting of broken bones, suturing of wounds, use of oxygen and emergency medical equipment, administering of drugs, knowledge of how to move a critically injured person, the removal of cybernetic prosthetics, and other life-saving techniques.",
  "Base Skill: 40% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Medical Doctor", "Medical", "medical", 60, 5,
  "The medical doctor is a trained surgeon and has a doctorate in the medical sciences. Areas of training include: clinical skills, medical discipline, code of ethics, physiology (muscle, respiratory, blood, body fluids), pathology (diseases, their structure and function), rudimentary pharmacology (use, reaction, and interaction of drugs), laboratory skills, and techniques and methods of data collection.",
  "Base Skill: 60% +5% per level.\nThe medical doctor (M.D.) is also a trained surgeon and has a basic knowledge regarding cybernetics. This means the M.D. can remove and attach most cybernetic mechanisms (although at a penalty of -10%, and -40% on bionics).",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Biology, Pathology, Chemistry, Basic Math or Advanced Mathematics, Literacy", selectModifiers: "", bonusesText: "" });

skill("Medical Doctor Treatment", "Medical", "medical", 50, 5,
  "Atempt to treat the illness.",
  "Base Skill: 50% +5% per level.\nBonus Skill to Medical Doctor. Add to sheet",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Medical Doctor", selectModifiers: "", bonusesText: "" });

skill("Cybernetic Medicine", "Medical", "medical", 40, 5,
  "This doctor is a specialist in the science of cybernetics and a master surgeon. The character has all the basic knowledge and requirements of the Medical Doctor, although his diagnostic skills are nowhere near as honed, but is a specialist in surgery involving the removal of limbs and internal organs and the surgical attachment of cybernetic replacements (artificial organs and prosthetics). The Cyber-Doc can also work on, calibrate and repair, bionic implants as well as install them, but suffers a -15% skill penalty. The science of bionics is much more complex and machine oriented than basic cybernetics.",
  "Base Skill: 40% +5% per level.\nBionic Skill Upgrade: A Doctor in Cybernetics needs to select this Cybernetic Medicine skill twice and Electrical Engineering to be capable of working on bionic systems.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Cybernetic Medicine Treatment", "Medical", "medical", 60, 5,
  "Doctor's ability to perform complex surgery, remove and install all types of cybernetic organs and devices, implants and bionics.",
  "Base Skill: 60% +5% per level.\nBonus Skill to M.D in Cybernetics. Add to sheet",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Cybernetic Medicine", selectModifiers: "", bonusesText: "" });

skill("Pathology", "Medical", "medical", 40, 5,
  "This branch of medicine deals with the nature of diseases, their cause, and symptoms, and the functional and structural changes caused by disease. Training includes anatomy, physiology, cell biology, manifestation of disease, tissue injury and repair, abnormal cell structure, metabolism, diagnosis of human diseases, tissue culture methods and applications, analysis of drugs in biological samples and laboratory research, investigative methods, and use of instruments and equipment.",
  "Base Skill: 40% +5% per level.\n+5% to Forensics skill.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Biology, Chemistry, Literacy", selectModifiers: "", bonusesText: "" });

skill("Psychology", "Medical", "medical", 35, 5,
  "The principles, theories and evaluation of human behavior as they apply to psychology and psycho-therapy. Includes analysis, understanding and treatment of emotional and mental illness, motivational and perceptual disorders, personality assessment, alcoholism, drug abuse and treatment, and other aspects and studies of the mind and human behavior.",
  "Base Skill: 35% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Biology, Chemistry, Literacy", selectModifiers: "", bonusesText: "" });

skill("Veterinary Science", "Medical", "medical", 50, 4,
  "A doctor who specializes in the medical care and treatment of wild and domestic animals. Areas of study are biology (specifically animal), reproduction, breeding, animal anatomy, physiology, pathology, toxicology, surgery, suturing wounds, setting bones, disease, medical care and other applications and techniques in the medical treatment of animals.",
  "Base Skill: 50% +4% per level.\nA Medical Doctor can also treat an animal, but is at a -35% penalty to do so.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Biology, Animal Husbandry", selectModifiers: "", bonusesText: "" });

skill("Sea Holistic Medicine", "Medical", "medical", 30, 5,
  "This skill is rarely known to characters living on the mainland. It is most common among seafaring folk and those who live on islands or along an ocean coastline. The skill includes training in the recognition, preparation, and applications of natural medicines derived from aquatic plants/seaweed and sea animals, including ink, blood, poisons, glands and other secretions and chemicals. This skill also includes the knowledge of where to find the necessary plants or animals, how to extract the necessary components and some knowledge of legends as they pertain to the healing properties of the sea and sea animals. Otherwise, the skill is fundamentally the same as the standard Holistic Medicine skill.",
  "Base Skill: 30% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Sea Holistic Effectiveness", "Medical", "medical", 20, 5,
  "The healer's skill at successfully treating the problem with herbs and making healing teas, tonics and salves from the sea.",
  "Base Skill: 20% +5% per level.\nBonuse skill to Sea Holistic Medicine. Add to sheet.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Sea Holistic Medicine", selectModifiers: "", bonusesText: "" });

// ═══ MILITARY ═════════════════════════════════════════════
skill("Camouflage", "Military", "military", 20, 5,
  "The skill of concealing a fixed base position, vehicle, equipment or individual, using natural and/or artificial materials. A fair amount of time is involved in the preparation of a larger position. Large cargo nets, cut branches or underbrush are used most often in camouflage. This skill is also used to conceal traps.",
  "Base Skill: 20% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Demolitions", "Military", "military", 60, 3,
  "Demolitions provides the character with an advanced knowledge in the use and workings of explosives and detonation devices for the purpose of blowing up bridges, buildings, barriers, fortifications and sabotage. This includes all types of explosives, such as mines, dynamite, plastics, nitro, blasting caps, etc. It also includes a basic understanding of the strategic placement of mines and booby traps. This skill increases the character' s awareness of suspicious rope, string, and wire.",
  "Base Skill: 60% +3% per level.\nA failed roll means a dud; no explosion.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Demolitions Disposal", "Military", "military", 60, 3,
  "The skill to safely defuse unexploded mines, bombs, explosive booby traps, dud artillery rounds, dud explosive charges, or any other type of explosive device.",
  "Base Skill: 60% +3% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Demolitions: Underwater", "Military", "military", 56, 4,
  "Fundamentally the same basic skills and training as Demolitions, but with an emphasis on using explosives in an underwater environment, including underwater techniques, area effect, sound wave damage, different types of explosives, as well as arming, disarming and repairing torpedoes and depth charges.",
  "Base Skill: 56% +4% per level.\nAny character with the Demolitions skill can use explosives underwater, but is -10%.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Field Armorer & Munitions Expert", "Military", "military", 40, 5,
  "This is a somewhat simplistic and basic version of the Weapons Engineer as it applies to infantry weapons. The character can maintain, unj am, fix, modify, mount, reload ammunition, recharge E-Clips, and figure out most small arms (conventional and energy pistols and rifles). The Armorer can repair all types of pistols and rifles, repair minor damage to body armor (20 M.D.C. maximum), adjust targeting sights, use and repair optical enhancements, reload missiles and ammo drums, install/mount machine-guns and rocket launchers on a vehicle, as well sharpen blades, make arrows and arrowheads, make horseshoes and basic metal items (nails, spikes, and chain links). A major overhaul is not possible.",
  "Base Skill: 40% +5% per level.\nAutomatically gets the Basic Mechanics skill at 30% +5% per level as part of this package.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Military Etiquette", "Military", "military", 35, 5,
  "A clear understanding of the way the military works, including rules of behavior (when to salute, how to address superiors and subalterns, etc.), military procedures and routines, standard issue of equipment, special ordering procedures, proper display of rank and medals, advancement in rank (and the duties that come with it), proper troop formations, how to deal with military bureaucracy, the chain of command, proper channels, who to contact to get things done, and other useful information in matters of military protocol and bureaucracy.",
  "Base Skill: 35% +5% per level.\nAll soldiers have a fundamental knowledge of military etiquette (base skill 30% with no improvement), but this skill is much more complete with a strong knowledge of what is expected, correct and the formal approach (i.e. by the book knowledge).",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Military Fortification", "Military", "military", 30, 5,
  "Knowledge in the design and building of basic defensive structures suitable for modern Mega-Damage combat. If provided with the right materials and time, the character can build defensive walls, bunkers, and tank traps, as well as understand the value of natural terrain that includes obstacles to impede movement and protective structures to shield friendly forces from enemy fire. The character is trained to prepare barbed wire, tank obstacles, tanglefoot wire, booby traps, trenches, tank ditches, foxholes/shell scrapes, reinforced concrete or earthen walls, bunker complexes, rail gun/mortar emplacements, tunnel systems and similar defensive constructions.",
  "Base Skill: 30% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Naval History", "Military", "military", 30, 5,
  "A basic historical knowledge of past navies, naval warfare, and naval combat vessels, as well as a general knowledge about the oceans and seas of Rifts Earth and the beings who travel them. The base skill percentage indicates the approximate degree of information the character has learned or can remember accurately.",
  "Base Skill: 30% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Naval Tactics", "Military", "military", 25, 5,
  "A basic understanding of naval military combat strategies and tactics, preferred methods of fighting in both small scale engagements and full battles, river, lake and sea combat tactics, boarding and capturing enemy vessels, the \"do's\" and \"don'ts\" of naval warfare, and other basic naval military methods. A successful tactics roll will reveal some hints as to the best way to approach a potential combat situation, like recognizing a potential attack/retreat area, combat or defensive weaknesses, a trap, etc.",
  "Base Skill: 25% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("NBC Warfare", "Military", "military", 35, 5,
  "This is the knowledge of safety precautions to protect oneself and others from the effects of nuclear, biological or chemical warfare, waste and contamination. The character is also knowledgeable in the safe handling and \"clean-up\" and containment of such hazardous materials.",
  "Base Skill: 35% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Parachuting (uncommon)", "Military", "military", 40, 5,
  "The methods, procedures, and techniques of parachuting, packing the chute, skydiving, precision landing, landing without injury, and practice of j umping from a high altitude aircraft. The advantage of parachuting is secrecy, since the troopers' insertion into enemy territory is silent and often goes unnoticed. Even if the jump goes without a hitch, there is a 20% chance of taking 6D6 S.D.C. from an awkward landing, even if wearing M.D. armor.",
  "Base Skill: 40% +5% per level.\nFailure on a Parachuting roll indicates that there are complications somewhere along the jump and the chute does not open or opens late. Even a character in M.D.C. body armor will take damage from the high velocity impact! 1D6 x 10+60 direct to Hit Points!",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Recognize Weapon Quality", "Military", "military", 25, 5,
  "The ability to accurately determine a weapon's durability, reliability, and quality by physically examining it. This includes knowing which manufacturers are reputed to make the best weapons, the ability to recognize damage or signs of wear or misuse, modifications/customization, whether the weapon can be made as good as new with a little repair work and/or cleaning, whether it is a cheap (or quality) \"knock-off' (copy/imitation), and so on.",
  "Base Skill: 25% +5% per level.\nReduce the skill ability by half if the item is not actually handled (seen but not physically examined).",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Trap & Mine Detection", "Military", "military", 20, 5,
  "Knowledge of the strategic placement of booby traps and mines, the telltale trademarks and indications of traps and mines, how to avoid them, and the use of mine and explosive detection equipment. The character has been trained to watch for suspicious objects, dirt mounds, trip wires and camouflaging materials that may denote the presence of a trap. Simple snare traps and trip wires can be easily disarmed by the character, but the Demolitions Disposal skill is required to disarm mines, explosives or complex traps.",
  "Base Skill: 20% +5% per level.\nAdd +50% when using special detection equipment to locate mines/explosives and +10% to locate other types of traps with detection equipment. Dog Boys and other nonhumans with a keen sense of smell are +10% to \"sniff out\" explosives.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

// ═══ PHYSICAL ═════════════════════════════════════════════
skill("Acrobatics", "Physical", "physical", 0, 0,
  "Aerial feats of agility and strength, such as walking a tightrope, high wire, trapeze, and stunts performed above ground. Other physical abilities include rolls, somersaults, leaps, and falls. Provides all of the following: An automatic kick attack at first level (1D8 S.D.C. damage), Sense of balance (60% +5% per level), Walk tightrope or high wire (60% +3% per level), Climb Rope (80% +2% per level), Back Flip (60% +5% per level), Basic Climb ability (40%; or adds a + 15% to Climbing skill), Basic Prowl ability (30%; or adds a +5% to Prowl skill).",
  "BONUS SKILL — not a percentile roll. Grants the bonuses listed in the description; add them to the sheet manually (attributes, S.D.C., combat stats, or the Bonuses field of other skills).",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "+2 bonus to roll with impact, +1 to P.S., P.P., and P.E. attributes, +1D6 to S.D.C., and no fear of heights.", bonusesText: "" });

skill("Aerobic Athletics", "Physical", "physical", 0, 0,
  "A type of aerobic exercise to build the body, develop reflexes and grace, and learn a few very basic self-defense moves.",
  "BONUS SKILL — not a percentile roll. Grants the bonuses listed in the description; add them to the sheet manually (attributes, S.D.C., combat stats, or the Bonuses field of other skills).",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "+1 to disarm, +1 to pull punch, +2D4 S.D.C. and +2 to kicking damage. Sense of balance (30% +5% per level of experience).", bonusesText: "" });

skill("Athletics (General)", "Physical", "physical", 0, 0,
  "Training in, and enjoyment of, vigorous exertion for non-professional, competitive sports, exercises, and contests of strength, endurance, and agility. Includes sports and hobbies such as tennis, track and field, skateboarding, bicycling, golf, skiing, swimming, bowling, baseball, basketball, and similar activities.",
  "BONUS SKILL — not a percentile roll. Grants the bonuses listed in the description; add them to the sheet manually (attributes, S.D.C., combat stats, or the Bonuses field of other skills).",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "+1 to parry and dodge, +1 to roll with impact, +1 to P.S., +1D6 to Spd and +1D8 to S.D.C", bonusesText: "" });

skill("Body Building & Weight Lifting", "Physical", "physical", 0, 0,
  "The building of muscle tone and body strength through weight lifting and exercise.",
  "BONUS SKILL — not a percentile roll. Grants the bonuses listed in the description; add them to the sheet manually (attributes, S.D.C., combat stats, or the Bonuses field of other skills).",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "+2 to P.S. and +10 S.D.C", bonusesText: "" });

skill("Boxing", "Physical", "physical", 0, 0,
  "Classic art of fighting with fists. Training helps build the body and reflexes. Skilled boxers will automatically knockout opponents on a roll of a Natural Twenty. The victim of a knockout will remain unconscious for 1D6 melees. Unlike normal knockout/stun, the player does not have to announce that he is trying to knockout his opponent before making a roll to strike.",
  "BONUS SKILL — not a percentile roll. Grants the bonuses listed in the description; add them to the sheet manually (attributes, S.D.C., combat stats, or the Bonuses field of other skills).",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "+1 additional attack per melee round, +2 to parry and dodge, +1 to roll with impact/punch, +2 to P.S. and +3D6 to S.D.C", bonusesText: "" });

skill("Climbing", "Physical", "physical", 40, 5,
  "Knowledge of the tools and techniques for climbing up sheer surfaces. Players should roll once for every 20 feet (6m) of a vertical climb. If the roll fails, it means he is losing his grip, however, every \"skilled\" climber gets a chance to regain his grip, roll again. Two consecutive failed rolls means the character falls (takes 1D6 damage per 10 feet/3m of a fall).",
  "Base Skill: 40% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Rappelling", "Physical", "physical", 30, 5,
  "Is a specialized rope climbing skill used in scaling walls, towers, and cliff facings. For game purposes, rappelling will include ascending and descending climbs.",
  "Base Skill: 30% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Fencing", "Physical", "physical", 0, 0,
  "This is the formal art of fighting with a sword and dagger. This includes not only Olympic style fencing with a foil, epee or saber, but also Kendo (the use of a samurai katana) and other blades. Swordsmanship is practiced in many places and is also all the rage, especially among the nobility, for its flashy looks and for the amount of blood it can spill.",
  "BONUS SKILL — not a percentile roll. Grants the bonuses listed in the description; add them to the sheet manually (attributes, S.D.C., combat stats, or the Bonuses field of other skills).",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "W.P. Sword", selectModifiers: "+1 to strike and parry with a sword or dagger, and +1D6 to damage with a sword.", bonusesText: "" });

skill("Forced March", "Physical", "physical", 0, 0,
  "Practiced training in uniform marching with a full field pack and weapons. This is done at an even pace and rhythm that enables the marchers to cover great distances on foot at a faster than normal pace. Increase the normal Physical Endurance rate as to how long an activity like marching can be maintained by five times; applicable only to forced marches/traveling. Maximum speed on a forced march is roughly 60% of one's speed attribute, which enables a large group of dozens to hundreds of soldiers to travel at the same consistent pace; suitable for everybody in the group (never less than a Speed of 8). Likewise, this skill trains soldiers to make coordinated charges and maneuvers, including spear runs, spear and shield placement, and so on.",
  "BONUS SKILL — not a percentile roll. Grants the bonuses listed in the description; add them to the sheet manually (attributes, S.D.C., combat stats, or the Bonuses field of other skills).",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "+2 to P.E., +1D4 to Speed, +2D6 to S.D.C.", bonusesText: "" });

skill("Gymnastics", "Physical", "physical", 0, 0,
  "Learning to do falls, rolls, tumbles, cartwheels, somersaults and to work the parallel bars and rings. This sport builds great upper body strength, grace, and balance. Provides all of the following: An automatic kick attack at first level (2D4 damage), Sense of balance (50% +3% per level), Work parallel bars & rings (60% +3% per level), Back Flip (70% +2% per level), Basic Prowl ability (30%; or adds a +5% to Prowl skill), Basic Climb ability (25%; or adds a +5% to Climbing skill), Climb Rope/Rappel (60% +2% per level).",
  "BONUS SKILL — not a percentile roll. Grants the bonuses listed in the description; add them to the sheet manually (attributes, S.D.C., combat stats, or the Bonuses field of other skills).",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "+2 bonus to roll with impact, +2 to P.S., +1 to P.P., +2 to P.E. and +2D6 to S.D.C.", bonusesText: "" });

skill("Juggling", "Physical", "physical", 35, 5,
  "The ability to toss \"up\" a number of objects, such as balls, clubs, knives, lit torches, and almost any small objects, and keep them continuously in the air with fast hand movements. It is used for the entertainment of others and to develop greater hand-eye coordination; +1 on initiative roll.",
  "Base Skill: 35% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Kick Boxing", "Physical", "physical", 0, 0,
  "Kick Boxing is a form of martial arts self-defense. The character who takes Kick Boxing has done maybe a few months or a year of casual training as a supplement to his usual Hand to Hand Combat skill. Add the following strikes to the usual list of known attacks: Roundhouse Kick (3D6 damage), Axe Kick (2D8 damage), Knee Strike (1D8 damage) and Leap Kick (3D8 damage, but counts as two melee attacks). Humans and other mortals inflict S.D.C./Hit Point damage, characters with Supernatural P. S. inflict the same number of damage dice as M.D., but true supernatural creatures/demons never study formal fighting techniques like Kick Boxing. Characters with Robot P.S. inflict half the damage listed as M.D. (i.e., Roundhouse does 2D4 M.D., Axe Kick 1D8 M.D. and so on).",
  "BONUS SKILL — not a percentile roll. Grants the bonuses listed in the description; add them to the sheet manually (attributes, S.D.C., combat stats, or the Bonuses field of other skills).",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "+1 to P.E., + 1 to P.S. and +1D10 to S.D.C", bonusesText: "" });

skill("Outdoorsmanship", "Physical", "physical", 0, 0,
  "Being an avid outdoorsman and survivalist, this character has spent a significant portion of his/her life living off the land or in the wild. As a result, the character is hardened to the rigors of outdoor life. Add +5% to the Dowsing, Fasting, I.D. Plants and Fruit, and Wilderness Survival skills.",
  "BONUS SKILL — not a percentile roll. Grants the bonuses listed in the description; add them to the sheet manually (attributes, S.D.C., combat stats, or the Bonuses field of other skills).",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Wilderness Survival.", selectModifiers: "+1 to P.E., +2D6 to S.D.C.", bonusesText: "" });

skill("Physical Labor", "Physical", "physical", 0, 0,
  "Not all strength and conditioning comes from deliberate training or sports, some comes from old-fashioned hard work. This skill represents the strength and endurance gained from hard physical labor either due to a physical occupation (such as construction, ditch digging, warehouse work loading and unloading boxes, etc.) or really demanding chores at home such as chopping wood, bailing hay, mending fences, etc.",
  "BONUS SKILL — not a percentile roll. Grants the bonuses listed in the description; add them to the sheet manually (attributes, S.D.C., combat stats, or the Bonuses field of other skills).",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "+2 to P.S., +1 to P.E., +2D8 to S.D.C", bonusesText: "" });

skill("Prowl", "Physical", "physical", 25, 5,
  "This skill helps the character to move with stealth; quietly, slowly, and carefully. Techniques include balance and footing, short steps and pacing, weapon positioning, prone positions for low visibility, and crawling. A failed Prowl roll means that the character has been seen or heard. If the Prowl roll is successful, then the character is not seen or heard and may make a sneak attack.",
  "Base Skill: 25% +5% per level.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("Running", "Physical", "physical", 0, 0,
  "A routine of running and exercise to build speed and endurance. For game purposes, the character is able to run at an even pace (half speed) for a half mile (0.8 km) for every one point of P.E. without undue fatigue. If pushing oneself to the limit and running at maximum speed, the character can run one third that distance before collapsing.",
  "BONUS SKILL — not a percentile roll. Grants the bonuses listed in the description; add them to the sheet manually (attributes, S.D.C., combat stats, or the Bonuses field of other skills).",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "+1 to P.E., +4D4 to Spd, +1D6 to S.D.C.", bonusesText: "" });

skill("Swimming", "Physical", "physical", 50, 5,
  "The rudimentary skill of keeping afloat, swimming, diving and lifesaving techniques. The percentile number indicates the overall quality of form as well as skill of execution. A character can swim a distance equal to 3x his P.S. in yards/meters per melee round. This pace can be maintained for a total of minutes equal to his P.E. attribute number before starting to feel fatigued. Swim Fatigue Note: The act of swimming on the surface of the water has the same fatigue rate as running and medium to heavy exertion, especially at great speed or for very long periods of time.",
  "Base Skill: 50% +5% per level.\nCharacters who fail their Swimming skill roll flounder, but manage to stay afloat, they just don't cover any distance. Three failed swim rolls in a row means the character slips underwater and will drown unless rescued.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "", bonusesText: "" });

skill("SCUBA", "Physical", "physical", 50, 5,
  "The letters S.C.U.B.A. stand for Self-Contained Underwater Breathing Apparatus. Individuals learn the methods and equipment needed for skin diving and underwater swimming. A character can swim a distance equal to 2x his P.S. in yards/meters per melee round. This pace can be maintained for a total of minutes equal to his P.E./endurance before tiring.",
  "Base Skill: 50% +5% per level.\nThe maximum safe depth one can go without getting the bends is about 120 feet (36.5 m). Deeper depths are possible with depressurization, special suits, power armor, robots and submarines.",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "Swimming", selectModifiers: "", bonusesText: "" });

skill("Wrestling", "Physical", "physical", 0, 0,
  "As taught in old high schools and colleges, wrestling is more of a sport than a combat skill, but it does provide some useful combat moves. Wrestling Special Moves: 1. Body Block/Tackle: does 1D4 damage (double if the wrestler is 8 to 12 feet/2.4 to 3.6m tall, and 3D6 damage if larger). The opponent must dodge or parry (push away/deflect attacker) to avoid being knocked down. If knocked down, the opponent loses one melee attack/action and initiative for the rest of that round. 2. Pin/Incapacitate: on a natural roll of 18, 19, or 20. This means that the wrestler can hold his opponent in such a way that his opponent can not physically attack or move. However, the character who is using the \"pin\" hold cannot attack or move without releasing his opponent. 3. Crush/Squeeze: does 1D4 S.D.C. damage per squeeze attack (double damage if 8 to 12 feet/2.4 to 3.6m tall, and 3D6 damage if larger). Each \"squeeze\" counts as one melee action/attack",
  "BONUS SKILL — not a percentile roll. Grants the bonuses listed in the description; add them to the sheet manually (attributes, S.D.C., combat stats, or the Bonuses field of other skills).",
  { requiredOCC: "", requiredLocation: "", requiredSkills: "", selectModifiers: "+1 to roll with impactlfall, +2 to P.S., +1 to P.E., +4D6 to S.D.C.", bonusesText: "" });

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
