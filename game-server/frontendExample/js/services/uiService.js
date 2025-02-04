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
        if (!player) {
          return console.log('Player not found')
        }
        // Если ставки нет, создаём её
        seatElement.innerHTML = `
            <div class="player-name">${player.name}</div>
            <div class="player-chips">${player.chips}</div>
            <p class="table-player-bet-value seat-${index + 1}-bet">
              <span class="chips-value">
                <span class="normal-value">${player.currentBet || 0}</span>
              </span>
            </p>
          `
        console.log('player bet:', player.currentBet)
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
    console.log('bet :', bet)
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
  displayPot() {
    const potElement = document.getElementById('pot-amount')
    potElement.textContent = this.room.state.pot
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
