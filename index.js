const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { results: agents } = require('./data/agentes.js'); //users
const path = require('path');
const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key'; // Llave secreta como variable

app.listen(PORT, () => {
    console.log(`Voila!..Servidor escuchando en el puerto ${PORT}`);
});



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // Para servir index.html desde la raíz
//app.use(express.static(path.join(__dirname, 'public')));

app.get('/token', (req, res) => {
    const { token } = req.query;

    jwt.verify(token, SECRET_KEY, (err, data) => {
        res.send( err ? 'token invalid' : data );
    });
});
// Opcion 1
//ruta para autenticar a los agentes y generar un token 
    app.post('/signin', (req, res) => {
        console.log("Solicitud de inicio de sesión recibida");
    const { email, password } = req.body;
        console.log("Email: ${email}, Password: ${password}");
    const agent = agents.find(a => a.email === email && a.password === password);
    if (agent) {
        const token = jwt.sign({ email: agent.email }, SECRET_KEY, { expiresIn: '2m' });
        res.json({ email: agent.email, token });
    } else {
        res.status(401).send('credenciales inválidas');
    }
});

//Opcion 2
// Ruta para autenticar a los agentes y generar un token
// app.post('/SignIn', (req, res) => {
//     const { email, password } = req.body;
//     const agent = agents.find(a => a.email === email && a.password === password);
//     if (agent) {
//         const token = jwt.sign({ email: agent.email }, SECRET_KEY, { expiresIn: '2m' });
//         res.json({ email: agent.email, token });
//     } else {
//         res.status(401).send('Credenciales inválidas');
//     }
// });


// Ruta restringida
app.get('/restricted', (req, res) => {
    // Se agrega control de caché para deshabilitar la caché
    res.setHeader('Cache-Control', 'no-store');
    
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('No se proporcionó un token');
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => { 
        if (err) {
            return res.status(401).send('Token inválido o expirado');
        }
        res.send(`Bienvenido, agente ${decoded.email}`);
        //redirigir a la pagina donde se muestra el token
        //res.redirect("/showToken.html");
    });
});

app.get("/showToken.html", (req, res) => {});


// Paso 1
//app.get("/Dashboard", (req, res) => {
    // Paso 2
//    let { token } = req.query;
    // Paso 3
//    jwt.verify(token, SECRET_KEY, (err, decoded) => { //verificacion de tokens
    // Paso 4
//    err
// /   ? res.status(401).send({
//    error: "401 Unauthorized",
//    message: err.message,
//    })
//    : // Paso 5
//    res.send(`
//    Bienvenido al Dashboard ${decoded.data.email}
//    `);
//});
//});

//Manejo de errores para visualizarlo en consola
app.use ((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Error interno del servidor");
});