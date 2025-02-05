import image from "src/assets/images/table-vertical.png";
import Seat from "./Seat";

import PokerActions from "./PokerActions";
import usePokerRoom from "src/hooks/usePokerRoom";
import { useEffect, useState } from "react";
import { SeatType } from "src/types/game";

const positions = [
  { x: 50, y: 0, dx: -50, dy: 0, idx: 0 },
  { x: 0, y: 10, dx: 0, dy: 0, idx: 1 },
  { x: 0, y: 30, dx: 0, dy: 0, idx: 2 },
  { x: 0, y: 70, dx: 0, dy: -100, idx: 3 },
  { x: 0, y: 90, dx: 0, dy: -100, idx: 4 },
  { x: 50, y: 100, dx: -50, dy: -100, idx: 5 },
  { x: 100, y: 90, dx: -100, dy: -100, idx: 6 },
  { x: 100, y: 70, dx: -100, dy: -100, idx: 7 },
  { x: 100, y: 30, dx: -100, dy: 0, idx: 8 },
  { x: 100, y: 10, dx: -100, dy: 0, idx: 9 }
];

const rotateArray = (arr: typeof positions, steps: number) => {
  return [...arr.slice(steps), ...arr.slice(0, steps)];
};

const PokerRoom = () => {
  const { gameState, roomRef } = usePokerRoom();
  const [rotatedPositions, setRotatedPositions] = useState(positions);

  useEffect(() => {
    const playerSeatIndex = gameState.seats.findIndex(
      (seat: SeatType) => seat.playerId === roomRef.current?.sessionId
    );

    if (playerSeatIndex !== -1) {
      switch (playerSeatIndex) {
        case 0:
          setRotatedPositions(rotateArray(positions, 5));
          break;
        case 1:
          setRotatedPositions(rotateArray(positions, 4));
          break;
        case 2:
          setRotatedPositions(rotateArray(positions, 3));
          break;
        case 3:
          setRotatedPositions(rotateArray(positions, 2));
          break;
        case 4:
          setRotatedPositions(rotateArray(positions, 1));
          break;
        case 5:
          setRotatedPositions(rotateArray(positions, 0));
          break;
        case 6:
          setRotatedPositions(rotateArray(positions, -1));
          break;
        case 7:
          setRotatedPositions(rotateArray(positions, -2));
          break;
        case 8:
          setRotatedPositions(rotateArray(positions, -3));
          break;
        case 9:
          setRotatedPositions(rotateArray(positions, -4));
          break;
      }
    }
  }, [gameState.seats]);

  const handleSeatClick = (seatNumber: number) => {
    roomRef.current?.send("leaveGame");
    roomRef.current?.send("joinGame", seatNumber);
  };

  return (
    <div className={"flex flex-col h-full w-full"}>
      <div className="relative flex-grow flex items-center justify-center w-full min-h-0">
        <div className="relative max-w-full max-h-full h-full flex items-center justify-center">
          <img
            src={image}
            className="w-auto h-auto max-w-full max-h-full object-contain"
          />
        </div>
        {rotatedPositions.map((position, idx) => (
          <Seat
            key={idx}
            x={position.x}
            y={position.y}
            dx={position.dx}
            dy={position.dy}
            num={idx}
            onClick={handleSeatClick}
            isOccupied={
              gameState.seats[idx] !== undefined &&
              gameState.seats[idx].playerId !== ""
            }
            player={
              gameState.players.get(gameState.seats[idx]?.playerId)?.name || ""
            }
          />
        ))}
      </div>
      <div className="h-20 w-full flex items-center justify-center">
        <PokerActions room={roomRef.current} />
      </div>
    </div>
  );
};

export default PokerRoom;
