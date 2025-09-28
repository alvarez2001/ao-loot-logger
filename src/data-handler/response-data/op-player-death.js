const MemoryStorage = require('../../storage/memory-storage')
const DeathLogger = require('../../death-logger')
const Logger = require('../../utils/logger')
const ParserError = require('../parser-error')

const name = 'OpPlayerDeath'

function handle(event) {
  try {
    const deathData = parse(event)
    
    Logger.debug('OpPlayerDeath', deathData, event.parameters)

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
  const parameters = event.parameters || []
  
  let killer = null
  let victim = null
  let deathType = 'self_death' // Es tu muerte
  let location = null
  let additionalInfo = ''

  try {
    // Este evento contiene información de múltiples jugadores que murieron
    // TÚ eres una de las víctimas, no el killer
    const deadPlayers = []
    
    // Extraer información de todos los jugadores que murieron
    if (parameters[1] && Array.isArray(parameters[1])) {
      const playerNames = parameters[1]
      const guildNames = parameters[11] || []
      
      for (let i = 0; i < playerNames.length; i++) {
        const playerName = playerNames[i]
        const guildName = guildNames[i] || ''
        
        const deadPlayer = MemoryStorage.players.getByName(playerName) || 
                          MemoryStorage.players.add({ playerName, guildName })
        
        deadPlayers.push(deadPlayer)
      }
    }

    // Verificar si TÚ eres una de las víctimas
    const isSelfDeath = MemoryStorage.players.self && 
                       deadPlayers.some(player => 
                         player.playerName === MemoryStorage.players.self.playerName
                       )

    if (isSelfDeath) {
      // Encontrar tu información específica
      const selfPlayer = deadPlayers.find(player => 
        player.playerName === MemoryStorage.players.self.playerName
      )
      
      victim = selfPlayer
      deathType = 'self_death'
      additionalInfo = `YOU DIED - Also died with: ${deadPlayers.filter(p => p.playerName !== MemoryStorage.players.self.playerName).map(p => p.playerName).join(', ')}`
      
      Logger.info(`💀💀💀 YOU DIED: ${victim?.playerName || 'Unknown'} (${victim?.guildName || 'No Guild'}) - Also died with: ${deadPlayers.filter(p => p.playerName !== MemoryStorage.players.self.playerName).map(p => p.playerName).join(', ')}`)
    } else {
      // Si no eres tú, registrar como muerte de otros
      victim = deadPlayers[0] // Tomar el primero como representativo
      deathType = 'other_death'
      additionalInfo = `Multiple deaths: ${deadPlayers.map(p => p.playerName).join(', ')}`
      
      Logger.info(`💀 Multiple deaths detected: ${deadPlayers.map(p => `${p.playerName} (${p.guildName})`).join(', ')}`)
    }

  } catch (error) {
    Logger.warn('Error parsing kill event parameters:', error)
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
