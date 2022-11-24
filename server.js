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

db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('MySQL Connected...')
});

app.get('/taps/:subtest/:rawscore', (request, response) => {
    const subtest = request.params.subtest;
    const rawScore = request.params.rawscore;
    console.log(request.params.subtest);
    console.log(rawScore);
    const sql = `SELECT ${subtest} FROM scaled_score_ages_90to95 WHERE raw_score = ${rawScore}`;

    db.query(sql, (err, result) => {
        if(err) throw err;
        response.send(result);
    });
});
