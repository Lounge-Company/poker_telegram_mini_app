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
                <div>Место ${index + 1}</div>
                <div>${player.name}</div>
                <div>Фишки: ${player.chips}</div>
            `
      } else {
        seatElement.innerHTML = `место ${index + 1}`
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
  displayCards(cards) {
    const playerCardsContainer = document.getElementById('playerCards')

    // Очищаем предыдущие карты
    playerCardsContainer.innerHTML = ''

    // Отображаем каждую карту
    cards.forEach((card) => {
      const cardElement = document.createElement('div')
      cardElement.className = 'card'
      cardElement.textContent = `${card.rank}${card.suit}`
      playerCardsContainer.appendChild(cardElement)
    })
  }
  highlightSeat(seatIndex) {
    const seatElement = document.getElementById(`seat-${seatIndex}`)
    seatElement.classList.add('active-turn')
  }
  removeHighlightSeat(seatIndex) {
    const seatElement = document.getElementById(`seat-${seatIndex}`)
    seatElement.classList.remove('active-turn')
  }
}
