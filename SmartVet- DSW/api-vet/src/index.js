import app from './server.js';
import connection from './database.js';

console.log("🚀 Iniciando SmartVet API...");

// Conexión a la base de datos
connection();

// Iniciar el servidor
app.listen(app.get('port'), () => {
  console.log(`Server ok on http://localhost:${app.get('port')}`);
});
