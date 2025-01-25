import React from "react";

interface SeatProps {
  x: number;
  y: number;
  dx?: number;
  dy?: number;
  num: number;
  onClick: (seatNumber: number) => void;
  isOccupied?: boolean;
}

const Seat = ({
  x,
  y,
  num,
  dx = 0,
  dy = 0,
  onClick,
  isOccupied
}: SeatProps) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: "150px",
        height: "100px",
        border: `1px dashed ${isOccupied ? "#000" : "#ccc"}`,
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
    </div>
  );
};

export default Seat;
