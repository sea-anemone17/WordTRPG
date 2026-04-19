export function pickRandom(array) {
  if (!Array.isArray(array) || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}

export function pickTextFromPool(pool, fallback = "") {
  return pickRandom(pool) || fallback;
}

export function ensureRouteCounter(bucket, key) {
  if (!bucket || !key) return;
  if (typeof bucket[key] !== "number") {
    bucket[key] = 0;
  }
}

export function addRouteCount(bucket, key, amount = 1) {
  if (!bucket || !key) return;
  ensureRouteCounter(bucket, key);
  bucket[key] += amount;
}

export function getTopKey(bucket) {
  const entries = Object.entries(bucket || {});
  if (!entries.length) return null;
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

export function getCurrentScenario(scenarios, scenarioId) {
  if (!scenarioId) return null;
  return scenarios.find((scenario) => scenario.id === scenarioId) || null;
}

export function getWordsInSection(data, sectionId) {
  return (data?.words || []).filter((word) => word.sectionId === sectionId);
}

export function pickUnusedPreferredWord({
  data,
  gameState,
  actionType,
  sectionId
}) {
  const words = getWordsInSection(data, sectionId);
  if (!words.length) return null;

  const unusedWords = words.filter((word) => !gameState.usedWordIds.includes(word.id));
  const candidateBase = unusedWords.length ? unusedWords : words;

  const matched = candidateBase.filter((word) => {
    const posOk =
      !actionType.preferredPos?.length || actionType.preferredPos.includes(word.pos);

    const tagOk =
      !actionType.preferredTags?.length ||
      (word.tags || []).some((tag) => actionType.preferredTags.includes(tag));

    return posOk && tagOk;
  });

  return pickRandom(matched.length ? matched : candidateBase);
}

export function applyEffects(gameState, effectConfig = {}) {
  if (typeof effectConfig.clue === "number") {
    gameState.clueCount += effectConfig.clue;
  }

  if (typeof effectConfig.mistake === "number") {
    gameState.mistakeCount += effectConfig.mistake;
  }

  if (effectConfig.routeBias) {
    addRouteCount(gameState.routeCounts, effectConfig.routeBias, 1);
  }
}

export function checkEndingCondition(gameState, scenario, clearCurrentTurnFn) {
  if (!scenario) return;

  const { maxTurns, clueGoal, mistakeLimit, minActionsBeforeEnding = 0 } = scenario.loopConfig || {};

  const enoughTurnsForEnding = gameState.turnCount >= minActionsBeforeEnding;
  const reachedTurnLimit = gameState.turnCount >= maxTurns && !gameState.currentActionType;
  const reachedClueGoal = gameState.clueCount >= clueGoal && enoughTurnsForEnding;
  const reachedMistakeLimit = gameState.mistakeCount >= mistakeLimit && enoughTurnsForEnding;

  if (reachedTurnLimit || reachedClueGoal || reachedMistakeLimit) {
    gameState.ended = true;
    clearCurrentTurnFn(gameState);
  }
}

export function getEndingLevelText(gameState, scenario) {
  if (!scenario) return "";

  if (gameState.clueCount >= scenario.loopConfig.clueGoal && gameState.mistakeCount <= 1) {
    return scenario.endingTexts.high;
  }

  if (gameState.clueCount >= Math.ceil(scenario.loopConfig.clueGoal / 2)) {
    return scenario.endingTexts.mid;
  }

  return scenario.endingTexts.low;
}

export function getRouteSummaryText(gameState, scenario) {
  const actionBias = getTopKey(gameState.routeCounts);
  if (!actionBias) return "";
  return scenario?.routeSummaries?.[actionBias] || "";
}

export function getChoiceRouteFlavor(gameState) {
  const topChoiceRoute = getTopKey(gameState.choiceRouteCounts);

  const choiceRouteTexts = {
    careful: "당신은 여러 순간에서 성급히 단정하기보다, 보이는 것의 결을 오래 들여다보려 했다.",
    tracking: "당신은 흩어진 자국들 사이의 방향을 놓치지 않으려는 태도로 조사를 이어 갔다.",
    atmospheric: "당신은 눈에 보이는 사실보다도 공간이 풍기는 미묘한 인상과 긴장을 오래 의식했다.",
    forensic: "당신은 사소한 자국과 물리적 변화들을 세밀하게 짚어 보며 사건의 흐름을 더듬었다.",
    interpretive: "당신은 단어와 문장 사이의 간극을 견디며, 남겨진 표현들이 품은 뜻을 끝까지 해석하려 했다.",
    practical: "당신은 흔적을 오래 감상하기보다 손에 남길 수 있는 핵심을 빠르게 추려 내는 쪽을 택했다.",
    systematic: "당신은 흩어진 단서들을 분류하고 배열하며 질서 있게 구조를 복원하려 했다."
  };

  return topChoiceRoute ? choiceRouteTexts[topChoiceRoute] || "" : "";
}
