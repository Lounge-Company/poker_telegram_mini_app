export class RoomEvents {
  constructor(room, uiService) {
    this.room = room
    this.ui = uiService
  }

  setup() {
    this.setupStateChanges()
    this.setupMessages()
    this.setupGameEvents()
    // this.setupSeatsChanges()
  }

  // setupSeatsChanges() {
  //   this.room.state.seats.onChange((seat, key) => {
  //     console.log('Seat changed:', key, seat)
  //     this.ui.updateSeats()
  //   })
  // }
  setupStateChanges() {
    this.room.onStateChange((state) => {
      console.log('State changed:', state)
      this.ui.updateSeats()
    })
  }
  setupMessages() {
    this.room.onMessage('message', (message) => {
      console.log('Received message:', message)
      this.ui.displayMessage(message)
    })
  }

  setupGameEvents() {
    this.room.onMessage('playerCards', (cards) => {
      console.log('Received cards:', cards)
      this.ui.displayCards(cards)
    })
  }
}
