let quizAnswers = {
    strength: "",
    flavor: "",
    style: ""
};

function selectQuiz(type, value) {
    quizAnswers[type] = value;

    const buttons = event.target.parentElement.querySelectorAll("button");
    buttons.forEach(button => button.classList.remove("active"));
    event.target.classList.add("active");
}

function showQuizResult() {
    const result = document.getElementById("quizResult");

    if (!quizAnswers.strength || !quizAnswers.flavor || !quizAnswers.style) {
        result.innerHTML = `
            <h3>Complete the quiz first</h3>
            <p>Please answer all questions to get your custom recipe.</p>
        `;
        return;
    }

    let title = "Balanced Brewer";
    let recipe = "Coffee: 15g | Water: 240ml | Temperature: 93°C | Brew Time: 2:45 min";

    if (quizAnswers.strength === "strong" && quizAnswers.flavor === "chocolate") {
        title = "Bold Classic";
        recipe = "Coffee: 18g | Water: 250ml | Temperature: 94°C | Brew Time: 3:00 min";
    } else if (quizAnswers.flavor === "fruity") {
        title = "Bright Explorer";
        recipe = "Coffee: 16g | Water: 255ml | Temperature: 92°C | Brew Time: 2:40 min";
    } else if (quizAnswers.style === "experimental") {
        title = "Creative Brewer";
        recipe = "Coffee: 17g | Water: 260ml | Temperature: 93°C | Try a slower circular pour";
    }

    result.innerHTML = `
        <h3>${title}</h3>
        <p>${recipe}</p>
    `;
}

function setFlavor(name, recipe) {
    document.getElementById("flavorResult").innerHTML = `
        <h3>Selected Flavor: ${name}</h3>
        <p>${recipe}</p>
    `;
}

function updateStrength() {
    const value = document.getElementById("strengthRange").value;
    const title = document.getElementById("strengthTitle");
    const details = document.getElementById("strengthDetails");

    if (value == 1) {
        title.innerHTML = "Light Brew";
        details.innerHTML = "Coffee: 13g | Water: 240ml";
    } else if (value == 2) {
        title.innerHTML = "Balanced Brew";
        details.innerHTML = "Coffee: 15g | Water: 240ml";
    } else {
        title.innerHTML = "Strong Brew";
        details.innerHTML = "Coffee: 18g | Water: 240ml";
    }
}

function calculateWater() {
    const coffee = document.getElementById("coffeeAmount").value;
    const result = document.getElementById("result");

    if (coffee === "" || coffee <= 0) {
        result.innerHTML = "Please enter a valid amount.";
        return;
    }

    const water = coffee * 16;

    let strength = "Balanced";
    if (coffee < 14) {
        strength = "Light";
    } else if (coffee > 18) {
        strength = "Strong";
    }
document.getElementById("cardNote").innerText =
    document.getElementById("brewNote").value || "No notes added";
    
    result.innerHTML = "Required Water: " + water + " ml";

    document.getElementById("cardCoffee").innerHTML = coffee + " g";
    document.getElementById("cardWater").innerHTML = water + " ml";
    document.getElementById("cardStrength").innerHTML = strength;
}

let timer;
let seconds = 0;
const totalSeconds = 180;

function startTimer() {
    clearInterval(timer);

    timer = setInterval(() => {
        seconds++;

        updateTimerDisplay();
        updateTimerStep();
        updateProgress();

        if (seconds >= totalSeconds) {
            clearInterval(timer);
            unlockAchievement();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    seconds = 0;
    updateTimerDisplay();
    document.getElementById("timerStep").innerHTML = "Ready to start";
    document.getElementById("progress").style.width = "0%";
}

function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    document.getElementById("timerDisplay").innerHTML =
        String(minutes).padStart(2, "0") + ":" + String(remainingSeconds).padStart(2, "0");
}

function updateTimerStep() {
    const step = document.getElementById("timerStep");

    if (seconds < 30) {
        step.innerHTML = "Bloom: Wet the coffee grounds";
    } else if (seconds < 75) {
        step.innerHTML = "First Pour: Start slow circular pouring";
    } else if (seconds < 120) {
        step.innerHTML = "Second Pour: Keep the flow steady";
    } else if (seconds < 170) {
        step.innerHTML = "Final Pour: Reach your target water amount";
    } else {
        step.innerHTML = "Finish: Let it drain and serve";
    }
}

function updateProgress() {
    const progress = (seconds / totalSeconds) * 100;
    document.getElementById("progress").style.width = progress + "%";
}

function startBrewAnimation() {
    const water = document.getElementById("waterDrop");
    const bed = document.getElementById("coffeeBed");
    const fill = document.getElementById("coffeeFill");

    water.classList.add("active");

    setTimeout(() => {
        bed.classList.add("active");
    }, 600);

    setTimeout(() => {
        fill.classList.add("active");
    }, 1500);

    setTimeout(() => {
        water.classList.remove("active");
    }, 4000);
}




function toggleTheme() {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

function loadTheme() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }
}

function loadDailyFact() {
    const facts = [
        "Freshly ground coffee usually produces a more aromatic cup.",
        "Blooming helps release trapped gases from freshly roasted coffee.",
        "A slower pour can increase extraction and create a stronger taste.",
        "Water temperature affects sweetness, acidity, and bitterness.",
        "A medium grind size is usually a good starting point for V60."
    ];

    const day = new Date().getDate();
    const fact = facts[day % facts.length];

    document.getElementById("dailyFact").innerHTML = fact;
}

function saveRecipe() {
    const coffee = document.getElementById("cardCoffee").innerText;
    const water = document.getElementById("cardWater").innerText;
    const strength = document.getElementById("cardStrength").innerText;
    const note = document.getElementById("brewNote").value;

    if (coffee === "-- g" || water === "-- ml") {
        alert("Please calculate a recipe first.");
        return;
    }

    const recipe = {
        coffee: coffee,
        water: water,
        ratio: "1:16",
        temperature: "93°C",
        brewTime: "2:45 min",
        strength: strength,
        note: note || "No notes added",
        date: new Date().toLocaleDateString()
    };
    document.getElementById("cardNote").innerText =
    note || "No notes added";

    let recipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    recipes.push(recipe);

    localStorage.setItem("savedRecipes", JSON.stringify(recipes));

    document.getElementById("brewNote").value = "";

    loadHistory();
    unlockRecipeAchievement();
}

function loadHistory() {
    const historyList = document.getElementById("historyList");
    const recipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];

    if (recipes.length === 0) {
        historyList.innerHTML = "<p>No saved recipes yet.</p>";
        return;
    }

    historyList.innerHTML = "";

    recipes.forEach((recipe, index) => {
        historyList.innerHTML += `
            <div class="history-card">
                <h3>Recipe #${index + 1}</h3>
                <p><strong>Coffee:</strong> ${recipe.coffee}</p>
                <p><strong>Water:</strong> ${recipe.water}</p>
                <p><strong>Ratio:</strong> ${recipe.ratio}</p>
                <p><strong>Temperature:</strong> ${recipe.temperature}</p>
                <p><strong>Brew Time:</strong> ${recipe.brewTime}</p>
                <p><strong>Strength:</strong> ${recipe.strength}</p>
                <p><strong>Date:</strong> ${recipe.date}</p>
                <div class="note">
                    <strong>Notes:</strong>
                    <p>${recipe.note}</p>
                </div>
            </div>
        `;
    });
}

function clearHistory() {
    localStorage.removeItem("savedRecipes");
    loadHistory();
}

function unlockAchievement() {
    localStorage.setItem("timerAchievement", "completed");
    loadAchievement();
}

function unlockRecipeAchievement() {
    const recipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];

    if (recipes.length >= 1) {
        localStorage.setItem("firstRecipeAchievement", "completed");
    }

    if (recipes.length >= 3) {
        localStorage.setItem("recipeAchievement", "completed");
    }

    loadAchievement();
}

function loadAchievement() {
    updateAchievementCard(
        "timerAchievement",
        "fa-trophy",
        "Timer Master",
        "You completed the guided brew timer.",
        localStorage.getItem("timerAchievement") === "completed"
    );

    updateAchievementCard(
        "firstRecipeAchievement",
        "fa-mug-saucer",
        "First Recipe",
        "You saved your first V60 recipe card.",
        localStorage.getItem("firstRecipeAchievement") === "completed"
    );

    updateAchievementCard(
        "recipeAchievement",
        "fa-award",
        "Recipe Collector",
        "You saved 3 V60 recipes in your brew history.",
        localStorage.getItem("recipeAchievement") === "completed"
    );
}

function updateAchievementCard(id, icon, title, desc, unlocked) {
    const card = document.getElementById(id);

    if (!card) return;

    if (unlocked) {
        card.classList.add("unlocked");
        card.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <h3>${title}</h3>
            <p>${desc}</p>
        `;
    } else {
        card.classList.remove("unlocked");
        card.innerHTML = `
            <i class="fa-solid fa-lock"></i>
            <h3>${title}</h3>
            <p>${desc}</p>
        `;
    }
}

function downloadRecipeCard() {
    const coffee = document.getElementById("cardCoffee").innerText;
    const recipeCard = document.getElementById("recipeCard");

    if (coffee === "-- g") {
        alert("Please calculate a recipe first.");
        return;
    }

    html2canvas(recipeCard, {
        backgroundColor: null,
        scale: 2
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = "v60-recipe-card.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}

loadTheme();
loadAchievement();
loadDailyFact();
updateStrength();
loadHistory();