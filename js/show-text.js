function showText(json) {
  let tokens = json.tokens
  let entities = json.entities
  let html = ""

  let keywords = {}
  for (let entity of entities) {
    keywords[entity.text] = entity.label
  }

  let sceneEl = document.querySelector('a-scene')
  let words = document.querySelector('a-entity#words')
  if (!words) {
    words = document.createElement('a-entity')
    words.setAttribute('id', 'words')
    sceneEl.appendChild(words)
  }
  let pos = { x: -6, y: 0, z: -3}
  let len = 0
  let width = 0

  for (let i = tokens.length + 1; i < tokens.length + 10; i++) {
    let el = document.querySelector(`a-entity#word-${i}`)
    if (el) {
      words.removeChild(el)
    }
  }

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    let word = token.text
    let tag = token.tag

    pos.x += width
    width = word.length/4
    pos.x += width
    let el = document.querySelector(`a-entity#word-${i}`)
    if (!el) {
      el = document.createElement('a-entity')
      el.setAttribute('id', `word-${i}`)
      words.appendChild(el)
      el.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`)
      el.setAttribute('animate-text', true)
    }
    // el.setAttribute('geometry', `primitive: plane; width: ${width}; height: 0.1`)
    // el.setAttribute('material', 'opacity: 0.2; transparent: true')
    // el.setAttribute('text', `height: 0.1; width: ${width}; anchor: center; align: center; wrap-count: ${word.length+1}; color: white; value: ${word}`)
    el.setAttribute('text-plane', `text: ${word}`)

    // console.log(el.object3D)
    // el.object3D.onBeforeRender(sceneEl.renderer, sceneEl.object3D, cameraEl.object3D)
    // setTimeout(() => {
    //   console.log(el.object3D.children)
    //   if (el.object3D.children.length > 0) {
    //     let width = el.object3D.children[0].scale.x
    //     let height = el.object3D.children[0].scale.y
    //     console.log(width)
    //     pos.x += width
    //   }
    // }, 10)

    // console.log(el.object3D.children)
    // if (el.object3D.children.length > 0) {
    //   let width = el.object3D.children[0].scale.x
    //   let height = el.object3D.children[0].scale.y
    //   pos.x += width
    // }
  }
}
