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
    this.setupBet()
    this.setupCall()
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
      let number = parseInt(numberInput.value, 10)
      if (!isNaN(number)) {
        this.room.send('joinGame', number - 1)
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
      console.log('ready button clicked')
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
  setupBet() {
    const betButton = document.getElementById('bet')
    betButton.addEventListener('click', () => {
      const betAmmount = document.getElementById('bet-input')
      console.log('bet value', betAmmount.value, 'type', typeof betAmmount.value)
      this.room.send('bet', parseInt(betAmmount.value, 10))
    })
  }
  setupCall() {
    const callButton = document.getElementById('call')
    callButton.addEventListener('click', () => {
      console.log('setupCall called')
      this.room.send('call')
    })
  }
  setupFold() {
    const foldButton = document.getElementById('fold')
    foldButton.addEventListener('click', () => {
      console.log('setupFold called')
      this.room.send('fold')
    })
  }
}
