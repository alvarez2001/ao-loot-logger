const fs = require('fs')
const crypto = require('crypto')
const axios = require('axios')

const Config = require('./config')
const { red, green, yellow } = require('./utils/colors')
const formatPlayerName = require('./utils/format-player-name')

class DeathLogger {
  constructor() {
    this.stream = null
    this.logFileName = null

    this.createNewLogFileName()
  }

  init() {
    if (this.stream != null) {
      this.stream.close()
    }

    this.stream = fs.createWriteStream(this.logFileName, { flags: 'a' })

    const header = [
      'timestamp_utc',
      'victim_name',
      'victim_guild',
      'death_type',
      'additional_info'
    ].join(';')

    this.stream.write(header + '\n')

    process.on('exit', () => {
      this.close()
    })
  }

  createNewLogFileName() {
    const d = new Date()

    const datetime = [
      d.getFullYear(),
      d.getMonth() + 1,
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds()
    ]
      .map((n) => n.toString().padStart(2, '0'))
      .join('-')

    this.logFileName = `death-events-${datetime}.txt`
  }

  write({ date, killer, victim, deathType, location, additionalInfo }) {
    if (this.stream == null) {
      this.init()
    }

    const lineData = [
      date.toISOString(),
      victim?.playerName ?? '',
      victim?.guildName ?? '',
      deathType ?? 'unknown',
      additionalInfo ?? ''
    ]

    const deathEvent = {
      timestamp_utc: lineData[0],
      killer__alliance: killer?.allianceName ?? '',
      killer__guild: killer?.guildName ?? '',
      killer__name: killer?.playerName ?? '',
      victim__alliance: victim?.allianceName ?? '',
      victim__guild: victim?.guildName ?? '',
      victim__name: victim?.playerName ?? '',
      death_type: deathType ?? 'unknown',
      additional_info: additionalInfo ?? ''
    }

    const line = lineData.join(';')

    // Enviar a API si está configurada
    if (process.env.API_URL) {
      console.log('📤 Enviando datos al endpoint /api/deaths:')
      console.log(JSON.stringify(deathEvent, null, 2))
      
      axios
        .post(`${process.env.API_URL}/api/deaths`, deathEvent)
        .then((response) => {
          console.log('✅ Death event enviado a API:', response.data)
        })
        .catch((error) => {
          // Solo mostrar error si es un error real, no 404
          if (error.response?.status !== 404) {
            console.error('❌ Error al enviar death event a API:', error.response?.data || error.message)
          } else {
            console.log('ℹ️ API no disponible (404) - continuando sin enviar')
          }
        })
    }

    this.stream.write(line + '\n')

    console.info(
      this.formatDeathLog({
        date,
        killer,
        victim,
        deathType
      })
    )
  }

  formatDeathLog({ date, killer, victim, deathType }) {
    const hours = date.getUTCHours().toString().padStart(2, '0')
    const minute = date.getUTCMinutes().toString().padStart(2, '0')
    const seconds = date.getUTCSeconds().toString().padStart(2, '0')

    const victimName = victim ? formatPlayerName(victim, yellow) : 'Unknown'

    if (deathType === 'self_death') {
      return `${hours}:${minute}:${seconds} UTC: 💀💀💀 YOU DIED: ${victimName} (${victim?.guildName || 'No Guild'})`
    } else if (deathType === 'pvp_death' && killer) {
      const killerName = formatPlayerName(killer, red)
      const killerGuild = killer?.guildName ? `[${killer.guildName}] ` : ''
      const victimGuild = victim?.guildName ? `[${victim.guildName}] ` : ''
      return `${hours}:${minute}:${seconds} UTC: ⚔️ ${killerGuild}${killerName} killed ${victimGuild}${victimName}`
    } else if (deathType === 'other_death') {
      return `${hours}:${minute}:${seconds} UTC: 💀 ${victimName} died (${victim?.guildName || 'No Guild'})`
    } else {
      return `${hours}:${minute}:${seconds} UTC: 💀 ${victimName} died (${deathType})`
    }
  }

  close() {
    if (this.stream != null) {
      this.stream.close()
    }

    this.stream = null
  }

  hash(value) {
    const hash = crypto.createHash('sha256')
    hash.update(value)
    return hash.digest('hex')
  }
}

module.exports = new DeathLogger()
