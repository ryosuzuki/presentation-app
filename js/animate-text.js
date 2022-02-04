AFRAME.registerComponent('animate-text', {
  schema: {
    token: { default: '{}', parse: JSON.parse }
  },

  play: function() {
    let info = this.el.getAttribute('animate-text')
    let token = info.token
    let config = {
      el: this.el,
      loop: false,
      scale: [0.5, 0.5],
    }
    let targetTags = ['NN', 'NNP', 'NNS']
    if (targetTags.includes(token.tag)) {
      config.scale[1] = 1
    }
    if (token.ent_type !== '') {
      config.scale[1] = 1
    }
    if (token.is_stop) {
      config.scale[1] = 0.1
    }
    config.posX = [Math.random(), Math.random()]
    config.posY = [Math.random(), Math.random()]
    config.posZ = [-3, -3]
    console.log(config)
    animate(config)
  },
})

function animate(config) {
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
  // console.log(text)
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