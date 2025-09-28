const DeathLogger = require('./src/death-logger')
const ResponseData = require('./src/data-handler/response-data')
const MemoryStorage = require('./src/storage/memory-storage')

// Función para probar el evento de muerte específico encontrado
function testSpecificDeathEvent() {
  console.log('🧪 Probando evento de muerte específico (ID: 481) - TU MUERTE...\n')

  // Simular que eres uno de los jugadores que murió (ZODI28)
  MemoryStorage.players.self = MemoryStorage.players.add({ 
    playerName: 'ZODI28', 
    guildName: 'Taverna Curupira' 
  })

  // Simular el evento de muerte real que encontraste
  const mockDeathEvent = {
    eventCode: 1,
    parameters: {
      '0': 638946784643169770n,
      '1': [ 'ZODI28', 'baianoxy', 'Polasco', 'MajorGuGuinha' ],
      '2': [ 'HUMAN_MALE', 'HUMAN_MALE', 'HUMAN_MALE', 'HUMAN_MALE' ],
      '3': [ 0, 0, 0, 0 ],
      '4': [
        'AVATAR_AJ_CHARACTER_PROGRESSION_01',
        'AVATAR_AJ_CHARACTER_PROGRESSION_01',
        'AVATAR_AJ_GUILD_01',
        'AVATAR_01'
      ],
      '5': [
        'AVATARRING_AJ_CHARACTER_PROGRESSION_01',
        'AVATARRING_AJ_GUILD_01',
        'AVATARRING_AJ_CREATURES_01',
        'AVATARRING_ANNIVERSARY_2025'
      ],
      '6': [ 6651, 9086, 6651, 8533 ],
      '7': [ 2, 2, 2, 2 ],
      '8': [ '', '', '', '' ],
      '9': [ 'EQUIPMENT_DATA' ],
      '10': [ 2, 2, 2, 2 ],
      '11': [
        'Taverna Curupira',
        'Taverna Curupira',
        'Taverna Curupira',
        'Taverna Curupira'
      ],
      '12': [
        933.7150268554688,
        819.9907836914062,
        1057.4354248046875,
        905.7708129882812
      ],
      '13': [ [Array], [Array], [Array], [Array] ],
      '14': [ [Array], [Array], [Array], [Array] ],
      '15': [ [Array], [Array], [Array], [Array] ],
      '16': [ [Array], [Array], [Array], [Array] ],
      '17': [ [Array], [Array], [Array], [Array] ],
      '18': [ [Array], [Array], [Array], [Array] ],
      '253': 481,
      '255': 30
    }
  }

  console.log('📊 Datos del evento de muerte:')
  console.log('Jugadores que murieron:', mockDeathEvent.parameters['1'])
  console.log('Guilds:', mockDeathEvent.parameters['11'])
  console.log('Event ID:', mockDeathEvent.parameters['253'])
  console.log('Tú eres:', MemoryStorage.players.self.playerName)
  console.log('Es tu muerte:', mockDeathEvent.parameters['1'].includes(MemoryStorage.players.self.playerName))
  
  try {
    ResponseData.OpPlayerDeath.handle(mockDeathEvent)
    console.log('✅ Evento de muerte procesado correctamente\n')
  } catch (error) {
    console.error('❌ Error procesando evento de muerte:', error.message)
    console.error('Stack trace:', error.stack)
  }

  console.log('🎯 Prueba completada. Revisa los archivos de log generados.')
}

// Ejecutar prueba si se llama directamente
if (require.main === module) {
  testSpecificDeathEvent()
}

module.exports = { testSpecificDeathEvent }
