import { useEffect, useState } from "react";
import { positions, rotateArray } from "src/services/funcService";
import { ColyseusState, SeatType } from "src/types/game";

export const useRotatedPositions = (
  gameState: ColyseusState,
  sessionId: string | undefined
) => {
  const [rotatedPositions, setRotatedPositions] = useState(positions);

  useEffect(() => {
    const playerSeatIndex = gameState.seats.findIndex(
      (seat: SeatType) => seat.playerId === sessionId
    );
    if (playerSeatIndex !== -1) {
      setRotatedPositions(rotateArray(positions, 5 - playerSeatIndex));
    }
  }, [gameState.seats, sessionId]);

  return rotatedPositions;
};
