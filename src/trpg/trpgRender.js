import { escapeHtml } from "../utils.js";
import { getDifficultyPreset, QUIZ_MODE_LABELS } from "./trpgConfig.js";

export function getTrpgElements() {
  return {
    bookSelect: document.getElementById("trpgBookSelect"),
    sectionSelect: document.getElementById("trpgSectionSelect"),
    scenarioSelect: document.getElementById("scenarioSelect"),
    difficultySelect: document.getElementById("difficultySelect"),
    startBtn: document.getElementById("startScenarioBtn"),
    restartBtn: document.getElementById("restartScenarioBtn"),

    sceneCounter: document.getElementById("sceneCounter"),
    clueCount: document.getElementById("clueCount"),
    mistakeCount: document.getElementById("mistakeCount"),
    scenarioStatus: document.getElementById("scenarioStatus"),

    scenarioTitle: document.getElementById("scenarioTitle"),
    scenarioIntroBox: document.getElementById("scenarioIntroBox"),
    sceneBox: document.getElementById("sceneBox"),

    wordEventBox: document.getElementById("wordEventBox"),
    trpgWordText: document.getElementById("trpgWordText"),
    trpgWordMeta: document.getElementById("trpgWordMeta"),
    trpgQuizModeText: document.getElementById("trpgQuizModeText"),
    trpgTimerText: document.getElementById("trpgTimerText"),
    trpgAnswerInput: document.getElementById("trpgAnswerInput"),
    trpgResultBox: document.getElementById("trpgResultBox"),
    trpgJudgeConfirmBox: document.getElementById("trpgJudgeConfirmBox"),
    trpgJudgeHintText: document.getElementById("trpgJudgeHintText"),

    choiceBox: document.getElementById("sceneChoiceBox"),
    choiceButtons: document.getElementById("choiceButtons"),

    endingBox: document.getElementById("endingBox"),
    endingText: document.getElementById("endingText")
  };
}

export function renderStats({ els, gameState, scenario }) {
  const maxTurns = scenario?.loopConfig?.maxTurns ?? 0;

  if (els.sceneCounter) {
    els.sceneCounter.textContent = `${gameState.sceneIndex + 1} / ${maxTurns}`;
  }
  if (els.clueCount) {
    els.clueCount.textContent = String(gameState.clues);
  }
  if (els.mistakeCount) {
    els.mistakeCount.textContent = String(gameState.mistakes);
  }
  if (els.scenarioStatus) {
    if (gameState.ended) {
      els.scenarioStatus.textContent = "종결";
    } else if (gameState.currentWordId && !gameState.resolvedThisTurn) {
      els.scenarioStatus.textContent = "해석 중";
    } else if (gameState.resolvedThisTurn) {
      els.scenarioStatus.textContent = "선택 대기";
    } else {
      els.scenarioStatus.textContent = "진행 중";
    }
  }
}

export function renderIntro({ els, scenario }) {
  if (!scenario) return;

  if (els.scenarioTitle) {
    els.scenarioTitle.textContent = scenario.title;
  }

  if (els.scenarioIntroBox) {
    els.scenarioIntroBox.innerHTML = `<p>${escapeHtml(scenario.intro || "")}</p>`;
  }
}

export function renderScene({ els, scenario, gameState }) {
  if (!els.sceneBox || !scenario) return;

  if (gameState.ended) {
    els.sceneBox.innerHTML = `
      <h3>조사 종료</h3>
      <p>모든 장면이 끝났습니다.</p>
    `;
    return;
  }

  if (gameState.currentWordId) {
    return;
  }

  const buttonsHtml = (scenario.actionTypes || [])
    .map(
      (action) => `
        <button class="button" type="button" data-action-id="${action.id}">
          ${escapeHtml(action.label)}
        </button>
      `
    )
    .join("");

  els.sceneBox.innerHTML = `
    <h3>장면 ${gameState.sceneIndex + 1}</h3>
    <p>어떤 방식으로 조사할지 선택하세요.</p>
    <div class="button-row">${buttonsHtml}</div>
  `;
}

export function renderWordEvent({
  els,
  gameState,
  word,
  getPosLabel,
  getToneLabel,
  getTagLabel
}) {
  if (!els.wordEventBox) return;

  if (!gameState.currentWordId || !word || gameState.resolvedThisTurn || gameState.ended) {
    els.wordEventBox.classList.add("hidden");
    return;
  }

  const preset = getDifficultyPreset(gameState.difficulty);

  if (els.trpgWordText) {
    els.trpgWordText.textContent = gameState.currentPromptText || word.word;
  }

  if (els.trpgQuizModeText) {
    els.trpgQuizModeText.textContent = QUIZ_MODE_LABELS[gameState.currentQuizMode] || "";
  }

  if (els.trpgTimerText) {
    els.trpgTimerText.textContent = "";
  }

  const metaParts = [];
  if (preset.showPos) metaParts.push(`품사: ${getPosLabel(word.pos)}`);
  if (preset.showTone) metaParts.push(`정서: ${getToneLabel(word.tone)}`);
  if (preset.showTags) {
    const tagText = (word.tags || []).map((tag) => getTagLabel(word.pos, tag)).join(", ");
    metaParts.push(`태그: ${tagText || "없음"}`);
  }

  if (els.trpgWordMeta) {
    els.trpgWordMeta.textContent = metaParts.join(" · ");
  }

  els.wordEventBox.classList.remove("hidden");
}

export function renderJudgeResult({ els, judgeResult }) {
  if (!els.trpgResultBox || !els.trpgJudgeConfirmBox || !els.trpgJudgeHintText) return;
  if (!judgeResult) return;

  if (judgeResult.isCorrect) {
    els.trpgResultBox.innerHTML = `<span class="result-correct">자동 판정: 정답 후보 ✅</span>`;
    els.trpgJudgeHintText.textContent = "정답 후보입니다. 그대로 확정하거나 뒤집을 수 있습니다.";
  } else {
    els.trpgResultBox.innerHTML = `<span class="result-wrong">자동 판정: 오답 후보 ❌</span>`;
    els.trpgJudgeHintText.textContent = `정답 보기: ${judgeResult.correctAnswerText}`;
  }

  els.trpgJudgeConfirmBox.classList.remove("hidden");
}

export function renderChoicePool({ els, gameState }) {
  if (!els.choiceBox || !els.choiceButtons) return;

  if (!gameState.resolvedThisTurn || gameState.ended) {
    els.choiceBox.classList.add("hidden");
    els.choiceButtons.innerHTML = "";
    return;
  }

  els.choiceBox.classList.remove("hidden");

  els.choiceButtons.innerHTML = (gameState.currentChoicePool || [])
    .map(
      (choice) => `
        <button class="button" type="button" data-choice-id="${choice.id}">
          ${escapeHtml(choice.label)}
        </button>
      `
    )
    .join("");
}

export function hideWordEvent(els) {
  if (els.wordEventBox) els.wordEventBox.classList.add("hidden");
}

export function clearWordUi(els) {
  if (els.trpgAnswerInput) els.trpgAnswerInput.value = "";
  if (els.trpgResultBox) els.trpgResultBox.innerHTML = "";
  if (els.trpgJudgeConfirmBox) els.trpgJudgeConfirmBox.classList.add("hidden");
}

export function renderEnding({ els, gameState }) {
  if (!els.endingBox || !els.endingText) return;

  if (!gameState.ended) {
    els.endingBox.classList.add("hidden");
    els.endingText.innerHTML = "";
    return;
  }

  els.endingBox.classList.remove("hidden");
  els.endingText.innerHTML = `
    <p><strong>단서 수:</strong> ${gameState.clues}</p>
    <p><strong>오해 수:</strong> ${gameState.mistakes}</p>
    <p><strong>진행 장면:</strong> ${gameState.sceneIndex}</p>
  `;
}
