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
      predictions: []
    }

  }

  componentDidMount() {
    this.speech = new Speech(socket)
    this.speech.testRun()

    let debug = true

    socket.on('message', (data) => {
      let json = JSON.parse(data)
      console.log(json)

      if (!debug) {
        this.showText(json)
      } else {
        let i = 1
        setInterval(() => {
          let current = Object.assign({}, json)
          current.tokens = current.tokens.slice(0, i)
          // console.log(current)
          this.showText(current)
          i++
        }, 800)
      }
    })
  }

  showText(json) {
    let tokens = json.tokens

    let pos = { x: -6, y: 0, z: -3}
    let len = 0
    let width = 0
    let words = document.querySelector('a-entity#words')
    /*
    for (let i = tokens.length + 1; i < tokens.length + 10; i++) {
      let el = document.querySelector(`a-entity#word-${i}`)
      if (el) {
        words.removeChild(el)
      }
    }
    */

    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i];
      let word = token.text

      // console.log(token.keyword_rank)
      if (token.keyword_rank === 0 && token.ent_type === '') {
        continue
      }

      pos.x += width
      width = word.length/4
      pos.x += width
      let el = document.querySelector(`a-entity#word-${i}`)
      if (!el) {
        el = document.createElement('a-entity')
        el.setAttribute('id', `word-${i}`)
        el.setAttribute('animate-text', 'token', JSON.stringify(token))
        words.appendChild(el)
      }
      el.setAttribute('text-plane', `text: ${word}`)
    }
  }

  render() {
    return (
      <>
        <Video />
        <a-scene webcam-pipeline>
          <a-camera position="0 0 0" rotation="-45 0 0"></a-camera>
          <a-entity id="hoge" animate-text text-plane="text: test" position="0 -1 -3" class="word"></a-entity>
          <a-entity id="words"></a-entity>
          <a-plane id="background-plane" width="1000" height="1000" material="transparent: true; opacity: 0.1" position="0 0 -3"></a-plane>
          <Hands />
          <Animate />
        </a-scene>
      </>
    )
  }

}

export default App