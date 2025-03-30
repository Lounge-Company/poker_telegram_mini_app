import { GameState } from '../rooms/schema/GameState'
import { PlayerState } from '../rooms/schema/PlayerState'
import { IBetRepository } from '../interfaces/repositories/IBetRepository'

export class BetManager {
  private state: GameState

  constructor(
    private betRepository: IBetRepository,
    private getPlayers: () => Map<string, PlayerState>
  ) {}

  initializeBlinds() {}

  public allBetsEqual(): boolean {
    let targetBet = this.betRepository.getCurrentBet()

    for (const player of this.getPlayers().values()) {
      if (player.hasFolded || player.isAllIn) continue

      if (player.currentBet !== targetBet) {
        return false
      }
    }
    return true
  }

  public updatePot(): void {
    let totalBets = 0
    for (const player of this.getPlayers().values()) {
      totalBets += player.currentBet
      player.currentBet = 0
    }

    const currentPot = this.betRepository.getPot()
    this.betRepository.setPot(currentPot + totalBets)
  }
}
