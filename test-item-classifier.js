const ItemClassifier = require('./src/item-classifier')

console.log('🧪 Probando el clasificador de items...\n')

// Items de prueba
const testItems = [
  { id: 'T1_FARM_CARROT_SEED', name: 'Carrot Seeds' },
  { id: 'T8_2H_AXE', name: "Elder's Great Axe" },
  { id: 'T3_CLOTH_HELMET', name: "Journeyman's Cloth Helmet" },
  { id: 'UNIQUE_ARMOR_FOUNDER_LEATHER_SET', name: 'Founder\'s Leather Armor' },
  { id: 'T6_ARTIFACT_2H_AXE', name: 'Artifact Great Axe' },
  { id: 'T2_FARM_BEAN_SEED', name: 'Bean Seeds' },
  { id: 'T7_2H_TOOL_TRACKING', name: "Grandmaster's Tracking Toolkit" },
  { id: 'T4_FARM_OX_BABY', name: "Adept's Ox Calf" },
  { id: 'T8_PLATE_ARMOR', name: "Elder's Plate Armor" },
  { id: 'T1_CLOTH_SHOES', name: "Novice's Cloth Shoes" },
  { id: 'QUESTITEM_EXP_TOKEN_T1', name: 'Experience Token' },
  { id: 'T6_MOUNT_ARMORED_HORSE', name: 'Armored Horse' },
  { id: 'T3_FARM_WHEAT_SEED', name: 'Wheat Seeds' },
  { id: 'T7_ARTIFACT_2H_STAFF', name: 'Artifact Great Staff' },
  { id: 'T2_LEATHER_ARMOR', name: "Apprentice's Leather Armor" }
]

console.log('📊 Resultados de clasificación:\n')

testItems.forEach(item => {
  const classification = ItemClassifier.getItemValue(item.id, item.name)
  const trashIcon = classification.category === 'trash' ? '🗑️' : '💎'
  const categoryColor = classification.category === 'trash' ? '🔴' : '🟢'
  
  console.log(`${trashIcon} ${categoryColor} ${item.name}`)
  console.log(`   ID: ${item.id}`)
  console.log(`   Categoría: ${classification.category}`)
  console.log(`   Valor: ${classification.value}`)
  console.log(`   Descripción: ${classification.description}`)
  console.log('')
})

console.log('✅ Prueba completada!')
console.log('🗑️ = Basura (trash)')
console.log('💎 = Valioso (valuable)')
