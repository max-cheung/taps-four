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
    if(yearDiff===9 && monthDiff<=5) {
        table = '90to95';
    }
}

function calculateScore() {
    // const subtest2 = document.querySelector('#subtest2').value;
    //
    // const url = `http://localhost:3000/taps/${subtest2}`;
    //
    // fetch(url)
    // .then(res => res.json())
    // .then(data => {
    //     console.log(data);
    //     console.log(data[0].subtest_2);
    //     document.querySelector('#subtest2_scaledScore').innerText = data[0].subtest_2;
    // })
    // .catch(err => {
    //     console.log(`error ${err}`);
    // });

    useTable(yearDiff, monthDiff);
        
    const subtest_2 = document.querySelector('#subtest2').value;
    const subtest_3 = document.querySelector('#subtest3').value;

    console.log(`${yearDiff}${monthDiff}`)
    const fetchScores = async() => {
        try {
            const res = await Promise.all([
                fetch(`http://localhost:3000/taps/${table}/subtest_2/${subtest_2}`),
                fetch(`http://localhost:3000/taps/${table}/subtest_3/${subtest_3}`)
            ]);

            const data = await Promise.all(res.map(r => r.json()))
            console.log(data);
            console.log(data.flat());
            document.querySelector('#subtest2_scaledScore').innerText = data.flat()[0].subtest_2;
            document.querySelector('#subtest3_scaledScore').innerText = data.flat()[1].subtest_3;
        } catch {
            throw Error("Promised failed");
        }
    }
    fetchScores();
}
