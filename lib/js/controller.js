let changes
let last = new Date().getTime()
function addGamePad (e) {
  let gp = navigator.getGamepads()[e.gamepad.index]
  if (gp.buttons.length > 0) {
    console.log("Gamepad connected.")
  }
}
function removeGamePad (e) {
  // tell the user their controller disconnected
  if (controllers[e.index]) {
    console.log('gamepad disconnected')
  }
}
let pressed = false, _default = null, clicked = false
function gameLoop () {
  let gamepads = navigator.getGamepads() ? navigator.getGamepads() : (navigator.webkitGamepads ? navigator.webkitGamepads : [])
  if (gamepads.length > 0) {
    let gamepad = gamepads[1]

    if (gamepad) {
      if (_default === null) _default = gamepad.axes[9] 
      if (gamepad.axes[9] !== changes && !pressed) {
        pressed = true
        if (gamepad.axes[9] <= -1)
          keyPressed(0)
        else if (gamepad.axes[9] < 0) 
          keyPressed(1)
        else if (gamepad.axes[9] > .5)
          keyPressed(2)
        else 
          keyPressed(3)
      }
      if (Math.abs(gamepad.axes[9] - _default) <= .01) 
        pressed = false 
      changes = gamepad.axes[9]

      if (gamepad.buttons[6].pressed && !clicked && callbacks.click) {
        clicked = true 
        callbacks.click()
      } else if (!gamepad.buttons[6].pressed) clicked = false 
    }
  }


  requestAnimationFrame(gameLoop)
}


let lastKey = 0
function keyPressed (k) {
  let now = new Date().getTime()
  // if (now - last > 300 || k === lastKey && now - last > 150) {
    if (k === 0 && callbacks.up)
      callbacks.up()
    else if (k === 1 && callbacks.right) 
      callbacks.right()
    else if (k === 2 && callbacks.left)
      callbacks.left()
    else if (callbacks.down)
      callbacks.down()
    
        
    lastKey = k
  // }

  last = now
}
gameLoop()
window.addEventListener('gamepadconnected', addGamePad)
window.addEventListener('gamepaddisconnected', removeGamePad)

let callbacks = {left: null, right: null, down: null, up: null, click: null}
module.exports = callbacks