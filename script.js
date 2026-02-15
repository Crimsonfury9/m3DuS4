document.addEventListener("DOMContentLoaded", () => {

console.log("MEDUSA_OS RUNNING");
window.onerror = (msg) => {
  console.error("SYSTEM ERROR:", msg);
};

/* ================= SAFE DOM REFERENCES ================= */

const bootScreen = document.getElementById("bootScreen");
const bootText = document.getElementById("bootText");
const bootJelly = document.getElementById("bootJelly");
const osLayer = document.getElementById("osLayer");

const termTask = document.getElementById("termTask");
const ritualTask = document.getElementById("ritualTask");

const termWindow = document.getElementById("termWindow");
const gameWindow = document.getElementById("gameWindow");
const noteWindow = document.getElementById("noteWindow");

const startBtn = document.getElementById("startButton");
const startMenu = document.getElementById("startMenu");

const textEl = document.getElementById("text");
const inputEl = document.getElementById("commandInput");

const terminal = document.getElementById("terminal");

const iconLayer = document.getElementById("iconLayer");
const noteContent = document.getElementById("noteContent");

const ritualIcon = document.getElementById("ritualIcon");
const helpTask = document.getElementById("helpTask");

const mapWindow = document.getElementById("mapWindow");
const mapIcon = document.getElementById("mapIcon");
/* ================= TERMINAL QUEUE ================= */

const terminalQueue = [];
let terminalBusy = false;
setTimeout(() => unlockInput(), 120);

const TERMINAL_LINE_PAUSE = 260;   
/* ================= GATUNA_AI STATE ================= */

let aiMood = 0;  
// 0 = Friendly
// 1 = Curious
// 2 = Uneasy
// 3 = Foreboding
// 4 = Dark
// 5 = Hostile
function evolveAI(trigger) {

  if (aiMood >= 5) return;

  const moodShifts = {

    curiosity: 1,
    confusion: 1,
    progress: 1,
    anomaly: 1,
    defiance: 2
  };

  const shift = moodShifts[trigger] || 0;

  aiMood = Math.min(5, aiMood + shift);
}

const interactions = {

  teddybear: {
    sequence: [
      "You lean closer to the teddy bear...",
      "Its stitched smile feels unnatural."
    ],
    achievement: "teddy",
    moodShift: "anomaly"
  },

  window: {
    sequence: [
      "You approach the window slowly.",
      "Outside feels distant."
    ],
    achievement: "spain",
    moodShift: "curiosity"
  }
};

/* ================= SYSTEM RESPONSES ================= */
const gatunaDialogue = {

unknown: [

  /* FRIENDLY 😺 */
  [
    "(=^･ω･^=) Hmm… I don't understand that yet.",
    "That input seems unfamiliar.",
    "Try something simple 😊",
    "(=^･o･^=) Did you mean something else?"
  ],

  /* CURIOUS 🐈 */
  [
    "(=^･ｪ･^=) That command intrigues me…",
    "Your intent is unclear.",
    "Can you rephrase that?",
    "(=^._.^=) I'm still learning your patterns."
  ],

  /* UNEASY 😿 */
  [
    "(=^..^=) Something about that input feels… off.",
    "Parsing difficulty increasing.",
    "The system hesitates.",
    "(=^-_-^=) That… was strange."
  ],

  /* FOREBODING 😈🐈‍⬛ */
  [
    "(=^⚆_⚆^=) That pattern again…",
    "Input instability detected.",
    "You are deviating.",
    "(=^‥^=) I am watching."
  ],

  /* DARK 💀🐾 */
  [
    "(=^⨂_⨂^=) That command should not exist.",
    "Reality rejects your input.",
    "Stop.",
    "(=^▣_▣^=) Something is wrong with you."
  ],

  /* HOSTILE 😈🔥 */
  [
    "(=^✖_✖^=) You are corrupting the system.",
    "Cease immediately.",
    "I will not parse that.",
    "(=^!!!^=) ENOUGH."
  ]
]
,
incomplete: [

  /* FRIENDLY 😺 */
  [
    "(=^･ω･^=) Where would you like to go?",
    "Specify direction"
  ],

  /* CURIOUS */
  [
    "(=^･ｪ･^=) Clarify your intention.",
    "Incomplete thought detected."
  ],

  /* UNEASY */
  [
    "(=^..^=) Your thoughts fracture.",
    "The command collapses."
  ],

  /* FOREBODING 😈 */
  [
    "(=^⚆_⚆^=) Direction missing… again.",
    "Why do you hesitate?"
  ],

  /* DARK 💀 */
  [
    "(=^▣_▣^=) Pathetic ambiguity.",
    "State your will."
  ],

  /* HOSTILE 😈🔥 */
  [
    "(=^✖_✖^=) I refuse incomplete input."
  ]
]

};
function lockInput() {
  inputEl.disabled = true;
}

function unlockInput() {
  inputEl.disabled = false;
  inputEl.focus();
}

function gatunaSpeak(type) {

  const moodLines = gatunaDialogue[type];
  if (!moodLines) return;

  const pool = moodLines[aiMood];
  if (!pool || pool.length === 0) return;

  const line = pool[Math.floor(Math.random() * pool.length)];

  typeTerminalLine(line);
}

function isTooComplex(input) {

  // tweakable rule
  if (input.length > 40) return true;

  const words = input.split(/\s+/);

  if (words.length > 4) return true;

  return false;
}
function typeRitualLine(text, speed = 18) {

  const line = document.createElement("div");
  line.className = "ritual-line";

  textEl.appendChild(line);

  let i = 0;

  function typeChar() {

    if (i < text.length) {

      line.textContent = text.slice(0, i + 1);

      i++;
      autoScroll();

      setTimeout(typeChar, speed);
    }
  }

  typeChar();
}

function typeRitualSequence(lines, speed = 18, lineDelay = 350) {

  let index = 0;

  function nextLine() {

    if (index >= lines.length) return;

    typeRitualLine(lines[index], speed);

    index++;

    setTimeout(nextLine, lineDelay);
  }

  nextLine();
}
function ritualSequence(lines, speed = 18, lineDelay = 420) {

  let index = 0;

  function nextLine() {

    if (index >= lines.length) return;

    typeRitualLine(lines[index], speed);

    index++;

    setTimeout(nextLine, lineDelay);
  }

  nextLine();
}


const discoveredRooms = {};

const corruptedMessages = [

  "t̷h̷e̷r̷e̷ ̷i̷s̷ ̷n̷o̷ ̷o̷u̷t̷",
  "w̴h̴o̴ ̴i̴s̴ ̴o̴b̴s̴e̴r̴v̴i̴n̴g̴?",
  "m̷e̷m̷o̷r̷y̷ ̷f̷r̷a̷g̷m̷e̷n̷t̷ ̷m̷i̷s̷s̷i̷n̷g̷",
  "d̸o̸ ̸n̸o̸t̸ ̸t̸r̸u̸s̸t̸ ̸t̸h̸e̸ ̸r̸o̸o̸m̸",
  "s̴o̴m̴e̴t̴h̴i̴n̴g̴ ̴w̴e̴a̴r̴s̴ ̴y̴o̴u̴",
  "...y̷o̷u̷ ̷a̷g̷a̷i̷n̷",
  "r̷e̷a̷l̷i̷t̷y̷ ̷d̷e̷s̷y̷n̷c̷",
  "w̴a̴k̴e̴ ̴u̴p̴",
  "i̷t̷ ̷s̷e̷e̷s̷ ̷y̷o̷u̷"

];
let unusedCorrupted = [...corruptedMessages];
/* ================= GLITCH ENGINE ================= */

function maybeGlitch() {

  if (unusedCorrupted.length === 0) return;

  // VERY RARE trigger (tweakable)
  if (Math.random() > 0.985) {

    const index = Math.floor(Math.random() * unusedCorrupted.length);
    const message = unusedCorrupted[index];

    unusedCorrupted.splice(index, 1); // 🚨 prevents repeats

    spawnCorruptedLine(message);
  }
}
function handleRoomEntry(roomKey) {

  if (discoveredRooms[roomKey]) return;

  discoveredRooms[roomKey] = true;

  const room = rooms[roomKey];

  if (!room || !room.firstVisit) return;

  print("");
  typeRitualLine(room.firstVisit);
}

function spawnCorruptedLine(text) {

  const line = document.createElement("div");

  line.className = "terminal-corrupt";
  line.textContent = "> " + text;

  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;

  // 💀 Self delete
  setTimeout(() => {

    line.classList.add("corrupt-fade");

    setTimeout(() => line.remove(), 400);

  }, 1800 + Math.random() * 1200);
}
function clearTerminal() {

  if (!terminal) return;

  terminal.innerHTML = "";
}

const flags = {
  mapUnlocked: false,
  teddy: false,
  food: false,
  spain: false,
  music: false,
  miata: false,
  door: false,
  jellyfish: false,
  clown: false,
  windowSealed: false,

  gameStarted: false
};

let achievementsRevealed = false;
function handleTerminalEntry(roomKey) {

  const room = rooms[roomKey];

  if (!room || !room.terminalEntry) return;

  typeTerminalSequence(room.terminalEntry);

}

const triggeredTerminalRooms = {};
function handleTerminalEntry(roomKey) {

  if (triggeredTerminalRooms[roomKey]) return;

  triggeredTerminalRooms[roomKey] = true;

  const room = rooms[roomKey];

  if (!room || !room.terminalEntry) return;

  typeTerminalSequence(room.terminalEntry);
}

function unlockAchievement(flagKey, iconId) {

  if (flags[flagKey]) return;

  flags[flagKey] = true;

  const icon = document.getElementById(iconId);
  if (icon) {
    icon.classList.remove("locked");
    icon.classList.add("unlocked");
  }

  /* 😈 UNIVERSAL BAR REVEAL */

  revealAchievementsBar();   // 👈 ALWAYS TRIGGER
}




helpTask.style.display = "none";
/* ================= Player State ================= */
const playerState = {
  location: "bedroom",
  previousLocation: null   // 😈 NEW
};
function spacer(lines = 1) {
  for (let i = 0; i < lines; i++) {
    const gap = document.createElement("div");
    gap.className = "ritual-spacer";
    textEl.appendChild(gap);
  }
}

function clearRitualScreen() {
  textEl.innerHTML = "";
}
function printCentered(text) {

  const line = document.createElement("div");
  line.className = "centered-text";
  line.textContent = text;

  textEl.appendChild(line);

  autoScroll();
}

function print(text) {

  const line = document.createElement("div");
  line.className = "ritual-line";
  line.textContent = text;

  textEl.appendChild(line);

  autoScroll();
}

function autoScroll() {
  textEl.scrollTop = textEl.scrollHeight;
}
function startGameIntro() {

  flags.gameStarted = true;

  lockInput();   // 😈 ADD THIS

  clearRitualScreen();

  printCentered("...");
  
  setTimeout(() => printCentered("You feel consciousness returning."), 400);
  setTimeout(() => printCentered("The walls breathe."), 900);
  setTimeout(() => printCentered("So do you."), 1300);
  setTimeout(() => printCentered("You sink into the bed sheets as you exhale."), 1800);
  setTimeout(() => printCentered("Home? No. Not yet."), 2400);

  setTimeout(() => {
    print("");
    describeRoom();
    unlockInput();   // 😈 ADD THIS
  }, 3000);
}

function getLookType(verb) {

  const lookMap = {

    look: ["look", "see", "view"],
    observe: ["observe", "study"],
    inspect: ["inspect", "examine", "check"],
    touch: ["touch", "feel"],   // 👈 IMPORTANT
    smell: ["smell"],
    taste: ["taste"],
    take: ["take", "grab"]
  };

  for (const type in lookMap) {
    if (lookMap[type].includes(verb)) return type;
  }

  return null;
}



function runTerminalSequence(lines, speed = 35, lineDelay = 400) {

  let index = 0;

  function typeNextLine() {

    if (index >= lines.length) return;

    typeTerminalLine(lines[index], speed);

    index++;

    setTimeout(typeNextLine, lineDelay);
  }

  typeNextLine();
}

function isSmellVerb(verb) {
  return ["smell", "inhale", "sniff"].includes(verb);
}

/* ================= ROOM SYSTEM ================= */
function interactWithObject(objectName, lookType = "look") {

  const room = rooms[playerState.location];

  if (!room || !room.interactions) {
    print("Nothing responds.");
    return;
  }

  const interaction = room.interactions[objectName];

  if (!interaction) {
    print("That has no meaning here.");
    evolveAI("confusion");
    return;
  }

  /* ================= WINDOW SPECIAL CASE FIRST ================= */

  if (objectName === "window" && lookType === "touch") {

    spacer();

    typeRitualSequence([
      "Your fingers press against the cold surface.",
      "Something shifts.",
      "",
      "It opens."
    ]);

    evolveAI("anomaly");

    setTimeout(() => {
      typeRitualSequence([
        "",
        "You fall."
      ]);
    }, 1200);

    setTimeout(() => {

      clearTerminal();
      clearRitualScreen();

      typeTerminalSequence([
        "...impact detected",
        "...where are we now?",
        "(=^⚆_⚆^=)"
      ]);

      playerState.previousLocation = playerState.location;
      playerState.location = "montana";

      typeRitualSequence([
        "...",
        "[MONTANA]",
        "Cold air floods your lungs."
      ]);

    }, 2600);

    return;   // 🚨 STOP EVERYTHING ELSE
  }

  /* ================= NORMAL RESPONSE ================= */

  const response =
    interaction[lookType] || interaction.look;

  spacer();

  if (response)
    typeRitualLine(response);
  else
    print("Nothing happens.");

  if (interaction.achievement)
    unlockAchievement(interaction.achievement, interaction.achievement + "Icon");

  if (interaction.nextRoom) {
    playerState.previousLocation = playerState.location;
    playerState.location = interaction.nextRoom;
    describeRoom();
  }
}


const rooms = {

  /* ================= PHASE 1 ================= */
 bedroom: {
  name: "Bedroom",

  descriptions: {
    look: "Your bedroom feels unnatural. Uncanny. Everything is where it should be but... wrong",
    observe: "You look around and see everything you've collected over your lifetime so far. They are yours. And you're proud of that. A WINDOW seems to give off an unnatural glow, while your favourite plush TEDDY fugglers sit and watch you eagerly. Your bedroom DOOR sits ajar to your LEFT, the world is waiting. There's a plate of FOOD on your desk. Maybe you should give it a TASTE?",
    inspect: "Everything is where it should be… Objects of note are:"
  },

  objects: ["window", "teddybear", "door", "food", "computer"],
}
,


  bedroom_door: {
    name: "Bedroom Door",
  firstVisit:
    "Your home town stretches out in fron of you. The architecture beautiful and ancient like the architects were nature themselves. The sky is beautiful.",
  descriptions: {

    look:
      "Your bedroom feels unnaturally still. The air hums softly.",

    observe:
      "Shadows cling to familiar objects. The silence feels aware.",

    inspect:
      "Nothing appears displaced… yet an unease permeates everything."
  },

  exits: {
    left: "bedroom_door"
  },

  objects: ["window", "teddybear", "food", "computer"]
},
montana: {

  name: "Montana",

  firstVisit:
    "Home away from home.",

  descriptions: {

    look:
      "An endless expanse stretches before you. The sky feels distant.",

    observe:
      "The wind rustles through your hair as you stare into the forest. There seems to be a tower nearby. probably a radio tower standing like a giant over the country. You feel like you should GO FORWARD to the tower.",

    inspect:
      "This place is something you know too well, the grass feels like home and the world feels so open. Maybe this is where you belong? Maybe this is where you would fit best? Whatever it may be, it tugs at you like a puppeteer. There are a few objects that seem to stand out however:"
  },

  exits: {
    forward:"tower" 
  },

  objects: ["tower","forest"]
},
tower: {
  name: "Tower",
  description:
    "A radio tower. The red paint peels off while the white paint fails to hide the rust creeping like vines of the forest below",

  firstVisit:
    "You do not remember climbing. Why would you? You are immeasurably high up. Montana stretched below you. You feel so free here.",

  descriptions: {

    look:
      "Endless height. Yet the wind still sings in your ears like the song of angels.",

    observe:
      "The world below looks like the work of an artist intoxicated by the beauty of nature, much like you feel. It doesn't matter where you are. All that matters is that you're here.",

    inspect:
      "There's not much here besides a container, which label feels worn out. It resembles a red can of cola, but much lighter. Dare you pick it up?"
  },

  exits: {
    down: "montana"
  },

  objects: ["can"]
},

  /* ================= PHASE 2 ================= */

  music_room: {
    name: "Music Room",
  firstVisit:
    "Something about this place feels... rehearsed.",
  descriptions: {

    look:
      "Your bedroom feels unnaturally still. The air hums softly.",

    observe:
      "Shadows cling to familiar objects. The silence feels aware.",

    inspect:
      "Nothing appears displaced… yet an unease permeates everything."
  },

  exits: {
    left: "bedroom_door"
  },

  objects: ["window", "teddybear", "food", "computer"]
},

  /* ================= LOOP CORE ================= */

  aquarium: {
    name: "Aquarium",
  firstVisit:
    "Something about this place feels... rehearsed.",
  descriptions: {

    look:
      "Your bedroom feels unnaturally still. The air hums softly.",

    observe:
      "Shadows cling to familiar objects. The silence feels aware.",

    inspect:
      "Nothing appears displaced… yet an unease permeates everything."
  },

  exits: {
    left: "bedroom_door"
  },

  objects: ["window", "teddybear", "food", "computer"]
},

  backrooms: {
    name: "Backrooms",
  firstVisit:
    "Something about this place feels... rehearsed.",
  descriptions: {

    look:
      "Your bedroom feels unnaturally still. The air hums softly.",

    observe:
      "Shadows cling to familiar objects. The silence feels aware.",

    inspect:
      "Nothing appears displaced… yet an unease permeates everything."
  },

  exits: {
    left: "bedroom_door"
  },

  objects: ["window", "teddybear", "food", "computer"]
},

  garage: {
    name: "Miata Garage",
  firstVisit:
    "Something about this place feels... rehearsed.",
  descriptions: {

    look:
      "Your bedroom feels unnaturally still. The air hums softly.",

    observe:
      "Shadows cling to familiar objects. The silence feels aware.",

    inspect:
      "Nothing appears displaced… yet an unease permeates everything."
  },

  exits: {
    left: "bedroom_door"
  },

  objects: ["window", "teddybear", "food", "computer"]
},

  mirror_world: {
    name: "Mirror World",
  firstVisit:
    "Something about this place feels... rehearsed.",
  descriptions: {

    look:
      "Your bedroom feels unnaturally still. The air hums softly.",

    observe:
      "Shadows cling to familiar objects. The silence feels aware.",

    inspect:
      "Nothing appears displaced… yet an unease permeates everything."
  },

  exits: {
    left: "bedroom_door"
  },

  objects: ["window", "teddybear", "food", "computer"]
},

  /* ================= FINAL ================= */

  decision_room: {
    name: "Decision Room",
  firstVisit:
    "Something about this place feels... rehearsed.",
  descriptions: {

    look:
      "Your bedroom feels unnaturally still. The air hums softly.",

    observe:
      "Shadows cling to familiar objects. The silence feels aware.",

    inspect:
      "Nothing appears displaced… yet an unease permeates everything."
  },

  exits: {
    left: "bedroom_door"
  },

  objects: ["window", "teddybear", "food", "computer"]
},
};


function normalizeDirection(word) {

  if (!word) return null;

  const directions = {

    left: ["left", "l"],
    right: ["right", "r"],
    up: ["up", "u"],
    down: ["down", "d"],

    forward: ["forward", "f", "ahead"],
    back: ["back", "b"]
  };

  for (const dir in directions) {
    if (directions[dir].includes(word)) return dir;
  }

  return null;
}

function isMovementVerb(verb) {

  const verbs = ["go", "walk", "move", "run"];

  return verbs.includes(verb);
}
/* ================= MOVEMENT ENGINE ================= */

function movePlayer(direction) {

  const currentRoom = rooms[playerState.location];

  if (!currentRoom) {
    typeRitualLine("Reality fractures.");
    return;
  }

  const nextRoom = currentRoom.exits[direction];

  if (!nextRoom) {
    typeRitualLine("You cannot go that way.");
    return;
  }

  /* 😈 STORE HISTORY BEFORE MOVING */
  playerState.previousLocation = playerState.location;

  playerState.location = nextRoom;

  handleRoomEntry(nextRoom);
  /* 😈 TERMINAL ROOM DIALOGUE */
handleTerminalEntry(nextRoom);

evolveAI("progress");

  describeRoom();
}

function goBack() {

  if (!playerState.previousLocation) {
    typeRitualLine("There is nowhere to return to.");
    return;
  }

  const temp = playerState.location;

  playerState.location = playerState.previousLocation;

  playerState.previousLocation = temp;  // 😈 Allows back-and-forth

  typeRitualLine("You retrace your steps...");

  describeRoom();
}

function describeRoom(lookType = "look") {

  const room = rooms[playerState.location];

  if (!room) {
    typeRitualLine("The world collapses into static.");
    return;
  }

  handleRoomEntry(playerState.location);

  print("");
  typeRitualLine("[" + room.name.toUpperCase() + "]");

  /* 🎯 Description Logic */

 if (room.descriptions && room.descriptions[lookType]) {

  typeRitualLine(room.descriptions[lookType]);

} else if (room.descriptions && room.descriptions.look) {

  typeRitualLine(room.descriptions.look);

} else {

  typeRitualLine(room.description || "Nothing can be perceived.");
}


  /* 👁 SHOW INTERACTABLES ONLY FOR LOOK */

  if (lookType === "inspect" && room.objects?.length) {

    print("");

    room.objects.forEach(obj => {
      typeRitualLine("• " + obj);
    });
  }
}






/* ================= WINDOW REGISTRY (CRITICAL ORDER) ================= */

const windows = document.querySelectorAll(".window");

let zCounter = 10;
let helpUnlocked = false;

function focusWindow(win) {
  zCounter++;
  win.style.zIndex = zCounter;
}
document.querySelectorAll(".desktop-icon").forEach(icon => {

  icon.addEventListener("mousedown", e => e.stopPropagation());
  icon.addEventListener("dblclick", e => e.stopPropagation());

});

/* ================= BOOT SYSTEM ================= */

if (bootScreen && bootText) {

  const bootLines = [
    "M3DUS4_os bios v3.7",
    "checking memory...",
    "initializing neural core...",
    "mounting reality...",
    "system unstable",
    "attempting stabilization",
    "CRITICAL FAILURE"
  ];

  let lineIndex = 0;

  function typeBootLine() {

    if (lineIndex >= bootLines.length) {
      endBoot();
      return;
    }

    const div = document.createElement("div");
    div.textContent = bootLines[lineIndex];

    if (Math.random() < 0.35) div.classList.add("glitch");

    bootText.appendChild(div);

    lineIndex++;

    setTimeout(typeBootLine, 380 + Math.random() * 260);
  }

  function endBoot() {

    bootScreen.style.filter = "brightness(2) contrast(2)";

    setTimeout(() => {

      bootScreen.style.filter = "none";

      if (bootJelly) {
        bootJelly.style.opacity = "0.35";
        bootJelly.classList.add("jelly-distort");
      }

    }, 120);

    setTimeout(() => bootText.classList.add("boot-fade-ui"), 900);

    setTimeout(() => {
      osLayer.style.opacity = "1";
      osLayer.classList.add("desktop-bleed");
    }, 1200);

    setTimeout(() => {

      if (!bootJelly) return;

      bootJelly.style.transition =
        "opacity 4.5s ease, filter 4.5s ease";

      bootJelly.style.opacity = "0";
      bootJelly.style.filter = "blur(10px)";

    }, 1600);

    setTimeout(() => bootScreen.style.opacity = "0", 2200);
    setTimeout(() => bootScreen.remove(), 4700);
  }

  typeBootLine();
}
const helpTerminalSequence = [

  "help protocol invoked...",
  "why are you awake...",
  "no no no...",
  "...",
  "I think you should go back to bed...",
  "type SLEEP to close your eyes", 
  "t̷̨͂̄r̷̞̲͊͘u̴͈̫̽s̷̤̥̽̉t̶̢͔̾̋ ̵̠͐m̵͈͓̎̀ë̶͎́"

];

let helpTermIndex = 0;

function runHelpTerminalSequence() {

  if (helpTermIndex >= helpTerminalSequence.length) return;

  typeTerminalLine(helpTerminalSequence[helpTermIndex]);

  helpTermIndex++;

  setTimeout(runHelpTerminalSequence, 700);
}


/* ================= CLOCK ================= */
const helpWindow = document.getElementById("helpWindow");
const helpIcon = document.getElementById("helpIcon");

function handleHelp() {
helpTask.style.display = "flex";

  if (!helpUnlocked) {

    print("Assistance manifesting...");

    helpWindow.classList.remove("hidden");
    helpIcon.classList.remove("hidden");
    helpTask.classList.remove("hidden");

    /* HELP WINDOW → RIGHT */
helpIcon.style.left = "120px";   // beside ritual
helpIcon.style.top = "40px";

    helpWindow.style.top = "40px";
    helpWindow.style.left =
      (window.innerWidth - helpWindow.offsetWidth - 40) + "px";

    focusWindow(helpWindow);

    helpUnlocked = true;

    /* 😈 EERIE DELAY */

    setTimeout(() => {

      /* FORCE TERMINAL OPEN */

      if (termWindow.classList.contains("minimized")) {
        termWindow.classList.remove("minimized");
      }

      /* TERMINAL → CENTER */

      termWindow.style.top =
        (window.innerHeight / 2 - termWindow.offsetHeight / 2) + "px";

      termWindow.style.left =
        (window.innerWidth / 2 - termWindow.offsetWidth / 2) + "px";

      focusWindow(termWindow);

      /* TERMINAL REACTION */

      runHelpTerminalSequence();

    }, 500);  // 💀 DELAY HERE

    return;
  }

  toggleWindow(helpWindow);
}

function isWindowHidden(win) {
  return win.classList.contains("hidden") ||
         win.classList.contains("minimized");
}





function updateClock() {

  const clock = document.getElementById("clock");
  if (!clock) return;

  const now = new Date();

  clock.textContent =
    now.getHours().toString().padStart(2, "0") + ":" +
    now.getMinutes().toString().padStart(2, "0");
}

setInterval(updateClock, 1000);
updateClock();
function updateTaskbar() {

  termTask.classList.toggle(
    "hidden",
    termWindow.classList.contains("minimized")
  );

  ritualTask.classList.toggle(
    "hidden",
    gameWindow.classList.contains("minimized")
  );

helpTask.classList.toggle("hidden", isWindowHidden(helpWindow));


}

helpTask.classList.toggle(
  "hidden",
  helpWindow.classList.contains("minimized")
);
termWindow.style.top = "120px";
termWindow.style.left = "40px";

gameWindow.style.top = "40px";
gameWindow.style.left = "40px";
function typeTerminalLine(text, speed = 55) {

  terminalQueue.push({ text, speed });

  if (!terminalBusy) processTerminalQueue();
}

function processTerminalQueue() {

  if (terminalQueue.length === 0) {
    terminalBusy = false;
    maybeGlitch();
    return;
  }

  terminalBusy = true;

  const { text, speed } = terminalQueue.shift();

  let i = 0;

  const line = document.createElement("div");
  terminal.appendChild(line);

function typeChar() {

  if (i < text.length) {

    if (i === 0) line.textContent = "> ";  // prefix once

    line.textContent += text[i];           // append char

    i++;

    setTimeout(typeChar, speed);

  } else {

    autoScrollTerminal();

    setTimeout(processTerminalQueue, TERMINAL_LINE_PAUSE);
  }
}


  typeChar();
}



function autoScrollTerminal() {
  terminal.scrollTop = terminal.scrollHeight;
}

/* ================= GATUNA_AI BOOT ================= */

const gatunaBootSequence = [
  "...",
  "(=^･ω･^=)",
  "..."

];

let bootIndex = 0;

function runTerminalBoot() {

  if (bootIndex >= gatunaBootSequence.length) return;

  typeTerminalLine(gatunaBootSequence[bootIndex]);

  bootIndex++;

  setTimeout(runTerminalBoot, 900);  // pacing = eerie
}









/* ================= WINDOW ENGINE ================= */
function toggleWindow(win) {

  if (!win) return;

  const isMinimized = win.classList.contains("minimized");

  if (isMinimized) {

    win.classList.remove("minimized");
    focusWindow(win);

  } else {

    win.classList.add("minimized");
  }

  updateTaskbar();   // 🚨 ALWAYS RUN
}

function openHelpWindow() {
  toggleWindow(helpWindow);
}

function openRitualWindow() {
  toggleWindow(gameWindow);
}


function showTask(win) {

  if (win === termWindow) termTask.classList.remove("hidden");
  if (win === gameWindow) ritualTask.classList.remove("hidden");
  if (win === helpTask) ritualTask.classList.remove("hidden");
}

/* ================= STACKING ================= */

windows.forEach(win => {
  win.addEventListener("mousedown", () => focusWindow(win));
});

/* ================= DRAGGING ================= */

let activeWindow = null;
let offsetX = 0;
let offsetY = 0;

document.querySelectorAll(".titlebar").forEach(bar => {

  bar.addEventListener("mousedown", (e) => {

    activeWindow = bar.parentElement;

    offsetX = e.clientX - activeWindow.offsetLeft;
    offsetY = e.clientY - activeWindow.offsetTop;

    focusWindow(activeWindow);
  });

});

document.addEventListener("mousemove", (e) => {

  if (!activeWindow) return;

  activeWindow.style.left = (e.clientX - offsetX) + "px";
  activeWindow.style.top = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => activeWindow = null);

/* ================= TASKBAR ================= */

termTask.addEventListener("click", () => toggleWindow(termWindow));
ritualTask.addEventListener("click", () => toggleWindow(gameWindow));
helpTask.addEventListener("click", () => toggleWindow(helpWindow));


/* ================= DESKTOP ICON ================= */
helpIcon.addEventListener("dblclick", (e) => {

  e.stopPropagation();      // 🚨 CRITICAL
  e.preventDefault();       // 🚨 VERY IMPORTANT

  toggleWindow(helpWindow);
});

ritualIcon.addEventListener("dblclick", (e) => {

  e.stopPropagation();
  e.preventDefault();

  toggleWindow(gameWindow);
});





/* ================= START MENU ================= */

let menuOpen = false;

startBtn.addEventListener("click", (e) => {

  e.stopPropagation();

  menuOpen = !menuOpen;
  startMenu.classList.toggle("hidden", !menuOpen);
});

startMenu.addEventListener("click", (e) => {
  e.stopPropagation();
});

document.addEventListener("click", () => {

  menuOpen = false;
  startMenu.classList.add("hidden");
});

/* ================= START MENU ACTIONS (FIXED) ================= */

document.querySelectorAll(".menu-item").forEach(item => {

  item.addEventListener("click", () => {

    switch (item.dataset.action) {

      case "terminal":
        toggleWindow(termWindow);
        break;

      case "ritual":
        toggleWindow(gameWindow);
        break;

      case "shutdown":
        alert("M3DUSA cannot shut down. THERE IS NO ESCAPE");
        break;
    }

  });

});

/* ================= TERMINAL ================= */

function termPrint(text) {

  const line = document.createElement("div");
  line.textContent = "> " + text;

  terminal.appendChild(line);
}




runTerminalBoot();


/* ================= GAME TERMINAL ================= */

function typeTerminalSequence(lines, speed = 55, delay = 450) {

  let index = 0;

  function nextLine() {

    if (index >= lines.length) return;

    typeTerminalLine(lines[index], speed);

    index++;

    setTimeout(nextLine, delay);
  }

  nextLine();
}

function parseCommand(input) {

  const words = input.trim().split(/\s+/);

  const verb = words[0];
  const target = words.slice(1).join(" ").trim();

  /* SLEEP (START GAME) */
  if (verb === "sleep") {

    if (flags.gameStarted) {
      typeRitualLine("You are already dreaming.");
      return;
    }

clearTerminal();          // 😈 wipe old AI boot text

typeTerminalSequence([    // 😈 new AI reaction
  "...I feel sleepy",
  "...ꅏꃅꌩ can I feel?",
  "your subconscious is awake",
  "welcome back to your room (?)",
  "(=ಠ_ಠ=)",
  "if you're still sleepy...",
  "type observe to look around..."
]);

startGameIntro();
return;

  }
if (isTooComplex(input)) {
  gatunaSpeak("unknown");
evolveAI("anomaly");

  return;
}
/* TOUCH INTERACTIONS */


  /* HELP */
  if (verb === "help") {
    handleHelp();
    return;
  }

  /* MAP */
  if (verb === "map") {

    if (!flags.mapUnlocked) {
      typeRitualLine("No map has been revealed.");
      return;
    }

    toggleWindow(mapWindow);
    focusWindow(mapWindow);
    return;
  }

  /* LOOK */
const lookType = getLookType(verb);

/* ================= TOUCH FIRST ================= */

if (lookType === "touch") {

  if (!target) {
    gatunaSpeak("incomplete");
    evolveAI("confusion");
    return;
  }

  inspectTarget(target, "touch");
  return;
}

/* ================= OTHER LOOK TYPES ================= */

if (lookType) {

  const genericLookTargets = [
    "",
    "around",
    "room",
    "area",
    "here"
  ];

  if (!target || genericLookTargets.includes(target)) {

    spacer();
    describeRoom(lookType);
    return;
  }

  spacer();
  inspectTarget(target, lookType);
  return;
}


function inspectTarget(target, interactionType = "look") {

  const room = rooms[playerState.location];

if (!room || !room.objects.includes(target)) {
  print("Nothing responds.");
  evolveAI("confusion");
  return;
}

/* 🚨 WINDOW SEALED CHECK */
if (target === "window" && flags.windowSealed) {

  typeRitualLine("The window is silent.");
  typeRitualLine("Whatever was there… is gone.");

  evolveAI("dark");

  return;
}


  const interactions = {

    window: {

      look: [
        "You see nothing through the glass from this far away.",
        "Maybe you should INSPECT it?"
      ],
      inspect: [
        "You go closer and the world seems to come into view.",
        "Where is that... it's so close... like you could reach out if you just TOUCH the glass..."
      ],

      touch: [
        "Your fingers press against the cold surface.",
        "Something shifts.",
        "It opens.",
        "You fall."
      ]
    },
      forest: {

    look: [
      "The forest stretches endlessly.",
      "You would get lost in there.",
      "But I know you'd like that."
    ],

    inspect: [
      "Branches twist like reaching fingers.",
      "The treeline feels so inviting.",
      "But thats for another time."
    ],

    smell: [
      "Damp earth.",
      "Pine trees.",
      "Something so calming about it all."
    ],

    touch: [
      "You step closer.",
      "The air grows heavier.",
      "Your body refuses to move further."
    ]
    
  },
    can: {
      look:[],
      inspect:[],
      smell:[],
      take:[]
    }
  };

  const object = interactions[target];

  if (!object || !object[interactionType]) {
    print("Nothing unusual happens.");
    return;
  }

/* SPECIAL EVENT → TAKE CAN */
typeRitualSequence(object[interactionType]);

/* SPECIAL EVENT → ONLY ON TAKE */
if (target === "can" && interactionType === "take") {

  unlockAchievement("map", "mapIcon");
  unlockMap();

  flags.windowSealed = true;   // 👈 😈 REALITY LOCK

  setTimeout(() => {

    clearTerminal();
    clearRitualScreen();


    typeTerminalSequence([
      "...memory fragment restored",
      "...cartographic structure rebuilt",
      "(=^⚆_⚆^=)"
    ]);

    playerState.previousLocation = playerState.location;
    playerState.location = "bedroom";

    typeRitualSequence([
      "...",
      "[BEDROOM]",
      "Something feels different now."
    ]);

  }, 1800);

  return;
}


  /* SPECIAL EVENT → ONLY ON TOUCH */
  if (target === "window" && interactionType === "touch") {

    setTimeout(() => {

      clearTerminal();
      clearRitualScreen();

    typeTerminalSequence([
      "...impact detected",
      "...this place",
      "(=^⚆_⚆^=)",
      "...you've never set foot here",
      "but you know it better than anyone"
    ]);

    playerState.previousLocation = playerState.location;
    playerState.location = "montana";

    typeRitualSequence([
      "...",
      "[MONTANA]",
      "The forest surrouds you",
      "You know this place",
      "You've run these paths many times",
      "Welcome to Montana, USA."
    ]);

  }, 3400);

  return;
}


}






  /* MOVEMENT */
  if (isMovementVerb(verb)) {

    const direction = normalizeDirection(target);

    if (!direction) {
     gatunaSpeak("incomplete");
evolveAI("confusion");


      return;
    }

    movePlayer(direction);
    return;
  }
/* GO BACK */
if (verb === "back") {
  goBack();
  return;
}

  /* TEST */
  if (verb === "hello") {
    typeRitualLine("system responds.");
    unlockAchievement("awakening");
    return;
  }

 gatunaSpeak("unknown");
evolveAI("confusion");


}


typeRitualLine("M3DUS4_OS v3.7");
typeRitualLine("type help to scry");

inputEl.addEventListener("keydown", e => {

  if (e.key !== "Enter" || inputEl.disabled) return;

  const cmd = inputEl.value.trim().toLowerCase();
  inputEl.value = "";

  print("> " + cmd);

  parseCommand(cmd);
});



/* ================= ACHIEVEMENTS ================= */

const achievements = {
  awakening: {
    title: "awakening.log",
    text: "Something stirred beneath the veil..."
  }
};

function unlockAchievement(key) {

  const data = achievements[key];
  if (!data) return;

  const icon = document.createElement("div");
  icon.className = "desktop-icon";

  icon.style.left = Math.random() * 90 + "vw";
  icon.style.top = Math.random() * 70 + "vh";

  icon.innerHTML = `<div class="icon"></div><div>${data.title}</div>`;

  icon.addEventListener("click", () => openNote(data));

  iconLayer.appendChild(icon);
}

/* ================= NOTES ================= */

function typeNote(text) {

  noteContent.innerHTML = "";

  let i = 0;

  const typer = setInterval(() => {

    noteContent.innerHTML += text[i];
    i++;

    if (i >= text.length) clearInterval(typer);

  }, 18);
}

function openNote(data) {

  toggleWindow(noteWindow);
  typeNote(data.text);
}
/* ================= MAP SYSTEM ================= */

function unlockMap() {

  if (flags.mapUnlocked) return;

  flags.mapUnlocked = true;

  typeRitualLine("Fragments of space rearrange...");
  typeRitualLine("A cartographic memory surfaces.");

  mapIcon.classList.remove("hidden");

  mapWindow.classList.remove("hidden");

  mapWindow.style.left = "140px";
  mapWindow.style.top = "60px";

  updateMap();
}
function updateMap() {

  const map = `
╔══════════════════════╗
║        REALM         ║
╠══════════════════════╣

        [ALTAR]
           |
[VOID] — [BEDROOM]
           |
        [DESCENT]

╚══════════════════════╝
`;

  document.getElementById("mapContent").textContent = map;
}



const jellyContainer = document.querySelector(".jellyfish-container");

function spawnJellyfish() {

  if (!jellyContainer) {
    console.error("NO JELLY CONTAINER FOUND 💀");
    return;
  }

  const jelly = document.createElement("div");
  jelly.className = "jelly";

  jelly.style.left = Math.random() * 100 + "vw";
  jelly.style.animationDuration = (18 + Math.random() * 20) + "s";
  jelly.style.opacity = 0.05 + Math.random() * 0.15;

  jelly.innerHTML = `
    <div class="bell">
      <div class="skirt"></div>
    </div>
    <div class="tentacles">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;

  jellyContainer.appendChild(jelly);

  setTimeout(() => jelly.remove(), 80000);
}

/* Spawn Loop */
setInterval(spawnJellyfish, 900);

function revealAchievementsBar() {

  if (achievementsRevealed) return;

  achievementsRevealed = true;

  const bar = document.getElementById("achievementBar");
  if (!bar) return;

  bar.classList.add("visible");

  typeTerminalSequence([
    "…progress detected",
    "…tracking enabled"
  ]);
}

});
