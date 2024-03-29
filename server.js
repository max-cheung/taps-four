require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.static('public'));

app.listen(process.env.PORT || PORT, function() {
    console.log(`Listening on port ${process.env.PORT}`);
})

app.get('/', (request, response) => {
    // obtain and console log client IP Address
    const ipAddress = request.socket.remoteAddress;
    console.log(ipAddress);

    response.sendFile(__dirname + '/index.html')
})

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.MYSQLUSER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.MYSQLPORT
});

db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('MySQL Connected...')
});

// get scaled scores from subtests
app.get('/taps/ss/:table/:subtest/:rawscore', (request, response) => {
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
app.get('/taps/iss/:table/:sumScaledScore', (request, response) => {
    const table = request.params.table;
    const sumScaledScore = request.params.sumScaledScore;
    const sql = `SELECT standard_score FROM ${table} WHERE sum_scaled_scores = ${sumScaledScore}`;

    db.query(sql, (err, result) => {
        if(err) throw err;
        response.send(result);
    });
});

// get confidence intervals
app.get('/taps/ci/:table', (request, response) => {
    const table = request.params.table;
    const sql = `SELECT confidence_interval_95 FROM ${table}`;

    db.query(sql, (err, result) => {
        if(err) throw err;
        response.send(result);
    });
});

// get index standard scores for individual subtests
app.get('/taps/subtestiss/:scaledScore', (request, response) => {
    const scaledScore = request.params.scaledScore;
    const sql = `SELECT standard_score FROM conversion_of_standard_scores WHERE scaled_score = ${scaledScore}`;

    db.query(sql, (err, result) => {
        if(err) throw err;
        response.send(result);
    });
})

// get percentile rank for individual subtests
app.get('/taps/subtestpr/:scaledScore', (request, response) => {
    const scaledScore = request.params.scaledScore;
    const sql = `SELECT percentile_rank FROM conversion_of_standard_scores WHERE scaled_score = ${scaledScore}`;

    db.query(sql, (err, result) => {
        if(err) throw err;
        response.send(result);
    });
})

// get percentile rank for indexes
app.get('/taps/indexpr/:standardScore', (request, response) => {
    const standardScore = request.params.standardScore;
    const sql = `SELECT percentile_rank FROM conversion_of_standard_scores_percentile_rank WHERE standard_score = ${standardScore}`;

    db.query(sql, (err, result) => {
        if(err) throw err;
        response.send(result);
    })
})

// get age equivalent for subtests
app.get('/taps/subtestae/:subtest/:rawScore', (request, response) => {
    const rawScore = request.params.rawScore;
    const subtest = request.params.subtest;
    const sql = `SELECT ${subtest} FROM subtest_age_equivalent WHERE raw_score = ${rawScore}`;

    db.query(sql, (err, result) => {
        if(err) throw err;
        response.send(result);
    })
})

// get age equivalent for indexes
app.get('/taps/indexae/:index/:sumRawScore', (request, response) => {
    const sumRawScore = request.params.sumRawScore;
    const index = request.params.index;
    const sql = `SELECT ${index} FROM index_age_equivalent WHERE raw_score = ${sumRawScore}`;

    db.query(sql, (err, result) => {
        if(err) throw err;
        response.send(result);
    })
})
