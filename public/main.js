document.querySelector('#calculateAge').addEventListener('click', calculateAge);
document.querySelector('#calculateScore').addEventListener('click', calculateScore);

function calculateAge() {
    const testDate = new Date(document.querySelector('#testDate').value);
    const birthDate = new Date(document.querySelector('#birthDate').value);

    if(birthDate>testDate) {
        return document.querySelector('#ageresult').innerText = `Chronological Age: Birthdate cannot come after test date.`;
    }

    const ageInDays = (testDate-birthDate)/8.64e+7;

    const dayDiff = Math.floor(ageInDays%365%30.4167);
    const monthDiff = Math.floor(ageInDays%365/30.4167);
    const yearDiff = Math.floor(ageInDays/365);

    document.querySelector('#ageresult').innerText = `Chronological Age: Year: ${yearDiff} Month: ${monthDiff} Day: ${dayDiff}`;
}

function calculateScore() {
    const subtest2 = document.querySelector('#subtest2').value;

    const url = `http://localhost:3000/taps/${subtest2}`;

    fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        console.log(data[0].subtest_2);
        document.querySelector('#subtest2_scaledScore').innerText = data[0].subtest_2;
    })
    .catch(err => {
        console.log(`error ${err}`);
    });
}
