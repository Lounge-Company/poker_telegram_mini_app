import assert from 'assert'
import { ColyseusTestServer, boot } from '@colyseus/testing'
import 'mocha'
// import your "app.config.ts" file here.
import appConfig from '../../src/app.config'
import { GameState } from '../../src/rooms/schema/GameState'

import { BroadcastMessage } from '../../src/types/BroadcastMessage'
import { PlayerState } from '../../src/rooms/schema/PlayerState'

describe('testing room', () => {
  let colyseus: ColyseusTestServer
  let originalWarn: typeof console.warn
  let originalError: typeof console.error
  before(async () => {
    colyseus = await boot(appConfig)
    originalWarn = console.warn
    originalError = console.error
    console.warn = (msg, ...args) => {
      if (!msg.includes('onMessage() not registered for type')) {
        originalWarn(msg, ...args)
      }
    }
    console.error = (msg, ...args) => {
      if (!msg.includes('onMessage() not registered for type')) {
        originalError(msg, ...args)
      }
    }
  })

  after(async () => {
    colyseus.shutdown()
    console.warn = originalWarn
    console.error = originalError
  })

  beforeEach(async () => await colyseus.cleanup())

  it('connecting into a room and adding to spectators', async () => {
    const room = await colyseus.createRoom<GameState>('my_room', {})
    const client = await colyseus.connectTo(room)

    await room.waitForNextPatch()

    // check if the client is in the room
    assert.strictEqual(
      room.state.spectators.has(client.sessionId),
      true,
      'Player is not in spectators'
    )
  })
  it('Checking the join at the table', async () => {
    const room = await colyseus.createRoom<GameState>('my_room', {})
    const client = await colyseus.connectTo(room)

    client.send('joinGame', { seatIndex: 0, name: 'test' })
    await room.waitForNextPatch()

    assert.strictEqual(
      room.state.players.has(client.sessionId),
      true,
      'Player is not in players'
    )
    assert.strictEqual(
      room.state.seats[0]?.playerId,
      client.sessionId,
      'Player is not in seat 0'
    )
  })
  it('Checking the leave from the table', async () => {
    const room = await colyseus.createRoom<GameState>('my_room', {})
    const client = await colyseus.connectTo(room)

    client.send('leaveGame')
    await room.waitForNextPatch()

    assert.strictEqual(
      room.state.players.has(client.sessionId),
      false,
      'Player is in players'
    )
    assert.strictEqual(
      room.state.spectators.has(client.sessionId),
      true,
      'Player is in spectators'
    )
    assert.strictEqual(room.state.seats[0]?.playerId, '', 'Player is in seat 0')
  })
  it('should send and receive chat messages', async () => {
    const room = await colyseus.createRoom<GameState>('my_room', {})
    const client1 = await colyseus.connectTo(room)
    const client2 = await colyseus.connectTo(room)

    await room.waitForNextPatch()

    const speactator1: PlayerState | undefined = room.state.spectators.get(
      client1.sessionId
    )
    const messagePromise = new Promise<BroadcastMessage>((resolve) => {
      client2.onMessage('message', (message) => {
        resolve(message)
      })
    })

    client1.send('message', 'Hello world')

    const receivedMessage = await messagePromise
    assert.strictEqual(
      receivedMessage.playerId,
      speactator1?.id,
      `Player id does not match. Player id: ${receivedMessage.playerId}, Client id: ${speactator1?.id}, message: ${receivedMessage.message}`
    )
    assert.strictEqual(
      receivedMessage.playerName,
      speactator1?.name,
      `Player name does not match. Player name: ${receivedMessage.playerName}, Client name: ${speactator1?.name}, message: ${receivedMessage.message}`
    )
    assert.strictEqual(
      receivedMessage.message,
      'Hello world',
      `message does not match. message: ${receivedMessage.message}, expected: Hello world`
    )
    assert.ok(
      Date.parse(receivedMessage.timestamp),
      'Timestamp должен быть валидной датой'
    )
  })
})
