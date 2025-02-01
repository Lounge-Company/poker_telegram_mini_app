import image from "src/assets/images/table-vertical.png";
import Seat from "./Seat";

import PokerActions from "./PokerActions";
import usePokerRoom from "src/hooks/usePokerRoom";

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

const PokerRoom = () => {
  const { gameState, roomRef } = usePokerRoom();

  const handleSeatClick = (seatNumber: number) => {
    roomRef.current?.send("leaveGame");
    roomRef.current?.send("joinGame", seatNumber);
  };

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
    >
      {positions.map((position, index) => (
        <Seat
          key={index}
          x={position.x}
          y={position.y}
          dx={position.dx}
          dy={position.dy}
          num={index}
          onClick={handleSeatClick}
          isOccupied={
            gameState.seats[index] !== undefined &&
            gameState.seats[index].playerId !== ""
          }
          player={
            gameState.players.get(gameState.seats[index]?.playerId)?.name || ""
          }
        />
      ))}
      <img
        src={image}
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "cover" }}
      />
      <PokerActions room={roomRef.current} />
    </div>
  );
};

export default PokerRoom;
