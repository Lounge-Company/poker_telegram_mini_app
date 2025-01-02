export const GAME_CONSTANTS = {
  TURN_TIME: 30000,
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 9,
  INITIAL_CHIPS: 1000,
  PHASES: ['preFlop', 'flop', 'turn', 'river'] as const
}
