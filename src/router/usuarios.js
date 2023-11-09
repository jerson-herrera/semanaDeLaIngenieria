const { Router } = require('express'); 

const routerUsuarios = Router();




const { getUsuarios} = require('../controllers/usuarios');

//, getUsuarioById, getTipoUsuario, createUsuario, updateUsuario, deleteUsuario
routerUsuarios.get('/getAllUsuarios',                       getUsuarios                      );
// routerUsuarios.get('/getUsuario/:id',                       getUsuarioById                   ); 
// routerUsuarios.get('/getTipoUsuario/:tipoUsuario',          getTipoUsuario                   );
// routerUsuarios.post('/CrearUsuario',                        createUsuario                    );
// routerUsuarios.put('/updateUsuario/:id',                    updateUsuario                    );
// routerUsuarios.delete('/deleteUsuario/:id',                 deleteUsuario                    );




module.exports = routerUsuarios; 