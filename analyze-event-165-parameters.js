// Script para analizar todos los parámetros del evento 165
const UniversalDeathDetector = require('./src/universal-death-detector')

console.log('🔍 Analizando todos los parámetros del evento 165...\n')

// Evento 165 real que proporcionaste
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

console.log('📋 Todos los parámetros del evento 165:')
console.log('')

Object.keys(event165.parameters).forEach(key => {
  const value = event165.parameters[key]
  const type = typeof value
  const preview = type === 'string' ? value : 
                  type === 'object' ? JSON.stringify(value) : 
                  String(value)
  
  console.log(`  ${key}: ${preview} (${type})`)
})

console.log('')
console.log('🎯 Información conocida:')
console.log('Víctima:', event165.parameters['2'], '(' + event165.parameters['3'] + ')')
console.log('Killer:', event165.parameters['10'], '(' + event165.parameters['11'] + ')')
console.log('')

console.log('❓ ¿Dónde podría estar la información de alianza?')
console.log('Los parámetros que podrían contener alianzas:')
Object.keys(event165.parameters).forEach(key => {
  const value = event165.parameters[key]
  if (typeof value === 'string' && value.length > 0) {
    console.log(`  ${key}: "${value}"`)
  }
})

console.log('\n🔍 Análisis completado!')
