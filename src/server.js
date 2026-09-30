import app from './app.js'
import pool from './config/database.js'

const PORT = process.env.PORT || 3000

pool.query('SELECT NOW()')
    .then(() => {
        console.log('PostgreSQL conectado')

        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`)
        })
    })
    .catch((error) => {
        console.error('Error conectando a PostgreSQL:', error)
    })