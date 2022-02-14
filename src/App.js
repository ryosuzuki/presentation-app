import React, { Component } from 'react'
import './App.css';

import AFRAME from 'aframe'
// import 'aframe-react'
import 'aframe-text-plane'

import Video from './Video.js'
import Speech from './Speech.js'
import Hands from './Hands.js'
import Animate from './Animate.js'

import { io } from 'socket.io-client'
import { getSpaceUntilMaxLength } from '@testing-library/user-event/dist/utils';
const socket = io('http://localhost:4000/');

class App extends Component {
  constructor(props) {
    super(props)
    window.App = this

    this.state = {
      hands: [],
      tokens: []
    }

    this.depth = -10
  }

  componentDidMount() {
    this.speech = new Speech(socket)
    this.speech.run()
    // this.speech.testRun()

    let debug = true
    debug = false

    socket.on('message', (data) => {
      let json = JSON.parse(data)
      console.log(json)

      if (!debug) {
        this.setState({ tokens: json.tokens })
      } else {
        let i = 1
        setInterval(() => {
          let current = Object.assign({}, json)
          current.tokens = current.tokens.slice(0, i)
          this.setState({ tokens: current.tokens })
          i++
        }, 800)
      }
    })
  }

  render() {
    return (
      <>
        <Video />
        <a-scene webcam-pipeline>
          <a-camera position="0 0 0" rotation="-45 0 0"></a-camera>
          <a-entity id="hoge" animate-text text-plane="text: test" position="0 -1 -3" class="word"></a-entity>
          <a-entity id="words">
            { this.state.tokens.map((token, i) => {
              if (token.keyword_rank === 0 && token.ent_type === '') return <></>
              let position = { x: Math.random(), y: Math.random(), z: this.depth }
              if (this.state.hands.length > 0) {
                let indexPos = this.state.hands[0].positions[8]
                position = indexPos
              }
              return (
                <a-entity
                  id={`word-${i}`}
                  key={ i }
                  animate-text={{ token: JSON.stringify(token) }}
                  position={ `${position.x} ${position.y} ${position.z}` }
                  text-plane={ `text: ${token.text}; fontFamily: Ubuntu`}
                >
                </a-entity>
              )
            })}
          </a-entity>
          <a-plane
            id="background-plane"
            width="1000"
            height="1000"
            material="transparent: true; opacity: 0.1"
            position={ `0 0 ${this.depth}` }
          ></a-plane>
          <Hands />
          <Animate />
        </a-scene>
      </>
    )
  }

}

export default App