const UniversalDeathDetector = require('./src/universal-death-detector')
const MemoryStorage = require('./src/storage/memory-storage')

console.log('🧪 Probando el evento 165 con formato correcto...\n')

// Simular que eres un jugador específico
MemoryStorage.players.self = MemoryStorage.players.add({
  playerName: 'ZODI28',
  guildName: 'Taverna Curupira'
})

// Evento 165 con el formato REAL que estás viendo en los logs
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

console.log('📋 Datos del evento 165 (formato real):')
console.log('Víctima:', event165.parameters['2'], '(' + event165.parameters['3'] + ')')
console.log('Killer:', event165.parameters['10'], '(' + event165.parameters['11'] + ')')
console.log('Coordenadas:', event165.parameters['0'])
console.log('Event ID:', event165.parameters['252'])
console.log('')

// Probar la detección
console.log('🎯 Probando detección:')
const deathInfo = UniversalDeathDetector.detectDeath(event165, 'event_data')

if (deathInfo) {
  console.log('✅ Evento 165 DETECTADO correctamente:')
  console.log('Killer:', deathInfo.killer?.playerName || 'None', '(' + deathInfo.killer?.guildName + ')')
  console.log('Víctima:', deathInfo.victim?.playerName || 'Unknown', '(' + deathInfo.victim?.guildName + ')')
  console.log('Tipo de muerte:', deathInfo.deathType)
  console.log('Ubicación:', deathInfo.location)
  console.log('Event ID:', deathInfo.eventId)
  console.log('')
  
  // Procesar el evento
  UniversalDeathDetector.processDeathEvent(deathInfo)
} else {
  console.log('❌ Evento 165 NO DETECTADO')
}

console.log('\n🎯 Prueba completada!')
