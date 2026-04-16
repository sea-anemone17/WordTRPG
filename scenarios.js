export const scenarios = [
  {
    id: "closed_corridor",
    title: "닫힌 복도에서",
    intro:
      "당신은 오랫동안 잠겨 있던 건물 안으로 들어선다. 복도 끝 어딘가에, 누군가가 남긴 기록이 아직 남아 있다는 소문만이 이곳을 지탱하고 있다.",
    endingTexts: {
      high:
        "당신은 남겨진 흔적들을 비교적 또렷하게 해석해 냈다. 사건의 윤곽은 완전하지 않았지만, 적어도 이 장소가 무엇을 숨기고 있었는지는 분명히 알게 되었다.",
      mid:
        "당신은 몇몇 중요한 흔적을 잡아냈지만, 의미가 흐릿하게 남은 부분도 있었다. 기록은 회수했으나, 그 주변의 침묵까지 모두 해석한 것은 아니었다.",
      low:
        "당신은 결국 기록에 도달했지만, 그 과정에서 너무 많은 의미를 놓쳤다. 진실의 껍데기는 손에 넣었으나, 핵심은 여전히 어둠 속에 남아 있다."
    },
    scenes: [
      {
        id: "scene_1",
        title: "복도",
        description:
          "조명이 거의 닿지 않는 복도가 길게 이어져 있다. 벽에는 오래된 먼지와 미세한 흔적이 층층이 쌓여 있다.",
        preferredTags: ["place", "atmosphere"],
        preferredPos: ["noun", "adjective"],
        successText:
          "당신은 공간이 품은 인상을 비교적 정확히 읽어낸다. 이곳은 단순히 낡은 것이 아니라, 무언가를 오래 감춘 채 방치된 장소다.",
        failureText:
          "당신은 이 공간의 분위기를 잡아내지 못한다. 복도는 그저 어둡고 조용할 뿐, 무엇을 말하는지는 아직 알 수 없다.",
        choices: [
          {
            id: "inspect_wall",
            label: "벽면의 흔적을 더 살핀다",
            journalText: "당신은 벽면에 남은 자국과 먼지층을 세심하게 살폈다."
          },
          {
            id: "move_forward",
            label: "복도 안쪽으로 바로 걸어간다",
            journalText: "당신은 망설이지 않고 복도 안쪽으로 곧장 걸어갔다."
          }
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
