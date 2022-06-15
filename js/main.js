document.querySelector('#calculateAge').addEventListener('click', calculateAge);

function calculateAge() {
    const testDate = new Date(document.querySelector('#testDate').value);
    const birthDate = new Date(document.querySelector('#birthDate').value);

    const chronologicalAge = ((testDate - birthDate)/8.64e+7);
    document.querySelector('#ageresult').innerText = `Chronological Age: ${chronologicalAge}`;
}