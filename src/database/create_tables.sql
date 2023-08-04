-- Crear la tabla 'cargos'
CREATE TABLE IF NOT EXISTS cargos (
  idCargo INT PRIMARY KEY AUTO_INCREMENT,
  nombre_cargo VARCHAR(255) NOT NULL,
  descripcion TEXT
);

-- Crear la tabla 'empleado'
CREATE TABLE IF NOT EXISTS empleado (
  idEmpleado INT PRIMARY KEY AUTO_INCREMENT,
  nombre_empleado VARCHAR(255) NOT NULL,
  nacionalidad VARCHAR(255),
  idCargo INT,
  FOREIGN KEY (idCargo) REFERENCES cargos(idCargo)
);
-- Otros comandos SQL para crear más tablas y relaciones si es necesario