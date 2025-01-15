import { TurnManager } from './TurnManager'
import { GameState } from '../rooms/schema/GameState'
import { actionService } from '../services/actionService'
import { DeckManager } from './DeckManager'

export class GameManager {
  state: GameState
  turnManager: TurnManager
  actionService: actionService
  deckManager: DeckManager

  constructor(state: GameState) {
    this.state = state
    this.turnManager = new TurnManager(state)
    this.deckManager = new DeckManager()
  }
  hasActivePlayers(): boolean {
    for (const player of this.state.players.values()) {
      if (!player.hasFolded && !player.isAllIn) {
        return true
      }
    }
    return false
  }
}
