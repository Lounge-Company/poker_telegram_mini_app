export class UIService {
  constructor(room) {
    this.room = room
    this.myId = room.sessionId
  }

  updateSeats() {
    this.room.state.seats.forEach((seat, index) => {
      const seatElement = document.getElementById(`seat-${index}`)
      if (!seatElement) return console.log('Seat element not found')

      if (seat.playerId) {
        const player = this.room.state.players.get(seat.playerId)
        console.log('Player ID:', seat.playerId)
        console.log('Player object keys:', Object.keys(player))
        console.log('Player object values:', Object.values(player))
        if (!player) {
          return console.log('Player not found')
        }
        seatElement.innerHTML = `
                <div>Место ${index}</div>
                <div>${player.name}</div>
                <div>Фишки: ${player.chips}</div>
            `
      } else {
        seatElement.innerHTML = `место ${index}`
      }
    })
  }
  displayMessage(message) {
    if (message && typeof message === 'object') {
      const messagesList = document.getElementById('messages')
      const newMessage = document.createElement('li')

      const playerName =
        this.myId === message.playerId
          ? `${message.playerName}(You)`
          : message.playerName

      const timestamp = new Date(message.timestamp).toLocaleTimeString()
      const content = message.message || ''

      newMessage.textContent = `[${timestamp}] ${playerName}: ${content}`
      messagesList.appendChild(newMessage)
    } else {
      console.warn('Unexpected message format:', message)
    }
  }
}
