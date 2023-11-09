const express = require ('express');  
const app = express();

const routerUsuarios = require('./router/usuarios');
const routerProyectos = require('./router/proyectos');
const routerEstudiantes = require('./router/estudiantes');


// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));



// Routes

app.use('/usuarios', routerUsuarios);
app.use('/proyectos', routerProyectos);
app.use('/estudiantes', routerEstudiantes);

const port = 4000;
app.listen(port, ()=>{
    console.log(`El servidor se esta ejecutando en el puerto: ${port}`) 
});