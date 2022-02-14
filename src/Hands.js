import React, { Component } from 'react'
import AFRAME from 'aframe'
import '@tensorflow/tfjs-backend-webgl'
const handpose = require('@tensorflow-models/handpose');
const THREE = AFRAME.THREE


class Hands extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.loadModel()

    for (let j = 0; j < 2; j++) {
      let handEl = document.querySelector(`#hand-${j}`)
      for (let i = 0; i < 21; i++) {
        let sphereEl = document.createElement('a-sphere')
        sphereEl.setAttribute('radius', 0.03)
        sphereEl.setAttribute('id', `hand-${j}-${i}`)
        handEl.appendChild(sphereEl)
      }
    }

    AFRAME.registerComponent('hands', {
      tick: () => {
        let video = document.querySelector('video')
        if (video.loaded) {
          this.predict(video)
        }
      }
    })
  }

  async loadModel() {
    this.model = await handpose.load()
  }

  async predict(source) {
    if (!this.model) return
    this.predictions = await this.model.estimateHands(source)
    this.showHands(this.predictions)
  }

  hideHands(handId) {
    let handEl = document.querySelector(`#hand-${handId}`)
    if (handEl.hidden) {
      return false
    }
    handEl.hidden = true
    for (let i = 0; i < 21; i++) {
      let sphere = document.querySelector(`#hand-${handId}-${i}`)
      sphere.setAttribute('position', '0 0 0')
    }
  }

  showHands() {
    if (!this.predictions || this.predictions.length === 0) {
      // console.log('not found')
      this.hideHands(0)
      this.hideHands(1)
      return false
    }

    for (let handId = 0; handId < 2; handId++) {
      let hand = this.predictions[handId]
      if (!hand) {
        this.hideHands(handId)
        continue
      }

      let handEl = document.querySelector(`#hand-${handId}`)
      handEl.hidden = false
      for (let i = 0; i < hand.landmarks.length; i++) {
        let landmark = hand.landmarks[i]
        let x = landmark[0]
        let y = landmark[1]
        let z = landmark[2]

        let raycaster = new THREE.Raycaster()
        let pos2D = new THREE.Vector3(
          ( x / window.innerWidth ) * 2 - 1,
          - ( y / window.innerHeight ) * 2 + 1
        )
        let sceneEl = document.querySelector('a-scene')
        let camera = sceneEl.camera
        raycaster.setFromCamera(pos2D, camera)

        let backgroundEl = document.querySelector('#background-plane')
        let background = backgroundEl.object3DMap.mesh
        let intersects = raycaster.intersectObject(background)

        for (let intersect of intersects) {
          let pos = intersect.point
          let sphere = document.querySelector(`#hand-${handId}-${i}`)
          sphere.setAttribute('position', pos)
        }

      }
    }
  }


  render() {
    return (
      <a-entity id="hands" hands>
        <a-entity id="hand-0"></a-entity>
        <a-entity id="hand-1"></a-entity>
      </a-entity>
    )
  }

}

export default Hands