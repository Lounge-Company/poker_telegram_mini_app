import { WinnersResult } from '../types/winnerResult'
import { IBetRepository } from '../interfaces/repositories/IBetRepository'
import { IPlayerRepository } from '../interfaces/repositories/IPlayerRepository'
import { ISeatRepository } from '../interfaces/repositories/ISeatRepository'
import { PlayerState } from '../rooms/schema/PlayerState'
import { ClientService } from '../services/clientService'

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
    const currentBet = this.betRepository.getCurrentBet()
    if (player && player.currentBet === currentBet) {
      console.log('handlePlayerCheck :', player.id, player.name)
      player.acted = true
      // this.playerRepository.updatePlayer(player)
    }
  }

  handleCall(playerId: string) {
    const player = this.playerRepository.getPlayer(playerId)
    if (player) {
      const currentBet = this.betRepository.getCurrentBet()
      const amountToCall = currentBet - player.currentBet

      if (player.chips >= amountToCall) {
        player.chips -= amountToCall
        this.betRepository.setPot(this.betRepository.getPot() + amountToCall)
        player.currentBet = currentBet
        player.acted = true
      } else {
        // Обработка ситуации all-in
        this.betRepository.setPot(this.betRepository.getPot() + player.chips)
        player.currentBet += player.chips
        this.betRepository.setCurrentBet(player.currentBet)
        player.chips = 0
        player.isAllIn = true
        player.acted = true
      }
    }
  }

  handleFold(playerId: string) {
    const player = this.playerRepository.getPlayer(playerId)
    if (player) {
      player.hasFolded = true
      player.acted = true
      // this.playerRepository.updatePlayer(player)
      this.decreaseActivePlayers()
    }
  }
  handleBet(playerId: string, amount: number) {
    const player = this.playerRepository.getPlayer(playerId)

    if (player && player.chips >= amount) {
      player.chips -= amount
      player.currentBet += amount
      const currentBet = this.betRepository.getCurrentBet()
      this.betRepository.setPot(this.betRepository.getPot() + amount)
      if (player.currentBet > currentBet) {
        this.betRepository.setCurrentBet(player.currentBet)
        this.resetActedPlayers()
      }
      player.acted = true
      // this.playerRepository.updatePlayer(player)
    } else {
      // Обработка ситуации all-in
      this.betRepository.setPot(this.betRepository.getPot() + player.chips)
      player.currentBet += player.chips
      this.betRepository.setCurrentBet(player.currentBet)
      player.chips = 0
      player.isAllIn = true
      player.acted = true
    }
  }
  resetPlayers() {
    this.playerRepository.getAllPlayers().forEach((player) => {
      player.acted = false
      player.hasFolded = false
      player.isAllIn = false
      player.currentBet = 0
      // this.playerRepository.updatePlayer(player)
    })
  }
  resetPlayersBetweenRounds(): void {
    this.playerRepository.getAllPlayers().forEach((player) => {
      if (!player.hasFolded && !player.isAllIn) {
        console.log(`Resetting player: ${player.name}`)
        player.currentBet = 0
        player.acted = false
      }
    })
  }

  decreaseActivePlayers() {
    console.log('decrementing active players')
    this.setActivePlayers(this.getActivePlayers() - 1)
  }
  getBlindsPositions() {
    const seats = this.seatRepository.getSeats().filter((seat) => seat.playerId)
    const dealerIndex = seats.findIndex(
      (seat) => seat.playerId === this.getDealerId()
    )
    console.log('dealer index:', dealerIndex)
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
        this.addChips(player.id, this.betRepository.getPot())
        console.log(
          `adding chips to ${player.name}, pot: ${this.betRepository.getPot()}`
        )
        this.betRepository.setPot(0)
        return player.id
      }
    }
  }
  awardPotToWinners(winnersResult: WinnersResult) {
    // fix it for full poker implementation
    const { winner } = winnersResult
    const winnerPlayer = this.playerRepository.getPlayer(winner.playerId)
    this.clientService.broadcastGameResult(winnersResult)
    winnerPlayer.chips += this.betRepository.getPot()
  }
  markPlayerAsFolded(playerId: string): void {
    const player = this.playerRepository.getPlayer(playerId)
    if (!player) return

    player.hasFolded = true
    player.acted = true
    this.decreaseActivePlayers()
  }
  markPlayerAsChecked(playerId: string): void {
    const player = this.playerRepository.getPlayer(playerId)
    if (!player) return
    player.acted = true
  }
  resetActedPlayers() {
    const players = this.playerRepository.getAllPlayers()
    players.forEach((player) => {
      if (!player.hasFolded && !player.isAllIn) {
        player.acted = false
      }
    })
  }
}
