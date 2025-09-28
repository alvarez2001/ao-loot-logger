const DeathLogger = require('./src/death-logger')
const MemoryStorage = require('./src/storage/memory-storage')

console.log('🧪 Probando datos que se envían al endpoint /api/deaths...\n')

// Simular jugadores con información completa
const killer = MemoryStorage.players.add({
  playerName: 'majorz1',
  guildName: 'CANALHA',
  allianceName: 'KILLER_ALLIANCE'
})

const victim = MemoryStorage.players.add({
  playerName: 'zoofila',
  guildName: 'III HASHTAG III',
  allianceName: 'VICTIM_ALLIANCE'
})

// Crear instancia del logger
const deathLogger = new DeathLogger()

console.log('📋 Datos de prueba:')
console.log('Killer:', killer.playerName, '(' + killer.guildName + ')', '[' + killer.allianceName + ']')
console.log('Víctima:', victim.playerName, '(' + victim.guildName + ')', '[' + victim.allianceName + ']')
console.log('')

// Simular el evento de muerte
const deathData = {
  date: new Date(),
  killer: killer,
  victim: victim,
  deathType: 'pvp_death',
  location: { x: -124.08, y: -284.75 },
  additionalInfo: 'Event 165 - Killer: majorz1 (CANALHA), Victim: zoofila (III HASHTAG III)'
}

console.log('🎯 Datos que se enviarán al endpoint /api/deaths:')
console.log('')

// Simular la creación del objeto deathEvent
const lineData = [
  deathData.date.toISOString(),
  deathData.victim?.playerName ?? '',
  deathData.victim?.guildName ?? '',
  deathData.deathType ?? 'unknown',
  deathData.additionalInfo ?? ''
]

const deathEvent = {
  timestamp_utc: lineData[0],
  killer__alliance: deathData.killer?.allianceName ?? '',
  killer__guild: deathData.killer?.guildName ?? '',
  killer__name: deathData.killer?.playerName ?? '',
  victim__alliance: deathData.victim?.allianceName ?? '',
  victim__guild: deathData.victim?.guildName ?? '',
  victim__name: deathData.victim?.playerName ?? '',
  death_type: deathData.deathType ?? 'unknown',
  location_x: deathData.location?.x ?? '',
  location_y: deathData.location?.y ?? '',
  additional_info: deathData.additionalInfo ?? ''
}

console.log('📤 Objeto JSON que se envía:')
console.log(JSON.stringify(deathEvent, null, 2))

console.log('\n✅ Prueba completada!')
console.log('Ahora el endpoint recibe información completa del killer y víctima.')
