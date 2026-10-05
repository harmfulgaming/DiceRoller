const { plugin, logger } = require("@eniac/flexdesigner");
const crypto = require("crypto");

const SIDES_BY_CID = {
  "com.harmfulglint.diceroller.d4": 4,
  "com.harmfulglint.diceroller.d6": 6,
  "com.harmfulglint.diceroller.d8": 8,
  "com.harmfulglint.diceroller.d10": 10,
  "com.harmfulglint.diceroller.d12": 12,
  "com.harmfulglint.diceroller.d20": 20,
  "com.harmfulglint.diceroller.d100": 100
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getSides(key) {
  if (SIDES_BY_CID[key.cid]) {
    return SIDES_BY_CID[key.cid];
  }

  // Keeps the old configurable Dice Roller working if it is
  // already placed in an existing FlexDesigner project.
  if (key.cid === "com.harmfulglint.diceroller.counter") {
    const sides = parseInt(key.data?.diceSides || "20", 10);
    return [4, 6, 8, 10, 12, 20, 100].includes(sides) ? sides : 20;
  }

  return null;
}

function getDiceCount(key) {
  const count = parseInt(key.data?.diceCount || "1", 10);

  if (Number.isNaN(count)) {
    return 1;
  }

  return Math.max(1, Math.min(10, count));
}

function getDisplayMode(key) {
  return key.data?.displayMode === "separate"
    ? "separate"
    : "total";
}

function rollDie(sides) {
  return crypto.randomInt(1, sides + 1);
}

function rollDice(sides, count) {
  const results = [];

  for (let i = 0; i < count; i++) {
    results.push(rollDie(sides));
  }

  return results;
}

function formatResult(results, displayMode) {
  // One die always just shows what you rolled.
  if (results.length === 1) {
    return String(results[0]);
  }

  // Separate example:
  // 4, 2, 6
  if (displayMode === "separate") {
    return results.join(", ");
  }

  // Total example:
  // 12
  return String(
    results.reduce((total, value) => total + value, 0)
  );
}

function drawText(serialNumber, key, text) {
  key.style = key.style || {};
  key.style.showIcon = false;
  key.style.showTitle = true;
  key.title = String(text);

  plugin.draw(serialNumber, key, "draw");
}

function isDiceKey(key) {
  return getSides(key) !== null;
}

plugin.on("plugin.alive", payload => {
  logger.info("DiceRoller alive:", payload);

  const serialNumber = payload.serialNumber;

  for (const key of payload.keys || []) {
    const sides = getSides(key);

    if (!sides) {
      continue;
    }

    // Initial appearance before the first roll.
    drawText(serialNumber, key, `D${sides}`);
  }
});

plugin.on("plugin.data", payload => {
  const serialNumber = payload.serialNumber;
  const key = payload.data?.key;

  if (!key || !isDiceKey(key)) {
    return;
  }

  setImmediate(async () => {
    const sides = getSides(key);
    const count = getDiceCount(key);
    const displayMode = getDisplayMode(key);

    // Small rolling animation.
    const frames = [
      "Rolling",
      "Rolling.",
      "Rolling..",
      "Rolling..."
    ];

    for (const frame of frames) {
      drawText(serialNumber, key, frame);
      await sleep(100);
    }

    const results = rollDice(sides, count);
    const output = formatResult(results, displayMode);

    // The result remains on the Flexbar until the next roll.
    drawText(serialNumber, key, output);

    logger.info(
      `Rolled ${count}D${sides}: ${results.join(", ")} | Display: ${displayMode}`
    );
  });
});

plugin.start();
