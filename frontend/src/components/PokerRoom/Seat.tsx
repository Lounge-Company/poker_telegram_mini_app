import { CardType, PlayerState } from "src/types/game";
import CardImage from "./CardImage";

interface SeatProps {
  x: number;
  y: number;
  dx?: number;
  dy?: number;
  num: number;
  onClick: (seatNumber: number) => void;
  isOccupied?: boolean;
  player?: PlayerState;
  isTurn?: boolean;
  playerCards?: CardType[];
  isDealer?: boolean;
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
  isTurn,
  playerCards,
  isDealer = false,
}: SeatProps) => {
  if (!isOccupied) {
    return (
      <div
        className={`cursor-pointer absolute w-30 h-20 flex justify-center items-center rounded-lg text-center p-2 border border-dashed border-gray-300`}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: `translate(${dx}%, ${dy}%)`,
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
          transform: `translate(${dx}%, ${dy}%)`,
        }}
      >
        {playerCards && (
          <div className="absolute bottom-4 align-middle flex ">
            {/* {playerCards[0].} */}
            {playerCards.map((card, index) => {
              const rotation = index === 0 ? "-rotate-10" : "rotate-10"; // или rotate-45 для сильнее
              const overlap = index === 0 ? "-mr-2" : "-ml-2";
              return (
                <CardImage
                  key={`${card.suit}${card.rank}`}
                  suit={card.suit}
                  rank={card.rank}
                  size="w-14"
                  className={`${rotation} ${overlap} shadow-[0_10px_20px_rgba(0,0,0,0.5)]`}
                />
              );
            })}
          </div>
        )}
        <div
          className={`w-full h-12 bg-gradient-to-r  ${
            isTurn ? "from-red-700 to-red-900" : "from-gray-700 to-gray-900"
          }  rounded-lg flex justify-center items-center text-white font-semibold text-sm shadow-lg relative`}
        >
          {player?.name}
          <div className="absolute top-0 right-2">Chps: {player?.chips}</div>
          <div className="absolute top-0 left-2">Bet: {player?.currentBet}</div>

          {/* <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border border-gray-600">
            D
          </div> */}
          {isDealer && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border border-gray-600">
              D
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default Seat;
