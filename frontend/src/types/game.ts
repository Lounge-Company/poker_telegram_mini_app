export type ColyseusState = {
  players: Map<string, PlayerState>;
  seats: SeatType[];
  communityCards: CardType[];
  currentTurn: string;
  gameStarted: boolean;
  pot: number;
  currentBet: number;
  TURN_TIME: number;
  // мои поля
  playerCards: CardType[];
};

export type CardType = {
  suit: string;
  rank: string;
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
