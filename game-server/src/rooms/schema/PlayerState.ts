import { Schema, Context, type } from '@colyseus/schema'
import { Card } from './Card'
export class PlayerState extends Schema {
  @type('string') id: string = ''
  @type('string') name: string = ''
  @type('number') chips = 100
  @type([Card]) openCards = new Array<Card>()
  @type('boolean') hasFolded = false
  @type('boolean') isAllIn = false
  @type('number') currentBet = 0
}
