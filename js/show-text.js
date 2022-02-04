function showText(json) {
  let tokens = json.tokens

  let pos = { x: -6, y: 0, z: -3}
  let len = 0
  let width = 0
  let words = document.querySelector('a-entity#words')
  for (let i = tokens.length + 1; i < tokens.length + 10; i++) {
    let el = document.querySelector(`a-entity#word-${i}`)
    if (el) {
      words.removeChild(el)
    }
  }

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    let word = token.text
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
