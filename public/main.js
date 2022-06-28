document.querySelector('#calculateAge').addEventListener('click', calculateAge);

function calculateAge() {
    const testDate = new Date(document.querySelector('#testDate').value);
    const birthDate = new Date(document.querySelector('#birthDate').value);

    if(birthDate>testDate) {
        return document.querySelector('#ageresult').innerText = `Chronological Age: Birthdate cannot come after test date.`;
    }

    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth()+1;
    const birthDay = birthDate.getDate()+1;
    const testYear = testDate.getFullYear();
    const testMonth = testDate.getMonth()+1;
    const testDay = testDate.getDate()+1;

    const yearDiff = testYear - birthYear;
    const monthDiff = testMonth - birthMonth;
    const dayDiff = testDay - birthDay;
    
    document.querySelector('#ageresult').innerText = `Chronological Age: Year: ${yearDiff} Month: ${monthDiff} Day: ${dayDiff}`;
}