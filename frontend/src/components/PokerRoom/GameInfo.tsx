import { ColyseusState, PlayerState } from "src/types/game";

interface GameInfoProps {
  gameState: ColyseusState;
  currentPlayer: PlayerState | undefined;
}

const GameInfo = ({ gameState, currentPlayer }: GameInfoProps) => {
  return (
    gameState.gameStarted && (
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="bg-black bg-opacity-50 text-white p-4 rounded-lg">
          <p>Game Started</p>
          <p>Bank: {gameState.pot}</p>
          <p>Turn Time: {gameState.TURN_TIME}</p>
          <p>Current turn: {currentPlayer?.name}</p>
          <p>
            Cards:
            {gameState.communityCards.map((card) => (
              <span key={`${card.suit}${card.rank}`}>
                {card.rank}
                {card.suit}
              </span>
            ))}
          </p>
        </div>
      </div>
    )
  );
};

export default GameInfo;
