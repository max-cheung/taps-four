document.querySelector('#calculateAge').addEventListener('click', calculateAge);
document.querySelector('#calculateScore').addEventListener('click', calculateScore);

let monthDiff;
let yearDiff;
let table;

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

function calculateScore() {
    useTable(yearDiff, monthDiff);
        
    // create array for subtest values from document querySelector
    // const subtestRawScoresArr = [];
    // for(let i=1; i<=11; i++) {
    //     subtestRawScoresArr.push(document.querySelector(`#subtest${i}`).value);
    // }
    // console.log(subtestRawScoresArr);

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
    console.log(subtestRawScores);

    console.log(`${yearDiff}${monthDiff}`);

    // create array of valid raw scores to fetch
    const subtestRawScoresFetchArr = [];
    for(const subtest in subtestRawScores) {
        if(subtestRawScores[subtest]>0) {
            subtestRawScoresFetchArr.push(fetch(`http://localhost:3000/taps/${table}/${subtest}/${subtestRawScores[subtest]}`));
        }
    }
    console.log(subtestRawScoresFetchArr);

    const arrScaledScores = [];
    
    const fetchScores = async() => {
        try {
            const res = await Promise.all(subtestRawScoresFetchArr);
            console.log(res);
            const resData = await Promise.all(res.map(r => r.json()));
            console.log(resData.flat());
            console.log(...resData.flat());
            arrScaledScores.push(...resData.flat());
            console.log(arrScaledScores);
        } catch {
            throw Error("Promised failed");
        }
        
        console.log(arrScaledScores);
    }

    fetchScores();

    // why does everything below this not run?
    // nevermind, it runs, because of the async function arrScaledScores doesn't have any value initially.:w

    console.log('hello world');
    arrScaledScores.forEach((ele, index, array) => {
        return console.log('hello world');
    })
    
    // const fetchScores = async() => {
    //     try {
    //         const res = await Promise.all([
    //             fetch(`http://localhost:3000/taps/${table}/subtest_1/${subtest_1}`),
    //             fetch(`http://localhost:3000/taps/${table}/subtest_2/${subtest_2}`),
    //             fetch(`http://localhost:3000/taps/${table}/subtest_3/${subtest_3}`),
    //             fetch(`http://localhost:3000/taps/${table}/subtest_4/${subtest_4}`),
    //             fetch(`http://localhost:3000/taps/${table}/subtest_5/${subtest_5}`),
    //             fetch(`http://localhost:3000/taps/${table}/subtest_6/${subtest_6}`),
    //             fetch(`http://localhost:3000/taps/${table}/subtest_7/${subtest_7}`),
    //             fetch(`http://localhost:3000/taps/${table}/subtest_8/${subtest_8}`),
    //             fetch(`http://localhost:3000/taps/${table}/subtest_9/${subtest_9}`),
    //             fetch(`http://localhost:3000/taps/${table}/subtest_10/${subtest_10}`),
    //             fetch(`http://localhost:3000/taps/${table}/subtest_11/${subtest_11}`),
    //         ]);
    //         console.log(res);

    //         const data = await Promise.all(res.map(r => r.json()))
    //         console.log(data);
    //         console.log(data.flat());
    //         document.querySelector('#subtest2_scaledScore').innerText = data.flat()[1].subtest_2;
    //         document.querySelector('#subtest3_scaledScore').innerText = `+ ${data.flat()[2].subtest_3}`;
    //         document.querySelector('#subtest4_scaledScore').innerText = `+ ${data.flat()[3].subtest_4}`;
    //         document.querySelector('#subtest5_scaledScore').innerText = data.flat()[4].subtest_5;
    //         document.querySelector('#subtest7_scaledScore').innerText = data.flat()[6].subtest_7;
    //         document.querySelector('#subtest9_scaledScore').innerText = `+ ${data.flat()[8].subtest_9}`;
    //         document.querySelector('#subtest10_scaledScore').innerText = `+ ${data.flat()[9].subtest_10}`;
    //         document.querySelector('#subtest8_scaledScore').innerText = data.flat()[7].subtest_8;
    //         document.querySelector('#subtest1_scaledScore').innerText = data.flat()[0].subtest_1;
    //         document.querySelector('#subtest11_scaledScore').innerText = `+ ${data.flat()[10].subtest_11}`;
    //         document.querySelector('#subtest6_scaledScore').innerText = data.flat()[5].subtest_6;
    //     } catch {
    //         throw Error("Promised failed");
    //     }
    // }
}
