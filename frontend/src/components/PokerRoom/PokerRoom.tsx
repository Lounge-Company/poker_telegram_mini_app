import image from "src/assets/images/table-vertical.png";
import Seat from "./Seat";

import PokerActions from "./PokerActions";
import usePokerRoom from "src/hooks/usePokerRoom";
import { useEffect, useState } from "react";
import { SeatType } from "src/types/game";
import JoinModal from "./JoinModal";
import {
  getPlayerInfo,
  positions,
  rotateArray
} from "src/services/funcService";
import GameInfo from "./GameInfo";

const PokerRoom = () => {
  const { gameState, roomRef } = usePokerRoom();
  const [rotatedPositions, setRotatedPositions] = useState(positions);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [seatNumber, setSeatNumber] = useState<number | undefined>(undefined);

  const currentPlayer = gameState.players.get(gameState.currentTurn);
  const sessionId = roomRef.current?.sessionId;

  useEffect(() => {
    const playerSeatIndex = gameState.seats.findIndex(
      (seat: SeatType) => seat.playerId === roomRef.current?.sessionId
    );
    if (playerSeatIndex !== -1)
      setRotatedPositions(rotateArray(positions, 5 - playerSeatIndex));
  }, [gameState.seats, roomRef]);

  const handleSeatClick = (seatNumber: number) => {
    setSeatNumber(seatNumber);
    setModalIsOpen((prev) => !prev);
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
        {rotatedPositions.map((position, idx) => {
          const { isOccupied, player, isTurn, playerCards } = getPlayerInfo(
            gameState.seats[idx],
            gameState,
            sessionId
          );
          return (
            <Seat
              key={idx}
              x={position.x}
              y={position.y}
              dx={position.dx}
              dy={position.dy}
              num={idx}
              onClick={handleSeatClick}
              isOccupied={isOccupied}
              player={player}
              turn={isTurn}
              playerCards={playerCards}
            />
          );
        })}
        <GameInfo gameState={gameState} currentPlayer={currentPlayer} />
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
