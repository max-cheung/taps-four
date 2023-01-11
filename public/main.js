document.querySelector('#calculateAge').addEventListener('click', calculateAge);
document.querySelector('#calculateScore').addEventListener('click', calculateScore);

let monthDiff;
let yearDiff;
let table;
let arrScaledScores = [];
let objScaledScores = {};
let ppiSumScaledScore;
let amiSumScaledScore;
let lciSumScaledScore;
let oscSumScaledScore;
let arrIndexStandardScores = [];

// function to remove 'alertRed' class from highlighted missing fields
function removeRed(subtest) {
    document.querySelector(subtest).classList.remove('alertRed');
}

// function that calculates the age and updates the DOM
function calculateAge() {
    // displays error if dates aren't provided
    if(document.querySelector('#testDate').value==='' || document.querySelector('#birthDate').value==='') {
        document.querySelector('#ageResult').classList.add('alertText');
        return document.querySelector('#ageResult').innerText = `Chronological Age: Invalid Age`;
    }

    const testDate = new Date(document.querySelector('#testDate').value);
    const birthDate = new Date(document.querySelector('#birthDate').value);

    if(birthDate>testDate) {
        dayDiff = undefined;
        monthDiff = undefined;
        yearDiff = undefined;
        
        //displays error if birthDate comes after testDate
        document.querySelector('#ageResult').classList.add('alertText');
        return document.querySelector('#ageResult').innerText = `Chronological Age: Birthdate cannot come after test date.`;
    }

    const ageInDays = (testDate-birthDate)/8.64e+7;

    dayDiff = Math.floor(ageInDays%365%30.4167);
    monthDiff = Math.floor(ageInDays%365/30.4167);
    yearDiff = Math.floor(ageInDays/365);
    
    // removes alertText and prints valid Chronological Age in the DOM
    document.querySelector('#ageResult').classList.remove('alertText');
    document.querySelector('#ageResult').innerText = `Chronological Age: Year: ${yearDiff} Month: ${monthDiff} Day: ${dayDiff}`;
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
    // displays error if Chronological Age Calculator is not calculated prior
    if(monthDiff===undefined || yearDiff===undefined) {
        return document.querySelector('#calculationError').innerText = 'Please calculate Chronological Age First';
    } else {
        document.querySelector('#calculationError').innerText = '';
    }

    // function to set monthDiff and yearDiff
    useTable(yearDiff, monthDiff);

    // resetting arr and obj
    arrScaledScores = [];
    objScaledScores = {};
    arrIndexStandardScores = [];

    // check for empty subtests
    //
    // subtests 2,3,4,7,9,10,1, and 11 can't be empty
    // adds class of alertRed to indicate missing field for user, also adds event listener to remove the class when changed
    // stops function if any of the above is empty
    // removes applicable scaled scores from DOM including index standard scores
    if(document.querySelector('#subtest2').value === '') {
        document.querySelector('#subtest2').classList.add('alertRed');
        document.querySelector('#subtest2').addEventListener('change', function() { removeRed('#subtest2')});
        // removes applicable calculations from the DOM
        document.querySelector('#subtest_2_scaledScore').innerText = '';
        document.querySelector('#ppi_sum').innerText = '';
        document.querySelector('#index_standard_score_ppi').innerText = '';
    }
    if(document.querySelector('#subtest3').value === '') {
        document.querySelector('#subtest3').classList.add('alertRed');
        document.querySelector('#subtest3').addEventListener('change', function() { removeRed('#subtest3')});
        // removes applicable calculations from the DOM
        document.querySelector('#subtest_3_scaledScore').innerText = '';
        document.querySelector('#ppi_sum').innerText = '';
        document.querySelector('#index_standard_score_ppi').innerText = '';
    }
    if(document.querySelector('#subtest4').value === '') {
        document.querySelector('#subtest4').classList.add('alertRed');
        document.querySelector('#subtest4').addEventListener('change', function() { removeRed('#subtest4')});
        // removes applicable calculations from the DOM
        document.querySelector('#subtest_4_scaledScore').innerText = '';
        document.querySelector('#ppi_sum').innerText = '';
        document.querySelector('#index_standard_score_ppi').innerText = '';
    }
    if(document.querySelector('#subtest7').value === '') {
        document.querySelector('#subtest7').classList.add('alertRed');
        document.querySelector('#subtest7').addEventListener('change', function() { removeRed('#subtest7')});
        // removes applicable calculations from the DOM
        document.querySelector('#subtest_7_scaledScore').innerText = '';
        document.querySelector('#ami_sum').innerText = '';
        document.querySelector('#index_standard_score_ami').innerText = '';
    }
    if(document.querySelector('#subtest9').value === '') {
        document.querySelector('#subtest9').classList.add('alertRed');
        document.querySelector('#subtest9').addEventListener('change', function() { removeRed('#subtest9')});
        // removes applicable calculations from the DOM
        document.querySelector('#subtest_9_scaledScore').innerText = '';
        document.querySelector('#ami_sum').innerText = '';
        document.querySelector('#index_standard_score_ami').innerText = '';
    }
    if(document.querySelector('#subtest10').value === '') {
        document.querySelector('#subtest10').classList.add('alertRed');
        document.querySelector('#subtest10').addEventListener('change', function() { removeRed('#subtest10')});
        // removes applicable calculations from the DOM
        document.querySelector('#subtest_10_scaledScore').innerText = '';
        document.querySelector('#ami_sum').innerText = '';
        document.querySelector('#index_standard_score_ami').innerText = '';
    }
    if(document.querySelector('#subtest1').value === '') {
        document.querySelector('#subtest1').classList.add('alertRed');
        document.querySelector('#subtest1').addEventListener('change', function() { removeRed('#subtest1')});
        // removes applicable calculations from the DOM
        document.querySelector('#subtest_1_scaledScore').innerText = '';
        document.querySelector('#lci_sum').innerText = '';
        document.querySelector('#index_standard_score_lci').innerText = '';
    }
    if(document.querySelector('#subtest11').value === '') {
        document.querySelector('#subtest11').classList.add('alertRed');
        document.querySelector('#subtest11').addEventListener('change', function() { removeRed('#subtest11')});
        // removes applicable calculations from the DOM
        document.querySelector('#subtest_11_scaledScore').innerText = '';
        document.querySelector('#lci_sum').innerText = '';
        document.querySelector('#index_standard_score_lci').innerText = '';
    }
    if(
        document.querySelector('#subtest2').value === '' ||
        document.querySelector('#subtest3').value === '' ||
        document.querySelector('#subtest4').value === '' ||
        document.querySelector('#subtest7').value === '' ||
        document.querySelector('#subtest9').value === '' ||
        document.querySelector('#subtest10').value === '' ||
        document.querySelector('#subtest1').value === '' ||
        document.querySelector('#subtest11').value === ''
    ) {
        return document.querySelector('#calculationError').innerText = 'Please fill out all required fields';
    }

    // undefined prevents ''>=0 === true and creating fetch array with invalid input below
    const subtestRawScores = {
        subtest_1 : document.querySelector('#subtest1').value!=='' ? Number(document.querySelector('#subtest1').value) : undefined,
        subtest_2 : document.querySelector('#subtest2').value!=='' ? Number(document.querySelector('#subtest2').value) : undefined,
        subtest_3 : document.querySelector('#subtest3').value!=='' ? Number(document.querySelector('#subtest3').value) : undefined,
        subtest_4 : document.querySelector('#subtest4').value!=='' ? Number(document.querySelector('#subtest4').value) : undefined,
        subtest_5 : document.querySelector('#subtest5').value!=='' ? Number(document.querySelector('#subtest5').value) : undefined,
        subtest_6 : document.querySelector('#subtest6').value!=='' ? Number(document.querySelector('#subtest6').value) : undefined,
        subtest_7 : document.querySelector('#subtest7').value!=='' ? Number(document.querySelector('#subtest7').value) : undefined,
        subtest_8 : document.querySelector('#subtest8').value!=='' ? Number(document.querySelector('#subtest8').value) : undefined,
        subtest_9 : document.querySelector('#subtest9').value!=='' ? Number(document.querySelector('#subtest9').value) : undefined,
        subtest_10 : document.querySelector('#subtest10').value!=='' ? Number(document.querySelector('#subtest10').value) : undefined,
        subtest_11 : document.querySelector('#subtest11').value!=='' ? Number(document.querySelector('#subtest11').value) : undefined,
    }

    // create array of valid raw scores to fetch
    const subtestRawScoresFetchArr = [];
    for(const subtest in subtestRawScores) {
        if(subtestRawScores[subtest]>=0) {
            subtestRawScoresFetchArr.push(fetch(`http://localhost:3000/taps/${table}/${subtest}/${subtestRawScores[subtest]}`));
        } else {
            // resets DOM to blank if raw score is not greater than or equal to 0
            document.querySelector(`#${subtest}_scaledScore`).innerText = '';
        }
    }
    
    // fetches fields that contain raw scores
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
    ppiSumScaledScore = objScaledScores.subtest_2 + objScaledScores.subtest_3 + objScaledScores.subtest_4;
    amiSumScaledScore = objScaledScores.subtest_7 + objScaledScores.subtest_9 + objScaledScores.subtest_10;
    lciSumScaledScore = objScaledScores.subtest_1 + objScaledScores.subtest_11; 
    oscSumScaledScore = ppiSumScaledScore + amiSumScaledScore + lciSumScaledScore;
    
    document.querySelector('#ppi_sum').innerText = ppiSumScaledScore;
    document.querySelector('#ami_sum').innerText = amiSumScaledScore;
    document.querySelector('#lci_sum').innerText = lciSumScaledScore;
    document.querySelector('#ppi').innerText = ppiSumScaledScore;
    document.querySelector('#ami').innerText = amiSumScaledScore;
    document.querySelector('#lci').innerText = lciSumScaledScore;
    document.querySelector('#osc_sum').innerText = oscSumScaledScore;

    calculateIndexStandardScore();
}

// function that fetches and updates DOM with Index Standard Score
function calculateIndexStandardScore() {
    // create array of sum of scaled scores to fetch
    const arrSumScaledScore = [
        fetch(`http://localhost:3000/taps/index_standard_score_ppi/${ppiSumScaledScore}`),
        fetch(`http://localhost:3000/taps/index_standard_score_ami/${amiSumScaledScore}`),
        fetch(`http://localhost:3000/taps/index_standard_score_lci/${lciSumScaledScore}`),
        fetch(`http://localhost:3000/taps/overall_standard_score/${oscSumScaledScore}`),
    ];

    // fetch index standard scores from sum scaled scores
    const fetchIndexStandardScores = async() => {
        try {
            const res = await Promise.all(arrSumScaledScore);
            const resData = await Promise.all(res.map(r => r.json()));
            arrIndexStandardScores.push(...resData.flat());

            // input index standard scores from fetch into the DOM
            document.querySelector('#index_standard_score_ppi').innerText = arrIndexStandardScores[0].standard_score;
            document.querySelector('#index_standard_score_ami').innerText = arrIndexStandardScores[1].standard_score;
            document.querySelector('#index_standard_score_lci').innerText = arrIndexStandardScores[2].standard_score;
            document.querySelector('#index_standard_score_osc').innerText = arrIndexStandardScores[3].standard_score;
        } catch {
            throw Error("Promised failed");
        }
    }

    fetchIndexStandardScores();
}
