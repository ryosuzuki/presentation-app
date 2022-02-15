import React, { Component } from 'react'
import AFRAME from 'aframe'
import anime from 'animejs/lib/anime.es.js'

class Animate extends Component {
  constructor(props) {
    super(props)

    this.App = window.App
  }

  componentDidMount() {
    AFRAME.registerComponent('animate-image', {
      play: function() {
        let configs = [
          { scale: 0.8 },
          { scale: 1.2 },
          { scale: 1.2, opacity: 0 }
        ]
        configs[0].duration = 0
        animate(this.el, configs)
      }
    })

    let i = 0
    AFRAME.registerComponent('animate-text', {
      schema: {
        token: { default: '{}', parse: JSON.parse }
      },

      play: function() {
        let info = this.el.getAttribute('animate-text')
        let token = info.token

        let backgrounds = [
          '#62A6BF',
          '#E18AAA',
          '#B1C294'
        ]
        let background = backgrounds[0]
        i++
        if (i >= backgrounds.length) {
          i = 0
        }

        let configs = [
          { scale: 0.8, backgroundColor: background },
          { scale: 1.2, backgroundColor: background },
          { scale: 1.2, backgroundColor: background, opacity: 0 },
        ]
        /*
        let targetTags = ['NN', 'NNP', 'NNS']
        if (targetTags.includes(token.tag)) {
          config.scale[1] = 0.2
          config.backgroundColor = ['#FEB07C', '#FEB07C']
        }
        if (token.ent_type !== '') {
          config.scale[1] = 0.2
          config.backgroundColor = ['#B8D1C0', '#B8D1C0']
        }
        if (token.is_stop) {
          config.scale[1] = 0.2
        }
        */
        // configs[0].posX = Math.random()
        // configs[0].posY = Math.random()
        configs[0].duration = 0
        console.log(info)
        if (token && token.text.toLowerCase().includes('augmented presentation')) {
          console.log('jfoejofjewo')
          configs[1].duration = 10000
          return
        }

        if (token && token.text.toLowerCase().includes('features')) {
          configs[1].duration = 10000
        }

        animate(this.el, configs)
      },

    })
  }


  render() {
    return (
      <></>
    )
  }
}


function animate(el, configs) {
  let defaultConfig = {
    loop: false,
    // direction: 'alternate',
    // easing: 'easeInOutExpo',
    duration: 2000
  }

  let timeline = anime.timeline(defaultConfig)

  for (let config of configs) {
    let pos = el.getAttribute('position')
    let scale = el.getAttribute('scale')
    let rotation = el.getAttribute('rotation')
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
    }
    let text = el.getAttribute('text-plane') // text
    if (!text) text = {}
    if (text.color) {
      params.color = text.color
    }
    if (text.opacity) {
      params.opacity = text.opacity
    }
    if (text.letterSpacing) {
      params.letterSpacing = text.letterSpacing
    }
    if (text.backgroundColor) {
      params.backgroundColor = text.backgroundColor
    }
    let opacity = el.getAttribute('opacity') // image opacity
    if (opacity) {
      params.opacity = opacity
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
        el.setAttribute('position', {
          x: params.posX,
          y: params.posY,
          z: params.posZ
        })
        el.setAttribute('scale', {
          x: params.scaleX,
          y: params.scaleY,
          z: params.scaleZ
        })
        el.setAttribute('rotation', {
          x: params.rotationX,
          y: params.rotationY,
          z: params.rotationZ
        })
        el.setAttribute('opacity',
          params.opacity
        )
        el.setAttribute('text-plane', Object.assign(text, {
          color: params.color,
          opacity: params.opacity,
          letterSpacing: params.letterSpacing,
          backgroundColor: params.backgroundColor
        }))
      }
    })

    timeline.add(config)
  }
  console.log(timeline)

  // anime(config)
  // return config
}


export default Animate