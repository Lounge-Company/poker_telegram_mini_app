import { GameState } from '../rooms/schema/GameState'

export class TurnValidator {
  static validate(state: GameState) {
    return (handler: (client: any, ...args: any[]) => void) => {
      return (client: any, ...args: any[]) => {
        if (client.sessionId !== state.currentTurn) {
          return
        }
        handler(client, ...args)
      }
    }
  }
}
