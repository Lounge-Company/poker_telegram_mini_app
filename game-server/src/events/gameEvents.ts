import { EventEmitter } from 'events'
import TypedEmitter from 'typed-emitter'
import { GameEventTypes } from '../types/GameEventsTypes'

export class GameEventEmitter extends (EventEmitter as new () => TypedEmitter<GameEventTypes>) {
  private static instance: GameEventEmitter

  private constructor() {
    super()
  }

  static getInstance(): GameEventEmitter {
    if (!GameEventEmitter.instance) {
      GameEventEmitter.instance = new GameEventEmitter()
    }
    return GameEventEmitter.instance
  }
}
