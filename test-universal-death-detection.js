const UniversalDeathDetector = require('./src/universal-death-detector')
const MemoryStorage = require('./src/storage/memory-storage')

console.log('🧪 Probando el detector universal de muerte...\n')

// Simular que eres un jugador específico
MemoryStorage.players.self = MemoryStorage.players.add({
  playerName: 'ZODI28',
  guildName: 'Taverna Curupira'
})

// Función para probar diferentes tipos de eventos de muerte
function testDeathDetection() {
  console.log('📊 Probando diferentes tipos de eventos de muerte:\n')

  // 1. Evento 481 (tu muerte conocida)
  console.log('1️⃣ Probando evento 481 (tu muerte):')
  const event481 = {
    eventCode: 1,
    parameters: {
      '0': 638946784643169770n,
      '1': [ 'ZODI28', 'baianoxy', 'Polasco', 'MajorGuGuinha' ],
      '2': [ 'HUMAN_MALE', 'HUMAN_MALE', 'HUMAN_MALE', 'HUMAN_MALE' ],
      '3': [ 0, 0, 0, 0 ],
      '4': [ 'AVATAR_AJ_CHARACTER_PROGRESSION_01', 'AVATAR_AJ_CHARACTER_PROGRESSION_01', 'AVATAR_AJ_GUILD_01', 'AVATAR_01' ],
      '5': [ 'AVATARRING_AJ_CHARACTER_PROGRESSION_01', 'AVATARRING_AJ_GUILD_01', 'AVATARRING_AJ_CREATURES_01', 'AVATARRING_ANNIVERSARY_2025' ],
      '6': [ 6651, 9086, 6651, 8533 ],
      '7': [ 2, 2, 2, 2 ],
      '8': [ '', '', '', '' ],
      '9': [ 'EQUIPMENT_DATA' ],
      '10': [ 2, 2, 2, 2 ],
      '11': [ 'Taverna Curupira', 'Taverna Curupira', 'Taverna Curupira', 'Taverna Curupira' ],
      '12': [ 933.7150268554688, 819.9907836914062, 1057.4354248046875, 905.7708129882812 ],
      '253': 481,
      '255': 30
    }
  }
  
  const deathInfo481 = UniversalDeathDetector.detectDeath(event481, 'response_data')
  if (deathInfo481) {
    console.log('✅ Evento 481 detectado:', {
      killer: deathInfo481.killer?.playerName || 'None',
      victim: deathInfo481.victim?.playerName || 'Unknown',
      deathType: deathInfo481.deathType,
      eventType: deathInfo481.eventType
    })
    UniversalDeathDetector.processDeathEvent(deathInfo481)
  } else {
    console.log('❌ Evento 481 no detectado')
  }
  console.log('')

  // 2. Evento de chat de muerte
  console.log('2️⃣ Probando evento de chat de muerte:')
  const chatDeathEvent = {
    eventCode: 1,
    parameters: {
      '252': 200, // Event ID de chat
      '1': 'PlayerVictim was killed by PlayerKiller',
      '2': 'system',
      '3': 'global'
    }
  }
  
  const chatDeathInfo = UniversalDeathDetector.detectDeath(chatDeathEvent, 'event_data')
  if (chatDeathInfo) {
    console.log('✅ Chat death detectado:', {
      killer: chatDeathInfo.killer?.playerName || 'None',
      victim: chatDeathInfo.victim?.playerName || 'Unknown',
      deathType: chatDeathInfo.deathType,
      eventType: chatDeathInfo.eventType
    })
    UniversalDeathDetector.processDeathEvent(chatDeathInfo)
  } else {
    console.log('❌ Chat death no detectado')
  }
  console.log('')

  // 3. Evento genérico con nombres de jugadores
  console.log('3️⃣ Probando evento genérico con jugadores:')
  const genericEvent = {
    eventCode: 1,
    parameters: {
      '252': 300, // Event ID desconocido
      '1': 'PlayerKiller',
      '2': 'PlayerVictim',
      '3': 'death',
      '4': 100,
      '5': 200
    }
  }
  
  const genericDeathInfo = UniversalDeathDetector.detectDeath(genericEvent, 'event_data')
  if (genericDeathInfo) {
    console.log('✅ Evento genérico detectado:', {
      killer: genericDeathInfo.killer?.playerName || 'None',
      victim: genericDeathInfo.victim?.playerName || 'Unknown',
      deathType: genericDeathInfo.deathType,
      eventType: genericDeathInfo.eventType
    })
    UniversalDeathDetector.processDeathEvent(genericDeathInfo)
  } else {
    console.log('❌ Evento genérico no detectado')
  }
  console.log('')

  // 4. Evento con array de jugadores
  console.log('4️⃣ Probando evento con array de jugadores:')
  const arrayEvent = {
    eventCode: 1,
    parameters: {
      '252': 400, // Event ID desconocido
      '1': [ 'Player1', 'Player2', 'Player3' ],
      '2': [ 'Guild1', 'Guild2', 'Guild3' ],
      '3': 'death_event'
    }
  }
  
  const arrayDeathInfo = UniversalDeathDetector.detectDeath(arrayEvent, 'event_data')
  if (arrayDeathInfo) {
    console.log('✅ Array death detectado:', {
      killer: arrayDeathInfo.killer?.playerName || 'None',
      victim: arrayDeathInfo.victim?.playerName || 'Unknown',
      deathType: arrayDeathInfo.deathType,
      eventType: arrayDeathInfo.eventType
    })
    UniversalDeathDetector.processDeathEvent(arrayDeathInfo)
  } else {
    console.log('❌ Array death no detectado')
  }
  console.log('')

  // 5. Evento sin muerte (no debería detectar nada)
  console.log('5️⃣ Probando evento sin muerte:')
  const noDeathEvent = {
    eventCode: 1,
    parameters: {
      '252': 500, // Event ID desconocido
      '1': 'item_pickup',
      '2': 'PlayerName',
      '3': 'T4_ARMOR'
    }
  }
  
  const noDeathInfo = UniversalDeathDetector.detectDeath(noDeathEvent, 'event_data')
  if (noDeathInfo) {
    console.log('❌ Falso positivo detectado:', noDeathInfo)
  } else {
    console.log('✅ Correctamente no detectó muerte')
  }
  console.log('')

  console.log('🎯 Prueba completada! Revisa los archivos de log generados.')
}

// Ejecutar las pruebas
testDeathDetection()
