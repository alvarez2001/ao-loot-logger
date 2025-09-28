const DeathLogger = require('./src/death-logger')
const EventData = require('./src/data-handler/event-data')

// Función para probar el sistema de detección de muerte
function testDeathDetection() {
  console.log('🧪 Probando sistema de detección de muerte...\n')

  // Simular evento de muerte directo
  const mockDeathEvent = {
    eventCode: 1,
    parameters: [
      null, // parámetro 0
      'PlayerKiller', // killer
      'PlayerVictim', // victim  
      'pvp_death', // tipo de muerte
      100, // x
      200, // y
      'Additional info'
    ]
  }

  console.log('📊 Simulando evento de muerte directo:')
  console.log('Killer:', mockDeathEvent.parameters[1])
  console.log('Victim:', mockDeathEvent.parameters[2])
  console.log('Tipo:', mockDeathEvent.parameters[3])
  console.log('Ubicación:', mockDeathEvent.parameters[4], mockDeathEvent.parameters[5])
  
  try {
    EventData.EvPlayerDeath.handle(mockDeathEvent)
    console.log('✅ Evento de muerte procesado correctamente\n')
  } catch (error) {
    console.error('❌ Error procesando evento de muerte:', error.message)
  }

  // Simular mensaje de chat con muerte
  const mockChatEvent = {
    eventCode: 1,
    parameters: [
      null, // parámetro 0
      'System', // sender
      'PlayerVictim was killed by PlayerKiller', // mensaje
      'system' // canal
    ]
  }

  console.log('💬 Simulando mensaje de chat con muerte:')
  console.log('Mensaje:', mockChatEvent.parameters[2])
  
  try {
    EventData.EvChatMessage.handle(mockChatEvent)
    console.log('✅ Mensaje de chat procesado correctamente\n')
  } catch (error) {
    console.error('❌ Error procesando mensaje de chat:', error.message)
  }

  console.log('🎯 Prueba completada. Revisa los archivos de log generados.')
}

// Ejecutar prueba si se llama directamente
if (require.main === module) {
  testDeathDetection()
}

module.exports = { testDeathDetection }
