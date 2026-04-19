import { normalizeText } from "../utils.js";
import { QUIZ_MODES } from "./trpgConfig.js";

function splitUserMeanings(userAnswer = "") {
  return String(userAnswer)
    .split(/[,/;\n]+/)
    .map((item) => normalizeText(item))
    .filter(Boolean);
}

function normalizeMeaningList(meanings = []) {
  return meanings.map((item) => normalizeText(item)).filter(Boolean);
}

function isMeaningMatch(input, target, { partialMatch = false } = {}) {
  if (!input || !target) return false;
  if (input === target) return true;

  if (partialMatch) {
    return input.includes(target) || target.includes(input);
  }

  return false;
}

export function judgeAnyMeaning(userAnswer, meanings, options = {}) {
  const inputs = splitUserMeanings(userAnswer);
  const targets = normalizeMeaningList(meanings);

  const matched = targets.filter((target) =>
    inputs.some((input) => isMeaningMatch(input, target, options))
  );

  return {
    isCorrect: matched.length >= 1,
    matchedCount: matched.length,
    requiredCount: 1,
    correctAnswerText: (meanings || []).join(" / ")
  };
}

export function judgeAllMeanings(userAnswer, meanings, options = {}) {
  const inputs = splitUserMeanings(userAnswer);
  const targets = normalizeMeaningList(meanings);

  const matched = targets.filter((target) =>
    inputs.some((input) => isMeaningMatch(input, target, options))
  );

  return {
    isCorrect: matched.length === targets.length && targets.length > 0,
    matchedCount: matched.length,
    requiredCount: targets.length,
    correctAnswerText: (meanings || []).join(" / ")
  };
}

export function judgeWordForm(userAnswer, targetWord) {
  const input = normalizeText(userAnswer);
  const target = normalizeText(targetWord);

  return {
    isCorrect: !!input && input === target,
    matchedCount: input === target ? 1 : 0,
    requiredCount: 1,
    correctAnswerText: targetWord
  };
}

export function judgeByQuizMode({ quizMode, userAnswer, word, preset }) {
  const options = {
    partialMatch: !!preset?.partialMatch
  };

  if (quizMode === QUIZ_MODES.MEANING_TO_WORD) {
    return judgeWordForm(userAnswer, word.word);
  }

  if (quizMode === QUIZ_MODES.ALL_MEANINGS) {
    return judgeAllMeanings(userAnswer, word.meanings || [], options);
  }

  return judgeAnyMeaning(userAnswer, word.meanings || [], options);
}
