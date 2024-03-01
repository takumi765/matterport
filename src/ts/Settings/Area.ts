import { Scene } from "./Interface";
import { Settings } from "./Union";

export class Area {
  public static AreaList: Scene[] = [
    {
      place: "barbar",
      uuids: [
        "149060cb94574161aeef0bdef31c9156",
        "604ead08044942e98f9976ff5d8fda1f",
        "180d0c54fe2f44c0b78309711ad821bd",
      ],
      musics: [],
      scent: Settings.Scents.shampoo
    },
    {
      place: "best10",
      uuids: [
        "625edc04cabc4de0a9a8a40cd53330f2",
        "23e3dc46d58a4639a415890f8512064a",
        "4fba14c9b5f94c6fa8413eca2aff6693",
        "c21068a8de214d978f11850409ae774a",
      ],
      musics: [
        new Audio("../../assets/music/ruby-no-ring.mp3"),
        new Audio("../../assets/music/ai-ga-tomaranai.mp3"),
        new Audio("../../assets/music/dancing-allnight.mp3"),
        new Audio("../../assets/music/namida-no-request.mp3"),
        new Audio("../../assets/music/gingiragin-ni-sarigenaku.mp3"),
        new Audio("../../assets/music/wakaretemo-sukina-hito.mp3"),
        new Audio("../../assets/music/hohoemi-gaeshi.mp3"),
        new Audio("../../assets/music/koi-ni-ochite.mp3"),
        new Audio("../../assets/music/daitokai.mp3"),
        new Audio("../../assets/music/highschool-lullaby.mp3"),
      ],
      scent: ""
    },
    // {
    //   place: "classroom",
    //   uuids: [
    //     "fc477ea4a3494044bce0034d5830b7de",
    //     "4789dbbcc7fc4eafaa72aa9371ff48fc",
    //     "4a96d2b9b2cd4211b90ef1108cb90bc3",
    //     "bf9facfc5dea4e5c9da722148434bcb6",
    //     "795a61c84742497494a760a753ba1f82",
    //     "f2de216b959d40bd9a4382d491a06461",
    //     "68ba4c8e9631462d94a7c10c7e212aba",
    //     "6c47369f25134ffa9b98a057e6a6edc2",
    //     "1ac2b28f862049e89d984abb9f51f217",
    //     "5bfbd119764c4d8183e1aafd88727416",
    //     "784225eb4db04075a7b9ada9fa6e46eb",
    //     "c5e9ce0ecc134b93af9a96d9c07ffaa0",
    //   ],
    //   musics: [
    //     new Audio("../../assets/music/itsuka-shitamachi.mp3")
    //   ],
    //   scent: Settings.Scents.hinoki
    // },
    {
      place: "coffee",
      uuids: [
        "ab9686595108452abce4dffc32dcf85d",
        "034d39b24cde4753bc78b693a283efd7",
        "3d446a6e6f6d43aaad89d694bc442ae1",
        "1c632d262466455dbaa0e0b8b56e43ab",
        "59729c626e9b4d26bedbcbb0ae884814",
        "2e1ce18938864d6189ec218559a5e056",
      ],
      musics: [],
      scent: Settings.Scents.coffee
    },
    {
      place: "Ennichi",
      uuids: [
        "8d1c893b060f47e1ba0fd66b4d330c5e",
        "54731c7ff5e942f09d71bb852a947226",
        "a02be3015d8c452f8c16d1a9c1c62be6",
        "aa294aaceced4dd19d906c2e891fca87",
        "916d1c4f203f4cecb22dc34622294f68",
        "8580380be7c146ea887e4ad2d1b3838c",
        "61dff7068ee44c68a5a3854074e5641f",
        "b9a8b6c66a0c4094badf297b227782e0",
        "6fb6722d037c49a795c34e92cc161b3c",
        "89e61334221c4c75baea1875a19a11f2",
        "fb796232f8894ec8bf04a73ee48e862c",
        "65c4956a12ff4190b7d4c360ea4638b9",
        "42fd97e4513e49518ffbf303e8089eb8",
        "1cdb6a4a738149949f5b6aa46aac0d0a",
        "0197fc9881554c35b78fc29ac1767848",
        "6730b15ebb43494683e9b2a2906f24eb",
        "6623288773f84ce9a9199d4be6f555f3",
      ],
      musics: [
        new Audio("../../assets/music/ennichi.mp3")
      ],
      scent: ""
    },
    {
      place: "phone",
      uuids: [
        "023a67b0c1fa4b6da072c4a3a3fc9c4d",
        "000a1277415f468e98e6bb5329a07966",
        "364b6e17a2794462a1ec1895ea9226a5",
        "d8a64e2e6ef846708884ecedbcb98438",
        "1ea7972f7b2b4313aab5d4bde7350a9b",
        "312cfd5cb92d4982a5f5640390bb0b34",
        "33bf525adf7545599747bc72b7ada722",
        "b873bc401fb14de0b2c0b4e4347bef02",
        "83938af8a1804a2f8546f236092a5d65",
        "3b0c2dc427924d82a52275f5851dc340",
        "d3a4bedb47c34117b4a5edb023335b97",
        "5d7dd490de49444cb6bce9d1abea7f0b",
      ],
      musics: [
          new Audio("../../assets/music/kurodenwa.mp3")
      ],
      scent: ""
    },
    {
      place: "train",
      uuids: [
        "182296cf89934d65bfc67a796510aa8d",
        "2a3eb964ece04e328d44d863b12517f6",
        "05140ce2f17143cb876a7fc0de48840f",
        "8d680c6486794017863ad526f65d25fb",
      ],
      musics: [
        new Audio("../../assets/music/itsuka-train.mp3")
      ],
      scent: ""
    },
    {
      place: "bar",
      uuids: [
        "37cd922d337f4026942b87b87bd25508",
        "e028a827877043e28483657bd47e569a",
      ],
      musics: [
        new Audio("../../assets/music/itsuka-trisbar.mp3")
      ],
      scent: Settings.Scents.whisky
    },
    {
      place: "udon",
      uuids: [
        "814f3b3c24f046f4a2ef2a42978575e4",
        "722fe611f93a4af2b45a96a1f4a93952",
        "e630189942f94e62ad3add0fed1ee07f",
      ],
      musics: [],
      scent: Settings.Scents.wafudashi
    },
    {
      place: "yuzu",
      uuids: [
        "56aa60427acd4fe5812fdb1238d7156a",
      ],
      musics: [
        new Audio("../../assets/music/yuzu.mp3"),
      ],
      scent: Settings.Scents.yuzu
    },
    // ↓↓実験用↓↓ //
    {
      place: "classroom1",
      uuids: [
        "784225eb4db04075a7b9ada9fa6e46eb",
        "4789dbbcc7fc4eafaa72aa9371ff48fc",
        "4a96d2b9b2cd4211b90ef1108cb90bc3",
        "bf9facfc5dea4e5c9da722148434bcb6",
      ],
      musics: [
        new Audio("../../assets/music/itsuka-shitamachi.mp3")
      ],
      scent: Settings.Scents.hinoki
    },
    {
      place: "classroom2",
      uuids: [
        "795a61c84742497494a760a753ba1f82",
        "f2de216b959d40bd9a4382d491a06461",
        "6c47369f25134ffa9b98a057e6a6edc2",
        "1ac2b28f862049e89d984abb9f51f217",
      ],
      musics: [
        new Audio("../../assets/music/itsuka-shitamachi.mp3")
      ],
      scent: Settings.Scents.hinoki
    },
    // ↑↑実験用↑↑ //

    // {
    //     // ramen
    //     uuids: [
    //         "e75c6e3dc07b426e852fd24f2443d84b",
    //         "8c4071bda68d4825bf96753adef62270",
    //         "38c395b1e8f641949d9218022d524736",
    //     ],
    //     scent: Settings.Scents.soysource
    // },
  ]
}