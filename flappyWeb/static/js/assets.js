// assets.js - Handles asset loading and management

// Game assets container
const assets = {
    bird: [],
    background: null,
    pipe: {
        top: null,
        bottom: null
    },
    ground: null,
    star: null,
    bigStar: null,
    heart: null
};

// Load all game assets
function loadAssets(onComplete) {
    let assetsToLoad = 8; // Number of assets to load
    let assetsLoaded = 0;

    // Function to check if all assets are loaded
    function assetLoaded() {
        assetsLoaded++;
        if (assetsLoaded >= assetsToLoad) {
            console.log("All assets loaded successfully!");
            if (onComplete) onComplete();
        }
    }

    // Load bird sprites (3 frames for animation)
    const birdPrefixes = ['yellowbird-upflap', 'yellowbird-midflap', 'yellowbird-downflap'];
    birdPrefixes.forEach(prefix => {
        const img = new Image();
        img.onload = assetLoaded;
        img.onerror = function() {
            console.error(`Failed to load: ${img.src}`);
            // Try alternative location or bird color
            img.src = `/static/assets/sprites/bluebird-${prefix.split('-')[1]}.png`;
        };
        img.src = `/static/assets/sprites/${prefix}.png`;
        assets.bird.push(img);
    });
    
    // Load background
    assets.background = new Image();
    assets.background.onload = assetLoaded;
    assets.background.onerror = function() {
        console.error('Failed to load background, trying alternative');
        assets.background.src = '/static/assets/sprites/background-night.png';
    };
    assets.background.src = '/static/assets/sprites/background-day.png';
    
    // Load pipes
    assets.pipe.top = new Image();
    assets.pipe.top.onload = assetLoaded;
    assets.pipe.top.onerror = function() {
        assets.pipe.top.src = '/static/assets/sprites/pipe-red.png';
    };
    assets.pipe.top.src = '/static/assets/sprites/pipe-green.png';
    
    assets.pipe.bottom = new Image();
    assets.pipe.bottom.onload = assetLoaded;
    assets.pipe.bottom.onerror = function() {
        assets.pipe.bottom.src = '/static/assets/sprites/pipe-red.png';
    };
    assets.pipe.bottom.src = '/static/assets/sprites/pipe-green.png';
    
    // Load ground
    assets.ground = new Image();
    assets.ground.onload = assetLoaded;
    assets.ground.src = '/static/assets/sprites/base.png';
    
    // Load star assets (for star modes)
    assets.star = new Image();
    assets.star.onload = assetLoaded;
    assets.star.onerror = function() {
        console.error('Failed to load star sprite');
    };
    assets.star.src = '/static/assets/sprites/star.png';
    
    // Load big star asset
    assets.bigStar = new Image();
    assets.bigStar.onload = assetLoaded;
    assets.bigStar.onerror = function() {
        console.error('Failed to load big star sprite');
    };
    assets.bigStar.src = '/static/assets/sprites/star.png'; // Using same image but scaled larger
    
    // Load heart icon
    assets.heart = new Image();
    assets.heart.onload = assetLoaded;
    assets.heart.onerror = function() {
        console.error('Failed to load heart sprite');
    };
    assets.heart.src = '/static/assets/sprites/heart.png';
}

// Check if critical assets are loaded
function checkAssets() {
    console.log("Checking assets...");
    
    // Check bird assets
    console.log("Bird assets:", assets.bird.length, "images");
    assets.bird.forEach((img, index) => {
        console.log(`Bird image ${index}: ${img.complete ? "Loaded" : "Not loaded"} (width: ${img.width}, height: ${img.height})`);
    });
    
    // Check background
    console.log(`Background: ${assets.background ? (assets.background.complete ? "Loaded" : "Not loaded") : "Missing"}`);
    if (assets.background) {
        console.log(`Background dimensions: ${assets.background.width}x${assets.background.height}`);
    }
    
    // Check pipes
    console.log(`Pipe (top): ${assets.pipe.top ? (assets.pipe.top.complete ? "Loaded" : "Not loaded") : "Missing"}`);
    console.log(`Pipe (bottom): ${assets.pipe.bottom ? (assets.pipe.bottom.complete ? "Loaded" : "Not loaded") : "Missing"}`);
    
    // Check ground
    console.log(`Ground: ${assets.ground ? (assets.ground.complete ? "Loaded" : "Not loaded") : "Missing"}`);
    
    return assets.bird.length > 0 && 
        assets.bird[0].complete && 
        assets.background && 
        assets.background.complete &&
        assets.pipe.top &&
        assets.pipe.top.complete &&
        assets.ground &&
        assets.ground.complete;
}

// Function to resize canvas and adjust game elements accordingly
function resizeCanvas(canvas, gameState) {
    // Get actual window dimensions
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    canvas.width = containerWidth;
    canvas.height = containerHeight;
    
    // Update ground position
    if (assets.ground) {
        gameState.ground.y = canvas.height - assets.ground.height;
    }
    
    // Also update bird starting position
    gameState.bird.y = canvas.height / 2 - gameState.bird.height;
}

// Export assets and functions
export { 
    assets, 
    loadAssets, 
    checkAssets, 
    resizeCanvas 
};