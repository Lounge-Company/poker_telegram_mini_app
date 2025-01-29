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
        // Если ставки нет, создаём её
        seatElement.innerHTML = `
            <div class="player-name">${player.name}</div>
            <div class="player-chips">${player.chips}</div>
            <p class="table-player-bet-value seat-${index + 1}-bet">
              <span class="chips-value">
                <span class="normal-value">0</span>
              </span>
            </p>
          `
      } else {
        // Если игрока нет, показываем только номер места
        seatElement.innerHTML = `место ${index + 1}`
      }
    })
  }
  updatePlayerBet(playerId, bet) {
    const seatIndex = this.room.state.seats.findIndex(
      (seat) => seat.playerId === playerId
    )
    console.log('playerId :', playerId)
    console.log('seatIndex :', seatIndex)
    const betElement = document.querySelector(`.seat-${seatIndex + 1}-bet`)
    const normalValueElement = betElement.querySelector('.normal-value')
    normalValueElement.textContent = bet
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
