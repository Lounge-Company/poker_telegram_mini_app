import { WinnersResult } from '../types/winnerResult'
import { IBetRepository } from '../interfaces/repositories/IBetRepository'
import { IPlayerRepository } from '../interfaces/repositories/IPlayerRepository'
import { ISeatRepository } from '../interfaces/repositories/ISeatRepository'
import { PlayerState } from '../rooms/schema/PlayerState'
import { ClientService } from '../services/clientService'
import { GameResultMessage } from '../types/GameResultPayload'

export class PlayerManager {
  constructor(
    private playerRepository: IPlayerRepository,
    private betRepository: IBetRepository,
    private seatRepository: ISeatRepository,
    private setActivePlayers: (count: number) => void,
    private getActivePlayers: () => number,
    private getDealerId: () => string,
    private clientService: ClientService
  ) {}
  handleCheck(playerId: string) {
    const player = this.playerRepository.getPlayer(playerId)
    if (player && this.betRepository.getCurrentBet() === 0) {
      console.log(`Player ${player.name} checked.`)
      player.acted = true
      // this.playerRepository.updatePlayer(player)
    }
  }

  handleCall(playerId: string) {
    const player = this.playerRepository.getPlayer(playerId)
    if (player && player.chips >= this.betRepository.getCurrentBet()) {
      player.chips -= this.betRepository.getCurrentBet()
      this.betRepository.setPot(player.chips)
      player.acted = true
      // this.playerRepository.updatePlayer(player)
    }
  }

  handleFold(playerId: string) {
    const player = this.playerRepository.getPlayer(playerId)
    if (player) {
      player.hasFolded = true
      player.acted = true
      // this.playerRepository.updatePlayer(player)
      this.updateActivePlayers()
    }
  }
  handleBet(playerId: string, amount: number) {
    const player = this.playerRepository.getPlayer(playerId)
    if (player && player.chips >= amount) {
      player.chips -= amount
      this.betRepository.setPot(amount)
      this.betRepository.setCurrentBet(amount)
      player.acted = true
      // this.playerRepository.updatePlayer(player)
    }
  }

  resetPlayers() {
    this.playerRepository.getAllPlayers().forEach((player) => {
      console.log('resetting player', player)
      player.acted = false
      player.hasFolded = false
      player.currentBet = 0
      // this.playerRepository.updatePlayer(player)
    })
  }
  updateActivePlayers() {
    const newCount = this.getActivePlayers() - 1
    if (newCount >= 0) {
      this.setActivePlayers(newCount)
    }
  }
  getBlindsPositions() {
    const players = this.playerRepository.getAllPlayers()
    const seats = this.seatRepository.getSeats()
    const dealerIndex = seats.findIndex(
      (seat) => seat.playerId === this.getDealerId()
    )
    const smallBlindIndex = (dealerIndex + 1) % seats.length
    const bigBlindIndex = (dealerIndex + 2) % seats.length

    return {
      smallBlind: seats[smallBlindIndex]?.playerId,
      bigBlind: seats[bigBlindIndex]?.playerId,
    }
  }
  addChips(playerId: string, amount: number) {
    const player = this.playerRepository.getPlayer(playerId)
    if (player) {
      player.chips += amount
    }
  }
  findLastActivePlayerAndAwardPot(): string {
    const players = this.playerRepository.getAllPlayers()

    for (const player of players.values()) {
      if (!player.hasFolded) {
        player.chips += this.betRepository.getPot()
        this.betRepository.setPot(0)
        return player.id
      }
    }
  }
  awardPotToWinners(winnersResult: WinnersResult) {
    // fix it for full poker implementation
    const { winningPlayerIds, winningHand } = winnersResult
    const totalPot = this.betRepository.getPot()
    const splitAmount = Math.floor(totalPot / winningPlayerIds.length) // <--- fix this

    const resultToSend: GameResultMessage = {
      pot: totalPot,
      winners: winningPlayerIds.map((playerId) => ({
        playerId,
        amount: splitAmount,
        hand: winningHand,
      })),
    }

    this.clientService.broadcastGameResult(resultToSend)
  }
  public markPlayerAsFolded(playerId: string): void {
    const player = this.playerRepository.getPlayer(playerId)
    if (!player) return

    player.hasFolded = true
    player.acted = true
    // this.playerRepository.updatePlayer(player)
  }
}
