import { TurnManager } from './TurnManager'

export class GameManager {
  constructor(
    private getPlayers: () => Map<string, any>,
    private setActivePlayers: (count: number) => void,
    private setGameStarted: (status: boolean) => void,
    private gameLoop: () => Promise<void>
  ) {}
  async startGame() {
    console.log('Starting game...')
    this.setGameStarted(true)
    // this.setActivePlayers(this.getPlayers().size)
    // this.setCurrentTurn(this.getStartingPlayer())

    await this.gameLoop()
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
