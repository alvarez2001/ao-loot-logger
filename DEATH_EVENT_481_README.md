# Evento de Muerte Específico - ID 481

## Descripción

Este documento describe el evento de muerte específico encontrado en Albion Online con ID `481` que se procesa en `handleResponseData`.

## Estructura del Evento

```javascript
{
  eventCode: 1,
  parameters: {
    '0': 638946776887391003n,        // Player ID
    '1': [ 'CrimsonBulevar' ],        // Nombre del personaje
    '2': [ 'HUMAN_MALE' ],            // Género/Raza
    '3': [ 0 ],                       // Parámetro desconocido
    '4': [ 'AVATAR_06' ],             // Avatar/Modelo
    '5': [ 'RING1' ],                 // Tipo de item
    '6': [ 6294 ],                    // Item ID
    '7': [ 4 ],                       // Quality del item
    '8': [ '' ],                      // Parámetro vacío
    '9': [ 'JSON_EQUIPMENT_DATA' ],    // Equipamiento completo (JSON)
    '10': [ 2 ],                      // Tier/Nivel
    '11': [ 'Santos Permuta' ],       // Guild del personaje
    '12': [ 271.1999816894531 ],      // Posición X
    '13': [ [Array] ],                // Posición Y (array)
    '14': [ [Array] ],                // Parámetros adicionales
    '15': [ [Array] ],                // Parámetros adicionales
    '16': [ [Array] ],                // Parámetros adicionales
    '17': [ [Array] ],                // Parámetros adicionales
    '18': [ [Array] ],                // Parámetros adicionales
    '253': 481,                       // Event ID
    '255': 46                         // Parámetro adicional
  }
}
```

## Información Extraída

### Datos del Personaje
- **Nombre**: `parameters[1][0]` - Nombre del personaje que murió
- **Guild**: `parameters[11][0]` - Guild del personaje
- **Player ID**: `parameters[0]` - ID único del personaje

### Ubicación
- **Posición X**: `parameters[12][0]` - Coordenada X de la muerte
- **Posición Y**: `parameters[13][0]` - Coordenada Y de la muerte

### Equipamiento
- **Item ID**: `parameters[6][0]` - ID del item principal
- **Quality**: `parameters[7][0]` - Calidad del item
- **Tier**: `parameters[10][0]` - Tier del personaje
- **Equipamiento Completo**: `parameters[9][0]` - JSON con todo el equipamiento

### Información Adicional
- **Género/Raza**: `parameters[2][0]` - HUMAN_MALE, etc.
- **Avatar**: `parameters[4][0]` - Modelo del personaje
- **Tipo de Item**: `parameters[5][0]` - RING1, etc.

## Parser Implementado

El parser `OpPlayerDeath` extrae la siguiente información:

```javascript
{
  victim: {
    playerName: 'CrimsonBulevar',
    guildName: 'Santos Permuta'
  },
  killer: null, // No disponible en este evento
  deathType: 'player_death',
  location: {
    x: 271.1999816894531,
    y: null // Necesita ser extraído de parameters[13]
  },
  additionalInfo: 'PlayerID: 638946776887391003 | ItemID: 6294 | Quality: 4 | Tier: 2 | Equipment: [JSON]'
}
```

## Log Generado

El evento genera un log con el siguiente formato:

```
timestamp_utc;killer__alliance;killer__guild;killer__name;victim__alliance;victim__guild;victim__name;death_type;location_x;location_y;additional_info
2024-09-28T17:34:48.218Z;;;;Santos Permuta;CrimsonBulevar;player_death;271.1999816894531;;PlayerID: 638946776887391003 | ItemID: 6294 | Quality: 4 | Tier: 2 | Equipment: [JSON]
```

## Salida en Consola

```
💀 Death detected: CrimsonBulevar (Santos Permuta) at (271.1999816894531, ?)
14:34:48 UTC: CrimsonBulevar died (player_death).
```

## Configuración

Para capturar este evento específico:

1. **Habilitar logging de eventos no procesados:**
   ```env
   LOG_UNPROCESSED=1
   ```

2. **El evento se captura automáticamente** cuando:
   - `event.parameters[253] === 481`
   - Se procesa en `handleResponseData`

## Limitaciones

1. **No hay información del killer** en este evento
2. **La posición Y** necesita ser extraída correctamente de `parameters[13]`
3. **Solo captura la muerte del personaje**, no quién lo mató
4. **El equipamiento** está en formato JSON y puede necesitar parsing adicional

## Mejoras Futuras

1. **Extraer posición Y** correctamente
2. **Parsear equipamiento JSON** para información más detallada
3. **Buscar eventos relacionados** que puedan contener información del killer
4. **Integrar con eventos de chat** para obtener contexto adicional

## Pruebas

Ejecutar el script de prueba:
```bash
node test-specific-death.js
```

Este script simula el evento exacto encontrado y verifica que el parser funcione correctamente.
