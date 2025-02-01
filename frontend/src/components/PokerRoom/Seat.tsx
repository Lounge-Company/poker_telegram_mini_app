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
  return (
    <div
      className={`cursor-pointer absolute flex justify-center items-center rounded-lg text-center p-2 border ${
        isOccupied
          ? "border-dashed border-green-500"
          : "border-dashed border-gray-300"
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: "150px",
        height: "100px",
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
};

export default Seat;
