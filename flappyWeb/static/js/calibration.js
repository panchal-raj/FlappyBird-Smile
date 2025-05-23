// flappyWeb/static/js/calibration.js

// Import necessary functions and state
import { gameState } from './gameState.js';
// Import webcam functions (ensure path is correct)
import { drawWebcamBackground, initWebcam, isWebcamReady } from './webcam.js';
// Import rendering utilities
import { updateBirdPhysics, drawBird, drawGround } from './utils/rendering.js';
// checkCollisions might not be used or a simplified version if needed for floor collision
// import { checkCollisions } from './utils/collisions.js';
// Import smile detection modules
import { loadModels as loadFaceModels, startSmileUpdates, stopSmileUpdates, faceApiLoaded } from './smileDetector.js';
// Store the function that requests the next animation frame
let requestNextFrameCallback = null;
let scoreElement = null; // To hide main game score
let livesElement = null; // To hide main game lives

/**
 * The main loop for the calibration screen.
 * Draws the webcam feed, instructions, bird, and ground.
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {HTMLCanvasElement} canvas - The game canvas element.
 */
function calibrationLoop(ctx, canvas) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background (webcam feed or fallback)
    drawWebcamBackground(ctx, canvas); // From webcam.js

    // Bird and Ground for visual feedback during calibration
    if (gameState.running && gameState.calibrationMode) {
        // Bird physics (e.g., make it hover or respond to a dummy input for now if desired)
        // For a simple hover:
        gameState.bird.y += Math.sin(Date.now() / 200) * 0.5; // Gentle hover
        if (gameState.bird.y < canvas.height * 0.4) gameState.bird.y = canvas.height * 0.4;
        if (gameState.bird.y > canvas.height * 0.6) gameState.bird.y = canvas.height * 0.6;


        // updateBirdPhysics(); // Or use simplified physics if not jumping yet
        const floorY = canvas.height - gameState.groundHeight - gameState.bird.height / 2;
        if (gameState.bird.y > floorY) {
            gameState.bird.y = floorY;
            gameState.bird.velocity = 0;
        }
        // checkCollisions(() => {}); // Optional for calibration, mainly for floor

        drawBird(ctx);

        // Draw ground with animation
        gameState.groundPos = (gameState.groundPos - (gameState.speed || 0.5)) % 24; // Slower speed
        drawGround(ctx, canvas);
    }

    // Continue calibration loop if still in calibration mode
    if (gameState.running && gameState.calibrationMode && requestNextFrameCallback) {
        requestNextFrameCallback(calibrationLoop);
    }
}

/**
 * Initializes and starts the calibration screen.
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {HTMLCanvasElement} canvas - The game canvas element.
 * @param {Function} startLoopFunc - Function from game.js to start the animation loop.
 * @param {Function} requestFrameFunc - Function from game.js to request the next animation frame.
 */
export async function startCalibrationScreen(ctx, canvas, startLoopFunc, requestFrameFunc) {
    console.log("Starting calibration screen (original basic version)...");

    // Hide main game score/lives if they exist and are managed by these IDs
    if (!scoreElement) scoreElement = document.getElementById('score-display');
    if (!livesElement) livesElement = document.getElementById('lives-display');
    if (scoreElement) scoreElement.style.display = 'none';
    if (livesElement) livesElement.style.display = 'none';


    // Attempt to initialize webcam if not already ready
    if (!isWebcamReady()) {
        console.log("Webcam not ready, attempting to initialize for calibration...");
        await initWebcam(); // Initialize webcam from webcam.js
        if (!isWebcamReady()) {
            alert("Webcam could not be started. Calibration screen will show fallback background.");
            // Proceed without webcam if it fails, drawWebcamBackground will show fallback
        }
    }

    // Load face-api models if not already loaded
    // Assuming loadModels is the one from smileDetector.js
    if (typeof loadFaceModels === 'function' && !faceApiLoaded) { // Check if faceApiLoaded is a global or part of smileDetector export
        try {
            await loadFaceModels(); // from smileDetector.js
            console.log("Face models loaded for calibration.");
        } catch (error) {
            console.error("Failed to load face models for calibration:", error);
            alert("Could not load smile detection models. Calibration might not work as expected.");
            // Optionally, decide if you want to proceed or return to menu
        }
    }
    requestNextFrameCallback = requestFrameFunc;

    // Set game state for calibration
    gameState.running = true;
    gameState.calibrationMode = true;
    gameState.pipes = []; // Clear pipes
    gameState.stars = []; // Clear stars (if you have them)
    // Reset bird position for calibration screen
    gameState.bird.x = canvas.width * 0.25; // Position bird more to the left
    gameState.bird.y = canvas.height / 2;   // Center vertically
    gameState.bird.velocity = 0;
    // gameState.bird.canJump = false; // No jumping in this basic version yet

    // Use the provided function from game.js to start the calibration loop
    startLoopFunc(calibrationLoop);
    
    // Start updating the smile intensity display
    // MODIFIED_BLOCK: Changed window.faceApiLoaded to the imported faceApiLoaded and improved warning
    if (isWebcamReady() && faceApiLoaded) {
         startSmileUpdates();
    } else {
        let reason = "";
        if (!isWebcamReady() && !faceApiLoaded) {
            reason = "Webcam and face models are not ready";
        } else if (!isWebcamReady()) {
            reason = "Webcam is not ready";
        } else {
            reason = "Face models are not ready"; // This will now correctly trigger if models truly failed or are still loading
        }
        console.warn(`${reason}, smile intensity display will not update.`);
        const smileValueElement = document.getElementById('smile-intensity-value');
        if(smileValueElement) smileValueElement.textContent = "N/A";
    }
}

/**
 * Stops the calibration loop.
 */
export function stopCalibration() {
    gameState.calibrationMode = false;
    requestNextFrameCallback = null; // Clear the callback
    console.log("Calibration stopped (original basic version).");

    // Stop updating the smile intensity display
    stopSmileUpdates();

    // Show main game score/lives again if they were hidden
    if (scoreElement) scoreElement.style.display = 'block'; // Or original display value
    if (livesElement) livesElement.style.display = 'block'; // Or original display value

    // The actual animation frame cancellation should happen in game.js's stopLoop function
}
