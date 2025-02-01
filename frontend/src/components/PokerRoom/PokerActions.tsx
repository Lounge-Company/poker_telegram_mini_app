import { useState } from "react";
import { Room } from "colyseus.js";
import Button from "./Button";

type PokerActionsProps = {
  room: Room | null;
};

const PokerActions = ({ room }: PokerActionsProps) => {
  const [isReady, setIsReady] = useState(false);

  const handleRaise = () => {
    if (room) {
      room.send("raise");
    }
  };

  const handleCall = () => {
    if (room) {
      console.log(room);
      room.send("call");
    }
  };

  const handleCheck = () => {
    if (room) {
      room.send("check");
    }
  };

  const handleFold = () => {
    if (room) {
      room.send("fold");
    }
  };

  const handleReadyToggle = () => {
    if (room) {
      if (isReady) {
        room.send("unready"); // отправляем состояние на сервер
      } else {
        room.send("ready");
      }
      setIsReady(!isReady); // обновляем локальное состояние
    }
  };

  return (
    <div className="absolute center left-1/2 transform -translate-x-1/2 flex space-x-2">
      <Button onClick={handleRaise} name="Raise" />
      <Button onClick={handleCall} name="Call" />
      <Button onClick={handleCheck} name="Check" />
      <Button onClick={handleFold} name="Fold" />
      <button
        className={`bg-${
          isReady ? "green" : "gray"
        }-500 text-white px-4 py-2 rounded hover:bg-${
          isReady ? "green" : "gray"
        }-600 cursor-pointer`}
        onClick={handleReadyToggle}
      >
        {isReady ? "Ready" : "Not Ready"}
      </button>
    </div>
  );
};

export default PokerActions;
