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
  // 공간/사물
  { value: "space", label: "공간" },
  { value: "object", label: "사물" },
  // 행동/변화
  { value: "action", label: "행동" },
  { value: "change", label: "변화" },
  // 감정/내면
  { value: "emotion", label: "감정" },
  { value: "thought", label: "사고" },
  // 관계/사회
  { value: "relation", label: "관계" },
  { value: "authority", label: "권위/제도" },
  // 개념/기록
  { value: "concept", label: "개념" },
  { value: "document", label: "기록" },
  // 감각/분위기
  { value: "sense", label: "감각" },
  { value: "atmosphere", label: "분위기" },
  // 자연
  { value: "nature", label: "자연" },
  // 기술/체계
  { value: "system", label: "체계" },
  { value: "signal", label: "신호" },
  // 기타
  { value: "danger", label: "위험" },
  { value: "daily", label: "일상" },
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
