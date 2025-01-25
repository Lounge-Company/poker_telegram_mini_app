// browserEvents.js
export class BrowserEvents {
  constructor(room) {
    this.room = room
  }

  setup() {
    this.setupMessageForm()
    this.setupGameForms()
    this.setupButtons()
    this.setupCheck()
  }

  setupMessageForm() {
    const messageForm = document.getElementById('messageForm')
    messageForm.addEventListener('submit', (event) => {
      event.preventDefault()
      const messageInput = document.getElementById('messageInput')
      this.room.send('message', messageInput.value)
      messageInput.value = ''
    })
  }

  setupGameForms() {
    const numberForm = document.getElementById('numberForm')
    numberForm.addEventListener('submit', (event) => {
      event.preventDefault()
      const numberInput = document.getElementById('numberInput')
      const number = parseInt(numberInput.value, 10)
      if (!isNaN(number)) {
        this.room.send('joinGame', number)
        numberInput.value = ''
      }
    })
  }

  setupButtons() {
    const leaveSeatButton = document.getElementById('leaveSeat')
    const readyButton = document.getElementById('ready')

    leaveSeatButton.addEventListener('click', () => {
      this.room.send('leaveGame')
    })

    readyButton.addEventListener('click', () => {
      this.room.send('ready')
    })
  }
  setupCheck() {
    const checkButton = document.getElementById('check')
    checkButton.addEventListener('click', () => {
      console.log('setupCheck called')
      this.room.send('check')
    })
  }
}
