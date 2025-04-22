import { getCardImage } from "src/services/CardImagesService";
import { CardType } from "src/types/game";

const CardImage = ({ suit, rank }: CardType) => {
  const imagePath = getCardImage(suit, rank);

  if (!imagePath) {
    return (
      <div>
        Loading... {suit} {rank} {imagePath}
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
