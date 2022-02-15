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

    this.depth = -15
  }

  componentDidMount() {
    this.speech = new Speech(socket)
    let debug = true
    // debug = false
    if (!debug) {
      this.speech.run()
    } else {
      this.speech.testRun()
    }
  }

  render() {
    return (
      <>
        <Video />
        <a-scene webcam-pipeline>
          <a-camera position="0 0 0" rotation="-45 0 0"></a-camera>
          <a-entity id="hoge" animate-text text-plane="text: test" position="0 -1 -20" class="word"></a-entity>
          <a-entity id="words">
            { this.state.tokens.map((token, i) => {
              if (token.keyword_rank === 0 && token.ent_type === '') return <></>
              let position = { x: Math.random(), y: Math.random(), z: this.depth }
              if (this.state.hands.length > 0) {
                let indexPos = this.state.hands[0].positions[8]
                position = indexPos
              }
              if (token.text.toLowerCase().includes('university of calgary')) {
                token.image = '/images/ucalgary.png'
              }
              if (token.text.toLowerCase().includes('augmented reality interface')) {
                token.image = '/images/ar.png'
              }
              if (token.text.toLowerCase().includes('gestural')) {
                token.image = '/images/gesture.png'
              }
              return (
                <a-entity
                  id={`word-${i}`}
                  key={ i }
                  animate-text={ `token: ${JSON.stringify(token)}` }
                  position={ `${position.x} ${position.y} ${position.z}` }
                  text-plane={ `text: ${token.text}; fontFamily: Ubuntu`}
                >
                  { token.image &&
                    <a-image
                      position='0 -4 0'
                      width="8"
                      height="6"
                      src={token.image}
                      opacity='0.7'
                      animate-image
                    ></a-image>
                  }
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