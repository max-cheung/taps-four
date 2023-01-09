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

// get scaled scores from subtests
app.get('/taps/:table/:subtest/:rawscore', (request, response) => {
    const table = request.params.table;
    const subtest = request.params.subtest;
    const rawScore = request.params.rawscore;
    const sql = `SELECT ${subtest} FROM scaled_score_ages_${table} WHERE raw_score = ${rawScore}`;

    db.query(sql, (err, result) => {
        if(err) throw err;
        response.send(result);
    });
});

// get index standard scores from sum of scaled scores
app.get('/taps/:table/:sumScaledScore', (request, response) => {
    const table = request.params.table;
    const sumScaledScore = request.params.sumScaledScore;
    const sql = `SELECT standard_score FROM ${table} WHERE sum_scaled_scores = ${sumScaledScore}`;

    db.query(sql, (err, result) => {
        if(err) throw err;
        response.send(result);
    });
});
