// 단어의 pos + tag 조합에 따라 이벤트 텍스트를 결정합니다.
// {word} 자리에 실제 단어가 들어갑니다.
// 매칭 우선순위: pos+tag 조합 → pos만 → 범용(default)

export const EVENT_TEMPLATES = {

  // ── 명사 + 태그 ──────────────────────────────
  'noun+space':      [
    "공간 한편에 {word}을(를) 발견했다.",
    "어두운 구석에 {word}이(가) 놓여 있었다.",
    "당신은 {word}을(를) 알아보았다."
  ],
  'noun+object':     [
    "{word}이(가) 먼지 속에 묻혀 있었다.",
    "손에 {word}이(가) 잡혔다.",
    "그것은 {word}이었다(였다)."
  ],
  'noun+atmosphere': [
    "{word}의 기운이 공간을 감싸고 있었다.",
    "이 장소에서 {word}을(를) 느꼈다."
  ],
  'noun+emotion':    [
    "마음 한편에서 {word}이(가) 떠올랐다.",
    "그 감각의 이름은 {word}이었다(였다)."
  ],
  'noun+concept':    [
    "기록에는 {word}이(가) 반복해서 등장했다.",
    "{word}. 이 개념이 열쇠였다."
  ],
  'noun+document':   [
    "문서 안에 {word}이(가) 적혀 있었다.",
    "기록의 핵심 단어는 {word}이었다(였다)."
  ],
  'noun+danger':     [
    "{word}의 흔적이 남아 있었다.",
    "이곳에는 {word}이(가) 도사리고 있었다."
  ],
  'noun+nature':     [
    "자연 속에서 {word}을(를) 발견했다.",
    "{word}이(가) 눈앞에 펼쳐져 있었다."
  ],
  'noun+relation':   [
    "누군가와의 {word}이(가) 여기에 기록되어 있었다.",
    "{word}의 흔적이 남아 있었다."
  ],
  'noun+authority':  [
    "문서에는 {word}에 관한 규정이 적혀 있었다.",
    "{word}이(가) 이 공간을 지배하고 있었다."
  ],
  'noun+system':     [
    "{word}이(가) 작동을 멈춘 상태였다.",
    "이 장치의 이름은 {word}이었다(였다)."
  ],
  'noun+signal':     [
    "{word}이(가) 감지되었다.",
    "신호 안에 {word}이(가) 숨어 있었다."
  ],
  'noun+sense':      [
    "{word}이(가) 감각을 자극했다.",
    "어딘가에서 {word}이(가) 느껴졌다."
  ],
  'noun+daily':      [
    "일상의 물건들 사이에서 {word}을(를) 발견했다.",
    "{word}이(가) 이곳에 남겨져 있었다."
  ],
  'noun+thought':    [
    "머릿속에서 {word}이(가) 맴돌았다.",
    "이 단어, {word}. 무언가를 가리키고 있었다."
  ],
  'noun+change':     [
    "{word}이(가) 이곳을 바꾸어 놓았다.",
    "변화의 이름은 {word}이었다(였다)."
  ],
  'noun+action':     [
    "{word}이(가) 필요한 순간이었다.",
    "다음 행동의 단서는 {word}이었다(였다)."
  ],

  // ── 동사 + 태그 ──────────────────────────────
  'verb+action':     [
    "이 상황에서 필요한 건 {word}하는 것이었다.",
    "당신은 {word}하기로 결정했다."
  ],
  'verb+change':     [
    "{word}하자 무언가가 달라졌다.",
    "변화는 {word}하는 것에서 시작되었다."
  ],
  'verb+relation':   [
    "누군가가 당신에게 {word}하길 원했다.",
    "그와의 관계는 {word}하는 것으로 정의되었다."
  ],
  'verb+danger':     [
    "위험을 피하려면 {word}해야 했다.",
    "그것은 {word}하거나, 아니면 포기하거나였다."
  ],
  'verb+signal':     [
    "신호가 {word}하라고 지시하고 있었다.",
    "{word}하는 순간 신호가 반응했다."
  ],
  'verb+thought':    [
    "당신은 {word}하며 상황을 정리했다.",
    "이 순간 필요한 건 {word}하는 것이었다."
  ],
  'verb+emotion':    [
    "마음속에서 무언가가 {word}하게 만들었다.",
    "그 감정은 당신을 {word}하도록 이끌었다."
  ],

  // ── 형용사 + 태그 ──────────────────────────────
  'adj+atmosphere':  [
    "{word}한 분위기가 공간을 채우고 있었다.",
    "이 장소는 {word}한 느낌으로 가득했다."
  ],
  'adj+space':       [
    "{word}한 장소가 모습을 드러냈다.",
    "공간은 {word}했다."
  ],
  'adj+emotion':     [
    "그 감각은 {word}한 것이었다.",
    "{word}한 감정이 밀려왔다."
  ],
  'adj+danger':      [
    "{word}한 기운이 느껴졌다.",
    "상황은 {word}하게 변해가고 있었다."
  ],
  'adj+nature':      [
    "자연은 {word}한 모습이었다.",
    "{word}한 풍경이 펼쳐져 있었다."
  ],
  'adj+object':      [
    "{word}한 물체가 눈에 띄었다.",
    "그것은 {word}한 것이었다."
  ],
  'adj+thought':     [
    "{word}한 생각이 머릿속을 스쳤다.",
    "상황은 {word}하게 정리되지 않았다."
  ],

  // ── 부사 + 태그 ──────────────────────────────
  'adv+action':      [
    "{word}하게. 그 방식이 중요했다.",
    "당신은 {word}하게 행동해야 했다."
  ],
  'adv+thought':     [
    "{word}하게 생각하는 것이 필요했다.",
    "상황을 {word}하게 파악해야 했다."
  ],

  // ── 표현/구 ──────────────────────────────────
  'phrase+concept':  [
    "이 표현이 핵심이었다: {word}",
    "기록에는 {word}라는 표현이 남겨져 있었다."
  ],
  'phrase+daily':    [
    "일상에서 쓰이는 표현이었다: {word}",
    "{word}. 어디선가 들어본 말이었다."
  ],

  // ── pos만 (tag 매칭 없을 때) ─────────────────
  'noun':    [
    "{word}. 이 단어가 단서였다.",
    "기록에 {word}이(가) 남겨져 있었다.",
    "당신은 {word}을(를) 발견했다."
  ],
  'verb':    [
    "{word}하는 것. 그것이 열쇠였다.",
    "행동이 필요했다. {word}.",
    "당신은 {word}하기로 했다."
  ],
  'adj':     [
    "{word}한 무언가가 여기 있었다.",
    "그것은 {word}한 것이었다."
  ],
  'adv':     [
    "{word}하게. 그 방식이 중요했다.",
    "상황은 {word}하게 전개되고 있었다."
  ],
  'phrase':  [
    "이 표현이 핵심이었다: {word}",
    "{word}. 어딘가에서 본 적 있는 표현이었다."
  ],

  // ── 범용 fallback ─────────────────────────────
  'default': [
    "{word}. 이 단어의 의미가 다음 단계를 열었다.",
    "단서를 발견했다. {word}.",
    "기록 속에서 {word}을(를) 찾아냈다."
  ]
};

// pos + tags 배열을 받아서 이벤트 텍스트를 하나 반환합니다.
export function pickEventText(pos, tags) {
  const tagList = Array.isArray(tags) ? tags : [];

  // 1순위: pos + tag 조합 매칭
  for (const tag of tagList) {
    const key = `${pos}+${tag}`;
    if (EVENT_TEMPLATES[key]) {
      return randomFrom(EVENT_TEMPLATES[key]);
    }
  }

  // 2순위: pos만 매칭
  if (EVENT_TEMPLATES[pos]) {
    return randomFrom(EVENT_TEMPLATES[pos]);
  }

  // 3순위: 범용
  return randomFrom(EVENT_TEMPLATES['default']);
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
