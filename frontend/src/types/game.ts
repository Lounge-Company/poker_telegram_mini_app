export type ColyseusState = {
  seats: SeatType[];
  players: Map<string, PlayerState>;
  currentTurn: string;
  gameStarted: boolean;
  pot: number;
  currentBet: number;
  TURN_TIME: number;
};

export type SeatType = {
  index: number;
  playerId: string;
};

export type PlayerState = {
  id: string;
  name: string;
  chips: number;
  currentBet: number;
  hasFolded: boolean;
  isAllIn: boolean;
  ready: boolean;
  acted: boolean;
  seatIndex: number;
};
