const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const route = require("./route")
const { addUser } = require("./users")
const { check } = require("./winCheck")

const app = express()

app.use(cors({ origin: "*" }))
app.use(route)

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }) => {
    socket.join(room)
    console.log(`join user: ${name} in room: ${room}`)

    const { userList } = addUser({ name, room })

    socket.emit("users", { users: userList.filter((u) => u.room === room) })
    socket.broadcast.to(room).emit("users", { users: userList.filter((u) => u.room === room) })

    socket.on("start", ({ choose }) => {
      console.log({ ...choose, name: name, turn: choose.id === "player1" })
      socket.emit("start", { ...choose, name: name, turn: choose.id === "player1" })
      socket.broadcast.to(room).emit("start", { ...choose, name: name, turn: choose.id === "player1" })
    })

    socket.on("turn", ({ board, id }) => {
      if (check(board)) {
        socket.emit("result", { board, id })
        socket.broadcast.to(room).emit("result", { board, id })
        return
      }
      socket.emit("turn", { board, id, turn: false })
      socket.broadcast.to(room).emit("turn", { board, id: id === "player1" ? "player2" : "player1", turn: true })
    })
  })

  io.on("disconnect", () => {
    console.log("Disconnect")
  })
})

server.listen(5000, () => {
  console.log("Example app listening on port 5000")
})
