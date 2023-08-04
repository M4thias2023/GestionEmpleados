const express = require("express");
const app = express();
const db = require("./database/db");
const fs = require('fs');
const path = require("path");
const { render } = require("ejs");
const methodOverride = require('method-override');
const empleadoController = require('./controllers/EmpleadoController');
const cargoController = require('./controllers/CargoController');
const mysql = require('mysql');

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//usar imagenes y archivos estaticos
app.use(express.static(path.join(__dirname, "public")));

//ejs
app.set('view engine', 'ejs'); // Configura EJS como el motor de plantillas
app.set('./views', path.join(__dirname, 'views')); // Establece la carpeta 'views'

// Leer el archivo create_database.sql
const createDBSQL = fs.readFileSync(path.join(__dirname, './database/create_database.sql'), 'utf-8');

// Leer el archivo create_tables.sql
const createTablesSQL = fs.readFileSync(path.join(__dirname, './database/create_tables.sql'), 'utf-8');

// Conectar a MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
});

// Conectar a la base de datos o crearla si no existe
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err.message);
    return;
  }

  connection.query(createDBSQL, (createDBErr, createDBResult) => {
    if (createDBErr && createDBErr.code !== 'ER_DB_CREATE_EXISTS') {
      console.error('Error al crear la base de datos:', createDBErr.message);
      return;
    }

    console.log('Base de datos creada o ya existe');

    // Usar la base de datos gestion_empleados para el resto de las consultas
    connection.changeUser({ database: 'gestion_empleados' }, (useDBErr) => {
      if (useDBErr) {
        console.error('Error al cambiar a la base de datos gestion_empleados:', useDBErr.message);
        return;
      }

      // Dividir las instrucciones SQL en un arreglo
      const sqlStatements = createTablesSQL.split(';').filter(statement => statement.trim() !== '');

      // Ejecutar cada instrucción SQL por separado para crear las tablas
      sqlStatements.forEach((sqlStatement, index) => {
        connection.query(sqlStatement, (createErr, createResult) => {
          if (createErr) {
            console.error(`Error al crear tabla ${index + 1}:`, createErr.message);
          } else {
            console.log(`Tabla ${index + 1} creada correctamente`);
          }
        });
      });

      // Iniciar el servidor Express
      const port = 3000;
      app.listen(port, () => {
        console.log(`Servidor escuchando en http://localhost:${port}`);
      });
    });
  });
});





// Conectar a la base de datos

app
  .get("/", (req, res) => {res.render("inicio")})
  .get("/empleados/registrar", empleadoController.getCargos, (req, res) => {
    const cargos = res.locals.cargos;
    res.render("registrarempleado", { cargos });
  })
  .get("/empleados/actualizar/:id", empleadoController.getCargos, empleadoController.getEmpleadoById, (req, res) => {
    const { idCargo } = req.params;
    const cargos = res.locals.cargos;
    const empleado = res.locals.empleado; // Asegúrate de obtener los datos del empleado
    res.render("actualizarempleado", { idCargo, empleado, cargos });
  })
  .get("/cargos/actualizar/:id", cargoController.getCargoById, (req, res) => {
    const { id } = req.params;
    const cargo = res.locals.cargo;
    res.render("actualizarcargos",{ id,cargo }) 
  })
  .get("/cargos/registrar", (req, res) => {res.render("registrocargos")})
  .get("/empleados", empleadoController.getEmpleados)
  .get("/empleados/listar/:id", empleadoController.getEmpleadoById)
  .post("/empleados/registrar", empleadoController.createEmpleado)
  .post("/empleados/actualizar/:id", empleadoController.updateEmpleado)
  .get("/empleados/borrar/:id", empleadoController.deleteEmpleado)
  .get("/cargos", cargoController.getCargos)
  .post("/cargos/registrar", cargoController.createCargo)
  .post("/cargos/actualizar/:id", cargoController.updateCargo)
  .delete("/cargos/borrar/:id", cargoController.deleteCargo)
  //error 404
  .use((req, res, next) => {res.status(404).render("404")})

