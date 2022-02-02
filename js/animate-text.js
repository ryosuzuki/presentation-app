AFRAME.registerComponent('animate-text', {
  play: function() {
    animateText({
      el: this.el,
      translateX: 2,
      scale: 2,
      rotation: 90,
      opacity: 0.2,
      color: '#0ee',
      loop: false,
      // direction: 'reverse',
    })
  },
})


function animateText(config) {
  let defaultConfig = {
    loop: true,
    direction: 'alternate',
    easing: 'easeInOutExpo',
  }
  config = Object.assign(defaultConfig, config)
  let el = config.el
  let pos = el.getAttribute('position')
  let scale = el.getAttribute('scale')
  let rotation = el.getAttribute('rotation')
  let text = {}
  text = el.getAttribute('text-plane') // text
  console.log(text)
  let params = {
    posX: pos.x,
    posY: pos.y,
    posZ: pos.z,
    scaleX: scale.x,
    scaleY: scale.y,
    scaleZ: scale.z,
    rotationX: rotation.x,
    rotationY: rotation.y,
    rotationZ: rotation.z,
    color: text.color,
    opacity: text.opacity,
    letterSpacing: text.letterSpacing
  }
  if (config.translateX) {
    config.posX = params.posX + config.translateX
  }
  if (config.translateY) {
    config.posY = params.posY + config.translateY
  }
  if (config.translateZ) {
    config.posZ = params.posZ + config.translateZ
  }
  if (config.scale) {
    config.scaleX = config.scale
    config.scaleY = config.scale
    config.scaleZ = config.scale
  }
  if (config.rotation) {
    config.rotationZ = config.rotation
  }
  config = Object.assign(config, {
    targets: params,
    update: () => {
      el.setAttribute('position', { x: params.posX, y: params.posY, z: params.posZ })
      el.setAttribute('scale', { x: params.scaleX, y: params.scaleY, z: params.scaleZ })
      el.setAttribute('rotation', { x: params.rotationX, y: params.rotationY, z: params.rotationZ })
      el.setAttribute('text-plane', Object.assign(text, { color: params.color, opacity: params.opacity, letterSpacing: params.letterSpacing }))
    }
  })
  anime(config)
}