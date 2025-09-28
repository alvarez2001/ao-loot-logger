const UniversalDeathDetector = require('./src/universal-death-detector')

console.log('🧪 Verificando detección del evento 165...\n')

// Evento 165 real que proporcionaste
const event165 = {
  eventCode: 1,
  parameters: [
    [ -124.0841064453125, -284.74627685546875 ], // '0': Coordenadas
    70571, // '1': ID del evento
    'SG0D', // '2': Víctima
    'GELO E TECO', // '3': Guild de la víctima
    0, // '5'
    true, // '6'
    -380.053466796875, // '7'
    true, // '8'
    65987, // '9'
    'Francisco159', // '10': Killer
    'I N T E R B A N K', // '11': Guild del killer
    [ 210, 172, 11, 34, 60, 97, 233, 74, 183, 202, 76, 0, 59, 3, 130, 227 ], // '12'
    255, // '13'
    true, // '14'
    -1000, // '15'
    true, // '16'
    true, // '17'
    165 // '252': Event ID
  ]
}

console.log('📋 Datos del evento 165:')
console.log('Víctima:', event165.parameters[2], '(' + event165.parameters[3] + ')')
console.log('Killer:', event165.parameters[10], '(' + event165.parameters[11] + ')')
console.log('Coordenadas:', event165.parameters[0])
console.log('Event ID:', event165.parameters[24])
console.log('')

// Verificar si el evento 165 está en la lista de eventos conocidos
console.log('🔍 Verificando si el evento 165 está registrado:')
console.log('Eventos de muerte conocidos:', Array.from(UniversalDeathDetector.deathEventIds))
console.log('¿Está el 165 registrado?', UniversalDeathDetector.deathEventIds.has(165))
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

console.log('\n🎯 Verificación completada!')
