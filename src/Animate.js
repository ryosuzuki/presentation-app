import React, { Component } from 'react'
import AFRAME from 'aframe'
import anime from 'animejs/lib/anime.es.js'

class Animate extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
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
          scale: 0.2,
        }

        config.backgroundColor = '#FEB07C'

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
        config.posX = Math.random()
        config.posY = Math.random()
        config.posZ = -3
        console.log(config)

        this.animate([config, {
          el: this.el,
          opacity: 0,
        }])

      },

      animate(configs) {
        let defaultConfig = {
          loop: false,
          direction: 'alternate',
          easing: 'easeInOutExpo',
          duration: 2000
        }

        let timeline = anime.timeline(defaultConfig)

        for (let config of configs) {
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
            letterSpacing: text.letterSpacing,
            backgroundColor: text.backgroundColor,
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

        // anime(config)
        // return config
      }


    })
  }


  render() {
    return (
      <></>
    )
  }
}

export default Animate