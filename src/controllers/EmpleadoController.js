const db = require("../database/db");
const cargoController = require("./CargoController");

const getEmpleados = (req, res) => {
    // Realizar una consulta a la base de datos para obtener todos los empleados
    const query = 'SELECT empleado.idEmpleado, empleado.nombre_empleado, empleado.nacionalidad, cargos.nombre_cargo FROM empleado INNER JOIN cargos ON empleado.idCargo = cargos.idCargo;';
    db.query(query, (err, empleados) => {
    if (err) {
        console.error('Error al obtener los empleados:', err.message);
        return res.status(500).json({ error: 'Error al obtener los empleados' });
    }
    // Renderizar la vista 'empleados.ejs' y pasar la lista de empleados como datos
    //res.json(empleados);
    res.render('empleados', { empleados });
    })
}

const getEmpleadoById = (req, res, next) => {
  const idEmpleado = req.params.id;

  // Realizar una consulta para obtener los datos del empleado por su ID
  const empleadoQuery = 'SELECT * FROM empleado WHERE idEmpleado = ?';
  db.query(empleadoQuery, [idEmpleado], (empleadoErr, empleadoResult) => {
    if (empleadoErr) {
      console.error(empleadoErr);
      return res.status(500).render('error', { error: 'Error al obtener el empleado' });
    }

    if (empleadoResult.length === 0) {
      return res.status(404).render('error', { error: 'El empleado no fue encontrado' });
    }

    // Pasar los datos del empleado al siguiente middleware
    res.locals.empleado = empleadoResult[0];
    next();
  });
};

const createEmpleado = (req, res) => {
  const { nombre_empleado, nacionalidad, idCargo } = req.body;

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
    const insertQuery = 'INSERT INTO empleado (nombre_empleado, nacionalidad, idCargo) VALUES (?,?,?)';
    db.query(insertQuery, [nombre_empleado, nacionalidad, idCargo], (insertErr, insertResult) => {
      if (insertErr) {
        console.error(insertErr);
        return res.status(500).json({ error: 'Error al registrar el empleado' });
      }

      // Redirigir a la lista de empleados después de registrar exitosamente
      res.redirect('/empleados');
    });
  });
};

const updateEmpleado = (req, res) => {
  const { id } = req.params;
  const { nombre_empleado, nacionalidad, idCargo } = req.body;

  // Verificar que el idCargo existe en la tabla 'cargos' antes de actualizar el empleado
  const cargoQuery = 'SELECT idCargo FROM cargos WHERE idCargo = ?';
  db.query(cargoQuery, [idCargo], (cargoErr, cargoResult) => {
    if (cargoErr) {
      console.error(cargoErr);
      return res.status(500).render('error', { error: 'Error al verificar el cargo' });
    }

    if (cargoResult.length === 0) {
      // El idCargo no existe en la tabla 'cargos'
      return res.status(404).render('error', { error: 'El idCargo no existe en la base de datos' });
    }

    // Si el idCargo existe, actualizar el empleado en la tabla 'empleados'
    const sql = 'UPDATE empleado SET nombre_empleado = ?, nacionalidad = ?, idCargo = ? WHERE idEmpleado = ?';
    db.query(sql, [nombre_empleado, nacionalidad, idCargo, id], (updateErr, updateResult) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).render('error', { error: 'Error al actualizar el empleado' });
      }

      // Empleado actualizado exitosamente, puedes redirigir o renderizar una vista de éxito
      // Por ejemplo, redirigir a la lista de empleados:
      res.redirect('/empleados');
    });
  });
};

const deleteEmpleado = (req, res) =>{
    const { id } = req.params;
    // Realizar una consulta para eliminar el empleado con el ID proporcionado
    const deleteQuery = 'DELETE FROM empleado WHERE idEmpleado = ?';
    db.query(deleteQuery, [id], (err, result) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al eliminar el empleado' });
    }
    if (result.affectedRows === 0) {
      // No se encontró un empleado con el ID proporcionado
        return res.status(404).json({ error: 'El empleado no fue encontrado' });
    }
    return res.redirect('/empleados');
    });
}

//traer los nombres de los cargos para el select de registrar empleado
const getCargos = (req, res, next) => {
  const query = 'SELECT nombre_cargo, idCargo FROM cargos';
  db.query(query, (err, cargos) => {
    if (err) {
      console.error('Error al obtener los cargos:', err.message);
      return res.status(500).json({ error: 'Error al obtener los cargos' });
    }
    // Pasar la lista de cargos al siguiente middleware
    res.locals.cargos = cargos;
    next();
  });
};

module.exports = {
    getEmpleados,
    getEmpleadoById,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    getCargos
}