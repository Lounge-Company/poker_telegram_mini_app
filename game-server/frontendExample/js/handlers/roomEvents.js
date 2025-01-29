export class RoomEvents {
  constructor(room, uiService) {
    this.room = room
    this.ui = uiService
    this.ui.updateSeats()
  }

  setup() {
    this.setupStateChanges()
    this.setupMessages()
    this.setupGameEvents()
    this.setupGameTurns()
    this.setupBets()
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
  setupGameTurns() {
    this.room.onMessage('turn', (playerId) => {
      const currentActive = document.querySelector('.active-turn')
      if (currentActive) {
        currentActive.classList.remove('active-turn')
      }

      const seatIndex = this.room.state.seats.findIndex(
        (seat) => seat.playerId === playerId
      )

      this.ui.highlightSeat(seatIndex)
    })
  }
  setupBets() {
    this.room.onMessage('playerBet', ({ playerId, bet }) => {
      this.ui.updatePlayerBet(playerId, bet)
    })
  }
}
