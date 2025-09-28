const DeathLogger = require('./src/death-logger')
const MemoryStorage = require('./src/storage/memory-storage')

console.log('🧪 Probando nuevo formato con guilds del killer y víctima...\n')

// Simular jugadores
const killer = MemoryStorage.players.add({
  playerName: 'majorz1',
  guildName: 'CANALHA'
})

const victim = MemoryStorage.players.add({
  playerName: 'zoofila',
  guildName: 'III HASHTAG III'
})

// Crear instancia del logger
const deathLogger = new DeathLogger()

console.log('📋 Datos de prueba:')
console.log('Killer:', killer.playerName, '(' + killer.guildName + ')')
console.log('Víctima:', victim.playerName, '(' + victim.guildName + ')')
console.log('')

// Probar el nuevo formato
console.log('🎯 Nuevo formato de salida:')
deathLogger.write({
  date: new Date(),
  killer: killer,
  victim: victim,
  deathType: 'pvp_death',
  location: { x: -124.08, y: -284.75 },
  additionalInfo: 'Event 165 - Test'
})

console.log('\n✅ Prueba completada!')
console.log('Ahora se muestra: [GUILD_KILLER] killer killed [GUILD_VICTIM] victim')
