import { EventEmitter } from 'events'
import TypedEmitter from 'typed-emitter' // Исправленный импорт
import { GameEventTypes } from '../types/GameEventsTypes'

// Унаследуемся от типизированного EventEmitter
export class GameEventEmitter extends (EventEmitter as new () => TypedEmitter<GameEventTypes>) {
  private static instance: GameEventEmitter

  // Приватный конструктор для Singleton
  private constructor() {
    super() // Вызов конструктора базового класса
  }

  // Метод для получения единственного экземпляра
  static getInstance(): GameEventEmitter {
    if (!GameEventEmitter.instance) {
      GameEventEmitter.instance = new GameEventEmitter()
    }
    return GameEventEmitter.instance
  }
}
