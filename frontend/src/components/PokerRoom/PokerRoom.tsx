import { useEffect, useRef, useState } from "react";
import image from "../../assets/images/table-vertical.png";
import Seat from "./Seat";

type Position = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

const PokerRoom = () => {
  const tableRef = useRef<HTMLImageElement>(null);
  const [seatPositions, setSeatPositions] = useState<Position[]>([]);

  useEffect(() => {
    console.log(tableRef);
    if (tableRef.current) {
      const tableRect = tableRef.current.getBoundingClientRect();
      const { width, height } = tableRect;
      console.log(width, height);
      const positions = [
        { x: 50, y: 0, dx: -50, dy: 0 },
        { x: 0, y: 10, dx: 0, dy: 0 },
        { x: 0, y: 30, dx: 0, dy: 0 },
        { x: 0, y: 70, dx: 0, dy: -100 },
        { x: 0, y: 90, dx: 0, dy: -100 },
        { x: 50, y: 100, dx: -50, dy: -100 },
        { x: 100, y: 90, dx: -100, dy: -100 },
        { x: 100, y: 70, dx: -100, dy: -100 },
        { x: 100, y: 30, dx: -100, dy: 0 },
        { x: 100, y: 10, dx: -100, dy: 0 }
      ];

      setSeatPositions(positions);
    }
  }, [tableRef]);

  useEffect(() => {
    console.log(seatPositions);
  }, [seatPositions]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}
      ref={tableRef}
    >
      {seatPositions.map((position, index) => (
        <Seat
          key={index}
          x={position.x}
          y={position.y}
          dx={position.dx}
          dy={position.dy}
          num={index}
        />
      ))}
      <img
        src={image}
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

export default PokerRoom;
