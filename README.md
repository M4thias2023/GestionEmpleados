# Documentación del Proyecto  de Práctica GestionEmpleados

## Descripción

GestionEmpleados es una aplicación web creada como práctica para administrar empleados y cargos en una organización. Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Borrar) tanto para empleados como para cargos.

## Instalación

1.  Clonar el repositorio desde GitHub:
    

    
    `git clone https://github.com/tu-usuario/GestionEmpleados.git` 
    
2.  Instalar las dependencias utilizando npm (Node Package Manager):
   
    
    `cd GestionEmpleados
    npm install` 
    

## Configuración

1.  Crear una base de datos MySQL y configurar las credenciales en `database/db.js`.
2.  Importar el archivo SQL de la base de datos desde `database/gestionempleados.sql`.
3. La base de datos así como sus tablas y relaciones se crearán automaticamente.

## Uso

1.  Iniciar la aplicación:
    
    Copy code
    
    `node src/app.js` 
    
2.  Acceder a la aplicación en un navegador web en la dirección `http://localhost:3000`.

## Funcionalidades

### Empleados

-   Registrar nuevo empleado.
-   Actualizar información de un empleado existente.
-   Eliminar un empleado.
-   Listar todos los empleados.
-   Ver detalles de un empleado específico.

### Cargos

-   Registrar nuevo cargo.
-   Actualizar información de un cargo existente.
-   Eliminar un cargo (si no está vinculado a empleados).
-   Listar todos los cargos.

## Estructura del Proyecto

`GestionEmpleados/
├── database/
│   ├── db.js
│   ├── gestionempleados.sql
├── public/
│   ├── styles/
│   │   ├── style.css
├── src/
│   ├── controllers/
│   │   ├── CargoController.js
│   │   ├── EmpleadoController.js
│   ├── views/
│   │   ├── actualizarempleado.ejs
│   │   ├── actualizarcargo.ejs
│   │   ├── cargos.ejs
│   │   ├── empleados.ejs
│   │   ├── header.ejs
│   │   ├── inicio.ejs
│   │   ├── navbar.ejs
│   │   ├── registrarempleado.ejs
│   │   ├── registrarcargo.ejs
├── app.js
├── package.json
├── README.md` 

## Tecnologías Utilizadas

-   Node.js
-   Express.js
-   MySQL
-   EJS (Embedded JavaScript) como motor de plantillas.
-   Bootstrap para estilos.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas colaborar en este proyecto, realiza un fork del repositorio, crea una rama para tu función o mejora, y luego crea un pull request.

## EQUIPO

Este proyecto está fue desarrollado por Mathías Trasmonte (@M4thias2023)
