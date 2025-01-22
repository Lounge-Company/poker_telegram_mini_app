import { RoomService } from './services/roomService.js'
import { UIService } from './services/uiService.js'
import { BrowserEvents } from './handlers/browserEvents.js'
import { RoomEvents } from './handlers/roomEvents.js'

async function init() {
  const roomService = new RoomService()
  const room = await roomService.joinRoom()

  const ui = new UIService(room)

  // Инициализируем обработчики событий
  const browserEvents = new BrowserEvents(room)
  const roomEvents = new RoomEvents(room, ui)

  // Устанавливаем обработчики
  browserEvents.setup()
  roomEvents.setup()
}

init()
