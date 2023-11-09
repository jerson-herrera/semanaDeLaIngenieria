const pool = require('../conexion/conexion.js');


// Obtener TODOS los Usuarios
const getUsuarios = async (req, res) => {

    try {
      const respuesta = await pool.query('SELECT * FROM usuarios ORDER BY usuarioid ASC');
  
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





module.exports = {
   getUsuarios
}