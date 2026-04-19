export const POS_OPTIONS = [
  { value: "noun", label: "명사" },
  { value: "verb", label: "동사" },
  { value: "adjective", label: "형용사" },
  { value: "adverb", label: "부사" },
  { value: "phrase", label: "구" },
  { value: "expression", label: "표현" },
  { value: "other", label: "기타" }
];

export const TONE_OPTIONS = [
  { value: "neutral", label: "중립" },
  { value: "positive", label: "긍정" },
  { value: "negative", label: "부정" },
  { value: "formal", label: "격식" },
  { value: "casual", label: "구어" },
  { value: "literary", label: "문어/문학" },
  { value: "academic", label: "학술" }
];

export const TAG_OPTIONS = [
  { value: "action", label: "행동" },
  { value: "emotion", label: "감정" },
  { value: "thought", label: "사고" },
  { value: "relation", label: "관계" },
  { value: "person", label: "인물" },
  { value: "space", label: "공간" },
  { value: "time", label: "시간" },
  { value: "state", label: "상태" },
  { value: "change", label: "변화" },
  { value: "abstract", label: "추상" },
  { value: "concrete", label: "구체" },
  { value: "test", label: "시험빈출" }
];

const POS_LABEL_MAP = Object.fromEntries(POS_OPTIONS.map((item) => [item.value, item.label]));
const TONE_LABEL_MAP = Object.fromEntries(TONE_OPTIONS.map((item) => [item.value, item.label]));
const TAG_LABEL_MAP = Object.fromEntries(TAG_OPTIONS.map((item) => [item.value, item.label]));

export function getPosLabel(posValue) {
  return POS_LABEL_MAP[posValue] || posValue || "미지정";
}

export function getToneLabel(toneValue) {
  return TONE_LABEL_MAP[toneValue] || toneValue || "미지정";
}

export function getTagLabel(_posValue, tagValue) {
  return TAG_LABEL_MAP[tagValue] || tagValue || "미지정";
}

export function getPosOptions() {
  return [...POS_OPTIONS];
}

export function getToneOptions() {
  return [...TONE_OPTIONS];
}

export function getTagOptions() {
  return [...TAG_OPTIONS];
}
