import { GameState } from '../../rooms/schema/GameState'

export const TurnValidator = (state: GameState, playerId: string) => {
  return state.currentTurn === playerId
}
