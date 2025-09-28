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
      victim_name: lineData[1],
      victim_guild: lineData[2],
      death_type: lineData[3],
      additional_info: lineData[4]
    }

    const line = lineData.join(';')

    // Enviar a API si está configurada
    if (process.env.API_URL) {
      axios
        .post(`${process.env.API_URL}/api/deaths`, deathEvent)
        .then((response) => {
          console.log('Death event guardado:', response.data)
        })
        .catch((error) => {
          console.error(
            'Error al guardar death event:',
            error.response?.data || error.message
          )
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
    } else {
      return `${hours}:${minute}:${seconds} UTC: ${victimName} died (${deathType}).`
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
