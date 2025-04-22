import { GameState } from '../rooms/schema/GameState'
import { PlayerState } from '../rooms/schema/PlayerState'
import { IBetRepository } from '../interfaces/repositories/IBetRepository'
import { PlayerManager } from './PlayerManager'
import { MapSchema } from '@colyseus/schema'
export class BetManager {
  private state: GameState

  constructor(
    private playerManager: PlayerManager,
    private betRepository: IBetRepository,
    private getPlayers: () => MapSchema<PlayerState>,
    private getBlinds: () => { SMALL: number; BIG: number }
  ) {}

  initializeBlinds() {
    const BLINDS = this.getBlinds()
    let blindsSum = 0
    const blindPositions = this.playerManager.getBlindsPositions()

    const smallBlindPlayer = this.getPlayers().get(blindPositions.smallBlind)
    const bigBlindPlayer = this.getPlayers().get(blindPositions.bigBlind)

    if (smallBlindPlayer) {
      smallBlindPlayer.chips -= BLINDS.SMALL
      smallBlindPlayer.currentBet = BLINDS.SMALL
      blindsSum += BLINDS.SMALL
    }

    if (bigBlindPlayer) {
      bigBlindPlayer.chips -= BLINDS.BIG
      bigBlindPlayer.currentBet = BLINDS.BIG
      blindsSum += BLINDS.BIG
    }
    this.betRepository.setPot(blindsSum)
    this.betRepository.setCurrentBet(BLINDS.BIG)
  }

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
