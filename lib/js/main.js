require('./renderer.js')
require('./lib/js/init.js')
const run = require('node-cmd')

const controller = require('./lib/js/controller')
const fs = require('fs')
const path = require('path')
let x = 0
let y = 0
let selected = null 
let romlist 

const select_sound = new Audio()
const click_sound = new Audio()
click_sound.src = './lib/content/click.mp3'
select_sound.src = './lib/content/select.mp3'

const roms = []
fs.readdir(process.env.roms_location, (err, files) => {
  if (err) throw err

  files.forEach(file => {
    if (/.*\.(n64|bin|pal|jap|usa|rom|u64|v64|z64)/i.test(file)) {
      // now check if logo exists
      let name = file.split('.')[0]// file.split(/(\s*?\(.*\)\s*?)?\./)[0]
      let logo = './lib/content/icon.png'
      // search after logo image if not found check on google and download, if no internet then default
      // if (fs.existsSync(path.join(process.env.roms_location, 'logos', name)))


      roms.push({file, name, logo})
    }
  })
})

let k = 0
function addroms () {
  romlist = document.querySelector('.romlist')
  let ul = document.createElement('ul')
  ul.classList.add('middle')
  romlist.appendChild(ul)
  for (let rom of roms) {
    let li = document.createElement('li')
    li.classList.add('rom')
    
    let img = document.createElement('img')
    img.alt = rom.name + ' logo'
    img.src = rom.logo

    let a = document.createElement('a')
    a['path-data'] = path.join(process.env.roms_location, rom.file)
    a.innerText = rom.name
    a.onclick = selectRom

    li.appendChild(img)
    li.appendChild(a)

    ul.appendChild(li)

    if (ul.children.length >= 5) {
      k++
      ul = document.createElement('ul')
      if (k === 1)
        ul.classList.add('right')
      romlist.appendChild(ul)
    }
  }
  if (k > 1) // last ul element 
    ul.classList.add('left')

  document.querySelector('.splashscreen').classList.add('hide')
  document.querySelector('.roms').classList.remove('hide')
  document.body.classList.add('main')


  setNavigation()
}


function selectRom () {
  const game_url = this['path-data']

  run.get('project64 ' + game_url, function (e) {
    console.log(e)
  })
}
function setNavigation () {
  controller.up = function () {
    y--
    navigation()
  }
  controller.down = function () {
    y++
    navigation()
  }
  controller.left = function () {
    x--
    navigation()
  }
  controller.right = function () {
    x++
    navigation()
  }
  controller.click = function () {
    if (selected) {
      click_sound.play()
      selected.querySelector('a').click()
    }
  }

  navigation()
}
let oldx = 0, oldy = 0
function navigation () {
  let sections = romlist.children.length
  if (selected) selected.classList.remove('selected')
  if (x >= sections) x = 0
  if (x < 0) x = sections - 1

  let selects = romlist.children[x].children.length
  if (y >= selects) y = selects - 1
  if (y < 0) y = 0

  let right = x + 1
  let left = x - 1
  if (left < 0) left = sections - 1
  if (right > sections - 1) right = 0

  // take care if less then 2
  
  if (x !== oldx || y !== oldy) {
    oldy = y
    select_sound.play()
  }
  if (x !== oldx) {
    if (romlist.children.length < 2) {

    } else {
      document.querySelector('.middle').classList.remove('middle')
      document.querySelector('.left').classList.remove('left')
      document.querySelector('.right').classList.remove('right')

      romlist.children[x].classList.add('middle')
      romlist.children[left].classList.add('left')
      romlist.children[right].classList.add('right')
    }
    oldx = x
  }

  // if (y !== oldy) {
    selected = romlist.children[x].children[y]
    selected.classList.add('selected')
  //   oldy = y
  // }
}


setTimeout(addroms, 100) // 1000*20)