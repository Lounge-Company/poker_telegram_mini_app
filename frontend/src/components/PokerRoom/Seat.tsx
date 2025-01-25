import React from "react";

interface SeatProps {
  x: number;
  y: number;
  dx?: number;
  dy?: number;
  num: number;
}

const Seat = ({ x, y, num, dx = 0, dy = 0 }: SeatProps) => {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: "150px",
        height: "100px",
        border: "1px dashed #ccc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "16px",
        transform: `translate(${dx}%, ${dy}%)`
      }}
    >
      Seat {num}
    </div>
  );
};

export default Seat;
