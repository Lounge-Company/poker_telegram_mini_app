import { PlayerState } from '../rooms/schema/PlayerState'
import { ClientService } from '../services/clientService'
import { GameState } from '../rooms/schema/GameState'
import { PlayerManager } from '../managers/PlayerManager'

export class PlayerActionService {
  constructor(
    private clientService: ClientService,
    private playerManager: PlayerManager,
    private getCurrentBet: () => number
  ) {}

  public async waitForPlayerAction(
    state: GameState,
    player: PlayerState
  ): Promise<void> {
    return new Promise((resolve) => {
      this.clientService.broadcastTurn(player.id)
      const currentBet = this.getCurrentBet()
      const timer = setTimeout(() => {
        if (!player.acted && player.currentBet !== currentBet) {
          // <--- Im not sure about this

          this.playerManager.markPlayerAsFolded(player.id)
          resolve()
        } else if (!player.acted && player.currentBet === currentBet) {
          this.playerManager.markPlayerAsChecked(player.id)
          resolve()
        }
      }, state.TURN_TIME)

      const checkInterval = setInterval(() => {
        if (player.acted) {
          clearTimeout(timer)
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)
    })
  }
}
