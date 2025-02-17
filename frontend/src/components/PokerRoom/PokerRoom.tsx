import image from "src/assets/images/table-vertical.png";
import Seat from "./Seat";

import PokerActions from "./PokerActions";
import usePokerRoom from "src/hooks/usePokerRoom";
import { useEffect, useState } from "react";
import { SeatType } from "src/types/game";
import JoinModal from "./JoinModal";
import { positions, rotateArray } from "src/services/funcService";

const PokerRoom = () => {
  const { gameState, roomRef } = usePokerRoom();
  const [rotatedPositions, setRotatedPositions] = useState(positions);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [seatNumber, setSeatNumber] = useState<number | undefined>(undefined);

  useEffect(() => {
    const playerSeatIndex = gameState.seats.findIndex(
      (seat: SeatType) => seat.playerId === roomRef.current?.sessionId
    );
    if (playerSeatIndex !== -1)
      setRotatedPositions(rotateArray(positions, 5 - playerSeatIndex));
  }, [gameState.seats, roomRef]);

  const handleSeatClick = (seatNumber: number) => {
    setSeatNumber(seatNumber);
    setModalIsOpen(!modalIsOpen);
  };

  const closeModal = () => {
    setModalIsOpen(false);
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
            player={gameState.players.get(gameState.seats[idx]?.playerId)}
            turn={
              gameState.players.get(gameState.currentTurn) ===
              gameState.players.get(gameState.seats[idx]?.playerId)
            }
          />
        ))}
        {gameState.gameStarted && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="bg-black bg-opacity-50 text-white p-4 rounded-lg">
              <p>Game Started</p>
              <p>Bank: {gameState.pot}</p>
              <p>Turn Time: {gameState.TURN_TIME}</p>
              <p>
                Current turn:{" "}
                {gameState.players.get(gameState.currentTurn)?.name}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="h-20 w-full flex items-center justify-center">
        <PokerActions room={roomRef.current} />
      </div>
      <JoinModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        seatNumber={seatNumber}
        room={roomRef.current}
      />
    </div>
  );
};

export default PokerRoom;
