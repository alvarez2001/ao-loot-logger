const MemoryStorage = require('../../storage/memory-storage')
const DeathLogger = require('../../death-logger')
const Logger = require('../../utils/logger')
const ParserError = require('../parser-error')

const name = 'EvChatMessage'

function handle(event) {
  try {
    const chatData = parse(event)
    
    Logger.debug('EvChatMessage', chatData, event.parameters)

    // Buscar patrones de muerte en el mensaje de chat
    const deathPatterns = [
      /(.+?) was killed by (.+?)/i,
      /(.+?) died/i,
      /(.+?) has been defeated by (.+?)/i,
      /(.+?) was defeated/i,
      /(.+?) fell in battle/i,
      /(.+?) was slain by (.+?)/i
    ]

    const message = chatData.message || ''
    let deathMatch = null

    for (const pattern of deathPatterns) {
      deathMatch = message.match(pattern)
      if (deathMatch) break
    }

    if (deathMatch) {
      const date = new Date()
      let killer = null
      let victim = null
      let deathType = 'chat_detected'

      // Extraer víctima y killer del mensaje
      if (deathMatch[1]) {
        victim = MemoryStorage.players.getByName(deathMatch[1].trim()) || 
                 MemoryStorage.players.add({ playerName: deathMatch[1].trim() })
      }

      if (deathMatch[2]) {
        killer = MemoryStorage.players.getByName(deathMatch[2].trim()) || 
                 MemoryStorage.players.add({ playerName: deathMatch[2].trim() })
      }

      DeathLogger.write({
        date,
        killer,
        victim,
        deathType,
        location: null,
        additionalInfo: `Chat: ${message}`
      })
    }

  } catch (error) {
    Logger.warn('Error parsing chat message:', error.message)
    Logger.debug('Raw chat event:', event.parameters)
  }
}

function parse(event) {
  const parameters = event.parameters || []
  
  let sender = null
  let message = ''
  let channel = 'unknown'

  try {
    // Intentar extraer información del sender
    if (parameters[1] && typeof parameters[1] === 'string') {
      sender = MemoryStorage.players.getByName(parameters[1]) || 
               MemoryStorage.players.add({ playerName: parameters[1] })
    }

    // Intentar extraer el mensaje
    if (parameters[2] && typeof parameters[2] === 'string') {
      message = parameters[2]
    }

    // Intentar extraer el canal
    if (parameters[3] && typeof parameters[3] === 'string') {
      channel = parameters[3]
    }

  } catch (error) {
    Logger.warn('Error parsing chat event parameters:', error)
  }

  return {
    sender,
    message,
    channel
  }
}

module.exports = { name, handle, parse }
