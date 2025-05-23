// // modes/stars.js
// import { gameState, gameSettings } from '../gameState.js';
// import { assets, sounds } from '../assets.js';
// import { isOverlappingPipe } from '../utils/collisions.js';
// import { drawStar } from '../utils/rendering.js';

// // Get canvas reference
// let canvas;

// /**
//  * Initialize the module with required context
//  * @param {HTMLCanvasElement} gameCanvas - The game canvas element
//  */
// export function setupStarsMode(gameCanvas) {
//     canvas = gameCanvas;
// }

// /**
//  * Create a new star
//  * @returns {Object} - New star object
//  */
// export function createStar() {
//     const isBigStar = Math.random() < gameState.bigStarChance;
//     const starSize = isBigStar ? 40 : 25;
    
//     // Random position
//     const x = canvas.width;
//     const y = Math.random() * (canvas.height - gameState.ground.height - 2 * starSize) + starSize;
    
//     // Ensure the star doesn't overlap with pipes
//     if (isOverlappingPipe(x, y, starSize, starSize, gameState.pipes)) {
//         // Try again with a different position if overlapping
//         return createStar();
//     }
    
//     return {
//         x: x,
//         y: y,
//         width: starSize,
//         height: starSize,
//         isBigStar: isBigStar,
//         collected: false,
//         value: isBigStar ? 5 : 1
//     };
// }

// /**
//  * Handle game logic for stars mode
//  */
// export function handleStarsMode(ctx) {
//     // Only run if in a star-related game mode
//     if (gameSettings.mode !== 'stars' && gameSettings.mode !== 'pipes-and-stars') {
//         return;
//     }
    
//     // Create new stars periodically
//     const currentTime = Date.now();
//     if (currentTime - gameState.lastStarTime > gameState.starSpawnInterval) {
//         gameState.stars.push(createStar());
//         gameState.lastStarTime = currentTime;
//     }
    
//     // Update stars
//     for (let i = 0; i < gameState.stars.length; i++) {
//         const star = gameState.stars[i];
        
//         // Move star
//         star.x -= gameState.pipeSpeed;
        
//         // Check if star was collected
//         if (!star.collected && checkStarCollection(gameState.bird, star)) {
//             star.collected = true;
//             gameState.score += star.value;
            
//             // Play star collection sound
//             if (sounds && sounds.star) {
//                 sounds.star.currentTime = 0;
//                 sounds.star.play().catch(e => console.log("Audio play failed:", e));
//             }
//         }
//     }
    
//     // Remove stars that are off-screen or collected
//     gameState.stars = gameState.stars.filter(star => 
//         star.x + star.width > 0 && !star.collected);
    
//     // Draw stars
//     if (ctx) {
//         for (const star of gameState.stars) {
//             if (!star.collected) {
//                 drawStar(ctx, assets.star, star);
//             }
//         }
//     }
// }

// /**
//  * Check if bird collects a star
//  * @param {Object} bird - Bird object with position and dimensions
//  * @param {Object} star - Star object with position and dimensions
//  * @returns {boolean} - Whether the bird collects the star
//  */
// function checkStarCollection(bird, star) {
//     return (
//         bird.x < star.x + star.width &&
//         bird.x + bird.width > star.x &&
//         bird.y < star.y + star.height &&
//         bird.y + bird.height > star.y &&
//         !star.collected
//     );
// }