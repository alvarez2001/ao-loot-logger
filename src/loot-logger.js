const fs = require('fs')
const crypto = require('crypto')
const axios = require('axios')

const Config = require('./config')
const { red, green } = require('./utils/colors')
const formatPlayerName = require('./utils/format-player-name')
const dotenv = require('dotenv')
dotenv.config()

class LootLogger {
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
      'looted_by__alliance',
      'looted_by__guild',
      'looted_by__name',
      'item_id',
      'item_name',
      'quantity',
      'looted_from__alliance',
      'looted_from__guild',
      'looted_from__name'
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

    this.logFileName = `loot-events-${datetime}.txt`
  }

  write({ date, itemId, quantity, itemName, lootedBy, lootedFrom }) {
    if (this.stream == null) {
      this.init()
    }

    if (
      Config.players[this.hash(lootedBy.playerName.toLocaleLowerCase('en-US'))]
    ) {
      return
    }

    const lineData = [
      date.toISOString(),
      lootedBy.allianceName ?? '',
      lootedBy.guildName ?? '',
      lootedBy.playerName,
      itemId,
      itemName,
      quantity,
      lootedFrom.allianceName ?? '',
      lootedFrom.guildName ?? '',
      lootedFrom.playerName
    ]

    const newLoot = {
      timestamp_utc: lineData[0],
      looted_by__alliance: lineData[1],
      looted_by__guild: lineData[2],
      looted_by__name: lineData[3],
      item_id: lineData[4],
      item_name: lineData[5],
      quantity: lineData[6],
      looted_from__alliance: lineData[7],
      looted_from__guild: lineData[8],
      looted_from__name: lineData[9]
    }

    const line = lineData.join(';')

    axios
      .post(`${process.env.API_URL}/api/loot`, newLoot)
      .then((response) => {
        console.log('Loot guardado:', response.data)
      })
      .catch((error) => {
        console.error(
          'Error al guardar loot:',
          error.response?.data || error.message
        )
      })

    this.stream.write(line + '\n')

    console.info(
      this.formatLootLog({
        date,
        lootedBy,
        lootedFrom,
        quantity,
        itemName
      })
    )
  }

  formatLootLog({ date, lootedBy, itemName, lootedFrom, quantity }) {
    const hours = date.getUTCHours().toString().padStart(2, '0')
    const minute = date.getUTCMinutes().toString().padStart(2, '0')
    const seconds = date.getUTCSeconds().toString().padStart(2, '0')

    return `${hours}:${minute}:${seconds} UTC: ${formatPlayerName(
      lootedBy,
      green
    )} looted ${quantity}x ${itemName} from ${formatPlayerName(
      lootedFrom,
      red
    )}.`
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

module.exports = new LootLogger()
