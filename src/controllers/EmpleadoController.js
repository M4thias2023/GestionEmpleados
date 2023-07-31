const db = require("../database/db");

const getEmpleados = (req, res) => {
    // Realizar una consulta a la base de datos para obtener todos los empleados
    const query = 'SELECT * FROM empleado';
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

const getEmpleadoById = (req, res) => {
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
    })
}

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
  
        return res.status(201).json({ message: 'Empleado registrado exitosamente' });
      });
    })
}

const updateEmpleado = (req, res) => {
    const { id } = req.params;
  const { nombre_empleado, nacionalidad, idCargo } = req.body;
  const sql = `UPDATE empleado SET nombre_empleado = '${nombre_empleado}', nacionalidad = '${nacionalidad}', idCargo = '${idCargo}' WHERE idEmpleado = ${id}`;
  db.query(sql, (err) => {
    if (err) throw err;
    res.send("Empleado actualizado!");
  });
}

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

module.exports = {
    getEmpleados,
    getEmpleadoById,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado
}