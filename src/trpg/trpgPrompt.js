import { pickRandom } from "./trpgHelpers.js";
import { QUIZ_MODES, QUIZ_MODE_LABELS } from "./trpgConfig.js";

export function chooseQuizMode(preset) {
  return pickRandom(preset?.allowedQuizModes || [QUIZ_MODES.WORD_TO_MEANING]) || QUIZ_MODES.WORD_TO_MEANING;
}

export function getTargetMeanings(word, preset) {
  const meanings = word?.meanings || [];
  const primaryIndexes = word?.primaryMeaningIndexes || [];

  if (preset?.usePrimaryMeaningsOnly && primaryIndexes.length) {
    return primaryIndexes
      .map((index) => meanings[index])
      .filter(Boolean);
  }

  return meanings;
}

export function buildMeaningToWordPrompt(word, preset) {
  const targetMeanings = getTargetMeanings(word, preset);
  return targetMeanings.join(" / ");
}

export function buildAllMeaningsPrompt(word) {
  return word?.word || "";
}

export function buildPromptForTurn({ word, quizMode, preset }) {
  if (!word) {
    return {
      promptText: "",
      quizModeLabel: ""
    };
  }

  if (quizMode === QUIZ_MODES.MEANING_TO_WORD) {
    return {
      promptText: buildMeaningToWordPrompt(word, preset),
      quizModeLabel: QUIZ_MODE_LABELS[quizMode]
    };
  }

  if (quizMode === QUIZ_MODES.ALL_MEANINGS) {
    return {
      promptText: buildAllMeaningsPrompt(word),
      quizModeLabel: QUIZ_MODE_LABELS[quizMode]
    };
  }

  return {
    promptText: word.word,
    quizModeLabel: QUIZ_MODE_LABELS[quizMode]
  };
}
