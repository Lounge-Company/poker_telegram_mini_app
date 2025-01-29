import { GameEventEmitter } from './gameEvents'
import { GameLoop } from '../core/GameLoop'

export const registerGameEvents = (gameLoop: GameLoop) => {
  const eventEmitter = GameEventEmitter.getInstance()

  eventEmitter.on('gameStart', () => {
    console.log('emmited gameStart')
    gameLoop.startGame()
  })

  eventEmitter.on('gameEnd', () => {
    gameLoop.stopGame()
  })

  eventEmitter.on('roundStart', () => {
    gameLoop.gameLoop()
  })
}
