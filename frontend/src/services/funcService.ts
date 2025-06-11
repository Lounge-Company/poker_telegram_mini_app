import { ColyseusState, SeatType } from "src/types/game";

export const positions = [
  { x: 50, y: 0, dx: -50, dy: 0, idx: 0 }, // Top center
  { x: 100, y: 10, dx: -100, dy: 0, idx: 9 }, // Top-right
  { x: 100, y: 30, dx: -100, dy: 0, idx: 8 }, // Mid-top-right
  { x: 100, y: 70, dx: -100, dy: -100, idx: 7 }, // Mid-bottom-right
  { x: 100, y: 90, dx: -100, dy: -100, idx: 6 }, // Bottom-right
  { x: 50, y: 100, dx: -50, dy: -100, idx: 5 }, // Bottom center
  { x: 0, y: 90, dx: 0, dy: -100, idx: 4 }, // Bottom-left
  { x: 0, y: 70, dx: 0, dy: -100, idx: 3 }, // Mid-bottom-left
  { x: 0, y: 30, dx: 0, dy: 0, idx: 2 }, // Mid-top-left
  { x: 0, y: 10, dx: 0, dy: 0, idx: 1 }, // Top-left
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
      playerCards: [],
      isDealer: false,
    };

  const player = gameState.players.get(seat.playerId);
  const isTurn = gameState.players.get(gameState.currentTurn) === player;
  const playerCards = sessionId === seat.playerId ? gameState.playerCards : [];
  const isOccupied = seat !== undefined && seat.playerId !== "";
  const isDealer = gameState.dealerId === seat.playerId;
  return { isOccupied, player, isTurn, playerCards, isDealer };
};
