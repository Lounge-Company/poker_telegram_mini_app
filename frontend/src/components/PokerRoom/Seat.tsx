interface SeatProps {
  x: number;
  y: number;
  dx?: number;
  dy?: number;
  num: number;
  onClick: (seatNumber: number) => void;
  isOccupied?: boolean;
  player?: string;
}

const Seat = ({
  x,
  y,
  num,
  dx = 0,
  dy = 0,
  onClick,
  isOccupied,
  player
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
        {player}
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
          className={
            "w-full h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg flex justify-center items-center text-white font-semibold text-sm shadow-lg"
          }
        >
          {player}
        </div>
      </div>
    );
  }
};

export default Seat;
