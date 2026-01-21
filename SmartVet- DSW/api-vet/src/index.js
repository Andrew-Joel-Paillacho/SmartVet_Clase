import app from './server.js';
import connection from './database.js';
import http from 'http'
import { Server } from 'socket.io'

console.log("🚀 Iniciando SmartVet API...");

// Conexión a la base de datos
connection();

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
})

io.on('connection', (socket) => {
    console.log('Usuario conectado',socket.id)
    socket.on('enviar-mensaje-front-back',(payload)=>{
        socket.broadcast.emit('enviar-mensaje-front-back',payload)
    })
})

// Iniciar el servidor
server.listen(app.get('port'), () => {
  console.log(`Server ok on http://localhost:${app.get('port')}`);
});
