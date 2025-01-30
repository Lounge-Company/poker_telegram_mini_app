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
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: "150px",
        height: "100px",
        border: `1px dashed ${isOccupied ? "#0F0" : "#ccc"}`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "16px",
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
