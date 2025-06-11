import { GameEventEmitter } from './gameEventEmitter'
import { GameEventTypes } from '../types/GameEventsTypes'

export class EventSubscriber {
  constructor(private eventEmitter: GameEventEmitter) {}

  subscribe<K extends keyof GameEventTypes>(
    event: K,
    handler: (...args: any[]) => void
  ) {
    this.eventEmitter.on(event, handler)
  }
}
