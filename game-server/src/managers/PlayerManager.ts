import { IPlayerRepository } from '../interfaces/IPlayerRepository'
import { PlayerState } from '../rooms/schema/PlayerState'

export class PlayerManager {
  constructor(
    private playerRepository: IPlayerRepository,
    private getCurrentBet: () => number,
    private setPot: (amount: number) => void,
    private setCurrentBet: (amount: number) => void,
    private setActivePlayers: (count: number) => void,
    private getActivePlayers: () => number
  ) {}
  handleCheck(playerId: string) {
    const player = this.playerRepository.getPlayer(playerId)
    if (player && this.getCurrentBet() === 0) {
      console.log(`Player ${player.name} checked.`)
      player.acted = true
      this.playerRepository.updatePlayer(player)
    }
  }

  handleCall(playerId: string) {
    const player = this.playerRepository.getPlayer(playerId)
    if (player && player.chips >= this.getCurrentBet()) {
      player.chips -= this.getCurrentBet()
      this.setPot(player.chips)
      player.acted = true
      this.playerRepository.updatePlayer(player)
    }
  }

  handleFold(playerId: string) {
    const player = this.playerRepository.getPlayer(playerId)
    if (player) {
      player.hasFolded = true
      player.acted = true
      this.playerRepository.updatePlayer(player)
      this.updateActivePlayers()
    }
  }
  handleBet(playerId: string, amount: number) {
    const player = this.playerRepository.getPlayer(playerId)
    if (player && player.chips >= amount) {
      player.chips -= amount
      this.setPot(amount)
      this.setCurrentBet(amount)
      player.acted = true
      this.playerRepository.updatePlayer(player)
    }
  }

  resetPlayers() {
    this.playerRepository.getAllPlayers().forEach((player) => {
      player.acted = false
      player.hasFolded = false
      this.playerRepository.updatePlayer(player)
    })
  }
  updateActivePlayers() {
    const newCount = this.getActivePlayers() - 1
    if (newCount >= 0) {
      this.setActivePlayers(newCount)
    }
  }
}
