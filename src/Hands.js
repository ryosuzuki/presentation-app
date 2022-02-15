import React, { Component } from 'react'
import AFRAME from 'aframe'
import '@tensorflow/tfjs-backend-webgl'
const handpose = require('@tensorflow-models/handpose');
const THREE = AFRAME.THREE


class Hands extends Component {
  constructor(props) {
    super(props)
    window.Hands = this
    this.App = window.App
  }

  componentDidMount() {
    this.loadModel()

    AFRAME.registerComponent('hands-update', {
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
    let hands = await this.model.estimateHands(source)

    hands = hands.map((hand) => {
      hand.positions = hand.landmarks.map((landmark) => {
        let pos = this.getPosition(landmark)
        return pos
      })
      return hand
    })

    this.App.setState({ hands: hands })
  }

  getPosition(landmark) {
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
    let pos = { x: 0, y: 0, z: 0 }
    for (let intersect of intersects) {
      pos = intersect.point
    }
    return pos
  }


  render() {
    return (
      <a-entity id="hands" hands-update>
        { this.App.state.hands.map((hand, i) => {
          return (
            <a-entity id={`hand-${i}`} key={ i }>
              { hand.positions.map((position, j) => {
                return (
                  <a-sphere
                    id={`hand-${i}-${j}`}
                    key={ j }
                    radius="0.1"
                    position={ `${position.x} ${position.y} ${position.z}` }
                  ></a-sphere>
                )
              }) }
            </a-entity>
          )
        })}
      </a-entity>
    )
  }

}

export default Hands