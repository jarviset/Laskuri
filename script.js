const caloriesPerStep = 0.05; // Oletetaan, että yksi askel kuluttaa 0,05 kaloria

// Juoma-kuvat ja niiden kalorimäärät
const drinks = {
    lonkero: { full: 'lonkero.png', half: 'lonkero_puolikas.png', calories: 182 },
    lonkero_light: { full: 'lonkero_light.png', half: 'lonkero_light_puolikas.png', calories: 109 },
    sandels: { full: 'sandels.png', half: 'sandels_puolikas.png', calories: 129 },
    crowmoor: { full: 'crowmoor.png', half: 'crowmoor_puolikas.png', calories: 149 },
    vischy: { full: 'vauva.png', half: 'vauva.png', calories: 0 } // Vichy käyttää vauva.png
};

// Alustetaan valitun juoman kuvat ja kalorit
let selectedDrink = drinks.lonkero;
let selectedCalories = drinks.lonkero.calories;

// Vetopalkin arvo päivittyy reaaliajassa
const stepsRange = document.getElementById('steps-range');
const stepsValue = document.getElementById('steps-value');

stepsRange.addEventListener('input', () => {
    stepsValue.textContent = stepsRange.value;
});

// Näytetään juomavalikko vasta, kun käyttäjä syöttää askeleet
document.getElementById('calculate-button').addEventListener('click', () => {
    const steps = parseInt(stepsRange.value);

    if (isNaN(steps) || steps <= 0) {
        alert("Anna kelvollinen askelmäärä.");
        return;
    }

    // Näytetään juomavalinta
    document.getElementById('drink-selection').style.display = 'block';
});

// Kun juoma valitaan
document.querySelectorAll('.drinks img').forEach(img => {
    img.addEventListener('click', (e) => {
        const selectedId = e.target.id;

        // Tyhjennetään edelliset tulokset
        document.getElementById('results').innerHTML = '';

        // Jos valitaan Vichy, näytetään vauva.fi-kysymys ja tyhjennetään tölkit
        if (selectedId === 'vischy') {
            document.getElementById('vichy-question').style.display = 'block';
            document.getElementById('drink-selection').style.display = 'none';
        } else {
            selectedDrink = drinks[selectedId];
            selectedCalories = drinks[selectedId].calories;

            // Lasketaan uudelleen askeleiden perusteella ja näytetään tulokset
            const steps = parseInt(stepsRange.value);
            if (!isNaN(steps) && steps > 0) {
                showResults(steps);
            }
        }
    });
});

// Funktio tulosten näyttämiseen
function showResults(steps) {
    const resultsDiv = document.getElementById('results');

    // Tyhjennetään edelliset tulokset
    resultsDiv.innerHTML = '<h3>Nämä olet ansainnut:</h3>';

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
        }, i * 2300); // 2,3 sekunnin viive per täysi tölkki
    }

    // Jos on ansaittu puolikas juoma, näytetään se 2,3 sekunnin viiveen jälkeen
    if (hasHalfDrink) {
        setTimeout(() => {
            const halfImg = document.createElement('img');
            halfImg.src = selectedDrink.half;
            resultsDiv.appendChild(halfImg);

            // Soitetaan tölkin avausääni puolikkaalle tölkille
            playSound();
        }, drinksEarned * 2300); // 2,5 sekunnin viive viimeisen täydellisen tölkin jälkeen
    }
}

// Vichy-valinnan toiminnot
document.getElementById('yes-button').addEventListener('click', () => {
    window.location.href = 'https://www.vauva.fi';
});

document.getElementById('no-button').addEventListener('click', () => {
    document.getElementById('vichy-question').style.display = 'none';
    document.getElementById('drink-selection').style.display = 'block';
});

// Funktio äänen toistamiseen
function playSound() {
    const soundClone = document.getElementById('can-open-sound').cloneNode();
    soundClone.play();
}
