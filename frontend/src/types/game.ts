export type ColyseusState = {
  seats: SeatType[];
  players: Map<string, PlayerState>;
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
