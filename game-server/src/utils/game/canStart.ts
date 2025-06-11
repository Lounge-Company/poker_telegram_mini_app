import { GameState } from '../../rooms/schema/GameState'

export function canStartGame(state: GameState): boolean {
  console.log('canStartGame')
  console.log(
    'readyPlayers:',
    state.readyPlayers,
    'players size:',
    state.players.size,
    'minPlayers:',
    state.MIN_PLAYERS
  )
  return (
    state.readyPlayers === state.players.size &&
    state.players.size >= state.MIN_PLAYERS
  )
}
