import { CardType, PlayerState } from "src/types/game";

interface SeatProps {
  x: number;
  y: number;
  dx?: number;
  dy?: number;
  num: number;
  onClick: (seatNumber: number) => void;
  isOccupied?: boolean;
  player?: PlayerState;
  turn?: boolean;
  playerCards?: CardType[];
}

const Seat = ({
  x,
  y,
  num,
  dx = 0,
  dy = 0,
  onClick,
  isOccupied,
  player,
  turn,
  playerCards
}: SeatProps) => {
  if (!isOccupied) {
    return (
      <div
        className={`cursor-pointer absolute w-30 h-20 flex justify-center items-center rounded-lg text-center p-2 border border-dashed border-gray-300`}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: `translate(${dx}%, ${dy}%)`
        }}
        onClick={() => {
          onClick(num);
        }}
      >
        Seat {num}
        <br></br>
        {player?.name}
      </div>
    );
  } else {
    return (
      <div
        className={
          "cursor-pointer absolute w-30 h-20 flex justify-center items-end"
        }
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: `translate(${dx}%, ${dy}%)`
        }}
      >
        <div
          className={`w-full h-12 bg-gradient-to-r  ${
            turn ? "from-red-700 to-red-900" : "from-gray-700 to-gray-900"
          }  rounded-lg flex justify-center items-center text-white font-semibold text-sm shadow-lg relative`}
        >
          {player?.name}
          <div className="absolute top-0 right-2">{player?.chips}</div>
          {playerCards && (
            <div className="absolute bottom-15 right-0 flex space-x-1">
              {playerCards.map((card) => (
                <span
                  key={`${card.suit}${card.rank}`}
                  className="px-1 py-0.5 bg-white text-black rounded"
                >
                  {card.rank} {card.suit}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default Seat;
