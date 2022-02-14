import React, { Component } from 'react'
import AFRAME from 'aframe'

class Video extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    AFRAME.registerComponent('8thwall-camera-pipeline', {
      init: function() {
        console.log('test')
        let XR8 = window.XR8
        if (!XR8) return false
        XR8.addCameraPipelineModule(
          XR8.CameraPixelArray.pipelineModule(),
        )
        XR8.addCameraPipelineModule({
          name: 'qrprocess',
          onProcessCpu: ({processGpuResult}) => {
            try {
              window.processGpuResult = processGpuResult
              let width = processGpuResult.camerapixelarray.cols
              let height = processGpuResult.camerapixelarray.rows
              let pixels = processGpuResult.camerapixelarray.pixels
              // let imageData = new ImageData(width, height)
              // imageData.data.set(pixels)
              // predict(imageData)
            } catch (err) {
              console.log(err)
            }
          },
        })
      },
    })

    let constraints = { audio: false, video: { width: 1280, height: 720 } }
    navigator.getUserMedia(constraints,
      (stream) => {
        let video = document.querySelector('video')
        video.srcObject = stream
        // video.style.transform = 'scaleX(-1)'
        video.onloadedmetadata = function(e) {
          video.play()
          video.loaded = true
        }
      },
      (err) => {
        console.log("The following error occured: " + err.name)
      }
    )
  }

  render() {
    return (
      <video id="video"></video>
    )
  }


}

export default Video