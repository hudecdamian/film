document.addEventListener('DOMContentLoaded', () => {
    // Přepínání záložek květin
    const tabButtons = document.querySelectorAll('.tab-btn');
    const flowerSections = document.querySelectorAll('.flower-section');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            flowerSections.forEach(sec => sec.classList.remove('active'));

            button.classList.add('active');
            const targetFlower = button.getAttribute('data-flower');
            document.getElementById(targetFlower).classList.add('active');
        });
    });

    // --- LOGIKA MINIHRY: SBÍRÁNÍ KVĚTIN ---
    const startBtn = document.getElementById('startBtn');
    const scoreVal = document.getElementById('scoreVal');
    const gameArea = document.getElementById('gameArea');
    const basket = document.getElementById('basket');

    let score = 0;
    let gameInterval = null;
    let itemSpawnInterval = null;
    let isPlaying = false;
    let basketX = 50; // pozice košíku v %

    // Ovládání košíku myší nebo dotykem
    gameArea.addEventListener('pointermove', (e) => {
        if (!isPlaying) return;
        const rect = gameArea.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let percentage = (x / rect.width) * 100;
        
        // Omezení, aby košík neutekl z plochy
        if (percentage < 5) percentage = 5;
        if (percentage > 95) percentage = 95;
        
        basketX = percentage;
        basket.style.left = `${basketX}%`;
    });

    startBtn.addEventListener('click', () => {
        if (isPlaying) return;
        startGame();
    });

    function startGame() {
        isPlaying = true;
        score = 0;
        scoreVal.textContent = score;
        startBtn.textContent = "Hra běží... 🌸";
        startBtn.style.opacity = "0.7";

        // Odstranění starých padajících květin, pokud nějaké zbyly
        document.querySelectorAll('.falling-item').forEach(el => el.remove());

        // Spawnování nových květin
        itemSpawnInterval = setInterval(spawnFlower, 800);

        // Hlavní herní smyčka pro detekci chycení
        gameInterval = setInterval(updateGame, 30);
    }

    function spawnFlower() {
        if (!isPlaying) return;

        const flowers = ['🌹', '🌸', '🌷'];
        const item = document.createElement('div');
        item.classList.add('falling-item');
        item.textContent = flowers[Math.floor(Math.random() * flowers.length)];

        // Náhodná pozice zleva (10% až 90%)
        const randomLeft = Math.random() * 80 + 10;
        item.style.left = `${randomLeft}%`;
        item.dataset.y = -30; // počáteční pozice shora v pixelech
        item.style.top = `-30px`;

        gameArea.appendChild(item);
    }

    function updateGame() {
        const items = document.querySelectorAll('.falling-item');
        const areaHeight = gameArea.clientHeight;

        items.forEach(item => {
            let currentY = parseFloat(item.dataset.y);
            currentY += 3.5; // rychlost padání
            item.dataset.y = currentY;
            item.style.top = `${currentY}px`;

            // Detekce dopadu na spodní část (kde je košík)
            if (currentY >= areaHeight - 45) {
                const itemRect = item.getBoundingClientRect();
                const basketRect = basket.getBoundingClientRect();

                // Jednoduchá kolize podle X souřadnic
                if (itemRect.left < basketRect.right && itemRect.right > basketRect.left) {
                    score += 1;
                    scoreVal.textContent = score;
                    item.remove();
                } else if (currentY > areaHeight) {
                    // Květina spadla vedle košíku
                    item.remove();
                }
            }
        });
    }

    // Ukončení hry po 25 sekundách
    let gameTimer = null;
    // (Pro zjednodušení běží nekonečně do dalšího kliku, nebo si můžeš nastavit limit)


    // --- PADAJÍCÍ LÍSTKY NA POZADÍ ---
    const petalsContainer = document.getElementById('petalsContainer');
    const numberOfPetals = 12;

    for (let i = 0; i < numberOfPetals; i++) {
        createPetal();
    }

    function createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');

        const size = Math.random() * 8 + 8;
        const leftPos = Math.random() * 100;
        const duration = Math.random() * 6 + 4;
        const delay = Math.random() * 5;

        petal.style.width = `${size}px`;
        petal.style.height = `${size * 1.4}px`;
        petal.style.left = `${leftPos}%`;
        petal.style.animationDuration = `${duration}s`;
        petal.style.animationDelay = `${delay}s`;

        const colors = ['#ffb6c1', '#f8bbd0', '#ffccd5', '#e1bee7'];
        petal.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        petalsContainer.appendChild(petal);

        petal.addEventListener('animationiteration', () => {
            petal.style.left = `${Math.random() * 100}%`;
        });
    }
});