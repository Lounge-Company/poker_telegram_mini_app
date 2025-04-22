import { useState } from "react";
import { ColyseusState } from "src/types/game";

interface GameBacklogProps {
  gamestate: ColyseusState;
}

const GameBacklog = ({ gamestate }: GameBacklogProps) => {
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(gamestate, null, 2));
    alert("Game state copied to clipboard!");
  };

  if (!visible)
    return (
      <button
        onClick={() => setVisible(true)}
        className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded z-50"
      >
        Show Debug Panel
      </button>
    );

  return (
    <div className="absolute top-0 right-0 max-h-screen overflow-auto bg-black bg-opacity-80 text-white text-sm p-4 z-50 w-[400px] font-mono">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Game Debug Panel</h2>
        <div>
          <button
            onClick={copyToClipboard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-xs rounded mr-2"
          >
            Copy JSON
          </button>
          <button
            onClick={() => setVisible(false)}
            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs rounded"
          >
            Close
          </button>
        </div>
      </div>

      {/* Простые поля */}
      <div>
        <b>Current Turn:</b> {gamestate.currentTurn}
      </div>
      <div>
        <b>Game Started:</b> {String(gamestate.gameStarted)}
      </div>
      <div>
        <b>Pot:</b> {gamestate.pot}
      </div>
      <div>
        <b>Current Bet:</b> {gamestate.currentBet}
      </div>
      <div>
        <b>TURN_TIME:</b> {gamestate.TURN_TIME}
      </div>
      <div>
        <b>DEALER: </b> {gamestate.dealerId}
      </div>

      <hr className="my-2 border-white/20" />

      {/* Игроки */}
      <div>
        <button onClick={() => toggleExpand("players")}>▶ Players</button>
        {expanded.players && (
          <div className="ml-4 mt-1">
            {[...gamestate.players.entries()].map(([id, player]) => (
              <div key={id} className="mb-2">
                <div>
                  <b>ID:</b> {player.id}
                </div>
                <div>
                  <b>Name:</b> {player.name}
                </div>
                <div>
                  <b>Chips:</b> {player.chips}
                </div>
                <div>
                  <b>Bet:</b> {player.currentBet}
                </div>
                <div>
                  <b>Seat:</b> {player.seatIndex}
                </div>
                <div>
                  <b>Folded:</b> {String(player.hasFolded)}
                </div>
                <div>
                  <b>All-In:</b> {String(player.isAllIn)}
                </div>
                <div>
                  <b>Ready:</b> {String(player.ready)}
                </div>
                <div>
                  <b>Acted:</b> {String(player.acted)}
                </div>
                <hr className="my-1 border-white/10" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Карты игрока */}
      <div>
        <button onClick={() => toggleExpand("playerCards")}>
          ▶ Your Cards
        </button>
        {expanded.playerCards && (
          <div className="ml-4 mt-1">
            {gamestate.playerCards.map((card, i) => (
              <div key={i}>
                {card.rank} of {card.suit}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Общие карты */}
      <div>
        <button onClick={() => toggleExpand("communityCards")}>
          ▶ Community Cards
        </button>
        {expanded.communityCards && (
          <div className="ml-4 mt-1">
            {gamestate.communityCards.map((card, i) => (
              <div key={i}>
                {card.rank} of {card.suit}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Места за столом */}
      <div>
        <button onClick={() => toggleExpand("seats")}>▶ Seats</button>
        {expanded.seats && (
          <div className="ml-4 mt-1">
            {gamestate.seats.map((seat, i) => (
              <div key={i}>
                <b>Index:</b> {seat.index}, <b>Player ID:</b> {seat.playerId}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBacklog;
