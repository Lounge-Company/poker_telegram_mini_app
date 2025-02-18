import { ColyseusState, SeatType } from "src/types/game";

export const positions = [
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

export const rotateArray = (arr: typeof positions, steps: number) => {
  return [...arr.slice(steps), ...arr.slice(0, steps)];
};

export const getPlayerInfo = (
  seat: SeatType | undefined,
  gameState: ColyseusState,
  sessionId: string | undefined
) => {
  if (!seat)
    return {
      isOccupied: false,
      player: undefined,
      isTurn: false,
      playerCards: []
    };

  const player = gameState.players.get(seat.playerId);
  const isTurn = gameState.players.get(gameState.currentTurn) === player;
  const playerCards = sessionId === seat.playerId ? gameState.playerCards : [];
  const isOccupied = seat !== undefined && seat.playerId !== "";
  return { isOccupied, player, isTurn, playerCards };
};
