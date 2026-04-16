import { initData, getData } from "./storage.js";
import { scenarios } from "./scenarios.js";
import { getPosLabel, getToneLabel, getTagLabel } from "./tags.js";
import { normalizeText, escapeHtml } from "./utils.js";

const trpgBookSelect = document.getElementById("trpgBookSelect");
const trpgSectionSelect = document.getElementById("trpgSectionSelect");
const scenarioSelect = document.getElementById("scenarioSelect");

const startScenarioBtn = document.getElementById("startScenarioBtn");
const restartScenarioBtn = document.getElementById("restartScenarioBtn");

const sceneCounter = document.getElementById("sceneCounter");
const clueCountEl = document.getElementById("clueCount");
const mistakeCountEl = document.getElementById("mistakeCount");
const scenarioStatus = document.getElementById("scenarioStatus");

const scenarioTitle = document.getElementById("scenarioTitle");
const scenarioIntroBox = document.getElementById("scenarioIntroBox");
const sceneBox = document.getElementById("sceneBox");

const wordEventBox = document.getElementById("wordEventBox");
const trpgWordText = document.getElementById("trpgWordText");
const trpgWordMeta = document.getElementById("trpgWordMeta");

const trpgAnswerForm = document.getElementById("trpgAnswerForm");
const trpgAnswerInput = document.getElementById("trpgAnswerInput");
const trpgShowAnswerBtn = document.getElementById("trpgShowAnswerBtn");
const trpgResultBox = document.getElementById("trpgResultBox");

const trpgJudgeConfirmBox = document.getElementById("trpgJudgeConfirmBox");
const trpgJudgeHintText = document.getElementById("trpgJudgeHintText");
const trpgConfirmCorrectBtn = document.getElementById("trpgConfirmCorrectBtn");
const trpgConfirmWrongBtn = document.getElementById("trpgConfirmWrongBtn");

const sceneChoiceBox = document.getElementById("sceneChoiceBox");
const choiceButtons = document.getElementById("choiceButtons");

const endingBox = document.getElementById("endingBox");
const endingText = document.getElementById("endingText");

const journalBox = document.getElementById("journalBox");

let gameState = null;
let pendingSubmission = null;

function resetGameState() {
  gameState = {
    scenarioId: null,
    sectionId: null,
    sceneIndex: 0,
    clueCount: 0,
    mistakeCount: 0,
    journal: [],
    currentWord: null,
    currentSceneResolved: false
  };
  pendingSubmission = null;
}

function renderBookOptions() {
  const data = getData();
  if (!data.books.length) {
    trpgBookSelect.innerHTML = `<option value="">책 없음</option>`;
    trpgSectionSelect.innerHTML = `<option value="">섹션 없음</option>`;
    return;
  }

  trpgBookSelect.innerHTML = data.books
    .map((book) => `<option value="${book.id}">${book.title}</option>`)
    .join("");

  renderSectionOptions();
}

function renderSectionOptions() {
  const data = getData();
  const bookId = trpgBookSelect.value;
  const sections = data.sections.filter((section) => section.bookId === bookId);

  if (!sections.length) {
    trpgSectionSelect.innerHTML = `<option value="">섹션 없음</option>`;
    return;
  }

  trpgSectionSelect.innerHTML = sections
    .sort((a, b) => a.order - b.order)
    .map((section) => `<option value="${section.id}">${section.title}</option>`)
    .join("");
}

function renderScenarioOptions() {
  scenarioSelect.innerHTML = scenarios
    .map((scenario) => `<option value="${scenario.id}">${scenario.title}</option>`)
    .join("");
}

function getCurrentScenario() {
  if (!gameState?.scenarioId) return null;
  return scenarios.find((scenario) => scenario.id === gameState.scenarioId) || null;
}

function getCurrentScene() {
  const scenario = getCurrentScenario();
  if (!scenario) return null;
  return scenario.scenes[gameState.sceneIndex] || null;
}

function getWordsInSection(sectionId) {
  const data = getData();
  return data.words.filter((word) => word.sectionId === sectionId);
}

function pickWordForScene(scene, sectionId) {
  const words = getWordsInSection(sectionId);

  if (!words.length) return null;

  const matched = words.filter((word) => {
    const posOk =
      !scene.preferredPos?.length || scene.preferredPos.includes(word.pos);

    const tagOk =
      !scene.preferredTags?.length ||
      (word.tags || []).some((tag) => scene.preferredTags.includes(tag));

    return posOk && tagOk;
  });

  if (matched.length > 0) {
    return matched[Math.floor(Math.random() * matched.length)];
  }

  return words[Math.floor(Math.random() * words.length)];
}

function renderState() {
  const scenario = getCurrentScenario();
  const totalScenes = scenario?.scenes.length || 0;
  const currentSceneNumber =
    totalScenes === 0 ? 0 : Math.min(gameState.sceneIndex + 1, totalScenes);

  sceneCounter.textContent = `${currentSceneNumber} / ${totalScenes}`;
  clueCountEl.textContent = gameState.clueCount;
  mistakeCountEl.textContent = gameState.mistakeCount;
  scenarioStatus.textContent = gameState.currentSceneResolved ? "선택 대기" : "조사 중";
}

function renderJournal() {
  if (!gameState.journal.length) {
    journalBox.innerHTML = `<div class="empty-state">아직 기록이 없습니다.</div>`;
    return;
  }

  journalBox.innerHTML = gameState.journal
    .map((entry) => `<div class="log-entry">${escapeHtml(entry)}</div>`)
    .join("");
}

function renderIntro() {
  const scenario = getCurrentScenario();
  if (!scenario) {
    scenarioIntroBox.innerHTML = `<p class="muted">시나리오를 시작해 주세요.</p>`;
    scenarioTitle.textContent = "시나리오";
    return;
  }

  scenarioTitle.textContent = scenario.title;
  scenarioIntroBox.innerHTML = `<p>${escapeHtml(scenario.intro)}</p>`;
}

function renderScene() {
  const scene = getCurrentScene();

  if (!scene) {
    sceneBox.innerHTML = `<p class="muted">장면이 없습니다.</p>`;
    return;
  }

  sceneBox.innerHTML = `
    <h3>${escapeHtml(scene.title)}</h3>
    <p>${escapeHtml(scene.description)}</p>
  `;
}

function renderWordEvent() {
  if (!gameState.currentWord) {
    wordEventBox.classList.add("hidden");
    return;
  }

  const word = gameState.currentWord;
  const tagText = (word.tags || []).map((tag) => getTagLabel(word.pos, tag)).join(", ");

  trpgWordText.textContent = word.word;
  trpgWordMeta.textContent =
    `품사: ${getPosLabel(word.pos)} · 정서: ${getToneLabel(word.tone)} · 태그: ${tagText || "없음"}`;

  trpgAnswerInput.value = "";
  trpgResultBox.innerHTML = "";
  trpgJudgeConfirmBox.classList.add("hidden");
  wordEventBox.classList.remove("hidden");
  trpgAnswerInput.focus();
}

function renderChoices() {
  const scene = getCurrentScene();

  if (!scene || !gameState.currentSceneResolved) {
    sceneChoiceBox.classList.add("hidden");
    choiceButtons.innerHTML = "";
    return;
  }

  sceneChoiceBox.classList.remove("hidden");
  choiceButtons.innerHTML = scene.choices
    .map(
      (choice) => `
        <button class="button" data-choice-id="${choice.id}">
          ${escapeHtml(choice.label)}
        </button>
      `
    )
    .join("");
}

function renderEnding() {
  endingBox.classList.add("hidden");
  endingText.innerHTML = "";
}

function renderAll() {
  renderState();
  renderIntro();
  renderScene();
  renderWordEvent();
  renderChoices();
  renderJournal();
}

function showEnding() {
  const scenario = getCurrentScenario();
  endingBox.classList.remove("hidden");

  let endingSummary = scenario.endingTexts.low;

  if (gameState.clueCount >= 3 && gameState.mistakeCount <= 1) {
    endingSummary = scenario.endingTexts.high;
  } else if (gameState.clueCount >= 2) {
    endingSummary = scenario.endingTexts.mid;
  }

  endingText.innerHTML = `
    <p>${escapeHtml(endingSummary)}</p>
    <hr />
    <p><strong>단서 수:</strong> ${gameState.clueCount}</p>
    <p><strong>오해 수:</strong> ${gameState.mistakeCount}</p>
  `;

  wordEventBox.classList.add("hidden");
  sceneChoiceBox.classList.add("hidden");
  scenarioStatus.textContent = "종결";
}

function judgeAnswer(userAnswer, meanings) {
  const normalizedUser = normalizeText(userAnswer);
  if (!normalizedUser) return false;

  const normalizedMeanings = (meanings || [])
    .map((meaning) => normalizeText(meaning))
    .filter(Boolean);

  return normalizedMeanings.some(
    (meaning) =>
      normalizedUser === meaning ||
      normalizedUser.includes(meaning) ||
      meaning.includes(normalizedUser)
  );
}

function beginWordInterpretation(userAnswer) {
  const scene = getCurrentScene();
  const word = gameState.currentWord;
  if (!scene || !word) return;

  const autoJudgedCorrect = judgeAnswer(userAnswer, word.meanings);

  pendingSubmission = {
    userAnswer,
    autoJudgedCorrect
  };

  if (autoJudgedCorrect) {
    trpgResultBox.innerHTML = `<span class="result-correct">자동 판정: 정답 후보 ✅</span>`;
    trpgJudgeHintText.textContent = "자동 판정은 정답 후보입니다. 그대로 확정하거나 뒤집을 수 있습니다.";
  } else {
    trpgResultBox.innerHTML = `<span class="result-wrong">자동 판정: 오답 후보 ❌</span>`;
    trpgJudgeHintText.textContent = `자동 판정은 오답 후보입니다. 정답 보기: ${(word.meanings || []).join(" / ")}`;
  }

  trpgJudgeConfirmBox.classList.remove("hidden");
}

function finalizeWordInterpretation(finalCorrect) {
  const scene = getCurrentScene();
  const word = gameState.currentWord;
  if (!scene || !word || !pendingSubmission) return;

  if (finalCorrect) {
    gameState.clueCount += 1;
    gameState.journal.push(scene.successText);
    trpgResultBox.innerHTML = `<span class="result-correct">해석 성공 ✅</span>`;
  } else {
    gameState.mistakeCount += 1;
    gameState.journal.push(scene.failureText);
    trpgResultBox.innerHTML = `<span class="result-wrong">해석 실패 ❌</span>`;
  }

  gameState.currentSceneResolved = true;
  trpgJudgeConfirmBox.classList.add("hidden");
  pendingSubmission = null;

  renderAll();
}

function moveToNextScene() {
  const scenario = getCurrentScenario();
  gameState.sceneIndex += 1;

  if (!scenario || gameState.sceneIndex >= scenario.scenes.length) {
    showEnding();
    renderJournal();
    renderState();
    return;
  }

  const nextScene = getCurrentScene();
  gameState.currentWord = pickWordForScene(nextScene, gameState.sectionId);
  gameState.currentSceneResolved = false;

  renderAll();
}

function startScenario() {
  const scenarioId = scenarioSelect.value;
  const sectionId = trpgSectionSelect.value;

  if (!scenarioId || !sectionId) {
    alert("책, 섹션, 시나리오를 모두 선택해 주세요.");
    return;
  }

  resetGameState();
  gameState.scenarioId = scenarioId;
  gameState.sectionId = sectionId;
  gameState.sceneIndex = 0;

  const firstScene = getCurrentScene();
  gameState.currentWord = pickWordForScene(firstScene, sectionId);
  gameState.currentSceneResolved = false;

  endingBox.classList.add("hidden");
  renderAll();
}

function handleChoice(choiceId) {
  const scene = getCurrentScene();
  if (!scene || !gameState.currentSceneResolved) return;

  const choice = scene.choices.find((item) => item.id === choiceId);
  if (!choice) return;

  gameState.journal.push(choice.journalText);
  moveToNextScene();
}

function attachEvents() {
  trpgBookSelect.addEventListener("change", () => {
    renderSectionOptions();
  });

  startScenarioBtn.addEventListener("click", () => {
    startScenario();
  });

  restartScenarioBtn.addEventListener("click", () => {
    startScenario();
  });

  trpgAnswerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!gameState.currentWord || pendingSubmission || gameState.currentSceneResolved) return;

    const userAnswer = trpgAnswerInput.value.trim();
    beginWordInterpretation(userAnswer);
  });

  trpgShowAnswerBtn.addEventListener("click", () => {
    if (!gameState.currentWord) return;
    trpgResultBox.innerHTML = `정답: <strong>${escapeHtml((gameState.currentWord.meanings || []).join(" / "))}</strong>`;
  });

  trpgConfirmCorrectBtn.addEventListener("click", () => {
    finalizeWordInterpretation(true);
  });

  trpgConfirmWrongBtn.addEventListener("click", () => {
    finalizeWordInterpretation(false);
  });

  choiceButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const choiceId = button.dataset.choiceId;
    handleChoice(choiceId);
  });
}

async function main() {
  await initData();
  resetGameState();
  renderBookOptions();
  renderScenarioOptions();
  attachEvents();
  renderAll();
}

main();
