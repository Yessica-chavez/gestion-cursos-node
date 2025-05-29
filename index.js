const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

// Importar modelos y sequelize
const sequelize = require('./src/config/database');
const Usuario = require('./src/models/Usuario');
const Curso = require('./src/models/Curso');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: 'clave_secreta',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000 }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Sincronizar modelos con la base de datos
sequelize.sync()
  .then(() => console.log('✅ Base de datos sincronizada'))
  .catch(err => console.error('❌ Error sincronizando la base de datos:', err));

// Middleware de autenticación
function protegerRuta(req, res, next) {
  if (req.session.usuario) next();
  else res.redirect('/');
}

// Página de login
app.get('/', (req, res) => {
  const mensaje = req.query.mensaje;
  res.render('login', { mensaje });
});

// Página de registro
app.get('/registro', (req, res) => res.render('registro'));

app.post('/registro', async (req, res) => {
  const { usuario, clave, confirmarClave } = req.body;
  
  try {
    // Verificar si las contraseñas coinciden
    if (clave !== confirmarClave) {
      return res.send('❌ Las contraseñas no coinciden');
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({
      where: { usuario }
    });

    if (usuarioExistente) {
      return res.send('❌ El usuario ya existe');
    }

    // Crear nuevo usuario
    await Usuario.create({ usuario, clave });
    res.redirect('/?mensaje=Usuario registrado exitosamente');
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).send('Error en el servidor');
  }
});

app.post('/login', async (req, res) => {
  const { usuario, clave } = req.body;
  try {
    const user = await Usuario.findOne({
      where: { usuario, clave }
    });
    
    if (user) {
      req.session.usuario = usuario;
      res.redirect('/listarCursos');
    } else {
      res.send('❌ Credenciales incorrectas');
    }
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).send('Error en el servidor');
  }
});

// Página listar cursos (ahora es la página principal después del login)
app.get('/listarCursos', protegerRuta, async (req, res) => {
  try {
    const cursos = await Curso.findAll();
    res.render('listarCursos', { cursos });
  } catch (err) {
    console.error('Error al obtener cursos:', err);
    res.status(500).send('Error al obtener los cursos');
  }
});

// Página registrar curso
app.get('/registrarCurso', protegerRuta, (req, res) => res.render('registrarCurso'));

app.post('/registrarCurso', protegerRuta, async (req, res) => {
  const { codigo, nombre } = req.body;
  try {
    await Curso.create({ codigo, nombre });
    res.redirect('/listarCursos');
  } catch (err) {
    console.error('Error al registrar curso:', err);
    res.status(500).send('Error al registrar el curso');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 App corriendo en http://localhost:${PORT}`));
