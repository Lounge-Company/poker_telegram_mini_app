import { useState } from "react";
import { Room } from "colyseus.js";
import Button from "./Button";

type PokerActionsProps = {
  room: Room | null;
};

const ACTIONS = {
  raise: "raise",
  call: "call",
  check: "check",
  fold: "fold",
  ready: "ready",
  unready: "unready"
} as const;

const PokerActions = ({ room }: PokerActionsProps) => {
  const [isReady, setIsReady] = useState(false);

  const handleAction = (action: keyof typeof ACTIONS) => {
    if (room) {
      room.send(ACTIONS[action]);
    }
  };

  const handleReadyToggle = () => {
    if (room) {
      const action = isReady ? ACTIONS.unready : ACTIONS.ready;
      room.send(action);
      setIsReady(!isReady);
    }
  };

  // Класс кнопки Ready
  const readyButtonClass = isReady
    ? "bg-green-500 hover:bg-green-600"
    : "bg-gray-500 hover:bg-gray-600";

  return (
    <div className=" flex space-x-2">
      {Object.keys(ACTIONS).map((action) => {
        if (action !== "ready" && action !== "unready") {
          return (
            <Button
              key={action}
              onClick={() => handleAction(action as keyof typeof ACTIONS)}
              name={action.charAt(0).toUpperCase() + action.slice(1)}
            />
          );
        }
      })}
      <button
        className={`text-white px-4 py-2 rounded cursor-pointer ${readyButtonClass}`}
        onClick={handleReadyToggle}
      >
        {isReady ? "Ready" : "Not Ready"}
      </button>
    </div>
  );
};

export default PokerActions;
