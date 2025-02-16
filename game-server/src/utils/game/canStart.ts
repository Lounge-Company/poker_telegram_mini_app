import { MyRoom } from '../../rooms/MyRoom'

export function canStartGame(room: MyRoom): boolean {
  return (
    room.state.readyPlayers === room.state.players.size &&
    room.state.players.size >= room.state.MIN_PLAYERS
  )
}
