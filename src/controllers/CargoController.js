const { default: Swal } = require("sweetalert2");
const db = require("../database/db");

const getCargos = (req, res) => {
    //consulta a la base de datos
  const sql = "SELECT * FROM cargos";
  //llamado a la base de datos
  db.query(sql, (err, cargos) => {
    if (err){
        console.error(err);
        return res.status(500).json({ error: "Error al obtener los cargos" });
    }
    res.render("cargos", { cargos })
  });
}

const createCargo = (req, res) => {
    const { nombre_cargo, descripcion } = req.body;
  const sql = "INSERT INTO cargos (nombre_cargo, descripcion) VALUES (?, ?)";
  db.query(sql, [nombre_cargo , descripcion], (err) => {
    if (err) throw err;
    //res.send("Cargo creado!");
    res.redirect('/cargos');
  });
}

const deleteCargo = (req, res) => {
  const { id } = req.params;

  // Verificar si el cargo está vinculado a algún empleado
  const empleadoQuery = 'SELECT idEmpleado FROM empleado WHERE idCargo = ?';
  db.query(empleadoQuery, [id], (empleadoErr, empleadoResult) => {
      if (empleadoErr) {
          console.error(empleadoErr);
          return res.status(500).json({ error: 'Error al verificar los empleados' });
      }

      if (empleadoResult.length > 0) {
        // El cargo está vinculado a al menos un empleado
        return res.status(200).json({ success: false, message: 'El cargo está vinculado a uno o más empleados' });
    }

      // Si el cargo no está vinculado a ningún empleado, proceder a eliminarlo
      const deleteQuery = 'DELETE FROM cargos WHERE idCargo = ?';
      db.query(deleteQuery, [id], (err, result) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Error al eliminar el cargo' });
          }
          
          if (result.affectedRows === 0) {
            // No se encontró un cargo con el ID proporcionado
            return res.status(404).json({ success: false, message: 'El cargo no fue encontrado' });
        }
        
        // Envía una respuesta de éxito si la eliminación fue exitosa
        return res.status(200).json({ success: true, message: 'El cargo ha sido eliminado exitosamente' });
      });
  });
};

const updateCargo = (req, res) => {
  const { id } = req.params;
  const { nombre_cargo, descripcion } = req.body;

  const sql = 'UPDATE cargos SET nombre_cargo = ?, descripcion = ? WHERE idCargo = ?';
  db.query(sql, [nombre_cargo, descripcion, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al actualizar el cargo' });
    }

    if (result.affectedRows === 0) {
      // No se encontró un cargo con el ID proporcionado
      return res.status(404).json({ success: false, message: 'El cargo no fue encontrado' });
    }

    // Envía una respuesta de éxito si la actualización fue exitosa
    return res.redirect('/cargos');
  });
}

const getCargoById = (req, res,next) => {
  const { id } = req.params;

  const sql = 'SELECT * FROM cargos WHERE idCargo = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener el cargo' });
    }

    if (result.length === 0) {
      // No se encontró un cargo con el ID proporcionado
      return res.status(404).json({ success: false, message: 'El cargo no fue encontrado' });
    }

    // Envía una respuesta de éxito con el cargo obtenido
    //return res.status(200).json({ success: true, cargo: result[0] });
    res.locals.cargo = result[0];
    next();
    //res.render("cargos", { cargos })
  });
}




module.exports = {
    getCargos,
    createCargo,
    deleteCargo,
    updateCargo,
    getCargoById
}