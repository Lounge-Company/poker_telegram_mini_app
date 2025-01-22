// Connect to the Colyseus server
const client = new Colyseus.Client('ws://localhost:2567')
let room
let myId
async function joinRoom() {
  try {
    room = await client.joinOrCreate('my_room')
    console.log('Joined room successfully!', room)
    room.state.seats.onChange((value, key) => {
      console.log(key, 'changed to', value)
      updateSeats()
    })
    myId = room.sessionId
    // Listen for messages from the server
    room.onMessage('message', (message) => {
      console.log('Received message from server:', message)

      // Ensure the message is an object and contains expected fields
      if (message && typeof message === 'object') {
        const messagesList = document.getElementById('messages')
        const newMessage = document.createElement('li')

        const playerName =
          myId === message.playerId
            ? `${message.playerName}(You)`
            : message.playerName
        const timestamp = new Date(message.timestamp).toLocaleTimeString()
        const content = message.message || ''

        // Format the message for display
        newMessage.textContent = `[${timestamp}] ${playerName}: ${content}`
        messagesList.appendChild(newMessage)
      } else {
        console.warn('Unexpected message format:', message)
      }
    })

    room.onMessage('playerCards', (cards) => {
      console.log('Получены карты:', cards)

      // Находим контейнер для карт игрока
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
    })
  } catch (err) {
    console.error('Failed to join room:', err)
  }
}

joinRoom()

// Handle form submission
const messageForm = document.getElementById('messageForm')
messageForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const messageInput = document.getElementById('messageInput')
  const message = messageInput.value

  // Send message to the server
  if (room) {
    room.send('message', message)
    console.log('Message sent to server:', message)

    // Display sent message in the list

    messageInput.value = '' // Clear input field
  }
})

// Handle number form submission
const numberForm = document.getElementById('numberForm')
numberForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const numberInput = document.getElementById('numberInput')
  const number = parseInt(numberInput.value, 10)

  if (room && !isNaN(number)) {
    room.send('joinGame', number)
    console.log('Number sent to server:', number)

    // Clear the input field
    numberInput.value = ''
  }
})
const leaveSeatButton = document.getElementById('leaveSeat')
leaveSeatButton.addEventListener('click', () => {
  if (room) {
    room.send('leaveGame')
  }
})
// Event handlers for new buttons
const readyButton = document.getElementById('ready')
readyButton.addEventListener('click', () => {
  if (room) {
    room.send('ready')
  }
})
function updateSeats() {
  console.log('Обновляем места:', room.state.seats)

  room.state.seats.forEach((seat, index) => {
    // Ищем элемент места по id
    const seatElement = document.getElementById(`seat-${index}`)
    if (!seatElement) {
      console.log(`Элемент места ${index} не найден`)
      return
    }

    // Если место занято игроком
    if (seat.playerId) {
      const player = room.state.players.get(seat.playerId)
      seatElement.innerHTML = `
              <div>Место ${index}</div>
              <div>${player.name}</div>
              <div>Фишки: ${player.chips}</div>
              ${player.id === room.state.currentTurn ? '<div>Текущий ход</div>' : ''}
          `
    } else {
      // Если место пустое
      seatElement.innerHTML = `Пустое место ${index}`
    }
  })
}
