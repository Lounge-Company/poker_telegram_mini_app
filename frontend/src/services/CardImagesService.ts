import hearts_ace from "src/assets/images/cards/hearts_ace.png";
import hearts_2 from "src/assets/images/cards/hearts_02.png";
import hearts_3 from "src/assets/images/cards/hearts_03.png";
import hearts_4 from "src/assets/images/cards/hearts_04.png";
import hearts_5 from "src/assets/images/cards/hearts_05.png";
import hearts_6 from "src/assets/images/cards/hearts_06.png";
import hearts_7 from "src/assets/images/cards/hearts_07.png";
import hearts_8 from "src/assets/images/cards/hearts_08.png";
import hearts_9 from "src/assets/images/cards/hearts_09.png";
import hearts_10 from "src/assets/images/cards/hearts_10.png";
import hearts_jack from "src/assets/images/cards/hearts_jack.png";
import hearts_queen from "src/assets/images/cards/hearts_queen.png";
import hearts_king from "src/assets/images/cards/hearts_king.png";

import diamonds_ace from "src/assets/images/cards/diamonds_ace.png";
import diamonds_2 from "src/assets/images/cards/diamonds_02.png";
import diamonds_3 from "src/assets/images/cards/diamonds_03.png";
import diamonds_4 from "src/assets/images/cards/diamonds_04.png";
import diamonds_5 from "src/assets/images/cards/diamonds_05.png";
import diamonds_6 from "src/assets/images/cards/diamonds_06.png";
import diamonds_7 from "src/assets/images/cards/diamonds_07.png";
import diamonds_8 from "src/assets/images/cards/diamonds_08.png";
import diamonds_9 from "src/assets/images/cards/diamonds_09.png";
import diamonds_10 from "src/assets/images/cards/diamonds_10.png";
import diamonds_jack from "src/assets/images/cards/diamonds_jack.png";
import diamonds_queen from "src/assets/images/cards/diamonds_queen.png";
import diamonds_king from "src/assets/images/cards/diamonds_king.png";

import spades_ace from "src/assets/images/cards/spades_ace.png";
import spades_2 from "src/assets/images/cards/spades_02.png";
import spades_3 from "src/assets/images/cards/spades_03.png";
import spades_4 from "src/assets/images/cards/spades_04.png";
import spades_5 from "src/assets/images/cards/spades_05.png";
import spades_6 from "src/assets/images/cards/spades_06.png";
import spades_7 from "src/assets/images/cards/spades_07.png";
import spades_8 from "src/assets/images/cards/spades_08.png";
import spades_9 from "src/assets/images/cards/spades_09.png";
import spades_10 from "src/assets/images/cards/spades_10.png";
import spades_jack from "src/assets/images/cards/spades_jack.png";
import spades_queen from "src/assets/images/cards/spades_queen.png";
import spades_king from "src/assets/images/cards/spades_king.png";

import clubs_ace from "src/assets/images/cards/clubs_ace.png";
import clubs_2 from "src/assets/images/cards/clubs_02.png";
import clubs_3 from "src/assets/images/cards/clubs_03.png";
import clubs_4 from "src/assets/images/cards/clubs_04.png";
import clubs_5 from "src/assets/images/cards/clubs_05.png";
import clubs_6 from "src/assets/images/cards/clubs_06.png";
import clubs_7 from "src/assets/images/cards/clubs_07.png";
import clubs_8 from "src/assets/images/cards/clubs_08.png";
import clubs_9 from "src/assets/images/cards/clubs_09.png";
import clubs_10 from "src/assets/images/cards/clubs_10.png";
import clubs_jack from "src/assets/images/cards/clubs_jack.png";
import clubs_queen from "src/assets/images/cards/clubs_queen.png";
import clubs_king from "src/assets/images/cards/clubs_king.png";

export const cardImages: { [key: string]: string } = {
  // Hearts
  hearts_ace: hearts_ace,
  hearts_02: hearts_2,
  hearts_03: hearts_3,
  hearts_04: hearts_4,
  hearts_05: hearts_5,
  hearts_06: hearts_6,
  hearts_07: hearts_7,
  hearts_08: hearts_8,
  hearts_09: hearts_9,
  hearts_10: hearts_10,
  hearts_jack: hearts_jack,
  hearts_queen: hearts_queen,
  hearts_king: hearts_king,

  // Diamonds
  diamonds_ace: diamonds_ace,
  diamonds_02: diamonds_2,
  diamonds_03: diamonds_3,
  diamonds_04: diamonds_4,
  diamonds_05: diamonds_5,
  diamonds_06: diamonds_6,
  diamonds_07: diamonds_7,
  diamonds_08: diamonds_8,
  diamonds_09: diamonds_9,
  diamonds_10: diamonds_10,
  diamonds_jack: diamonds_jack,
  diamonds_queen: diamonds_queen,
  diamonds_king: diamonds_king,

  // Spades
  spades_ace: spades_ace,
  spades_02: spades_2,
  spades_03: spades_3,
  spades_04: spades_4,
  spades_05: spades_5,
  spades_06: spades_6,
  spades_07: spades_7,
  spades_08: spades_8,
  spades_09: spades_9,
  spades_10: spades_10,
  spades_jack: spades_jack,
  spades_queen: spades_queen,
  spades_king: spades_king,

  // Clubs
  clubs_ace: clubs_ace,
  clubs_02: clubs_2,
  clubs_03: clubs_3,
  clubs_04: clubs_4,
  clubs_05: clubs_5,
  clubs_06: clubs_6,
  clubs_07: clubs_7,
  clubs_08: clubs_8,
  clubs_09: clubs_9,
  clubs_10: clubs_10,
  clubs_jack: clubs_jack,
  clubs_queen: clubs_queen,
  clubs_king: clubs_king
};

export const getFullRankName = (rank: string): string => {
  const rankMap: { [key: string]: string } = {
    q: "queen",
    k: "king",
    j: "jack",
    a: "ace",
    "2": "02",
    "3": "03",
    "4": "04",
    "5": "05",
    "6": "06",
    "7": "07",
    "8": "08",
    "9": "09",
    "10": "10"
  };

  return rankMap[rank.toLowerCase()] || rank;
};
