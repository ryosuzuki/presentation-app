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
        video.style.transform = 'scaleX(-1)'
        video.onloadedmetadata = function(e) {
          video.play()
          video.loaded = true
        }
      },
      function(err) {
        console.log("The following error occured: " + err.name)
      }
    )

    let leftEl = document.querySelector('#left-hand')
    let rightEl = document.querySelector('#right-hand')
    for (let i = 0; i < 21; i++) {
      let sphere = document.createElement('a-sphere')
      sphere.setAttribute('radius', 0.03)
      let leftPointEl = sphere.cloneNode()
      leftPointEl.setAttribute('id', `left-${i}`)
      leftEl.appendChild(leftPointEl)
      let rightPointEl = sphere.cloneNode()
      rightPointEl.setAttribute('id', `right-${i}`)
      rightEl.appendChild(rightPointEl)
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
loadModel()

async function predict(source) {
  let predictions = await window.model.estimateHands(source)
  if (predictions && predictions.length > 0) {
    // console.log(predictions)
    showHands(predictions)
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

      let raycaster = new THREE.Raycaster()
      let pos2D = new THREE.Vector3(
        ( x / window.innerWidth ) * 2 - 1,
        ( y / window.innerHeight ) * 2 + 1
      )
      let sceneEl = document.querySelector('a-scene')
      let camera = sceneEl.camera
      raycaster.setFromCamera(pos2D, camera)

      let background = document.querySelector('#background-plane')
      let intersects = raycaster.intersectObjects([background.object3D])

      debugger
      for (let intersect of intersects) {
        console.log(intersect.object)
      }


      /*
      let projector = new THREE.Projector()
      let pos = new THREE.Vector3(
        x / window.innerWidth * 2 - 1,
        -y / window.innerHeight * 2 + 1,
        0.5
      )
      let camera = AFRAME.scenes[0].camera
      projector.unprojectVector(pos, camera)
      pos.sub(camera.position)
      pos.normalize()

      let rayCaster = new THREE.Raycaster(camera.position, pos)
      let scale = window.innerWidth * 2
      let rayDirection = new THREE.Vector3(
        rayCaster.ray.direction.x * scale,
        rayCaster.ray.direction.y * scale,
        rayCaster.ray.direction.z * scale
      )
      let rayVector = new THREE.Vector3(
        camera.position.x + rayDirection.x,
        camera.position.y + rayDirection.y,
        camera.position.z + rayDirection.z
      )
      */

      // let pos = new THREE.Vector3(x, y, -1).unproject(camera)
      // pos.z = -3
      // let sphere = document.querySelector(`#left-${i}`)
      // sphere.setAttribute('position', pos)
      // console.log(pos)
    }
  }



}


