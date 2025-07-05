const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'inseguro', resave: false, saveUninitialized: true }));

// Conexión vulnerable sin protección
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'cursosdb'
});

conn.connect(err => {
  if (err) throw err;
  console.log('✅ Conectado a MySQL');
});

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { mensaje: req.session.mensaje });
  req.session.mensaje = null;
});

// ⚠️ Lógica de login vulnerable a SQLi si lo modificas más adelante
app.post('/login', (req, res) => {
  const { usuario, clave } = req.body;
  if (usuario === 'admin' && clave === '123') {
    req.session.usuario = usuario;
    res.redirect('/listarCursos');
  } else {
    req.session.mensaje = 'Credenciales incorrectas';
    res.redirect('/login');
  }
});

app.get('/listarCursos', (req, res) => {
  conn.query('SELECT * FROM cursos', (err, cursos) => {
    if (err) throw err;
    res.render('listarCursos', { cursos });
  });
});

app.get('/registrarCurso', (req, res) => {
  res.render('agregarCurso');
});

app.post('/registrarCurso', (req, res) => {
  const { codigo, nombre } = req.body;
  // ⚠️ Vulnerabilidad: no hay validación ni escape de HTML
  conn.query(`INSERT INTO cursos (codigo, nombre, created_at) VALUES (?, ?, NOW())`, [codigo, nombre], (err) => {
    if (err) throw err;
    res.redirect('/listarCursos');
  });
});

app.post('/eliminarCurso/:id', (req, res) => {
  const id = req.params.id;
  conn.query(`DELETE FROM cursos WHERE id = ${id}`, (err) => {
    if (err) throw err;
    res.redirect('/listarCursos');
  });
});

app.listen(3000, () => console.log('🚀 Servidor corriendo en http://localhost:3000'));
