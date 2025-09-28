// Script para probar el evento 165 sin API
const UniversalDeathDetector = require('./src/universal-death-detector')
const MemoryStorage = require('./src/storage/memory-storage')

console.log('🧪 Probando evento 165 sin API...\n')

// Simular que eres un jugador específico
MemoryStorage.players.self = MemoryStorage.players.add({
  playerName: 'ZODI28',
  guildName: 'Taverna Curupira'
})

// Evento 165 real
const event165 = {
  eventCode: 1,
  parameters: {
    '0': [ -124.0841064453125, -284.74627685546875 ],
    '1': 70571,
    '2': 'SG0D',
    '3': 'GELO E TECO',
    '5': 0,
    '6': true,
    '7': -380.053466796875,
    '8': true,
    '9': 65987,
    '10': 'Francisco159',
    '11': 'I N T E R B A N K',
    '12': [ 210, 172, 11, 34, 60, 97, 233, 74, 183, 202, 76, 0, 59, 3, 130, 227 ],
    '13': 255,
    '14': true,
    '15': -1000,
    '16': true,
    '17': true,
    '252': 165
  }
}

console.log('📋 Probando evento 165:')
console.log('Víctima:', event165.parameters['2'], '(' + event165.parameters['3'] + ')')
console.log('Killer:', event165.parameters['10'], '(' + event165.parameters['11'] + ')')
console.log('')

// Probar la detección
const deathInfo = UniversalDeathDetector.detectDeath(event165, 'event_data')

if (deathInfo) {
  console.log('✅ Evento 165 DETECTADO:')
  console.log('Killer:', deathInfo.killer?.playerName, '(' + deathInfo.killer?.guildName + ')')
  console.log('Víctima:', deathInfo.victim?.playerName, '(' + deathInfo.victim?.guildName + ')')
  console.log('Tipo:', deathInfo.deathType)
  console.log('Ubicación:', deathInfo.location)
  console.log('')
  
  // Procesar el evento (sin API)
  UniversalDeathDetector.processDeathEvent(deathInfo)
} else {
  console.log('❌ Evento 165 NO DETECTADO')
}

console.log('\n🎯 Prueba completada!')
