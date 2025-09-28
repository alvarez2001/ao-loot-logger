# Sistema de Detección de Eventos de Muerte

## Descripción

Este sistema permite capturar y registrar eventos de muerte en Albion Online, incluyendo:

- **Muertes directas**: Eventos específicos de muerte de jugadores
- **Mensajes de chat**: Detección de muertes a través de mensajes del sistema
- **Información detallada**: Killer, víctima, tipo de muerte, ubicación, etc.

## Archivos Creados

### 1. `src/death-logger.js`
Logger específico para eventos de muerte que:
- Crea archivos de log con formato CSV
- Envía datos a API externa (si está configurada)
- Muestra información en consola con colores

### 2. `src/data-handler/event-data/ev-player-death.js`
Parser para eventos directos de muerte que:
- Extrae información del killer y víctima
- Detecta tipo de muerte y ubicación
- Maneja diferentes estructuras de eventos

### 3. `src/data-handler/event-data/ev-chat-message.js`
Parser para mensajes de chat que:
- Detecta patrones de muerte en mensajes
- Extrae killer y víctima del texto
- Procesa diferentes formatos de mensajes

### 4. Modificaciones en `src/data-handler/data-handler.js`
- Detección automática de eventos de muerte
- Análisis de patrones en eventos no procesados
- Integración con los nuevos parsers

## Configuración

### Variables de Entorno

Crear archivo `.env`:
```env
LOG_UNPROCESSED=1
API_URL=http://localhost:5000
```

### Habilitar Detección

El sistema está configurado para detectar automáticamente eventos de muerte cuando:
- `LOG_UNPROCESSED=1` está habilitado
- Se detectan patrones de muerte en eventos no procesados
- Se encuentran mensajes de chat con información de muerte

## Uso

### 1. Ejecutar con Detección de Muerte
```bash
# Con variables de entorno
LOG_UNPROCESSED=1 node src/index.js

# O usando archivo .env
node src/index.js
```

### 2. Archivos de Log Generados
- `death-events-YYYY-MM-DD-HH-MM-SS.txt`: Log de eventos de muerte
- Formato CSV con columnas:
  - timestamp_utc
  - killer__alliance, killer__guild, killer__name
  - victim__alliance, victim__guild, victim__name
  - death_type, location_x, location_y
  - additional_info

### 3. Salida en Consola
```
14:30:25 UTC: PlayerVictim died (pvp_death) killed by PlayerKiller.
```

## Patrones Detectados

### Eventos de Muerte Directos
- Eventos con IDs específicos de muerte
- Parámetros que contienen información de killer/víctima
- Datos de ubicación y tipo de muerte

### Mensajes de Chat
- `PlayerName was killed by KillerName`
- `PlayerName died`
- `PlayerName has been defeated by KillerName`
- `PlayerName was defeated`
- `PlayerName fell in battle`
- `PlayerName was slain by KillerName`

## API Integration

Si `API_URL` está configurada, los eventos de muerte se envían a:
```
POST {API_URL}/api/deaths
```

Con el siguiente formato:
```json
{
  "timestamp_utc": "2024-01-01T14:30:25.000Z",
  "killer__alliance": "AllianceName",
  "killer__guild": "GuildName", 
  "killer__name": "PlayerKiller",
  "victim__alliance": "VictimAlliance",
  "victim__guild": "VictimGuild",
  "victim__name": "PlayerVictim",
  "death_type": "pvp_death",
  "location_x": 100,
  "location_y": 200,
  "additional_info": "Additional context"
}
```

## Pruebas

Ejecutar el script de prueba:
```bash
node test-death-detection.js
```

Este script simula eventos de muerte y verifica que el sistema funcione correctamente.

## Limitaciones

1. **Eventos Encriptados**: Algunos paquetes pueden estar encriptados y no ser procesados
2. **Patrones Limitados**: Solo detecta patrones conocidos de muerte
3. **Datos Raw**: Los eventos no procesados pueden requerir análisis manual
4. **Términos de Servicio**: Verificar que el uso cumple con los ToS de Albion Online

## Desarrollo Futuro

- Agregar más patrones de detección
- Mejorar parsing de eventos específicos
- Integrar con sistemas de análisis de datos
- Agregar filtros y configuraciones avanzadas
