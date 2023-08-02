const db = require("../database/db");

const getCargos = (req, res) => {
    //consulta a la base de datos
  const sql = "SELECT * FROM cargos";
  //llamado a la base de datos
  db.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
}

const createCargo = (req, res) => {
    const { nombre_cargo, descripcion } = req.body;
  const sql = "INSERT INTO cargos (nombre_cargo, descripcion) VALUES (?, ?)";
  db.query(sql, [nombre_cargo , descripcion], (err) => {
    if (err) throw err;
    res.send("Cargo creado!");
  });
}

const deleteCargo = (req, res) => {
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
}

const updateCargo = (req, res) => {
  const { idCargo } = req.params;
  const { nombre_cargo, descripcion } = req.body;
  const sql = `UPDATE cargos SET nombre_cargo = '${nombre_cargo}', descripcion = '${descripcion}' WHERE idCargo = ${idCargo}`;
  db.query(sql, (err) => {
    if (err) throw err;
    res.send("Cargo actualizado!");
  });
}




module.exports = {
    getCargos,
    createCargo,
    deleteCargo,
    updateCargo,
}