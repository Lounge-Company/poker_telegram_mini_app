import image from "src/assets/images/table-vertical.png";
import Seat from "./Seat";

import PokerActions from "./PokerActions";
import usePokerRoom from "src/hooks/usePokerRoom";
import { useState } from "react";
import JoinModal from "./JoinModal";
import { getPlayerInfo } from "src/services/funcService";
import GameInfo from "./GameInfo";
import { useRotatedPositions } from "src/hooks/useRotatedPositions";
import GameBacklog from "./GameBacklog";

const PokerRoom = () => {
  const { gameState, roomRef } = usePokerRoom();
  const currentPlayer = gameState.players.get(gameState.currentTurn);
  const sessionId = roomRef.current?.sessionId;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [seatNumber, setSeatNumber] = useState<number | undefined>(undefined);

  const rotatedPositions = useRotatedPositions(gameState, sessionId);

  const handleSeatClick = (seatNumber: number) => {
    setSeatNumber(seatNumber);
    setModalIsOpen((prev) => !prev);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  if (!gameState || !sessionId) return <div>Loading...</div>;

  return (
    <div className={"flex flex-col h-full w-full"}>
      <div className="relative flex-grow flex items-center justify-center w-full min-h-0">
        <div className="relative max-w-full max-h-full h-full flex items-center justify-center">
          <img
            src={image}
            className="w-auto h-auto max-w-full max-h-full object-contain"
          />
        </div>
        {/* <GameInfo gameState={gameState} currentPlayer={currentPlayer} /> */}
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
      </div>
      <div className="h-20 w-full flex items-center justify-center">
        <PokerActions room={roomRef.current} />
      </div>
      <GameBacklog gamestate={gameState} /> //Данные о GAMESTATE
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
