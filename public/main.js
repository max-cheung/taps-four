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
let objSubtestIndexStandardScores = {};
let objConfidenceIntervals = {
    subtest_1 : undefined,
    subtest_2 : undefined,
    subtest_3 : undefined,
    subtest_4 : undefined,
    subtest_5 : undefined,
    subtest_6 : undefined,
    subtest_7 : undefined,
    subtest_8 : undefined,
    subtest_9 : undefined,
    subtest_10 : undefined,
    subtest_11 : undefined,
    ppi : undefined,
    ami : undefined,
    lci : undefined,
    osc : undefined,
};
let objSubtestPercentileRanks = {};
let subtestRawScores;

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

    // displays error if age is less than 5 or greater than 21
    if(yearDiff<5 || yearDiff>21) {
        dayDiff = undefined;
        monthDiff = undefined;
        yearDiff = undefined;
        
        //displays error if birthDate comes after testDate
        document.querySelector('#ageResult').classList.add('alertText');
        return document.querySelector('#ageResult').innerText = `Chronological Age: Age cannot be less than 5 or greater than 21`;
    }
    
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
    // removes applicable scaled scores from DOM including index standard scores and confidence intervals
    if(document.querySelector('#subtest_2').value === '') {
        document.querySelector('#subtest_2').classList.add('alertRed');
        document.querySelector('#subtest_2').addEventListener('change', function() { removeRed('#subtest_2')});
        // removes applicable calculations from the DOM
        document.querySelector('#subtest_2_scaledScore').innerText = '';
        document.querySelector('#ppi_sum').innerText = '';
        document.querySelector('#index_standard_score_ppi').innerText = '';
        document.querySelector('#ppi').innerText = '';
        document.querySelector('#osc_sum').innerText = '';
        document.querySelector('#index_standard_score_osc').innerText = '';
        document.querySelector('#subtest_2_ci').innerText = '-';
        document.querySelector('#ppi_ci').innerText = '-';
        document.querySelector('#osc_ci').innerText = '-';
        document.querySelector('#overall_ppi_ci').innerText = '-';
        document.querySelector('#subtest_2_pr').innerText = '';
        document.querySelector('#ppi_pr').innerText = '';
        document.querySelector('#overall_ppi_pr').innerText = '';
        document.querySelector('#osc_pr').innerText = '';
        document.querySelector('#subtest_2_ae').innerText = '';
        document.querySelector('#ppi_ae').innerText = '';
        document.querySelector('#overall_ppi_ae').innerText = '';
        document.querySelector('#osc_ae').innerText = '';
    }
    if(document.querySelector('#subtest_3').value === '') {
        document.querySelector('#subtest_3').classList.add('alertRed');
        document.querySelector('#subtest_3').addEventListener('change', function() { removeRed('#subtest_3')});
        // removes applicable calculations from the DOM
        document.querySelector('#subtest_3_scaledScore').innerText = '';
        document.querySelector('#ppi_sum').innerText = '';
        document.querySelector('#index_standard_score_ppi').innerText = '';
        document.querySelector('#ppi').innerText = '';
        document.querySelector('#osc_sum').innerText = '';
        document.querySelector('#index_standard_score_osc').innerText = '';
        document.querySelector('#subtest_3_ci').innerText = '-';
        document.querySelector('#ppi_ci').innerText = '-';
        document.querySelector('#osc_ci').innerText = '-';
        document.querySelector('#overall_ppi_ci').innerText = '-';
        document.querySelector('#subtest_3_pr').innerText = '';
        document.querySelector('#ppi_pr').innerText = '';
        document.querySelector('#overall_ppi_pr').innerText = '';
        document.querySelector('#osc_pr').innerText = '';
        document.querySelector('#subtest_3_ae').innerText = '';
        document.querySelector('#ppi_ae').innerText = '';
        document.querySelector('#overall_ppi_ae').innerText = '';
        document.querySelector('#osc_ae').innerText = '';
    }
    if(document.querySelector('#subtest_4').value === '') {
        document.querySelector('#subtest_4').classList.add('alertRed');
        document.querySelector('#subtest_4').addEventListener('change', function() { removeRed('#subtest_4')});
        // removes applicable calculations from the DOM
        document.querySelector('#subtest_4_scaledScore').innerText = '';
        document.querySelector('#ppi_sum').innerText = '';
        document.querySelector('#index_standard_score_ppi').innerText = '';
        document.querySelector('#ppi').innerText = '';
        document.querySelector('#osc_sum').innerText = '';
        document.querySelector('#index_standard_score_osc').innerText = '';
        document.querySelector('#subtest_4_ci').innerText = '-';
        document.querySelector('#ppi_ci').innerText = '-';
        document.querySelector('#osc_ci').innerText = '-';
        document.querySelector('#overall_ppi_ci').innerText = '-';
        document.querySelector('#subtest_4_pr').innerText = '';
        document.querySelector('#ppi_pr').innerText = '';
        document.querySelector('#overall_ppi_pr').innerText = '';
        document.querySelector('#osc_pr').innerText = '';
        document.querySelector('#subtest_4_ae').innerText = '';
        document.querySelector('#ppi_ae').innerText = '';
        document.querySelector('#overall_ppi_ae').innerText = '';
        document.querySelector('#osc_ae').innerText = '';
    }
    if(document.querySelector('#subtest_7').value === '') {
        document.querySelector('#subtest_7').classList.add('alertRed');
        document.querySelector('#subtest_7').addEventListener('change', function() { removeRed('#subtest_7')});
        // removes applicable calculations from the DOM
        document.querySelector('#subtest_7_scaledScore').innerText = '';
        document.querySelector('#ami_sum').innerText = '';
        document.querySelector('#index_standard_score_ami').innerText = '';
        document.querySelector('#ami').innerText = '';
        document.querySelector('#osc_sum').innerText = '';
        document.querySelector('#index_standard_score_osc').innerText = '';
        document.querySelector('#subtest_7_ci').innerText = '-';
        document.querySelector('#ami_ci').innerText = '-';
        document.querySelector('#osc_ci').innerText = '-';
        document.querySelector('#overall_ami_ci').innerText = '-';
        document.querySelector('#subtest_7_pr').innerText = '';
        document.querySelector('#ami_pr').innerText = '';
        document.querySelector('#overall_ami_pr').innerText = '';
        document.querySelector('#osc_pr').innerText = '';
        document.querySelector('#subtest_7_ae').innerText = '';
        document.querySelector('#ami_ae').innerText = '';
        document.querySelector('#overall_ami_ae').innerText = '';
        document.querySelector('#osc_ae').innerText = '';
    }
    if(document.querySelector('#subtest_9').value === '') {
        document.querySelector('#subtest_9').classList.add('alertRed');
        document.querySelector('#subtest_9').addEventListener('change', function() { removeRed('#subtest_9')});
        // removes applicable calculations from the DOM
        document.querySelector('#subtest_9_scaledScore').innerText = '';
        document.querySelector('#ami_sum').innerText = '';
        document.querySelector('#index_standard_score_ami').innerText = '';
        document.querySelector('#ami').innerText = '';
        document.querySelector('#osc_sum').innerText = '';
        document.querySelector('#index_standard_score_osc').innerText = '';
        document.querySelector('#subtest_9_ci').innerText = '-';
        document.querySelector('#ami_ci').innerText = '-';
        document.querySelector('#osc_ci').innerText = '-';
        document.querySelector('#overall_ami_ci').innerText = '-';
        document.querySelector('#subtest_9_pr').innerText = '';
        document.querySelector('#ami_pr').innerText = '';
        document.querySelector('#overall_ami_pr').innerText = '';
        document.querySelector('#osc_pr').innerText = '';
        document.querySelector('#subtest_9_ae').innerText = '';
        document.querySelector('#ami_ae').innerText = '';
        document.querySelector('#overall_ami_ae').innerText = '';
        document.querySelector('#osc_ae').innerText = '';
    }
    if(document.querySelector('#subtest_10').value === '') {
        document.querySelector('#subtest_10').classList.add('alertRed');
        document.querySelector('#subtest_10').addEventListener('change', function() { removeRed('#subtest_10')});
        // removes applicable calculations from the DOM
        document.querySelector('#subtest_10_scaledScore').innerText = '';
        document.querySelector('#ami_sum').innerText = '';
        document.querySelector('#index_standard_score_ami').innerText = '';
        document.querySelector('#ami').innerText = '';
        document.querySelector('#osc_sum').innerText = '';
        document.querySelector('#index_standard_score_osc').innerText = '';
        document.querySelector('#subtest_10_ci').innerText = '-';
        document.querySelector('#ami_ci').innerText = '-';
        document.querySelector('#osc_ci').innerText = '-';
        document.querySelector('#overall_ami_ci').innerText = '-';
        document.querySelector('#subtest_10_pr').innerText = '';
        document.querySelector('#ami_pr').innerText = '';
        document.querySelector('#overall_ami_pr').innerText = '';
        document.querySelector('#osc_pr').innerText = '';
        document.querySelector('#subtest_10_ae').innerText = '';
        document.querySelector('#ami_ae').innerText = '';
        document.querySelector('#overall_ami_ae').innerText = '';
        document.querySelector('#osc_ae').innerText = '';
    }
    if(document.querySelector('#subtest_1').value === '') {
        document.querySelector('#subtest_1').classList.add('alertRed');
        document.querySelector('#subtest_1').addEventListener('change', function() { removeRed('#subtest_1')});
        // removes applicable calculations from the DOM
        document.querySelector('#subtest_1_scaledScore').innerText = '';
        document.querySelector('#lci_sum').innerText = '';
        document.querySelector('#index_standard_score_lci').innerText = '';
        document.querySelector('#lci').innerText = '';
        document.querySelector('#osc_sum').innerText = '';
        document.querySelector('#index_standard_score_osc').innerText = '';
        document.querySelector('#subtest_1_ci').innerText = '-';
        document.querySelector('#lci_ci').innerText = '-';
        document.querySelector('#osc_ci').innerText = '-';
        document.querySelector('#overall_lci_ci').innerText = '-';
        document.querySelector('#subtest_1_pr').innerText = '';
        document.querySelector('#lci_pr').innerText = '';
        document.querySelector('#overall_lci_pr').innerText = '';
        document.querySelector('#osc_pr').innerText = '';
        document.querySelector('#subtest_1_ae').innerText = '';
        document.querySelector('#lci_ae').innerText = '';
        document.querySelector('#overall_lci_ae').innerText = '';
        document.querySelector('#osc_ae').innerText = '';
    }
    if(document.querySelector('#subtest_11').value === '') {
        document.querySelector('#subtest_11').classList.add('alertRed');
        document.querySelector('#subtest_11').addEventListener('change', function() { removeRed('#subtest_11')});
        // removes applicable calculations from the DOM
        document.querySelector('#subtest_11_scaledScore').innerText = '';
        document.querySelector('#lci_sum').innerText = '';
        document.querySelector('#index_standard_score_lci').innerText = '';
        document.querySelector('#lci').innerText = '';
        document.querySelector('#osc_sum').innerText = '';
        document.querySelector('#index_standard_score_osc').innerText = '';
        document.querySelector('#subtest_11_ci').innerText = '-';
        document.querySelector('#lci_ci').innerText = '-';
        document.querySelector('#osc_ci').innerText = '-';
        document.querySelector('#overall_lci_ci').innerText = '-';
        document.querySelector('#subtest_11_pr').innerText = '';
        document.querySelector('#lci_pr').innerText = '';
        document.querySelector('#overall_lci_pr').innerText = '';
        document.querySelector('#osc_pr').innerText = '';
        document.querySelector('#subtest_11_ae').innerText = '';
        document.querySelector('#lci_ae').innerText = '';
        document.querySelector('#overall_lci_ae').innerText = '';
        document.querySelector('#osc_ae').innerText = '';
    }
    if(
        document.querySelector('#subtest_2').value === '' ||
        document.querySelector('#subtest_3').value === '' ||
        document.querySelector('#subtest_4').value === '' ||
        document.querySelector('#subtest_7').value === '' ||
        document.querySelector('#subtest_9').value === '' ||
        document.querySelector('#subtest_10').value === '' ||
        document.querySelector('#subtest_1').value === '' ||
        document.querySelector('#subtest_11').value === ''
    ) {
        return document.querySelector('#calculationError').innerText = 'Please fill out all required fields';
    }

    // undefined prevents ''>=0 === true and creating fetch array with invalid input below
    subtestRawScores = {
        subtest_1 : document.querySelector('#subtest_1').value!=='' ? Number(document.querySelector('#subtest_1').value) : undefined,
        subtest_2 : document.querySelector('#subtest_2').value!=='' ? Number(document.querySelector('#subtest_2').value) : undefined,
        subtest_3 : document.querySelector('#subtest_3').value!=='' ? Number(document.querySelector('#subtest_3').value) : undefined,
        subtest_4 : document.querySelector('#subtest_4').value!=='' ? Number(document.querySelector('#subtest_4').value) : undefined,
        subtest_5 : document.querySelector('#subtest_5').value!=='' ? Number(document.querySelector('#subtest_5').value) : undefined,
        subtest_6 : document.querySelector('#subtest_6').value!=='' ? Number(document.querySelector('#subtest_6').value) : undefined,
        subtest_7 : document.querySelector('#subtest_7').value!=='' ? Number(document.querySelector('#subtest_7').value) : undefined,
        subtest_8 : document.querySelector('#subtest_8').value!=='' ? Number(document.querySelector('#subtest_8').value) : undefined,
        subtest_9 : document.querySelector('#subtest_9').value!=='' ? Number(document.querySelector('#subtest_9').value) : undefined,
        subtest_10 : document.querySelector('#subtest_10').value!=='' ? Number(document.querySelector('#subtest_10').value) : undefined,
        subtest_11 : document.querySelector('#subtest_11').value!=='' ? Number(document.querySelector('#subtest_11').value) : undefined,
    }

    // create array of valid raw scores to fetch
    const subtestRawScoresFetchArr = [];
    for(const subtest in subtestRawScores) {
        if(subtestRawScores[subtest]>=0) {
            subtestRawScoresFetchArr.push(fetch(`/taps/ss/${table}/${subtest}/${subtestRawScores[subtest]}`));
        } else {
            // resets DOM to blank if raw score is not greater than or equal to 0 for subtests 5, 8 and 6
            document.querySelector(`#${subtest}_scaledScore`).innerText = '';
            document.querySelector(`#${subtest}_ci`).innerText = '-';
            document.querySelector(`#${subtest}_pr`).innerText = '';
            document.querySelector(`#${subtest}_ae`).innerText = '';
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
            // if score is not in DB (null), set score to 'N/A'
            if(score===null) {
                score = 'N/A';
                
                // check if any scaled scores are 'N/A' and prompt user of error and clears DOM of invalid results
                document.querySelector('#calculationError').innerText = 'Invalid Raw Score';
                document.querySelector(`#${subtest}`).classList.add('alertRed');
                document.querySelector(`#${subtest}`).addEventListener('change', function() { removeRed(`#${subtest}`)});
                document.querySelector(`#${subtest}_ci`).innerText = '-';
                document.querySelector(`#${subtest}_pr`).innerText = '';
                if(subtest==='subtest_2' || subtest==='subtest_3' || subtest==='subtest_4') {
                    document.querySelector('#overall_ppi_ci').innerText = '-';
                    document.querySelector('#overall_ppi_pr').innerText = '';
                    document.querySelector('#overall_ppi_ae').innerText = '';
                    document.querySelector('#ppi_ci').innerText = '-';
                    document.querySelector('#ppi_pr').innerText = '';
                    document.querySelector('#ppi_ae').innerText = '';
                    document.querySelector('#osc_ci').innerText = '-';
                    document.querySelector('#osc_pr').innerText = '';
                    document.querySelector('#osc_ae').innerText = '';
                }
                if(subtest==='subtest_7' || subtest==='subtest_9' || subtest==='subtest_10') {
                    document.querySelector('#overall_ami_ci').innerText = '-';
                    document.querySelector('#overall_ami_pr').innerText = '';
                    document.querySelector('#overall_ami_ae').innerText = '';
                    document.querySelector('#ami_ci').innerText = '-';
                    document.querySelector('#ami_pr').innerText = '';
                    document.querySelector('#ami_ae').innerText = '';
                    document.querySelector('#osc_ci').innerText = '-';
                    document.querySelector('#osc_pr').innerText = '';
                    document.querySelector('#osc_ae').innerText = '';
                }
                if(subtest==='subtest_1' || subtest==='subtest_11') {
                    document.querySelector('#overall_lci_ci').innerText = '-';
                    document.querySelector('#overall_lci_pr').innerText = '';
                    document.querySelector('#overall_lci_ae').innerText = '';
                    document.querySelector('#lci_ci').innerText = '-';
                    document.querySelector('#lci_pr').innerText = '';
                    document.querySelector('#lci_ae').innerText = '';
                    document.querySelector('#osc_ci').innerText = '-';
                    document.querySelector('#osc_pr').innerText = '';
                    document.querySelector('#osc_ae').innerText = '';
                }
            }
            document.querySelector(`#${subtest}_scaledScore`).innerText = score;
        });

        // convert array of objects of scaled scores to an object of scaled scores to ease of access
        arrScaledScores.forEach((ele) => {
            objScaledScores[Object.keys(ele)[0]] = Object.values(ele)[0];
        });

        // run function that calculates percentile rank
        calculateSubtestPercentileRank();

        callBackFn();
    }

    // runs the fetchScores function
    fetchScores(sumScaledScores);

    // runs calculateSubtestAgeEquivalent function
    calculateSubtestAgeEquivalent();
}

// function that sums scaled scores and updates the DOM
function sumScaledScores() {
    // confirms that applicable raw scores are present before doing arithmetic inside the if statements
    // if missing, else statement clears sums and the DOM of applicable values
    if(objScaledScores.subtest_2 !== null && objScaledScores.subtest_3 !== null && objScaledScores.subtest_4 !== null) {
        ppiSumScaledScore = objScaledScores.subtest_2 + objScaledScores.subtest_3 + objScaledScores.subtest_4;
        document.querySelector('#ppi_sum').innerText = ppiSumScaledScore;
        document.querySelector('#ppi').innerText = ppiSumScaledScore;
    } else {
        ppiSumScaledScore = 0;
        document.querySelector('#ppi_sum').innerText = '';
        document.querySelector('#index_standard_score_ppi').innerText = '';
        document.querySelector('#ppi').innerText = '';
    }
    if(objScaledScores.subtest_7 !== null && objScaledScores.subtest_9 !== null && objScaledScores.subtest_10 !== null) {
        amiSumScaledScore = objScaledScores.subtest_7 + objScaledScores.subtest_9 + objScaledScores.subtest_10;
        document.querySelector('#ami_sum').innerText = amiSumScaledScore;
        document.querySelector('#ami').innerText = amiSumScaledScore;
    } else {
        amiSumScaledScore = 0;
        document.querySelector('#ami_sum').innerText = '';
        document.querySelector('#index_standard_score_ami').innerText = '';
        document.querySelector('#ami').innerText = '';
    }
    if(objScaledScores.subtest_1 !== null && objScaledScores.subtest_11 !== null) {
        lciSumScaledScore = objScaledScores.subtest_1 + objScaledScores.subtest_11; 
        document.querySelector('#lci_sum').innerText = lciSumScaledScore;
        document.querySelector('#lci').innerText = lciSumScaledScore;
    } else {
        lciSumScaledScore = 0; 
        document.querySelector('#lci_sum').innerText = '';
        document.querySelector('#index_standard_score_lci').innerText = '';
        document.querySelector('#lci').innerText = '';
    }
    if(ppiSumScaledScore > 0 && amiSumScaledScore > 0 && lciSumScaledScore > 0) {
        oscSumScaledScore = ppiSumScaledScore + amiSumScaledScore + lciSumScaledScore;
        document.querySelector('#osc_sum').innerText = oscSumScaledScore;
    } else {
        oscSumScaledScore = 0;
        document.querySelector('#osc_sum').innerText = '';
        document.querySelector('#index_standard_score_osc').innerText = '';
    }

    calculateIndexStandardScore();
    calculateSubtestIndexStandardScore();
    calculateConfidenceInterval();
}

// function that fetches and updates DOM with Index Standard Score
function calculateIndexStandardScore() {
    // create array of sum of scaled scores to fetch
    const arrSumScaledScore = [
        fetch(`/taps/iss/index_standard_score_ppi/${ppiSumScaledScore}`),
        fetch(`/taps/iss/index_standard_score_ami/${amiSumScaledScore}`),
        fetch(`/taps/iss/index_standard_score_lci/${lciSumScaledScore}`),
        fetch(`/taps/iss/overall_standard_score/${oscSumScaledScore}`),
    ];

    // fetch index standard scores from sum scaled scores
    const fetchIndexStandardScores = async() => {
        try {
            const res = await Promise.all(arrSumScaledScore);
            const resData = await Promise.all(res.map(r => r.json()));
            arrIndexStandardScores.push(...resData.flat());

            // input index standard scores from fetch into the DOM
            if(arrIndexStandardScores.length===4) {
                document.querySelector('#index_standard_score_ppi').innerText = arrIndexStandardScores[0].standard_score;
                document.querySelector('#index_standard_score_ami').innerText = arrIndexStandardScores[1].standard_score;
                document.querySelector('#index_standard_score_lci').innerText = arrIndexStandardScores[2].standard_score;
                document.querySelector('#index_standard_score_osc').innerText = arrIndexStandardScores[3].standard_score;
            }
        } catch {
            throw Error("Promised failed");
        }
        // calculate indexes percentile rank
        calculateIndexPercentileRank();

        // calculate indexes age equivalents
        calculateIndexAgeEquivalent();

    }

    fetchIndexStandardScores();
}

// function that fetches & calculates confidence intervals and updates DOM
function calculateConfidenceInterval() {
    let table;

    // determine DB table based on age
    if(yearDiff===5) {
        table = 'age5';
    } else if(yearDiff===6) {
        table = 'age6';
    } else if(yearDiff===7) {
        table = 'age7';
    } else if(yearDiff===8) {
        table = 'age8';
    } else if(yearDiff===9) {
        table = 'age9';
    } else if(yearDiff===10) {
        table = 'age10';
    } else if(yearDiff===11) {
        table = 'age11';
    } else if(yearDiff===12) {
        table = 'age12';
    } else if(yearDiff===13) {
        table = 'age13';
    } else if(yearDiff===14) {
        table = 'age14';
    } else if(yearDiff===15) {
        table = 'age15';
    } else if(yearDiff===16) {
        table = 'age16';
    } else if(yearDiff===17) {
        table = 'age17';
    } else if(yearDiff===18) {
        table = 'age18';
    } else if(yearDiff===19) {
        table = 'age19';
    } else if(yearDiff===20) {
        table = 'age20';
    } else if(yearDiff===21) {
        table = 'age21';
    } 

    // create an array of confidence intervals to fetch
    const arrConfidenceIntervalsFetch = [
        fetch(`/taps/ci/confidence_intervals_${table}`)
    ];

    // fetch confidence intervals for all subtests and indexes
    const fetchConfidenceIntervals = async() => {
        try {
            const res = await Promise.all(arrConfidenceIntervalsFetch);
            const resData = await Promise.all(res.map(r => r.json()));
            let data = [...resData.flat()];
            let i = 0;
            for(const key in objConfidenceIntervals) {
                objConfidenceIntervals[key] = data[i].confidence_interval_95;
                i++;
            }
            
            // update DOM with confidence intervals for sum of scaled scores
            if(arrIndexStandardScores.length===4) {
                document.querySelector('#ppi_ci').innerText = `${Math.round(arrIndexStandardScores[0].standard_score - objConfidenceIntervals.ppi)} - ${Math.round(arrIndexStandardScores[0].standard_score + objConfidenceIntervals.ppi)}`;
                document.querySelector('#overall_ppi_ci').innerText = `${Math.round(arrIndexStandardScores[0].standard_score - objConfidenceIntervals.ppi)} - ${Math.round(arrIndexStandardScores[0].standard_score + objConfidenceIntervals.ppi)}`;
                document.querySelector('#ami_ci').innerText = `${Math.round(arrIndexStandardScores[1].standard_score - objConfidenceIntervals.ami)} - ${Math.round(arrIndexStandardScores[1].standard_score + objConfidenceIntervals.ami)}`;
                document.querySelector('#overall_ami_ci').innerText = `${Math.round(arrIndexStandardScores[1].standard_score - objConfidenceIntervals.ami)} - ${Math.round(arrIndexStandardScores[1].standard_score + objConfidenceIntervals.ami)}`;
                document.querySelector('#lci_ci').innerText = `${Math.round(arrIndexStandardScores[2].standard_score - objConfidenceIntervals.lci)} - ${Math.round(arrIndexStandardScores[2].standard_score + objConfidenceIntervals.lci)}`;
                document.querySelector('#overall_lci_ci').innerText = `${Math.round(arrIndexStandardScores[2].standard_score - objConfidenceIntervals.lci)} - ${Math.round(arrIndexStandardScores[2].standard_score + objConfidenceIntervals.lci)}`;
                document.querySelector('#osc_ci').innerText = `${Math.round(arrIndexStandardScores[3].standard_score - objConfidenceIntervals.osc)} - ${Math.round(arrIndexStandardScores[3].standard_score + objConfidenceIntervals.osc)}`;
            }
        } catch {
            throw Error("Promised failed");
        }
    }

    fetchConfidenceIntervals()
}

// function that fetches index standard scores for individual subtests and updates DOM
function calculateSubtestIndexStandardScore() {
    // clear object to avoid DOM updates with old state
    for(const key in objSubtestIndexStandardScores) {
        delete objSubtestIndexStandardScores[key];
    }

    // create array of valid subtests to fetch
    const arrSubtestIssFetch = [];
    for(const subtest in objScaledScores) {
        arrSubtestIssFetch.push(fetch(`/taps/subtestiss/${objScaledScores[subtest]}`));
    }

    // fetch index standard scores from subtests
    const fetchSubtestIndexStandardScores = async() => {
        try {
            const res = await Promise.all(arrSubtestIssFetch);
            const resData = await Promise.all(res.map(r => r.json()));
            const arrResData = [...resData.flat()];

            // places index standard scores for individual subtests into object
            let i = 0;
            for(const subtest in objScaledScores) {
                objSubtestIndexStandardScores[subtest] = arrResData[i].standard_score;
                i++;
            }

            // updates DOM with confidence intervals for individual subtests
            for(const subtest in objSubtestIndexStandardScores) {
                document.querySelector(`#${subtest}_ci`).innerText = `${Math.round(objSubtestIndexStandardScores[subtest] - objConfidenceIntervals[subtest])} - ${Math.round(objSubtestIndexStandardScores[subtest] + objConfidenceIntervals[subtest])}`;
            }
        } catch {
            throw Error("Promised failed");
        }
    } 

    fetchSubtestIndexStandardScores();
}

// function that fetches percentile rank for subtests and updates the DOM
function calculateSubtestPercentileRank() {
    // clear object to avoid DOM updates with old state
    for(const key in objSubtestPercentileRanks) {
        delete objSubtestPercentileRanks[key];
    }

    // create an array of valid subtests to fetch (using same array as calculateSubtestIndexStandardScore)
    const arrSubtestPercentileRankFetch = [];
    for(const subtest in objScaledScores) {
        arrSubtestPercentileRankFetch.push(fetch(`/taps/subtestpr/${objScaledScores[subtest]}`));
    }
    
    // fetch percentile rank from subtests
    const fetchSubtestPercentileRank = async() => {
        try {
            const res = await Promise.all(arrSubtestPercentileRankFetch);
            const resData = await Promise.all(res.map(r => r.json()));
            const arrResData = [...resData.flat()];

            // places percentile ranks for individual subtests in object
            let i = 0;
            for(const subtest in objScaledScores) {
                objSubtestPercentileRanks[subtest] = arrResData[i].percentile_rank;
                i++;
            }

            // updates DOM with percentile ranks for individual subtests
            for(const subtest in objSubtestPercentileRanks) {
                document.querySelector(`#${subtest}_pr`).innerText = objSubtestPercentileRanks[subtest];
            }

        } catch {
            throw Error("Promised failed");
        }
    }

    fetchSubtestPercentileRank();
}

// function that fetches percentile rank for indexes and updates DOM
function calculateIndexPercentileRank() {
    // create an array of valid index standard scores to fetch percentile ranks (using same array as calculateIndexStandardScore)
    const arrIndexPercentileRankFetch = [];
    arrIndexStandardScores.forEach(ele => {
        arrIndexPercentileRankFetch.push(fetch(`/taps/indexpr/${ele.standard_score}`));
    })

    // fetch percentile rank from index standard scores
    const fetchIndexPercentileRank = async() => {
        try {
            const res = await Promise.all(arrIndexPercentileRankFetch);
            const resData = await Promise.all(res.map(r => r.json()));
            const arrResData = [...resData.flat()];

            // updates DOM with percentile ranks for indexes
            if(arrIndexStandardScores.length===4) {
                document.querySelector('#ppi_pr').innerText = arrResData[0].percentile_rank;
                document.querySelector('#overall_ppi_pr').innerText = arrResData[0].percentile_rank;
                document.querySelector('#ami_pr').innerText = arrResData[1].percentile_rank;
                document.querySelector('#overall_ami_pr').innerText = arrResData[1].percentile_rank;
                document.querySelector('#lci_pr').innerText = arrResData[2].percentile_rank;
                document.querySelector('#overall_lci_pr').innerText = arrResData[2].percentile_rank;
                document.querySelector('#osc_pr').innerText = arrResData[3].percentile_rank;
            }
        } catch {
            throw Error("Promised failed");
        }
    }

    fetchIndexPercentileRank();
}

// function that fetches age equivalents for subtests and updates DOM
function calculateSubtestAgeEquivalent() {
    // create an array of valid raw scores to fetch age equivalents 
    const arrSubtestAgeEquivalentFetch = [];
    for(const subtest in subtestRawScores) {
        if(subtestRawScores[subtest]>=0) {
            arrSubtestAgeEquivalentFetch.push(fetch(`/taps/subtestae/${subtest}/${subtestRawScores[subtest]}`));
        }
    }

    // fetch age equivalents for subtests
    const fetchSubtestAgeEquivalent = async() => {
        try {
            const res = await Promise.all(arrSubtestAgeEquivalentFetch);
            const resData = await Promise.all(res.map(r => r.json()));
            const arrResData = [...resData.flat()];

            // place age equivalents for individual subtests into object for ease of access
            const objSubtestAgeEquivalents = {};

            arrResData.forEach(ele => {
                objSubtestAgeEquivalents[Object.keys(ele)[0]] = Object.values(ele)[0];
            })

            // update DOM with age equivalents for individual subtests;
            for(const subtest in objSubtestAgeEquivalents) {
                document.querySelector(`#${subtest}_ae`).innerText = objSubtestAgeEquivalents[subtest];
            }
        } catch {
            throw Error("Promised failed");
        }
    }

    fetchSubtestAgeEquivalent();
}

// function that fetches age equivalents for indexes and updates DOM
function calculateIndexAgeEquivalent() {
    // calculate sum of index's raw scores
    const ppiSumRawScore = subtestRawScores.subtest_2 + subtestRawScores.subtest_3 + subtestRawScores.subtest_4; 
    const amiSumRawScore = subtestRawScores.subtest_7 + subtestRawScores.subtest_9 + subtestRawScores.subtest_10; 
    const lciSumRawScore = subtestRawScores.subtest_1 + subtestRawScores.subtest_11;
    const oscSumRawScore = ppiSumRawScore + amiSumRawScore + lciSumRawScore;

    // create an array of valid index sums to fetch age equivalents 
    const arrIndexSumRawScoreFetch = [
        fetch(`/taps/indexae/ppi/${ppiSumRawScore}`),
        fetch(`/taps/indexae/ami/${amiSumRawScore}`),
        fetch(`/taps/indexae/lci/${lciSumRawScore}`),
        fetch(`/taps/indexae/osc/${oscSumRawScore}`),
    ]

    // fetch age equivalents for indexes
    const fetchIndexAgeEquivalent = async() => {
        try {
            const res = await Promise.all(arrIndexSumRawScoreFetch);
            const resData = await Promise.all(res.map(r => r.json()));
            const arrResData = [...resData.flat()];

            if(arrIndexStandardScores.length===4) {
                document.querySelector('#ppi_ae').innerText = arrResData[0].ppi;
                document.querySelector('#overall_ppi_ae').innerText = arrResData[0].ppi;
                document.querySelector('#ami_ae').innerText = arrResData[1].ami;
                document.querySelector('#overall_ami_ae').innerText = arrResData[1].ami;
                document.querySelector('#lci_ae').innerText = arrResData[2].lci;
                document.querySelector('#overall_lci_ae').innerText = arrResData[2].lci;
                document.querySelector('#osc_ae').innerText = arrResData[3].osc;
            }
        } catch {
            throw Error("Promised failed");
        }
    }

    fetchIndexAgeEquivalent();
}
