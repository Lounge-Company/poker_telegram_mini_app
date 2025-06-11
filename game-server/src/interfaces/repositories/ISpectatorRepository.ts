import { PlayerState } from '../../rooms/schema/PlayerState'

export interface ISpectatorRepository {
  getSpectators(): PlayerState[]
  setSpectator(player: PlayerState): void
}
