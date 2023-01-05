document.querySelector('#calculateAge').addEventListener('click', calculateAge);
document.querySelector('#calculateScore').addEventListener('click', calculateScore);

let monthDiff;
let yearDiff;
let table;
let arrScaledScores = [];
let objScaledScores = {};

// function that calculates the age and updates the DOM
function calculateAge() {
    const testDate = new Date(document.querySelector('#testDate').value);
    const birthDate = new Date(document.querySelector('#birthDate').value);

    if(birthDate>testDate) {
        return document.querySelector('#ageresult').innerText = `Chronological Age: Birthdate cannot come after test date.`;
    }

    const ageInDays = (testDate-birthDate)/8.64e+7;

    dayDiff = Math.floor(ageInDays%365%30.4167);
    monthDiff = Math.floor(ageInDays%365/30.4167);
    yearDiff = Math.floor(ageInDays/365);

    document.querySelector('#ageresult').innerText = `Chronological Age: Year: ${yearDiff} Month: ${monthDiff} Day: ${dayDiff}`;
}

// age calculation to determine db table
function useTable(yearDiff, monthDiff) {
    if(yearDiff===5 && monthDiff<=2) {
        table = '50to52';
    } else if(yearDiff===5 && monthDiff<=5) {
        table = '53to55';
    } else if(yearDiff===5 && monthDiff<=8) {
        table = '56to58';
    } else if(yearDiff===5 && monthDiff<=11) {
        table = '59to511';
    } else if(yearDiff===6 && monthDiff<=2) {
        table = '60to62';
    } else if(yearDiff===6 && monthDiff<=5) {
        table = '63to65';
    } else if(yearDiff===6 && monthDiff<=8) {
        table = '66to68';
    } else if(yearDiff===6 && monthDiff<=11) {
        table = '69to611';
    } else if(yearDiff===7 && monthDiff<=5) {
        table = '70to75';
    } else if(yearDiff===7 && monthDiff<=11) {
        table = '76to711';
    } else if(yearDiff===8 && monthDiff<=5) {
        table = '80to85';
    } else if(yearDiff===8 && monthDiff<=11) {
        table = '86to811';
    } else if(yearDiff===9 && monthDiff<=5) {
        table = '90to95';
    } else if(yearDiff===9 && monthDiff<=11) {
        table = '96to911';
    } else if(yearDiff===10 && monthDiff<=5) {
        table = '100to105';
    } else if(yearDiff===10 && monthDiff<=11) {
        table = '106to1011';
    } else if(yearDiff===11 && monthDiff<=11) {
        table = '11to1111';
    } else if(yearDiff===12 && monthDiff<=11) {
        table = '12to1211';
    } else if(yearDiff===13 && monthDiff<=11) {
        table = '13to1311';
    } else if(yearDiff===14 && monthDiff<=11) {
        table = '14to1411';
    } else if(yearDiff===15 && monthDiff<=11) {
        table = '15to1511';
    } else if(yearDiff===16 && monthDiff<=11) {
        table = '16to1611';
    } else if(yearDiff===17 && monthDiff<=11) {
        table = '17to1711';
    } else if(yearDiff===18 && monthDiff<=11) {
        table = '18to1811';
    } else if(yearDiff===19 && monthDiff<=11) {
        table = '19to1911';
    } else if(yearDiff===20 && monthDiff<=11) {
        table = '20to2011';
    } else if(yearDiff===21 && monthDiff<=11) {
        table = '21to2111';
    } 
}

// function that fetches and updates DOM with scaled scores
function calculateScore() {
    useTable(yearDiff, monthDiff);

    // resetting arr and obj
    arrScaledScores = [];
    objScaledScores = {};
        
    const subtestRawScores = {
        subtest_1 : Number(document.querySelector('#subtest1').value),
        subtest_2 : Number(document.querySelector('#subtest2').value),
        subtest_3 : Number(document.querySelector('#subtest3').value),
        subtest_4 : Number(document.querySelector('#subtest4').value),
        subtest_5 : Number(document.querySelector('#subtest5').value),
        subtest_6 : Number(document.querySelector('#subtest6').value),
        subtest_7 : Number(document.querySelector('#subtest7').value),
        subtest_8 : Number(document.querySelector('#subtest8').value),
        subtest_9 : Number(document.querySelector('#subtest9').value),
        subtest_10 : Number(document.querySelector('#subtest10').value),
        subtest_11 : Number(document.querySelector('#subtest11').value),
    }

    // create array of valid raw scores to fetch
    const subtestRawScoresFetchArr = [];
    for(const subtest in subtestRawScores) {
        if(subtestRawScores[subtest]>0) {
            subtestRawScoresFetchArr.push(fetch(`http://localhost:3000/taps/${table}/${subtest}/${subtestRawScores[subtest]}`));
        } else {
            // resets DOM to blank if raw score is not greater than 0
            document.querySelector(`#${subtest}_scaledScore`).innerText = '';
        }
    }
    
    // fetches fields that contain raw scoles
    const fetchScores = async(callBackFn) => {
        try {
            const res = await Promise.all(subtestRawScoresFetchArr);
            const resData = await Promise.all(res.map(r => r.json()));
            arrScaledScores.push(...resData.flat());
        } catch {
            throw Error("Promised failed");
        }

        // inputs scaled scores from fetch into the DOM
        arrScaledScores.forEach((ele) => {
            let subtest = Object.keys(ele)[0];
            let score = Object.values(ele)[0];
            document.querySelector(`#${subtest}_scaledScore`).innerText = score;
        });

        // convert array of objects of scaled scores to an object of scaled scores to ease of access
        arrScaledScores.forEach((ele) => {
            objScaledScores[Object.keys(ele)[0]] = Object.values(ele)[0];
        });
        callBackFn();
    }

    // runs the fetchScores function
    fetchScores(sumScaledScores);
}

// function that sums scaled scores and updates the DOM
function sumScaledScores() {

    // loops through and replaces missing subtests with 0 so sums are not NaN
    for(let i=1; i<=11; i++) {
        let subtest = `subtest_${i}`;
        if(!objScaledScores.hasOwnProperty(subtest)) {
            objScaledScores[subtest]= 0;
        }
    }

    const ppiSumScaledScore = objScaledScores.subtest_2 + objScaledScores.subtest_3 + objScaledScores.subtest_4;
    const amiSumScaledScore = objScaledScores.subtest_7 + objScaledScores.subtest_9 + objScaledScores.subtest_10;
    const lciSumScaledScore = objScaledScores.subtest_1 + objScaledScores.subtest_11; 
    const oscSumScaledScore = ppiSumScaledScore + amiSumScaledScore + lciSumScaledScore;
    
    document.querySelector('#ppi_sum').innerText = ppiSumScaledScore;
    document.querySelector('#ami_sum').innerText = amiSumScaledScore;
    document.querySelector('#lci_sum').innerText = lciSumScaledScore;
    document.querySelector('#ppi').innerText = ppiSumScaledScore;
    document.querySelector('#ami').innerText = amiSumScaledScore;
    document.querySelector('#lci').innerText = lciSumScaledScore;
    document.querySelector('#osc_sum').innerText = oscSumScaledScore;
}

// a function to alert user that numbers are missing
