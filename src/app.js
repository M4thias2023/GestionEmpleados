const express = require("express");
const app = express();
const db = require("./database/db");
const path = require("path");
const { render } = require("ejs");
const methodOverride = require('method-override');
const empleadoController = require('./controllers/EmpleadoController');
const cargoController = require('./controllers/CargoController');

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.set('view engine', 'ejs'); // Configura EJS como el motor de plantillas
app.set('./views', path.join(__dirname, 'views')); // Establece la carpeta 'views'



const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
  //mostrar la vista de inicio.ejs
});


// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

//routes
app.get("/", (req, res) => {
  res.render("inicio");
});

app.get("/cargos", (req, res) => {
  res.render("cargos");
});

app
  // Ruta para mostrar la vista de empleado
  .get("/empleados", empleadoController.getEmpleados)
  .get("/empleados/listar/:id", empleadoController.getEmpleadoById)
  .post("/empleados/registrar", empleadoController.createEmpleado)
  .put("/empleados/actualizar/:id", empleadoController.updateEmpleado)
  .get("/empleados/borrar/:id", empleadoController.deleteEmpleado)
  .get("/cargos/listar", cargoController.getCargos)
  .post("/cargos/registrar", cargoController.createCargo)
  .put("/cargos/actualizar/:id", cargoController.updateCargo)
  .get("/cargos/borrar/:id", cargoController.deleteCargo)




