export function shouldContinueGame(
  gameStarted: boolean,
  playersCount: number,
  MIN_PLAYERS: number
): boolean {
  return gameStarted && playersCount >= MIN_PLAYERS
}
