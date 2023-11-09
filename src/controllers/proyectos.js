const pool = require('../conexion/conexion.js');


// Obtener TODOS los getProyectos
const getProyectos = async (req, res) => {

    try {
      const respuesta = await pool.query('SELECT * FROM proyectos ORDER BY proyectoid ASC');
  
      if (respuesta.rows.length === 0) {
        res.status(404).json({ message: "No se encontraron proyectos" });
      } else {
        res.status(200).json(respuesta.rows);
      }
    } catch (error) {
      console.error("Error en la consulta a la base de datos: ", error);
      res.status(500).json({ error: "Error en la consulta a la base de datos" });
    }
};



// Obtener Proyectos especifico por (id).
const getProyectoById = async (req, res) => {
  const ProyectoId = parseInt(req.params.ProyectoId);

  // Verificar si el ID no es un numero valido o si no es un numero entero
  if (isNaN(ProyectoId) || !Number.isInteger(ProyectoId) || ProyectoId <= 0) {
    res.status(400).json({ mensaje: 'El ID proporcionado no es un numero entero valido o no es positivo.' });
    return; // Salir de la función
  }

  try {
    const respuesta = await pool.query('SELECT * FROM proyectos WHERE proyectoid = $1', [ProyectoId]);

    if (respuesta.rows.length > 0) {
      res.json(respuesta.rows);
    } else {
      res.status(404).json({ mensaje: 'No se encontró un proyecto con el ID ' + ProyectoId + ' que has proporcionado.' });
    }
  } catch (error) {
    console.error("Error en la consulta a la base de datos: ", error);
    res.status(500).json({ mensaje: 'Error en la consulta a la base de datos' });
  }
};


//Create Proyecto.
const createProyecto = async (req, res) => {
  const {
    programaAcademico,
    facultad,
    grupoInvestigacion,
    resolucionRectoralAprueba,
    convocatoriaAprueba,
    fechaInicio,
    fechaFinalizacion,
    estado,
    actaInicio,
    actaCompromiso,
    actaPropiedadIntelectual,
    guiaSoporte,
    investigadores,
    semillero,
    titulo,
    resumen,
    objetivos,
    metodologia,
    cronograma
  } = req.body;

  // Verificar si hay datos faltantes
  if (
    programaAcademico === "" ||
    facultad === "" ||
    grupoInvestigacion === "" ||
    resolucionRectoralAprueba === "" ||
    convocatoriaAprueba === "" ||
    fechaInicio === "" ||
    fechaFinalizacion === "" ||
    estado === "" ||
    actaInicio === "" ||
    actaCompromiso === "" ||
    actaPropiedadIntelectual === "" ||
    guiaSoporte === "" ||
    investigadores === "" ||
    semillero === "" ||
    titulo === "" ||
    resumen === "" ||
    objetivos === "" ||
    metodologia === "" ||
    cronograma === ""
  ) {
    res.status(400).json({ error: "Ausencia de datos" });
    return;
  }

  const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!fechaRegex.test(fechaInicio) || !fechaRegex.test(fechaFinalizacion)) {
    res.status(400).json({ error: "Formato de fecha incorrecto. Debe ser YYYY-MM-DD" });
    return;
  }

  try {
    const respuesta = await pool.query(
      'INSERT INTO Proyectos (ProgramaAcademico, Facultad, GrupoInvestigacion, ResolucionRectoralAprueba, ConvocatoriaAprueba, FechaInicio, FechaFinalizacion, Estado, ActaInicio, ActaCompromiso, ActaPropiedadIntelectual, GuiaSoporte, Investigadores, Semillero, Titulo, Resumen, Objetivos, Metodologia, Cronograma) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)',
      [
        programaAcademico,
        facultad,
        grupoInvestigacion,
        resolucionRectoralAprueba,
        convocatoriaAprueba,
        fechaInicio,
        fechaFinalizacion,
        estado,
        actaInicio,
        actaCompromiso,
        actaPropiedadIntelectual,
        guiaSoporte,
        investigadores,
        semillero,
        titulo,
        resumen,
        objetivos,
        metodologia,
        cronograma
      ]
    );

    if (respuesta.rowCount === 1) {
      res.status(201).json({ message: 'Proyecto creado con éxito' });
    } else {
      res.status(500).json({ error: 'Error al insertar proyecto' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el proyecto' });
  }
};

//------------------------------------------------------------------------------------------------------------------------------------------------------


// Update Proyecto.
const updateProyecto = async (req, res) => {

  
  const ProyectoId = parseInt(req.params.ProyectoId); // Capturamos el ID del proyecto de la URL como número entero
  const {
    programaAcademico,
    facultad,
    grupoInvestigacion,
    resolucionRectoralAprueba,
    convocatoriaAprueba,
    fechaInicio,
    fechaFinalizacion,
    estado,
    actaInicio,
    actaCompromiso,
    actaPropiedadIntelectual,
    guiaSoporte,
    investigadores,
    semillero,
    titulo,
    resumen,
    objetivos,
    metodologia,
    cronograma
  } = req.body;

  // Validar que proyectoId sea un número entero positivo
  if (isNaN(ProyectoId) || ProyectoId <= 0) {
    res.status(400).json({ mensaje: 'El ID proporcionado no es un numero entero valido o no es positivo.' });
    return; // Salir de la función
  }
  // Validar que el ID del proyecto sea obligatorio
  if (!ProyectoId) {
    res.status(400).json({ error: "El ID del proyecto es obligatorio" });
    return;
  }

  // Consultar el proyecto existente
  const proyectoExists = await pool.query('SELECT * FROM proyectos WHERE proyectoid = $1', [ProyectoId]);

  // Verificar si el proyecto existe
  if (proyectoExists.rowCount === 0) {
    res.status(404).json({ error: 'Proyecto no encontrado' });
    return;
  }

  // Arreglos para almacenar los nuevos valores y nombres de columnas
  const updateValuesProyecto = [];
  const updateColumnsProyecto = [];

  // Validar y agregar nuevos valores en la tabla "Proyectos" si corresponde
  if (programaAcademico !== undefined) {
    updateValuesProyecto.push(programaAcademico);
    updateColumnsProyecto.push('ProgramaAcademico');
  }

  if (facultad !== undefined) {
    updateValuesProyecto.push(facultad);
    updateColumnsProyecto.push('Facultad');
  }

  if (grupoInvestigacion !== undefined) {
    updateValuesProyecto.push(grupoInvestigacion);
    updateColumnsProyecto.push('GrupoInvestigacion');
  }

  if (resolucionRectoralAprueba !== undefined) {
    updateValuesProyecto.push(resolucionRectoralAprueba);
    updateColumnsProyecto.push('ResolucionRectoralAprueba');
  }

  if (convocatoriaAprueba !== undefined) {
    updateValuesProyecto.push(convocatoriaAprueba);
    updateColumnsProyecto.push('ConvocatoriaAprueba');
  }

  if (fechaInicio !== undefined) {
    updateValuesProyecto.push(fechaInicio);
    updateColumnsProyecto.push('FechaInicio');
  }

  if (fechaFinalizacion !== undefined) {
    updateValuesProyecto.push(fechaFinalizacion);
    updateColumnsProyecto.push('FechaFinalizacion');
  }

  if (estado !== undefined) {
    updateValuesProyecto.push(estado);
    updateColumnsProyecto.push('Estado');
  }

  if (actaInicio !== undefined) {
    updateValuesProyecto.push(actaInicio);
    updateColumnsProyecto.push('ActaInicio');
  }

  if (actaCompromiso !== undefined) {
    updateValuesProyecto.push(actaCompromiso);
    updateColumnsProyecto.push('ActaCompromiso');
  }

  if (actaPropiedadIntelectual !== undefined) {
    updateValuesProyecto.push(actaPropiedadIntelectual);
    updateColumnsProyecto.push('ActaPropiedadIntelectual');
  }

  if (guiaSoporte !== undefined) {
    updateValuesProyecto.push(guiaSoporte);
    updateColumnsProyecto.push('GuiaSoporte');
  }

  if (investigadores !== undefined) {
    updateValuesProyecto.push(investigadores);
    updateColumnsProyecto.push('Investigadores');
  }

  if (semillero !== undefined) {
    updateValuesProyecto.push(semillero);
    updateColumnsProyecto.push('Semillero');
  }

  if (titulo !== undefined) {
    updateValuesProyecto.push(titulo);
    updateColumnsProyecto.push('Titulo');
  }

  if (resumen !== undefined) {
    updateValuesProyecto.push(resumen);
    updateColumnsProyecto.push('Resumen');
  }

  if (objetivos !== undefined) {
    updateValuesProyecto.push(objetivos);
    updateColumnsProyecto.push('Objetivos');
  }

  if (metodologia !== undefined) {
    updateValuesProyecto.push(metodologia);
    updateColumnsProyecto.push('Metodologia');
  }

  if (cronograma !== undefined) {
    updateValuesProyecto.push(cronograma);
    updateColumnsProyecto.push('Cronograma');
  }

  // Si updateValuesProyecto está vacío, significa que no hay cambios que realizar en la tabla "Proyectos".
  if (updateValuesProyecto.length === 0) {
    res.status(400).json({ error: 'Ningún campo para actualizar proporcionado' });
    return;
  }

  // Agregar proyectoId al arreglo updateValuesProyecto para identificar al proyecto a actualizar en la tabla "Proyectos"
  updateValuesProyecto.push(ProyectoId);

  // Construir la consulta SQL dinámicamente para la actualización en la tabla "Proyectos"
  const updateSetProyecto = updateColumnsProyecto.map((col, i) => `${col} = $${i + 1}`).join(', ');
  const queryProyecto = `UPDATE proyectos SET ${updateSetProyecto} WHERE proyectoid = $${updateValuesProyecto.length}`;

  // Realizar la actualización en la tabla "Proyectos"
  const respuestaProyecto = await pool.query(queryProyecto, updateValuesProyecto);

  if (respuestaProyecto.rowCount === 1) {
    res.status(200).json({ message: 'Proyecto actualizado con éxito' });
  } else {
    res.status(500).json({ error: 'Error al actualizar el proyecto' });
  }
};











//Borrar Proyecto
const deleteProyecto = async (req, res) => {
  const ProyectoId = parseInt(req.params.ProyectoId);

  if (isNaN(ProyectoId) || ProyectoId <= 0) {
      res.status(400).json({ error: 'El ID proporcionado no es un numero entero positivo valido.' });
      return;
  }
  

  try {
      // Eliminar registros en la tabla estudiantes relacionados con el proyecto
      await pool.query('DELETE FROM estudiantes WHERE proyectoid = $1', [ProyectoId]);

      // Luego, eliminar el proyecto
      const response = await pool.query('DELETE FROM proyectos WHERE proyectoid = $1', [ProyectoId]);

      if (response.rowCount > 0) {
          res.json(`El proyecto con ID: ${ProyectoId} se eliminó correctamente.`);
      } else {
          res.status(404).json(`No se encontró ningún proyecto con el ID: ${ProyectoId}`);
      }
  } catch (error) {
      console.error('Error en la consulta a la base de datos: ', error);
      res.status(500).json('Error en la consulta a la base de datos');
  }
};














module.exports = {
    getProyectos,
    getProyectoById,
    deleteProyecto,
    createProyecto,
    updateProyecto
}