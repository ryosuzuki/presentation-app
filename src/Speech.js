class Speech {
  constructor(socket) {
    this.socket = socket
  }

  run() {
    window.SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new window.SpeechRecognition();
    this.recognition.lang = "en-US";
    this.recognition.interimResults = true;
    this.recognition.continuous = true;

    this.recognition.addEventListener('error', function(event) {
      console.log(event.error + ' and ' + this.recognition)
    })

    let finalTranscript = "";
    this.recognition.onresult = (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        let transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          interimTranscript = "";
          // console.log(`emitting ${transcript}`)
          // socket.emit('message', transcript)
        } else {
          interimTranscript += transcript;
        }
        let text = finalTranscript + interimTranscript;
        // debugEl.innerText = value
        // textEl.setAttribute("value", value);
        text = interimTranscript
        text = text.replace(/(\r\n|\n|\r)/gm, ' ')
        console.log(`emitting ${text}`)
        this.socket.emit('message', text)
      }
    };

    this.recognition.start();
  }

  testRun() {
    let defaultTranscript = "Hi, my name is Adnan Karim. I am a graduate student at the University of Calgary in the Department of Computer Science. Today, I want to talk about Real-time Augmented Presentation. As you can see when I talk about something, we can augment presentation using an augmented reality interface. We have several features, such as live kinetic typography, embedded icons, embedded visuals, as well as an embedded annotation to a physical object. All components are interactive with gestural interactions. And most importantly all animations happen in real-time. This means that no video editing or programming is required. Thus it can significantly reduce the time and efforts of making such an augmented presentation, but also expands the tremendous potential for real-time live presentations like classroom lectures. We believe these techniques can make the presentation more expressive and engaging. In this talk, I want to describe how we designed such a system and introduce a new system to describe how we implemented this demo."
    defaultTranscript = defaultTranscript.replaceAll('.', '')
    defaultTranscript = defaultTranscript.replaceAll(',', '')

    let speechTest = true
    // speechTest = false
    if (speechTest) {
      let words = defaultTranscript.split(' ')
      let text = ''
      let i = 0
      setInterval(() => {
        if (i > words.length) return false
        text += words[i]
        text += ' '
        i++
        this.socket.emit('message', text)
      }, 500)
    } else {
      this.socket.emit('message', defaultTranscript)
    }
  }

}

export default Speech