import { Schema, type } from '@colyseus/schema'
import { Card } from './Card'
export class PlayerState extends Schema {
  @type('string') id: string = ''
  @type('string') name: string = ''
  @type('number') chips = 10
  @type([Card]) openCards = new Array<Card>()
  @type('number') currentBet = 0
  @type('boolean') hasFolded = false
  @type('boolean') isAllIn = false
  @type('boolean') ready = false
  @type('boolean') acted = false
}
