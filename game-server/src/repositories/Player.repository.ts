import { MapSchema } from '@colyseus/schema'
import { IPlayerRepository } from '../interfaces/repositories/IPlayerRepository'
import { PlayerState } from '../rooms/schema/PlayerState'
import { Card } from '../rooms/schema/Card'

export class PlayerRepository implements IPlayerRepository {
  constructor(private players: MapSchema<PlayerState>) {}

  getPlayer(id: string): PlayerState | undefined {
    return this.players.get(id)
  }
  getAllPlayers(): MapSchema<PlayerState> {
    return this.players
  }
  getPlayerCount(): number {
    return this.players.size
  }
  setOpenCards(id: string, cards: Card[]): void {
    const player = this.players.get(id)
    if (player) {
      for (const card of cards) {
        player.openCards.push(card)
      }
    }
  }
}
