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

AFRAME.registerComponent('webcam-pipeline', {
  init: function() {
    loadModel()
    let constraints = { audio: false, video: { width: 1280, height: 720 } }
    navigator.getUserMedia(constraints,
      function(stream) {
        let video = document.querySelector('video')
        video.srcObject = stream
        // video.style.transform = 'scaleX(-1)'
        video.onloadedmetadata = function(e) {
          video.play()
          video.loaded = true
        }
      },
      function(err) {
        console.log("The following error occured: " + err.name)
      }
    )

    for (let j = 0; j < 2; j++) {
      let handEl = document.querySelector(`#hand-${j}`)
      for (let i = 0; i < 21; i++) {
        let sphereEl = document.createElement('a-sphere')
        sphereEl.setAttribute('radius', 0.03)
        sphereEl.setAttribute('id', `hand-${j}-${i}`)
        handEl.appendChild(sphereEl)
      }
    }
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

async function predict(source) {
  if (!window.model) return
  let predictions = await window.model.estimateHands(source)
  showHands(predictions)
}


function hideHands(handId) {
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

function showHands(predictions) {
  if (!predictions || predictions.length === 0) {
    console.log('not found')
    hideHands(0)
    hideHands(1)
    return false
  }

  for (let handId = 0; handId < 2; handId++) {
    let hand = predictions[handId]
    if (!hand) {
      hideHands(handId)
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
