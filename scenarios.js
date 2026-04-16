export const scenarios = [
  {
    id: "closed_corridor_loop",
    title: "닫힌 복도에서",
    intro:
      "당신은 오랫동안 잠겨 있던 건물 안으로 들어선다. 복도 끝 어딘가에, 누군가가 남긴 기록이 아직 남아 있다는 소문만이 이곳을 지탱하고 있다.",

    loopConfig: {
      maxTurns: 8,
      clueGoal: 5,
      mistakeLimit: 4
    },

    endingTexts: {
      high:
        "당신은 남겨진 흔적들을 비교적 또렷하게 해석해 냈다. 사건의 윤곽은 완전하지 않았지만, 적어도 이 장소가 무엇을 숨기고 있었는지는 분명히 알게 되었다.",
      mid:
        "당신은 몇몇 중요한 흔적을 붙잡아 냈지만, 끝내 흐릿하게 남은 부분도 있었다. 기록은 회수했으나, 그 침묵의 층위까지 모두 벗겨 낸 것은 아니었다.",
      low:
        "당신은 결국 기록에 도달했지만, 그 과정에서 너무 많은 의미를 놓쳤다. 진실의 껍데기는 손에 넣었으나, 핵심은 여전히 어둠 속에 남아 있다."
    },

    actionTypes: [
      {
        id: "observe",
        label: "주변을 살핀다",
        description:
          "공간의 분위기, 사물의 윤곽, 오래 남은 자국 같은 것을 읽어내려 시도한다.",
        preferredTags: ["place", "atmosphere", "quality", "object"],
        preferredPos: ["noun", "adjective"],

        successText:
          "당신은 공간이 품은 인상을 비교적 정확히 읽어낸다. 이 장소는 단순히 낡은 것이 아니라, 무언가를 오래 감춘 채 방치된 흔적을 품고 있다.",
        failureText:
          "당신은 공간의 분위기를 붙잡지 못한다. 눈앞의 풍경은 보이지만, 그것이 무엇을 암시하는지는 아직 알 수 없다.",

        successJournalPool: [
          "당신은 복도와 벽면에 남은 흔적을 하나의 흐름으로 묶어 보기 시작했다.",
          "당신은 먼지와 정적 속에서 이곳이 오래 닫혀 있었다는 인상을 읽어 냈다.",
          "당신은 공간이 품은 미묘한 긴장을 비교적 정확히 감지했다."
        ],
        failureJournalPool: [
          "당신은 이 공간의 인상을 단순한 낡음으로 넘겨 버렸다.",
          "당신은 주변을 둘러보았지만, 무엇이 중요한 흔적인지는 분간하지 못했다.",
          "당신은 공간의 분위기를 읽으려 했으나 핵심을 붙잡지 못했다."
        ],

        choicePool: [
          {
            id: "observe_wall",
            label: "벽면의 자국을 더 살핀다",
            journalText: "당신은 벽면에 남은 자국과 먼지층을 세심하게 살폈다."
          },
          {
            id: "observe_floor",
            label: "바닥에 남은 흔적을 따라간다",
            journalText: "당신은 바닥에 스친 흔적의 방향을 조심스럽게 따라갔다."
          },
          {
            id: "observe_air",
            label: "공기의 정체된 느낌에 집중한다",
            journalText: "당신은 눈에 보이지 않는 정적과 공기의 흐름을 의식했다."
          },
          {
            id: "observe_light",
            label: "빛이 닿는 범위를 확인한다",
            journalText: "당신은 희미한 빛이 어디까지 닿는지를 오래 바라보았다."
          }
        ]
      },

      {
        id: "trace",
        label: "흔적을 추적한다",
        description:
          "누군가의 행동 흔적, 급히 손댄 자국, 이동의 방향 같은 것을 좇는다.",
        preferredTags: ["action", "change", "relation", "movement"],
        preferredPos: ["verb"],

        successText:
          "당신은 흔적의 의미를 제대로 읽어낸다. 누군가는 이 장소에서 무엇인가를 숨기거나 옮기거나 버리려 했고, 그 과정은 결코 여유롭지 않았다.",
        failureText:
          "당신은 흔적을 단순한 사용감으로 넘겨 버린다. 누군가의 의도는 있었겠지만, 지금의 당신은 그 결을 이어 붙이지 못한다.",

        successJournalPool: [
          "당신은 누군가의 행동이 급박했다는 사실을 자국의 흐름에서 읽어 냈다.",
          "당신은 사라진 것과 남겨진 것 사이의 불균형을 추적해 냈다.",
          "당신은 이 장소에서 벌어진 움직임의 방향을 어렴풋이 이어 보았다."
        ],
        failureJournalPool: [
          "당신은 흔적을 그저 오래된 생활 자국쯤으로 넘겨 버렸다.",
          "당신은 남은 자국을 보았지만, 그 의도를 따라가지는 못했다.",
          "당신은 변화의 흔적을 포착했지만 그것을 사건으로 묶어내지 못했다."
        ],

        choicePool: [
          {
            id: "trace_handle",
            label: "손잡이 주변의 마모를 확인한다",
            journalText: "당신은 손잡이 주변의 닳은 자국을 세심하게 확인했다."
          },
          {
            id: "trace_surface",
            label: "표면에 남은 긁힌 흔적을 짚어 본다",
            journalText: "당신은 표면을 가른 미세한 긁힘을 손끝으로 더듬었다."
          },
          {
            id: "trace_direction",
            label: "무엇이 옮겨졌는지 방향을 짐작한다",
            journalText: "당신은 물건의 배치와 흐트러짐에서 이동 방향을 짐작했다."
          },
          {
            id: "trace_pause",
            label: "한 발 물러서 전체 배치를 본다",
            journalText: "당신은 가까운 흔적보다 전체 배치가 말하는 흐름을 먼저 보았다."
          }
        ]
      },

      {
        id: "decode",
        label: "기록을 해독한다",
        description:
          "남겨진 단어, 문장 조각, 반복되는 표현을 이어 붙여 기록의 중심을 해석하려 한다.",
        preferredTags: ["concept", "emotion", "feeling", "document"],
        preferredPos: ["noun", "adjective"],

        successText:
          "당신은 조각난 문장의 중심 의미를 붙잡는다. 기록은 사실을 모두 말하지 않지만, 무엇이 지워졌고 무엇이 끝까지 남으려 했는지는 분명히 드러난다.",
        failureText:
          "당신은 남겨진 문장 조각을 온전히 묶어내지 못한다. 기록은 눈앞에 있지만, 그 의미는 아직 흩어진 채 남아 있다.",

        successJournalPool: [
          "당신은 끊어진 문장들 사이에서 반복되는 의미의 축을 찾아냈다.",
          "당신은 남은 단어들만으로도 이 기록이 붙들고 있던 핵심을 짐작했다.",
          "당신은 지워진 부분보다 남겨진 표현이 더 많은 것을 말한다는 사실을 깨달았다."
        ],
        failureJournalPool: [
          "당신은 문장 조각을 읽었지만, 그 사이의 공백을 메우지 못했다.",
          "당신은 단어들을 보았으나 그것을 하나의 의미로 엮어 내지 못했다.",
          "당신은 기록의 표면만 훑었고, 중심은 끝내 흐릿하게 남았다."
        ],

        choicePool: [
          {
            id: "decode_slow",
            label: "문장을 천천히 이어 읽는다",
            journalText: "당신은 조급해하지 않고 문장의 결을 천천히 이어 읽었다."
          },
          {
            id: "decode_copy",
            label: "핵심만 빠르게 옮겨 적는다",
            journalText: "당신은 남아 있는 문장의 핵심만 빠르게 옮겨 적었다."
          },
          {
            id: "decode_repeat",
            label: "반복되는 표현에 주목한다",
            journalText: "당신은 반복되어 남은 표현들이 무엇을 가리키는지 오래 붙잡고 있었다."
          },
          {
            id: "decode_missing",
            label: "빠진 단어를 상상하며 빈칸을 메운다",
            journalText: "당신은 지워진 부분에 무엇이 있었을지 조심스럽게 상상해 보았다."
          }
        ]
      }
    ]
  }
];          }
        ]
      },
      {
        id: "scene_2",
        title: "숨겨진 서랍",
        description:
          "작은 서랍이 있는 낡은 탁자를 발견했다. 표면은 거칠고, 손잡이 주변에는 누군가 급히 손댄 듯한 흔적이 남아 있다.",
        preferredTags: ["action", "change", "relation"],
        preferredPos: ["verb"],
        successText:
          "당신은 흔적의 의미를 제대로 읽어낸다. 누군가는 이 서랍 속 내용을 숨기거나 버리려 했고, 그 과정은 급박했다.",
        failureText:
          "당신은 흔적을 단순한 사용감으로 넘겨 버린다. 누군가의 의도는 있었겠지만, 지금의 당신은 그 결을 읽지 못한다.",
        choices: [
          {
            id: "open_drawer",
            label: "서랍을 열어 기록을 확인한다",
            journalText: "당신은 서랍을 조심스럽게 열어 안쪽의 종이 조각들을 확인했다."
          },
          {
            id: "step_back",
            label: "조금 물러서서 주변부터 확인한다",
            journalText: "당신은 서랍보다도 그 주변의 배치를 먼저 확인했다."
          }
        ]
      },
      {
        id: "scene_3",
        title: "남겨진 기록",
        description:
          "접힌 종이 조각 몇 장이 나타난다. 문장은 완전하지 않지만, 남겨진 단어들만으로도 이 장소가 침묵 속에 붙들고 있던 이야기를 짐작할 수 있다.",
        preferredTags: ["concept", "emotion", "feeling"],
        preferredPos: ["noun", "adjective"],
        successText:
          "당신은 조각난 문장들의 중심 의미를 붙잡는다. 기록은 사실을 모두 말하지 않지만, 무엇이 지워졌는지는 충분히 드러난다.",
        failureText:
          "당신은 문장 조각의 의미를 온전히 묶어내지 못한다. 기록은 눈앞에 있지만, 사건은 여전히 흩어진 채 남아 있다.",
        choices: [
          {
            id: "preserve_record",
            label: "기록을 그대로 보존한다",
            journalText: "당신은 기록을 함부로 건드리지 않고 보존하기로 했다."
          },
          {
            id: "copy_record",
            label: "핵심만 빠르게 옮겨 적는다",
            journalText: "당신은 남아 있는 문장의 핵심만 빠르게 옮겨 적었다."
          }
        ]
      }
    ]
  }
];
