const { Router } = require('express'); 

const routerEstudiantes = Router();




const { getEstudiantes, getEstudianteById} = require('../controllers/estudiantes');

//, getEstudianteById, getTipoEstudiante, createEstudiante, updateEstudiante, deleteEstudiante
routerEstudiantes.get('/getAllEstudiantes',                       getEstudiantes                      );
routerEstudiantes.get('/getEstudiante/:EstudianteId',                       getEstudianteById                   ); 
// routerEstudiantes.get('/getTipoEstudiante/:tipoEstudiante',          getTipoEstudiante                   );
// routerEstudiantes.post('/CrearEstudiante',                        createEstudiante                    );
// routerEstudiantes.put('/updateEstudiante/:id',                    updateEstudiante                    );
// routerEstudiantes.delete('/deleteEstudiante/:id',                 deleteEstudiante                    );



 
module.exports = routerEstudiantes; 