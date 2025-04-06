import { IGameStateRepository } from '../interfaces/repositories/IGameStateRepository'
import { RoundType } from '../types/GameTypes'

export class RoundManager {
  constructor(
    private gameStateRepository: IGameStateRepository,
    private getStartingPlayer: () => string,
    private getPlayersCount: () => number
  ) {}

  getCurrentRound(): RoundType {
    return this.gameStateRepository.getGamePhase()
  }

  shouldContinueRounds(): boolean {
    if (
      this.gameStateRepository.getActivePlayers() >=
      this.gameStateRepository.getMinPlayers()
    ) {
      return true
    }
    if (
      this.gameStateRepository.getAllInPlayersCount() <
      this.gameStateRepository.getActivePlayers()
    ) {
    }
    if (this.gameStateRepository.getGamePhase() !== RoundType.SHOWDOWN) {
      return true
    }
    return false
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

    this.gameStateRepository.setGamePhase(nextPhase)
  }
}
