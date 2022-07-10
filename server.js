const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.listen(process.env.PORT || PORT, function() {
    console.log('Listening on port 3000');
})

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html')
})

const db = mysql.createConnection({
    host: 'localhost',
    user: 'max',
    password: 'max321',
    database: 'taps',
    port: '/tmp/mysql.sock'
});

db.connect;

app.get('/taps', (req, res) => {
    const sql = 'SELECT * FROM scaled_score_ages_9to95';

    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});