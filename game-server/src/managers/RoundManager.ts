import { IGameStateRepository } from '../interfaces/repositories/IGameStateRepository'
import { RoundType } from '../types/GameTypes'
import { hasOnlyOneActivePlayer } from '../utils/game/hasOnlyOneActivePlayer'
import { isAllPlayersAllIn } from '../utils/game/isAllPlayersAllIn'

export class RoundManager {
  constructor(
    private gameStateRepository: IGameStateRepository,
    private getPlayersCount: () => number
  ) {}

  getCurrentRound(): RoundType {
    return this.gameStateRepository.getGamePhase()
  }

  shouldContinueRounds(): boolean {
    const activePlayers = this.gameStateRepository.getActivePlayers()
    const allInPlayersCount = this.gameStateRepository.getAllInPlayersCount()
    const gamePhase = this.gameStateRepository.getGamePhase()
    if (hasOnlyOneActivePlayer(activePlayers)) {
      return false
    }

    if (isAllPlayersAllIn(allInPlayersCount, activePlayers)) {
      return false
    }
    if (gamePhase == RoundType.SHOWDOWN) {
      return false
    }
    return true
  }

  resetRound(): void {
    this.gameStateRepository.setGamePhase(RoundType.PREFLOP)
    this.gameStateRepository.resetBets()
    this.gameStateRepository.setActivePlayers(this.getPlayersCount())
  }

  switchRound(nextRound?: RoundType): void {
    const phaseOrder = [
      RoundType.PREFLOP,
      RoundType.FLOP,
      RoundType.TURN,
      RoundType.RIVER,
      RoundType.SHOWDOWN,
    ]

    const currentPhase = this.gameStateRepository.getGamePhase()
    const nextPhase =
      nextRound ??
      phaseOrder[phaseOrder.indexOf(currentPhase) + 1] ??
      RoundType.PREFLOP
    console.log('next phase', nextPhase)
    this.gameStateRepository.setGamePhase(nextPhase)
  }
}
