import { getImageURL } from "./imageUrl";

const getFormatedSuit = (suit: string): string => {
  switch (suit.toLowerCase()) {
    case "h":
      return "hearts";
    case "d":
      return "diamonds";
    case "s":
      return "spades";
    case "c":
      return "clubs";
  }
  return "";
};
const getFormatedRank = (rank: string): string => {
  switch (rank.toLowerCase()) {
    case "a":
      return "ace";
    case "j":
      return "jack";
    case "q":
      return "queen";
    case "k":
      return "king";
    case "10":
      return "10";
    case "9":
      return "09";
    case "8":
      return "08";
    case "7":
      return "07";
    case "6":
      return "06";
    case "5":
      return "05";
    case "4":
      return "04";
    case "3":
      return "03";
    case "2":
      return "02";
  }
  return "";
};

export function getCardImage(suit: string, rank: string): string {
  const fsuit = getFormatedSuit(suit);
  const frank = getFormatedRank(rank);
  return getImageURL(fsuit, frank);
}
