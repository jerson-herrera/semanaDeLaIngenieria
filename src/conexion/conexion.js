const { Pool } = require ('pg');

const pool = new Pool({
    user: 'postgres', 
    host: 'localhost', 
    password: '12345', 
    database: 'semanaDeLaIngenieria',
    port: '5432' 
});




module.exports = pool; 