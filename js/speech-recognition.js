window.SpeechRecognition =
  window.SpeechRecognition || webkitSpeechRecognition;
recognition = new window.SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = true;
recognition.continuous = true;
let textEl = document.querySelector("#text");
let debugEl = document.querySelector("#debug");

recognition.addEventListener('error', function(event) {
  console.log(event.error + ' and ' + recognition)
})

let finalTranscript = "";
recognition.onresult = (event) => {
  let interimTranscript = "";
  for (let i = event.resultIndex; i < event.results.length; i++) {
    let transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      finalTranscript += transcript;
      interimTranscript = "";
    } else {
      interimTranscript += transcript;
    }
    let text = finalTranscript + interimTranscript;
    // debugEl.innerText = value
    // textEl.setAttribute("value", value);
    text = text.replace(/(\r\n|\n|\r)/gm, ' ')
    console.log(`emitting ${text}`)
    socket.emit('message', text)
  }
};

recognition.start();
