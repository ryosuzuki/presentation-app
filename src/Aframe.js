import React, { Component } from 'react'

import AFRAME from 'aframe'
// import 'aframe-react'

import Speech from './Speech.js'
import Video from './Video.js'
import Hands from './Hands.js'

import { io } from 'socket.io-client'
import { getSpaceUntilMaxLength } from '@testing-library/user-event/dist/utils';

const socket = io('http://localhost:4000/');

class Aframe extends Component {
  constructor(props) {
    super(props)
    window.App = this
  }

  componentDidMount() {
    const socket = io()
    let debug = true
    debug = false

    this.speech = new Speech(socket)
    this.speech.testRun()

    if (!debug) {
      socket.on('message', (data) => {
        let json = JSON.parse(data)
        console.log(json)
        this.showText(json)
      })
    } else {
      let text = "Hi, my name is Adnan Karim. I am a graduate student at the University of Calgary in the Department of Computer Science. Today, I want to talk about Real-time Augmented Presentation. As you can see when I talk about something, we can augment presentation using an augmented reality interface. We have several features, such as live kinetic typography, embedded icons, embedded visuals, as well as an embedded annotation to a physical object. All components are interactive with gestural interactions. And most importantly all animations happen in real-time. This means that no video editing or programming is required. Thus it can significantly reduce the time and efforts of making such an augmented presentation, but also expands the tremendous potential for real-time live presentations like classroom lectures. We believe these techniques can make the presentation more expressive and engaging. In this talk, I want to describe how we designed such a system and introduce a new system to describe how we implemented this demo."
      // text = text.replaceAll('.', '')
      // text = text.replaceAll(',', '')
      socket.emit('message', text)
      socket.on('message', (data) => {
        let json = JSON.parse(data)
        window.json = json
        let i = 1
        setInterval(() => {
          let current = Object.assign({}, json)
          current.tokens = current.tokens.slice(0, i)
          this.showText(current)
          i++
        }, 800)
      })
    }
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
        </a-scene>
      </>
    )
  }

}

export default Aframe