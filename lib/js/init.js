
const fs = require('fs')
const path = require('path')
// const roms_location =

const conftxt = fs.readFileSync('./config.env', 'utf8').split(/\n/)
for (let c of conftxt) {
  let s = c.split('=')
  process.env[s[0]] = s[1]
}