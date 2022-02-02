AFRAME.registerComponent('8thwall-camera-pipeline', {
  init: function() {
    console.log('test')
    if (!window.XR8) return false
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
          let imageData = new ImageData(width, height)
          imageData.data.set(pixels)
          predict(imageData)
        } catch (err) {
          console.log(err)
        }
      },
    })
  },
})


AFRAME.registerComponent('webcam-pipeline', {
  init: function() {
    let constraints = { audio: false, video: { width: 1280, height: 720 } }
    navigator.getUserMedia(constraints,
      function(stream) {
        let video = document.querySelector('video')
        video.srcObject = stream
        video.onloadedmetadata = function(e) {
          video.play()
          video.loaded = true
        }
      },
      function(err) {
        console.log("The following error occured: " + err.name)
      }
    )
  },
  tick: function() {
    let video = document.querySelector('video')
    if (video.loaded) {
      predict(video)
    }
  }
})


async function loadModel() {
  window.model = await handpose.load()
}
loadModel()

async function predict(source) {
  let predictions = await window.model.estimateHands(source)
  if (predictions && predictions.length > 0) {
    console.log(predictions)
  } else {
    console.log('not found')
  }
}


function showHands(predictions) {
  for (let hand of predictions) {
    for (let i = 0; i < hand.landmarks.length; i++) {
      let landmark = hand.landmarks[i]
      let x = landmark[0]
      let y = landmark[1]
      let z = landmark[2]

    }
  }



}


