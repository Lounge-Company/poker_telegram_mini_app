import { TurnManager } from './TurnManager'

export class GameManager {
  constructor(
    private getPlayers: () => Map<string, any>,
    private setActivePlayers: (count: number) => void,
    private setGameStarted: (status: boolean) => void,
    private setCurrentTurn: (turn: string) => void,
    private turnManager: TurnManager
  ) {}
  startGame() {
    this.setGameStarted(true)
    this.setActivePlayers(this.getPlayers().size)
    this.setCurrentTurn(this.turnManager.getStartingPlayer())
  }

  stopGame() {
    this.setGameStarted(false)
  }

  resetGame() {
    this.setActivePlayers(this.getPlayers().size)
  }

  determineWinner(): string {
    return ''
  }
}
