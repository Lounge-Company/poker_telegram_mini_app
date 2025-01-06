import { Schema, Context, type, MapSchema } from '@colyseus/schema'
import { PlayerState } from './PlayerState'
import { Card } from './Card'
export class GameState extends Schema {
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>()
  @type({ map: PlayerState }) spectators = new MapSchema<PlayerState>()
  @type([Card]) communityCards = new Array<Card>()
  @type('string') currentTurn: PlayerState['id']
  @type('boolean') gameStarted = false
  @type('number') pot = 0
  @type('number') currentBet = 0
  @type('number') smallBlind: number = 5
  @type('number') bigBlind: number = 10
  @type('number') smallBlindPlayerIndex = 0
  @type('string') gamePhase = 'preFlop' // preFlop, flop, turn, river
}
