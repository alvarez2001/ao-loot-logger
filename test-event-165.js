const UniversalDeathDetector = require('./src/universal-death-detector')
const MemoryStorage = require('./src/storage/memory-storage')

console.log('🧪 Probando el evento 165 (muerte PvP)...\n')

// Simular que eres un jugador específico
MemoryStorage.players.self = MemoryStorage.players.add({
  playerName: 'ZODI28',
  guildName: 'Taverna Curupira'
})

// Función para probar el evento 165 específico
function testEvent165() {
  console.log('📊 Probando evento 165 (muerte PvP):\n')

  // Evento 165 real que proporcionaste
  const event165 = {
    eventCode: 1,
    parameters: {
      '0': [ -124.0841064453125, -284.74627685546875 ], // Coordenadas
      '1': 70571, // ID del evento
      '2': 'SG0D', // Víctima
      '3': 'GELO E TECO', // Guild de la víctima
      '5': 0,
      '6': true,
      '7': -380.053466796875,
      '8': true,
      '9': 65987,
      '10': 'Francisco159', // Killer
      '11': 'I N T E R B A N K', // Guild del killer
      '12': [ 210, 172, 11, 34, 60, 97, 233, 74, 183, 202, 76, 0, 59, 3, 130, 227 ],
      '13': 255,
      '14': true,
      '15': -1000,
      '16': true,
      '17': true,
      '252': 165 // Event ID
    }
  }
  
  console.log('📋 Datos del evento 165:')
  console.log('Víctima:', event165.parameters['2'], '(' + event165.parameters['3'] + ')')
  console.log('Killer:', event165.parameters['10'], '(' + event165.parameters['11'] + ')')
  console.log('Coordenadas:', event165.parameters['0'])
  console.log('Event ID:', event165.parameters['252'])
  console.log('')

  const deathInfo165 = UniversalDeathDetector.detectDeath(event165, 'event_data')
  if (deathInfo165) {
    console.log('✅ Evento 165 detectado correctamente:')
    console.log('Killer:', deathInfo165.killer?.playerName || 'None', '(' + deathInfo165.killer?.guildName + ')')
    console.log('Víctima:', deathInfo165.victim?.playerName || 'Unknown', '(' + deathInfo165.victim?.guildName + ')')
    console.log('Tipo de muerte:', deathInfo165.deathType)
    console.log('Ubicación:', deathInfo165.location)
    console.log('Información adicional:', deathInfo165.additionalInfo)
    console.log('')
    
    UniversalDeathDetector.processDeathEvent(deathInfo165)
  } else {
    console.log('❌ Evento 165 no detectado')
  }
  console.log('')

  // Probar si es tu muerte (cambiar el nombre de la víctima)
  console.log('🔄 Probando si es tu muerte (cambiar víctima a ZODI28):')
  const event165Self = {
    ...event165,
    parameters: {
      ...event165.parameters,
      '2': 'ZODI28', // Cambiar víctima a tu nombre
      '3': 'Taverna Curupira' // Cambiar guild a tu guild
    }
  }
  
  const deathInfo165Self = UniversalDeathDetector.detectDeath(event165Self, 'event_data')
  if (deathInfo165Self) {
    console.log('✅ Evento 165 (tu muerte) detectado:')
    console.log('Killer:', deathInfo165Self.killer?.playerName || 'None')
    console.log('Víctima:', deathInfo165Self.victim?.playerName || 'Unknown')
    console.log('Tipo de muerte:', deathInfo165Self.deathType)
    console.log('')
    
    UniversalDeathDetector.processDeathEvent(deathInfo165Self)
  } else {
    console.log('❌ Evento 165 (tu muerte) no detectado')
  }
  console.log('')

  console.log('🎯 Prueba del evento 165 completada! Revisa los archivos de log generados.')
}

// Ejecutar las pruebas
testEvent165()
