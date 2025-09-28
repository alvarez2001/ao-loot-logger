class ItemClassifier {
  constructor() {
    this.trashPatterns = [
      // Items de tier muy bajo
      /^T1_/,
      /^T2_/,
      
      // Items de semillas y farming básico
      /_SEED$/,
      /_BABY$/,
      /_GROWN$/,
      
      // Items de herramientas básicas
      /_TOOL_/,
      /_PICKAXE$/,
      /_AXE$/,
      /_HAMMER$/,
      /_SCYTHE$/,
      /_FISHING/,
      
      // Items de comida básica
      /_BREAD$/,
      /_CARROT$/,
      /_BEAN$/,
      /_WHEAT$/,
      /_TURNIP$/,
      /_CABBAGE$/,
      /_POTATO$/,
      /_CORN$/,
      /_PUMPKIN$/,
      
      // Items de recursos básicos
      /_FIBER$/,
      /_HIDE$/,
      /_ORE$/,
      /_ROCK$/,
      /_WOOD$/,
      /_STONE$/,
      /_CLOTH$/,
      /_LEATHER$/,
      /_METALBAR$/,
      /_PLANKS$/,
      
      // Items de monturas básicas
      /_OX$/,
      /_HORSE$/,
      /_MULE$/,
      
      // Items de quest
      /QUESTITEM/,
      /QUEST_/,
      
      // Items de eventos especiales (generalmente no valiosos)
      /_ANNIVERSARY/,
      /_HALLOWEEN/,
      /_CHRISTMAS/,
      
      // Items de calidad muy baja
      /_NORMAL$/,
      /_GOOD$/,
      
      // Items específicos conocidos como basura
      /_TRASH$/,
      /_JUNK$/,
      /_SCRAP$/,
      
      // Items de construcción básica
      /_CONSTRUCTION/,
      /_BUILDING/,
      
      // Items de consumibles básicos
      /_POTION_BASIC/,
      /_FOOD_BASIC/,
      
      // Items de armadura muy básica
      /_CLOTH_HELMET_T1/,
      /_CLOTH_ARMOR_T1/,
      /_CLOTH_SHOES_T1/,
      /_LEATHER_HELMET_T1/,
      /_LEATHER_ARMOR_T1/,
      /_LEATHER_SHOES_T1/,
      /_PLATE_HELMET_T1/,
      /_PLATE_ARMOR_T1/,
      /_PLATE_SHOES_T1/,
      
      // Items de armas muy básicas
      /_SWORD_T1/,
      /_AXE_T1/,
      /_HAMMER_T1/,
      /_SPEAR_T1/,
      /_BOW_T1/,
      /_CROSSBOW_T1/,
      /_STAFF_T1/,
      /_WAND_T1/,
      /_SHIELD_T1/,
      /_TORCH_T1/
    ]
    
    this.valuablePatterns = [
      // Items de tier alto
      /^T6_/,
      /^T7_/,
      /^T8_/,
      
      // Items únicos
      /UNIQUE_/,
      /ARTIFACT_/,
      
      // Items de calidad alta
      /_EXCELLENT$/,
      /_OUTSTANDING$/,
      /_MASTERPIECE$/,
      
      // Items de monturas especiales
      /_MOUNT_/,
      /_RIDING/,
      
      // Items de recursos refinados
      /_REFINED/,
      /_PROCESSED/,
      
      // Items de equipamiento de tier alto
      /_T6_/,
      /_T7_/,
      /_T8_/,
      
      // Items de consumibles valiosos
      /_POTION_MAJOR/,
      /_FOOD_MAJOR/,
      
      // Items de artefactos
      /_ARTIFACT/,
      /_RELIC/,
      
      // Items de eventos especiales valiosos
      /_LEGENDARY/,
      /_EPIC/,
      /_RARE/
    ]
  }

  isTrash(itemId, itemName) {
    // Verificar patrones de basura
    for (const pattern of this.trashPatterns) {
      if (pattern.test(itemId) || pattern.test(itemName)) {
        return true
      }
    }
    
    // Verificar patrones valiosos
    for (const pattern of this.valuablePatterns) {
      if (pattern.test(itemId) || pattern.test(itemName)) {
        return false
      }
    }
    
    // Si no coincide con ningún patrón, considerar como basura por defecto
    return true
  }

  classifyItem(itemId, itemName) {
    if (this.isTrash(itemId, itemName)) {
      return 'trash'
    } else {
      return 'valuable'
    }
  }

  getItemValue(itemId, itemName) {
    const classification = this.classifyItem(itemId, itemName)
    
    if (classification === 'trash') {
      return {
        category: 'trash',
        value: 'low',
        description: 'Item considerado basura'
      }
    } else {
      return {
        category: 'valuable',
        value: 'high',
        description: 'Item considerado valioso'
      }
    }
  }
}

module.exports = new ItemClassifier()
