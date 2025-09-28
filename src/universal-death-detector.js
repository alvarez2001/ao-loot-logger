const deathLogger = require('./death-logger')
const MemoryStorage = require('./storage/memory-storage')
const Logger = require('./utils/logger')

class UniversalDeathDetector {
  constructor() {
    this.deathLogger = deathLogger
    this.deathEventIds = new Set([
      481, // Evento específico que ya conocemos (tu muerte)
      165, // Evento de muerte PvP (killer vs victim)
      // Agregar más IDs de eventos de muerte cuando los encontremos
    ])
    
    // Patrones de muerte en diferentes tipos de eventos
    this.deathPatterns = {
      // Patrones en eventos directos
      directDeath: [
        'death', 'died', 'killed', 'defeated', 'slain', 'fell', 'eliminated'
      ],
      
      // Patrones en mensajes de chat
      chatDeath: [
        'was killed by',
        'died',
        'was defeated by',
        'was slain by',
        'fell in battle',
        'has been defeated',
        'was eliminated by',
        'was destroyed by'
      ],
      
      // Patrones en eventos de combate
      combatDeath: [
        'combat_death',
        'pvp_death',
        'pve_death',
        'environmental_death'
      ]
    }
  }

  // Detectar muerte en cualquier tipo de evento
  detectDeath(event, eventType = 'unknown') {
    try {
      const parameters = event?.parameters || {}
      const eventId = event?.parameters?.[252] || event?.parameters?.[253]
      
      Logger.debug(`🔍 Analizando evento ${eventType} (ID: ${eventId}) para muerte:`, parameters)
      
      // DEBUG: Verificar si el evento 165 está siendo procesado
      if (eventId === 165) {
        Logger.info(`🎯 EVENTO 165 DETECTADO - Verificando si está en la lista...`)
        Logger.info(`Lista de eventos conocidos:`, Array.from(this.deathEventIds))
        Logger.info(`¿Está 165 en la lista?`, this.deathEventIds.has(165))
      }
      
      // Verificar si es un evento de muerte conocido primero (funciona con objetos)
      if (this.deathEventIds.has(eventId)) {
        Logger.info(`💀 Evento de muerte conocido detectado (ID: ${eventId})`)
        return this.parseKnownDeathEvent(event, eventId)
      }
      
      // Verificar que parameters sea un array para otros métodos
      if (!Array.isArray(parameters)) {
        return null
      }
      
      Logger.debug(`🔍 Analizando evento ${eventType} (ID: ${eventId}) para muerte:`, parameters)
      
      // Buscar patrones de muerte en el evento
      const deathInfo = this.findDeathPatterns(parameters, eventType)
      if (deathInfo) {
        Logger.info(`💀 Patrón de muerte detectado en evento ${eventType}`)
        return deathInfo
      }
      
      // Buscar información de muerte en arrays de jugadores
      const playerDeathInfo = this.findPlayerDeathInArrays(parameters)
      if (playerDeathInfo) {
        Logger.info(`💀 Muerte de jugador detectada en arrays`)
        return playerDeathInfo
      }
      
      return null
      
    } catch (error) {
      Logger.debug(`Error detectando muerte en evento ${eventType}:`, error.message)
      return null
    }
  }

  // Parsear evento de muerte conocido
  parseKnownDeathEvent(event, eventId) {
    switch (eventId) {
      case 481:
        return this.parseEvent481(event)
      case 165:
        return this.parseEvent165(event)
      default:
        return this.parseGenericDeathEvent(event)
    }
  }

  // Parsear el evento 165 específico (muerte PvP)
  parseEvent165(event) {
    const parameters = event.parameters || {}
    
    try {
      Logger.info(`🔍 Parseando evento 165:`, parameters)
      
      // Estructura del evento 165 (formato objeto):
      // '0': [coordenadas] - Posición
      // '1': ID del evento
      // '2': Nombre de la víctima
      // '3': Guild de la víctima  
      // '10': Nombre del killer
      // '11': Guild del killer
      
      const victimName = parameters['2'] // 'SG0D'
      const victimGuild = parameters['3'] // 'GELO E TECO'
      const killerName = parameters['10'] // 'Francisco159'
      const killerGuild = parameters['11'] // 'I N T E R B A N K'
      
      Logger.info(`📊 Datos extraídos del evento 165:`)
      Logger.info(`Víctima: ${victimName} (${victimGuild})`)
      Logger.info(`Killer: ${killerName} (${killerGuild})`)
      
      if (!victimName || !killerName) {
        Logger.warn('Evento 165: Faltan nombres de víctima o killer')
        return null
      }
      
      // Crear objetos de jugador
      const killer = MemoryStorage.players.getByName(killerName) || 
                    MemoryStorage.players.add({ 
                      playerName: killerName, 
                      guildName: killerGuild 
                    })
      
      const victim = MemoryStorage.players.getByName(victimName) || 
                     MemoryStorage.players.add({ 
                       playerName: victimName, 
                       guildName: victimGuild 
                     })
      
      // Extraer ubicación si está disponible
      let location = null
      if (parameters['0'] && Array.isArray(parameters['0']) && parameters['0'].length >= 2) {
        location = {
          x: parameters['0'][0],
          y: parameters['0'][1]
        }
      }
      
      // Determinar si es tu muerte
      const isSelfDeath = MemoryStorage.players.self && 
                         victim.playerName === MemoryStorage.players.self.playerName
      
      const deathType = isSelfDeath ? 'self_death' : 'pvp_death'
      
      Logger.info(`💀 Evento 165 detectado: ${killerName} killed ${victimName}`)
      
      return {
        killer: isSelfDeath ? null : killer, // Si es tu muerte, no hay killer específico
        victim: victim,
        deathType: deathType,
        location: location,
        additionalInfo: `Event 165 - Killer: ${killerName} (${killerGuild}), Victim: ${victimName} (${victimGuild})`,
        eventId: 165,
        eventType: 'event_data'
      }
      
    } catch (error) {
      Logger.warn('Error parsing event 165:', error)
      return null
    }
  }

  // Parsear el evento 481 específico
  parseEvent481(event) {
    const parameters = event.parameters || []
    
    try {
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
      
      // Determinar tipo de muerte
      const isSelfDeath = MemoryStorage.players.self &&
                         deadPlayers.some(player =>
                           player.playerName === MemoryStorage.players.self.playerName
                         )
      
      if (isSelfDeath) {
        const selfPlayer = deadPlayers.find(player =>
          player.playerName === MemoryStorage.players.self.playerName
        )
        
        return {
          killer: null, // No hay killer específico en este evento
          victim: selfPlayer,
          deathType: 'self_death',
          location: this.extractLocation(parameters),
          additionalInfo: `YOU DIED - Also died with: ${deadPlayers.filter(p => p.playerName !== MemoryStorage.players.self.playerName).map(p => p.playerName).join(', ')}`,
          eventId: 481,
          eventType: 'response_data'
        }
      } else {
        return {
          killer: null,
          victim: deadPlayers[0],
          deathType: 'other_death',
          location: this.extractLocation(parameters),
          additionalInfo: `Multiple deaths: ${deadPlayers.map(p => p.playerName).join(', ')}`,
          eventId: 481,
          eventType: 'response_data'
        }
      }
      
    } catch (error) {
      Logger.warn('Error parsing event 481:', error)
      return null
    }
  }

  // Parsear evento de muerte genérico
  parseGenericDeathEvent(event) {
    const parameters = event.parameters || []
    
    try {
      let killer = null
      let victim = null
      let deathType = 'unknown'
      let location = null
      let additionalInfo = ''
      
      // Intentar extraer killer y victim de diferentes posiciones
      for (let i = 0; i < Math.min(parameters.length, 10); i++) {
        const param = parameters[i]
        
        if (typeof param === 'string' && param.length > 0) {
          // Si es un nombre de jugador y no tenemos killer, asignarlo
          if (!killer && this.isPlayerName(param)) {
            killer = MemoryStorage.players.getByName(param) || 
                    MemoryStorage.players.add({ playerName: param })
          }
          // Si ya tenemos killer y encontramos otro nombre, es la víctima
          else if (killer && !victim && this.isPlayerName(param)) {
            victim = MemoryStorage.players.getByName(param) || 
                    MemoryStorage.players.add({ playerName: param })
          }
        }
      }
      
      // Si no encontramos killer/victim específicos, usar información genérica
      if (!victim && killer) {
        victim = killer // Asumir que es muerte propia
        killer = null
        deathType = 'self_death'
      } else if (!killer && victim) {
        deathType = 'other_death'
      } else if (killer && victim) {
        deathType = 'pvp_death'
      }
      
      return {
        killer,
        victim,
        deathType,
        location,
        additionalInfo: `Generic death event - Parameters: ${JSON.stringify(parameters.slice(0, 5))}`,
        eventId: event.parameters?.[252] || event.parameters?.[253] || 'unknown',
        eventType: 'generic'
      }
      
    } catch (error) {
      Logger.warn('Error parsing generic death event:', error)
      return null
    }
  }

  // Buscar patrones de muerte en parámetros
  findDeathPatterns(parameters, eventType) {
    // Verificar que parameters sea un array
    if (!Array.isArray(parameters)) {
      return null
    }
    
    for (const param of parameters) {
      if (typeof param === 'string') {
        // Buscar patrones de chat
        for (const pattern of this.deathPatterns.chatDeath) {
          if (param.toLowerCase().includes(pattern.toLowerCase())) {
            return this.parseChatDeathMessage(param, eventType)
          }
        }
        
        // Buscar patrones directos
        for (const pattern of this.deathPatterns.directDeath) {
          if (param.toLowerCase().includes(pattern.toLowerCase())) {
            return this.parseDirectDeathMessage(param, eventType)
          }
        }
      }
    }
    
    return null
  }

  // Parsear mensaje de chat de muerte
  parseChatDeathMessage(message, eventType) {
    try {
      const lowerMessage = message.toLowerCase()
      
      // Patrón: "PlayerName was killed by KillerName"
      const killedByMatch = message.match(/(\w+)\s+was\s+killed\s+by\s+(\w+)/i)
      if (killedByMatch) {
        const victimName = killedByMatch[1]
        const killerName = killedByMatch[2]
        
        return {
          killer: MemoryStorage.players.getByName(killerName) || 
                 MemoryStorage.players.add({ playerName: killerName }),
          victim: MemoryStorage.players.getByName(victimName) || 
                  MemoryStorage.players.add({ playerName: victimName }),
          deathType: 'pvp_death',
          location: null,
          additionalInfo: `Chat message: ${message}`,
          eventType: 'chat_message'
        }
      }
      
      // Patrón: "PlayerName died"
      const diedMatch = message.match(/(\w+)\s+died/i)
      if (diedMatch) {
        const victimName = diedMatch[1]
        
        return {
          killer: null,
          victim: MemoryStorage.players.getByName(victimName) || 
                  MemoryStorage.players.add({ playerName: victimName }),
          deathType: 'other_death',
          location: null,
          additionalInfo: `Chat message: ${message}`,
          eventType: 'chat_message'
        }
      }
      
      return null
      
    } catch (error) {
      Logger.warn('Error parsing chat death message:', error)
      return null
    }
  }

  // Parsear mensaje directo de muerte
  parseDirectDeathMessage(message, eventType) {
    try {
      return {
        killer: null,
        victim: null,
        deathType: 'unknown',
        location: null,
        additionalInfo: `Direct death message: ${message}`,
        eventType: 'direct_message'
      }
    } catch (error) {
      Logger.warn('Error parsing direct death message:', error)
      return null
    }
  }

  // Buscar muerte de jugador en arrays
  findPlayerDeathInArrays(parameters) {
    try {
      // Verificar que parameters sea un array
      if (!Array.isArray(parameters)) {
        return null
      }
      
      // Buscar arrays que contengan nombres de jugadores
      for (const param of parameters) {
        if (Array.isArray(param)) {
          const playerNames = param.filter(p => typeof p === 'string' && this.isPlayerName(p))
          
          if (playerNames.length > 0) {
            // Si encontramos nombres de jugadores, asumir que murieron
            const victims = playerNames.map(name => 
              MemoryStorage.players.getByName(name) || 
              MemoryStorage.players.add({ playerName: name })
            )
            
            return {
              killer: null,
              victim: victims[0],
              deathType: 'array_death',
              location: null,
              additionalInfo: `Players in death array: ${playerNames.join(', ')}`,
              eventType: 'array_data'
            }
          }
        }
      }
      
      return null
      
    } catch (error) {
      Logger.debug('Error finding player death in arrays:', error.message)
      return null
    }
  }

  // Extraer ubicación de parámetros
  extractLocation(parameters) {
    try {
      // Verificar que parameters sea un array
      if (!Array.isArray(parameters)) {
        return null
      }
      
      // Buscar coordenadas en diferentes posiciones
      for (let i = 0; i < parameters.length; i++) {
        const param = parameters[i]
        
        if (typeof param === 'number' && param > 0 && param < 2000) {
          // Buscar el siguiente parámetro que también sea número
          if (i + 1 < parameters.length && typeof parameters[i + 1] === 'number') {
            return {
              x: param,
              y: parameters[i + 1]
            }
          }
        }
      }
      
      return null
      
    } catch (error) {
      Logger.debug('Error extracting location:', error.message)
      return null
    }
  }

  // Verificar si un string es un nombre de jugador
  isPlayerName(str) {
    if (typeof str !== 'string') return false
    
    // Nombres de jugador típicos: 3-20 caracteres, alfanuméricos
    return /^[A-Za-z0-9_]{3,20}$/.test(str) && 
           !str.includes(' ') && 
           !str.includes(':') &&
           !str.includes('[') &&
           !str.includes(']')
  }

  // Procesar evento de muerte detectado
  processDeathEvent(deathInfo) {
    if (!deathInfo) return
    
    try {
      Logger.info(`💀 Procesando evento de muerte:`, {
        killer: deathInfo.killer?.playerName || 'Unknown',
        victim: deathInfo.victim?.playerName || 'Unknown',
        deathType: deathInfo.deathType,
        eventType: deathInfo.eventType
      })
      
      // Loggear el evento de muerte
      this.deathLogger.write({
        date: new Date(),
        killer: deathInfo.killer,
        victim: deathInfo.victim,
        deathType: deathInfo.deathType,
        location: deathInfo.location,
        additionalInfo: deathInfo.additionalInfo
      })
      
    } catch (error) {
      Logger.error('Error processing death event:', error)
    }
  }
}

module.exports = new UniversalDeathDetector()
