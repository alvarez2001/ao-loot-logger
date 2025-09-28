const UniversalDeathDetector = require('./src/universal-death-detector')
const MemoryStorage = require('./src/storage/memory-storage')

console.log('🔍 Información completa del Killer y Víctima\n')

// Simular que eres un jugador específico
MemoryStorage.players.self = MemoryStorage.players.add({
  playerName: 'ZODI28',
  guildName: 'Taverna Curupira'
})

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

console.log('📋 Datos RAW del evento:')
console.log('Víctima:', event165.parameters['2'])
console.log('Guild Víctima:', event165.parameters['3'])
console.log('Killer:', event165.parameters['10'])
console.log('Guild Killer:', event165.parameters['11'])
console.log('Coordenadas:', event165.parameters['0'])
console.log('')

// Probar la detección
const deathInfo = UniversalDeathDetector.detectDeath(event165, 'event_data')

if (deathInfo) {
  console.log('✅ INFORMACIÓN COMPLETA EXTRAÍDA:')
  console.log('')
  console.log('🔴 KILLER:')
  console.log('  Nombre:', deathInfo.killer?.playerName || 'N/A')
  console.log('  Guild:', deathInfo.killer?.guildName || 'N/A')
  console.log('  Alliance:', deathInfo.killer?.allianceName || 'N/A')
  console.log('')
  console.log('🟡 VÍCTIMA:')
  console.log('  Nombre:', deathInfo.victim?.playerName || 'N/A')
  console.log('  Guild:', deathInfo.victim?.guildName || 'N/A')
  console.log('  Alliance:', deathInfo.victim?.allianceName || 'N/A')
  console.log('')
  console.log('📍 UBICACIÓN:')
  console.log('  X:', deathInfo.location?.x || 'N/A')
  console.log('  Y:', deathInfo.location?.y || 'N/A')
  console.log('')
  console.log('📊 METADATOS:')
  console.log('  Tipo de muerte:', deathInfo.deathType)
  console.log('  Event ID:', deathInfo.eventId)
  console.log('  Event Type:', deathInfo.eventType)
  console.log('  Info adicional:', deathInfo.additionalInfo)
  console.log('')
  
  // Mostrar cómo se guarda en CSV
  console.log('💾 DATOS PARA CSV:')
  const csvData = [
    new Date().toISOString(),
    deathInfo.killer?.allianceName || '',
    deathInfo.killer?.guildName || '',
    deathInfo.killer?.playerName || '',
    deathInfo.victim?.allianceName || '',
    deathInfo.victim?.guildName || '',
    deathInfo.victim?.playerName || '',
    deathInfo.deathType,
    deathInfo.location?.x || '',
    deathInfo.location?.y || '',
    deathInfo.additionalInfo
  ]
  console.log('CSV Line:', csvData.join(';'))
  
} else {
  console.log('❌ No se pudo extraer información del evento')
}

console.log('\n🎯 Análisis completado!')
