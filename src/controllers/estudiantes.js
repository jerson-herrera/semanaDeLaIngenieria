const pool = require('../conexion/conexion.js');


// Obtener TODOS los Usuarios
const getEstudiantes = async (req, res) => {

    try {
      const respuesta = await pool.query('SELECT * FROM estudiantes ORDER BY estudianteid ASC');
  
      if (respuesta.rows.length === 0) {
        res.status(404).json({ message: "No se encontraron usuarios" });
      } else {
        res.status(200).json(respuesta.rows);
      }
    } catch (error) {
      console.error("Error en la consulta a la base de datos: ", error);
      res.status(500).json({ error: "Error en la consulta a la base de datos" });
    }
};


// Obtener Estudiante especifico por (id).
const getEstudianteById = async (req, res) => {
  const EstudianteId = parseInt(req.params.EstudianteId);

  // Verificar si el ID no es un numero valido o si no es un numero entero
  if (isNaN(EstudianteId) || !Number.isInteger(EstudianteId) || EstudianteId <= 0) {
    res.status(400).json({ mensaje: 'El ID proporcionado no es un numero entero valido o no es positivo.' });
    return; // Salir de la función
  }

  try {
    const respuesta = await pool.query('SELECT * FROM estudiantes WHERE estudianteid = $1', [EstudianteId]);

    if (respuesta.rows.length > 0) {
      res.json(respuesta.rows);
    } else {
      res.status(404).json({ mensaje: 'No se encontró un estudiante con el ID ' + EstudianteId + ' que has proporcionado.' });
    }
  } catch (error) {
    console.error("Error en la consulta a la base de datos: ", error);
    res.status(500).json({ mensaje: 'Error en la consulta a la base de datos' });
  }
};







module.exports = {
    getEstudiantes,
    getEstudianteById
}