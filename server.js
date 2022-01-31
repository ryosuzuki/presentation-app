const {PythonShell} = require('python-shell')
const pyshell = new PythonShell('spacy-listen.py')
const express = require('express')
const http = require('http')
const path = require('path')
const app = express()
const server = http.Server(app)

const socketio = require('socket.io')
const io = socketio(server)

app.use(express.static(__dirname))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

server.listen(3000, () => {
  console.log('listening on 3000')
})

io.on('connection', (socket) => {
  console.log('connection start')
  socket.on('message', (message) => {
    pyshell.send(message)
  })

  pyshell.on('message', (message) => {
    socket.emit('message', message)
  })

  socket.on('disconnect', () => {
    console.log('connection end')
  })
})
