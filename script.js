const caloriesPerStep = 0.05; // Oletetaan, että yksi askel kuluttaa 0,05 kaloria

// Juoma-kuvat ja niiden kalorimäärät
const drinks = {
    lonkero: { full: 'lonkero.png', half: 'lonkero_puolikas.png', calories: 182 },
    lonkero_light: { full: 'lonkero_light.png', half: 'lonkero_light_puolikas.png', calories: 109 },
    sandels: { full: 'sandels.png', half: 'sandels_puolikas.png', calories: 129 },
    crowmoor: { full: 'crowmoor.png', half: 'crowmoor_puolikas.png', calories: 149 }
};

// Alustetaan valitun juoman kuvat ja kalorit
let selectedDrink = drinks.lonkero;
let selectedCalories = drinks.lonkero.calories;

// Vetopalkin arvo päivittyy reaaliajassa
const stepsRange = document.getElementById('steps-range');
const stepsValue = document.getElementById('steps-value');
const mainButton = document.getElementById('main-button');

stepsRange.addEventListener('input', () => {
    stepsValue.textContent = stepsRange.value;
});

// Aluksi käytetään nappia "Laske" toiminnolla
mainButton.addEventListener('click', calculateSteps);

// Funktio askeleiden laskemiseen
function calculateSteps() {
    const steps = parseInt(stepsRange.value);

    if (isNaN(steps) || steps <= 0) {
        alert("Anna kelvollinen askelmäärä.");
        return;
    }

    // Näytetään juomavalinta ja piilotetaan tulokset
    document.getElementById('drink-selection').style.display = 'block';
    document.getElementById('results').innerHTML = '';

    // Vaihdetaan napin toiminto "Vaihda juomaa" -tilaan
    mainButton.removeEventListener('click', calculateSteps);
    mainButton.addEventListener('click', showDrinkSelection);
    mainButton.textContent = 'Vaihda juomaa';
}

// Kun juoma valitaan
document.querySelectorAll('.drinks img').forEach(img => {
    img.addEventListener('click', (e) => {
        const selectedId = e.target.id;

        // Piilotetaan juomavalinta
        document.getElementById('drink-selection').style.display = 'none';

        // Päivitetään valittu juoma ja kalorit
        selectedDrink = drinks[selectedId];
        selectedCalories = drinks[selectedId].calories;

        // Näytetään tulokset
        const steps = parseInt(stepsRange.value);
        if (!isNaN(steps) && steps > 0) {
            showResults(steps);
        }
    });
});

// Funktio tulosten näyttämiseen
function showResults(steps) {
    const resultsDiv = document.getElementById('results');

    // Tyhjennetään edelliset tulokset
    resultsDiv.innerHTML = '<h3>Liikkuminen kannattaa! Nämä olet ansainnut:</h3>';

    // Lasketaan poltetut kalorit ja juoman määrä
    const caloriesBurned = steps * caloriesPerStep;
    const drinksEarned = Math.floor(caloriesBurned / selectedCalories);
    const remainingCalories = caloriesBurned % selectedCalories;
    const hasHalfDrink = remainingCalories >= selectedCalories / 2;

    // Näytetään juomatölkit 2,5 sekunnin välein ja soitetaan ääni
    for (let i = 0; i < drinksEarned; i++) {
        setTimeout(() => {
            const img = document.createElement('img');
            img.src = selectedDrink.full;
            resultsDiv.appendChild(img);

            // Soitetaan tölkin avausääni
            playSound();
        }, i * 2500); // 2,5 sekunnin viive per täysi tölkki
    }

    // Jos on ansaittu puolikas juoma, näytetään se 2,5 sekunnin viiveen jälkeen
    if (hasHalfDrink) {
        setTimeout(() => {
            const halfImg = document.createElement('img');
            halfImg.src = selectedDrink.half;
            resultsDiv.appendChild(halfImg);

            // Soitetaan tölkin avausääni puolikkaalle tölkille
            playSound();
        }, drinksEarned * 2500); // 2,5 sekunnin viive viimeisen täydellisen tölkin jälkeen
    }
}

// Funktio "Vaihda juomaa" -tilaan siirtymiseen
function showDrinkSelection() {
    // Tyhjennetään tulokset ja näytetään juomavalinta uudelleen
    document.getElementById('results').innerHTML = '';
    document.getElementById('drink-selection').style.display = 'block';
}

// Funktio äänen toistamiseen
function playSound() {
    const soundClone = document.getElementById('can-open-sound').cloneNode();
    soundClone.play();
}
