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
app.get("/empleados/:id"),
  (req, res) => {
    const sql = `SELECT * FROM empleado WHERE id = ${req.params.id}`;
    db.query(sql, (err, row) => {
      if (err) throw err;
      res.json(row);
    });
  };

// POST un empleado
app.post("/empleados", (req, res) => {
  const sql = "INSERT INTO empleado SET ?";
  const empleadoObj = {
    nombre_empleado: req.body.nombre_empleado,
    nacionalidad: req.body.nacionalidad,
    cargo: req.body.cargo,
  };
  db.query(sql, empleadoObj, (err) => {
    if (err) throw err;
    res.send("Empleado creado!");
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
  const sql = "INSERT INTO cargos SET ?";
  const cargoObj = {
    nombre_cargo: req.body.nombre_cargo,
    descripcion: req.body.descripcion,
  };
  db.query(sql, cargoObj, (err) => {
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
