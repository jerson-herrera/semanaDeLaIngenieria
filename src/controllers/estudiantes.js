const pool = require('../conexion/conexion.js');


// Obtener TODOS los Estudiantes
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




// Obtener Estudiantes por Rol
const getEstudiantesPorRol = async (req, res) => {
  try {
      let RolEstudiante = req.params.RolEstudiante; // Obtener el rol desde los parámetros de la solicitud
      RolEstudiante = RolEstudiante.trim(); // Eliminar espacios en blanco al principio y al final

      // Verificar si el rol es uno de los roles válidos
      const rolesValidos = ['Estudiante', 'Líder de semillero', 'Investigador Principal', 'Co-Investigador'];

      if (rolesValidos.includes(RolEstudiante)) {
          const respuesta = await pool.query('SELECT * FROM Estudiantes WHERE rol = $1', [RolEstudiante]);

          if (respuesta.rows.length === 0) {
              res.status(404).json({ message: `No se encontraron estudiantes con el rol: ${RolEstudiante}` });
          } else {
              res.status(200).json(respuesta.rows);
          }
      } else {
          res.status(400).json({ error: 'El rol ingresado no es válido' });
      }
  } catch (error) {
      console.error('Error en la consulta a la base de datos: ', error);
      res.status(500).json({ error: 'Error en la consulta a la base de datos' });
  }
};




//Create estudiante

const createEstudiante = async (req, res) => {
  try {
      const { NombreCompleto, ProyectoId, Rol } = req.body; // Obtener datos del cuerpo de la solicitud

      // Verificar si el rol es uno de los roles válidos
      const rolesValidos = ['Estudiante', 'Líder de semillero', 'Investigador Principal', 'Co-Investigador'];

      // Validar si ProyectoId es un número entero positivo
      if (!Number.isInteger(ProyectoId) || ProyectoId <= 0) {
          return res.status(400).json({ error: 'ProyectoId debe ser un número entero positivo' });
      }

      // Verificar si el rol es válido
      if (!rolesValidos.includes(Rol)) {
          return res.status(400).json({ error: 'El rol ingresado no es válido' });
      }

      // Verificar si el ProyectoId existe en la base de datos
      const proyectoExistente = await pool.query('SELECT ProyectoId FROM Proyectos WHERE ProyectoId = $1', [ProyectoId]);

      if (proyectoExistente.rows.length === 0) {
          return res.status(404).json({ error: `No existe un proyecto con el ID: ${ProyectoId}` });
      }

      // Insertar el estudiante en la base de datos
      const respuesta = await pool.query(
          'INSERT INTO Estudiantes (NombreCompleto, ProyectoId, Rol) VALUES ($1, $2, $3) RETURNING *',
          [NombreCompleto, ProyectoId, Rol]
      );

      res.status(201).json({ message: 'Estudiante creado correctamente' }); // Respondemos con el mensaje de éxito
  } catch (error) {
      console.error('Error en la consulta a la base de datos: ', error);
      res.status(500).json({ error: 'Error en la consulta a la base de datos' });
  }
};


//Update Estudiante

const updateEstudiante = async (req, res) => {
  const EstudianteId = parseInt(req.params.EstudianteId);
  const { NombreCompleto, ProyectoId, Rol } = req.body;

  // Validar que EstudianteId sea un número entero positivo
  if (isNaN(EstudianteId) || EstudianteId <= 0) {
      res.status(400).json({ error: 'El ID del estudiante no es un número entero positivo válido' });
      return;
  }

  // Validar que el ID del estudiante sea obligatorio
  if (!EstudianteId) {
      res.status(400).json({ error: 'El ID del estudiante es obligatorio' });
      return;
  }

  // Consultar el estudiante existente
  const estudianteExistente = await pool.query('SELECT * FROM estudiantes WHERE estudianteid = $1', [EstudianteId]);

  // Verificar si el estudiante existe
  if (estudianteExistente.rowCount === 0) {
      res.status(404).json({ error: 'Estudiante no encontrado' });
      return;
  }

  // Validar que ProyectoId sea un número entero positivo
  if (ProyectoId !== undefined) {
      if (!Number.isInteger(ProyectoId) || ProyectoId <= 0) {
          res.status(400).json({ error: 'ProyectoId debe ser un número entero positivo' });
          return;
      }

      // Validar que el ProyectoId existe en la base de datos
      const proyectoExistente = await pool.query('SELECT proyectoid FROM proyectos WHERE proyectoid = $1', [ProyectoId]);

      if (proyectoExistente.rowCount === 0) {
          res.status(404).json({ error: `No existe un proyecto con el ID: ${ProyectoId}` });
          return;
      }
  }

  // Validar que el Rol sea válido
  if (Rol !== undefined) {
      const rolesValidos = ['Estudiante', 'Líder de semillero', 'Investigador Principal', 'Co-Investigador'];

      if (!rolesValidos.includes(Rol)) {
          res.status(400).json({ error: 'El Rol ingresado no es válido' });
          return;
      }
  }

  // Arreglos para almacenar los nuevos valores y nombres de columnas
  const updateValuesEstudiantes = [];
  const updateColumnsEstudiantes = [];

  // Validar y agregar nuevos valores en la tabla "Estudiantes" si corresponde
  if (NombreCompleto !== undefined) {
      updateValuesEstudiantes.push(NombreCompleto);
      updateColumnsEstudiantes.push('NombreCompleto');
  }

  if (ProyectoId !== undefined) {
      updateValuesEstudiantes.push(ProyectoId);
      updateColumnsEstudiantes.push('ProyectoId');
  }

  if (Rol !== undefined) {
      updateValuesEstudiantes.push(Rol);
      updateColumnsEstudiantes.push('Rol');
  }

  // Si updateValuesEstudiantes está vacío, significa que no hay cambios que realizar en la tabla "Estudiantes".
  if (updateValuesEstudiantes.length === 0) {
      res.status(400).json({ error: 'Ningún campo para actualizar proporcionado' });
      return;
  }

  // Agregar EstudianteId al arreglo updateValuesEstudiantes para identificar al estudiante a actualizar en la tabla "Estudiantes"
  updateValuesEstudiantes.push(EstudianteId);

  // Construir la consulta SQL dinámicamente para la actualización en la tabla "Estudiantes"
  const updateSetEstudiantes = updateColumnsEstudiantes.map((col, i) => `${col} = $${i + 1}`).join(', ');
  const queryEstudiantes = `UPDATE estudiantes SET ${updateSetEstudiantes} WHERE estudianteid = $${updateValuesEstudiantes.length}`;

  // Realizar la actualización en la tabla "Estudiantes"
  const respuestaEstudiantes = await pool.query(queryEstudiantes, updateValuesEstudiantes);

  if (respuestaEstudiantes.rowCount === 1) {
      res.status(200).json({ message: 'Estudiante actualizado con éxito' });
  } else {
      res.status(500).json({ error: 'Error al actualizar el estudiante' });
  }
};






















//Delete Estudiante

const deleteEstudiante = async (req, res) => {
  const EstudianteId = parseInt(req.params.EstudianteId);

  // Verificar si el ID es un número válido y es un número entero positivo
  if (isNaN(EstudianteId) || EstudianteId <= 0) {
      res.status(400).json({ error: 'El ID proporcionado no es un número entero positivo válido.' });
      return;
  }

  try {
      const response = await pool.query('DELETE FROM estudiantes WHERE estudianteid = $1', [EstudianteId]);

      if (response.rowCount > 0) {
          res.json(`El estudiante con ID: ${EstudianteId} se eliminó correctamente.`);
      } else {
          res.status(404).json(`No se encontró ningún estudiante con el ID: ${EstudianteId}`);
      }
  } catch (error) {
      console.error('Error en la consulta a la base de datos: ', error);
      res.status(500).json('Error en la consulta a la base de datos');
  }
};








module.exports = {
    getEstudiantes,
    getEstudianteById,
    getEstudiantesPorRol,
    createEstudiante,
    updateEstudiante,
    deleteEstudiante
}