import { cardImages, getFullRankName } from "src/services/CardImagesService";
import { CardType } from "src/types/game";

const CardImage = ({ suit, rank }: CardType) => {
  const fullRank = getFullRankName(rank);
  const imageKey = `${suit}_${fullRank.toLowerCase()}`;

  const imagePath = cardImages[imageKey];

  if (!imagePath) {
    return (
      <div>
        Loading... {suit} {rank} {fullRank}
      </div>
    );
  }

  return (
    <img
      src={imagePath}
      alt={`${rank} of ${suit}`}
      className="w-16 h-24 object-contain"
    />
  );
};

export default CardImage;
