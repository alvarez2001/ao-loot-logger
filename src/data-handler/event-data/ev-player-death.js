const MemoryStorage = require('../../storage/memory-storage')
const DeathLogger = require('../../death-logger')
const Logger = require('../../utils/logger')
const ParserError = require('../parser-error')

const name = 'EvPlayerDeath'

function handle(event) {
  try {
    const deathData = parse(event)
    
    Logger.debug('EvPlayerDeath', deathData, event.parameters)

    const date = new Date()

    DeathLogger.write({
      date,
      killer: deathData.killer,
      victim: deathData.victim,
      deathType: deathData.deathType,
      location: deathData.location,
      additionalInfo: deathData.additionalInfo
    })
  } catch (error) {
    Logger.warn('Error parsing death event:', error.message)
    Logger.debug('Raw death event:', event.parameters)
  }
}

function parse(event) {
  // Intentar diferentes estructuras de eventos de muerte
  const parameters = event.parameters || []
  
  // Estructura común de eventos de muerte en Albion Online
  let killer = null
  let victim = null
  let deathType = 'unknown'
  let location = null
  let additionalInfo = ''

  try {
    // Intentar extraer información del killer (parámetro común en eventos de muerte)
    if (parameters[1] && typeof parameters[1] === 'string') {
      killer = MemoryStorage.players.getByName(parameters[1]) || 
               MemoryStorage.players.add({ playerName: parameters[1] })
    }

    // Intentar extraer información de la víctima
    if (parameters[2] && typeof parameters[2] === 'string') {
      victim = MemoryStorage.players.getByName(parameters[2]) || 
               MemoryStorage.players.add({ playerName: parameters[2] })
    }

    // Intentar extraer tipo de muerte
    if (parameters[3] && typeof parameters[3] === 'string') {
      deathType = parameters[3]
    }

    // Intentar extraer ubicación
    if (parameters[4] && typeof parameters[4] === 'number' && 
        parameters[5] && typeof parameters[5] === 'number') {
      location = { x: parameters[4], y: parameters[5] }
    }

    // Información adicional
    if (parameters.length > 6) {
      additionalInfo = JSON.stringify(parameters.slice(6))
    }

  } catch (error) {
    Logger.warn('Error parsing death event parameters:', error)
  }

  // Si no pudimos extraer información específica, usar datos genéricos
  if (!killer && !victim) {
    // Intentar extraer cualquier nombre de jugador disponible
    for (let i = 0; i < parameters.length; i++) {
      if (typeof parameters[i] === 'string' && parameters[i].length > 0) {
        if (!victim) {
          victim = MemoryStorage.players.getByName(parameters[i]) || 
                   MemoryStorage.players.add({ playerName: parameters[i] })
        } else if (!killer) {
          killer = MemoryStorage.players.getByName(parameters[i]) || 
                   MemoryStorage.players.add({ playerName: parameters[i] })
        }
      }
    }
  }

  return {
    killer,
    victim,
    deathType,
    location,
    additionalInfo
  }
}

module.exports = { name, handle, parse }
