import { Schema, Context, type } from '@colyseus/schema'
import { Card } from './Card'
export class PlayerState extends Schema {
  @type('string') id: string = ''
  @type('string') name: string = ''
  @type('number') seatIndex: number | null = null
  @type('number') chips = 100
  @type([Card]) openCards = new Array<Card>()
  @type('number') currentBet = 0
  @type('boolean') hasFolded = false
  @type('boolean') isAllIn = false
  @type('boolean') ready = false
  @type('boolean') acted = false
}
