const { Router } = require('express'); 

const routerEstudiantes = Router();




const { getEstudiantes, getEstudianteById, getEstudiantesPorRol, createEstudiante, updateEstudiante, deleteEstudiante} = require('../controllers/estudiantes');


routerEstudiantes.get('/getAllEstudiantes',                       getEstudiantes                      );
routerEstudiantes.get('/getEstudiante/:EstudianteId',                       getEstudianteById                   ); 
routerEstudiantes.get('/getEstudiantesPorRol/:RolEstudiante',          getEstudiantesPorRol                   );
routerEstudiantes.post('/CreateEstudiante',                        createEstudiante                    );
routerEstudiantes.put('/updateEstudiante/:EstudianteId',                    updateEstudiante                    );
routerEstudiantes.delete('/deleteEstudiante/:EstudianteId',                 deleteEstudiante                    );



 
module.exports = routerEstudiantes; 