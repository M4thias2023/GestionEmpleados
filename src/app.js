const express = require("express");

const app = express();

const db = require("./database/db");

//middlewares
app.use(express.json());

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

//routes
app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

// GET todos los empleados
app.get("/empleados", (req, res) => {
  //consulta a la base de datos
  const sql = "SELECT * FROM empleado";
  //llamado a la base de datos
  db.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});


//TRAER UN EMPLEADO
app.get('/empleados/:id', (req, res) => {
    const idEmpleado = req.params.id; // Obtiene el ID del empleado desde los parámetros de la ruta
  
    // Verificar que el empleado existe en la base de datos antes de obtenerlo
    const empleadoQuery = 'SELECT * FROM empleado WHERE idEmpleado = ?';
    db.query(empleadoQuery, [idEmpleado], (empleadoErr, empleadoResult) => {
      if (empleadoErr) {
        console.error(empleadoErr);
        return res.status(500).json({ error: 'Error al obtener el empleado' });
      }
  
      if (empleadoResult.length === 0) {
        // El empleado con el ID especificado no existe en la tabla 'empleados'
        return res.status(404).json({ error: 'El empleado no fue encontrado' });
      }
  
      // Si el empleado existe, se envía como respuesta
      return res.json(empleadoResult[0]);
    });
  });


// POST un empleado
app.post('/empleados', (req, res) => {
    const { nombre, nacionalidad, idCargo } = req.body;
  
    // Verificar que el idCargo existe en la tabla 'cargos' antes de registrar el empleado
    const cargoQuery = 'SELECT idCargo FROM cargos WHERE idCargo = ?';
    db.query(cargoQuery, [idCargo], (cargoErr, cargoResult) => {
      if (cargoErr) {
        console.error(cargoErr);
        return res.status(500).json({ error: 'Error al verificar el cargo' });
      }
  
      if (cargoResult.length === 0) {
        // El idCargo no existe en la tabla 'cargos'
        return res.status(404).json({ error: 'El idCargo no existe en la base de datos' });
      }
  
      // Si el idCargo existe, insertar el empleado en la tabla 'empleados'
      const insertQuery = 'INSERT INTO empleado ( nombre_empleado, nacionalidad, idCargo) VALUES (?,?,?)';
      db.query(insertQuery, [nombre, nacionalidad, idCargo], (insertErr, insertResult) => {
        if (insertErr) {
          console.error(insertErr);
          return res.status(500).json({ error: 'Error al registrar el empleado' });
        }
  
        return res.status(201).json({ message: 'Empleado registrado exitosamente' });
      });
    });
  });

//ACTUALIZAR UN EMPLEADO, ACTUALIZA EL CARGO QUE VIENE DE LA TABLA CARGOS
app.put("/empleados/:id", (req, res) => {
  const { id } = req.params;
  const { cargo } = req.body;
  const { nombre_empleado } = req.body;
  const { nacionalidad } = req.body;
  const sql = `UPDATE empleado SET cargo = '${cargo}', nombre_empleado = '${nombre_empleado}', nacionalidad = '${nacionalidad}' WHERE id = ${id}`;
  db.query(sql, (err) => {
    if (err) throw err;
    res.send("Empleado actualizado!");
  });
});

app.delete("/empleados/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM empleado WHERE id = ${id}`;
  db.query(sql, (err) => {
    if (err) throw err;
    res.send("Empleado eliminado!");
  });
});

// GET todos los cargos
app.get("/cargos", (req, res) => {
  //consulta a la base de datos
  const sql = "SELECT * FROM cargos";
  //llamado a la base de datos
  db.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// POST un cargo
app.post("/cargos", (req, res) => {
    const { nombre_cargo, descripcion } = req.body;
  const sql = "INSERT INTO cargos (nombre_cargo, descripcion) VALUES (?, ?)";
  db.query(sql, [nombre_cargo , descripcion], (err) => {
    if (err) throw err;
    res.send("Cargo creado!");
  });
});

//borrar un cargo
app.delete("/cargos/:idCargo", (req, res) => {
  const idCargo = req.params.idCargo; // Obtiene el ID del cargo desde los parámetros de la ruta

  // Verificar que el ID del cargo existe en la base de datos antes de eliminarlo
  const cargoQuery = "SELECT idCargo FROM cargos WHERE idCargo = ?";
  db.query(cargoQuery, [idCargo], (cargoErr, cargoResult) => {
    if (cargoErr) {
      console.error(cargoErr);
      return res.status(500).json({ error: "Error al verificar el cargo" });
    }

    if (cargoResult.length === 0) {
      // El ID del cargo no existe en la tabla 'cargos'
      return res
        .status(404)
        .json({ error: "El ID del cargo no existe en la base de datos" });
    }

    // Eliminar el cargo de la tabla 'cargos' si el ID del cargo existe
    const deleteQuery = "DELETE FROM cargos WHERE idCargo = ?";
    db.query(deleteQuery, [idCargo], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error(deleteErr);
        return res.status(500).json({ error: "Error al eliminar el cargo" });
      }

      return res.status(200).status({ message: "Cargo eliminado" });
    });
  });
});
