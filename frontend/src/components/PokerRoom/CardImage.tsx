import { getCardImage } from "src/services/CardImagesService";
import { CardType } from "src/types/game";

interface CardImageProps extends CardType {
  size?: string; // Добавляем возможность изменять размер через пропс
  className?: string;
}

const CardImage = ({
  suit,
  rank,
  size = "w-16",
  className = "",
}: CardImageProps) => {
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
      className={`${size} aspect-[2/3] object-contain ${className}`}
    />
  );
};

export default CardImage;
