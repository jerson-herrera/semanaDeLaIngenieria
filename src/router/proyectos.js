const { Router } = require('express'); 

const routerProyectos = Router();




const { getProyectos, getProyectoById, deleteProyecto, createProyecto, updateProyecto}  = require('../controllers/proyectos');
//getTipoProyecto


routerProyectos.get('/getAllProyectos',                       getProyectos                      );
routerProyectos.get('/getProyecto/:ProyectoId',               getProyectoById                   ); 
// routerProyectos.get('/getTipoProyecto/:tipoProyecto',         getTipoProyecto                   );
routerProyectos.post('/CreateProyecto',                        createProyecto                    );
routerProyectos.put('/updateProyecto/:ProyectoId',                    updateProyecto                    );
routerProyectos.delete('/deleteProyecto/:ProyectoId',                 deleteProyecto                    );





module.exports = routerProyectos; 