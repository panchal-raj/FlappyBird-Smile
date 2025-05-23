// // modes/pipesStars.js
// import { gameState, gameSettings } from '../gameState.js';
// import { assets, sounds } from '../assets.js';
// import { createPipe, handlePipesMode } from './pipes.js';
// import { createStar, checkStarCollisions, handleStarsMode } from './stars.js';

// // Additional collision detection for pipe-star interactions
// function ensureStarPositioning(star) {
//     // Check if star is in a valid position away from pipes
//     let isValidPosition = true;
//     const buffer = 30; // Buffer space from pipe edges
    
//     for (const pipe of gameState.pipes) {
//         // Check horizontal overlap
//         if (star.x < pipe.x + pipe.width + buffer && star.x + star.width + buffer > pipe.x) {
//             // Check if star is in the pipe's path
//             if (star.y < pipe.topHeight + buffer || star.y + star.height > pipe.bottomY - buffer) {
//                 isValidPosition = false;
//                 break;
//             }
//         }
//     }
    
//     return isValidPosition;
// }

// // Create a star specifically for the pipes-and-stars mode
// function createPipesAndStarsStar() {
//     const star = createStar(); // Get base star from stars.js
    
//     // Ensure the star is not positioned inside or too close to a pipe
//     let attempts = 0;
//     const maxAttempts = 15;
    
//     while (!ensureStarPositioning(star) && attempts < maxAttempts) {
//         // Adjust position and try again
//         const minY = 50;
//         const maxY = gameState.ground.y - 50;
//         star.y = minY + Math.random() * (maxY - minY);
        
//         // Try positioning further to the right if needed
//         if (attempts > 5) {
//             star.x += 100; // Move further right to avoid pipes
//         }
        
//         attempts++;
//     }
    
//     // Adjust star speed to match pipe speed for consistency
//     star.speed = gameState.pipeSpeed;
    
//     return star;
// }

// // Mark pipes as passed without awarding points in combined mode
// function handlePipeStarScoring(pipe) {
//     if (!pipe.passed && gameState.bird.x > pipe.x + pipe.width) {
//         pipe.passed = true;
//         // No points awarded for passing pipes in combined mode
//         // Only stars give points in this mode
//     }
// }

// // Main handler for the combined pipes-and-stars mode
// function handlePipesAndStarsMode() {
//     // Only run if we're in the combined mode
//     if (gameSettings.mode !== 'pipes-and-stars') {
//         return;
//     }
    
//     // Call the individual handlers for pipes and stars
//     // We're using the core functionality from each mode
//     handlePipesMode();
//     handleStarsMode();
    
//     // Find pipes that have been passed and manage scoring
//     // We override the scoring here to customize for combined mode
//     for (const pipe of gameState.pipes) {
//         handlePipeStarScoring(pipe);
//     }
    
//     // Spawn stars slightly less frequently in combined mode
//     // This logic runs in handleStarsMode, but we can adjust the interval here
//     gameState.starSpawnInterval = 2500; // Slightly longer interval than pure stars mode
// }

// // Custom star spawn timing for combined mode
// function adjustStarSpawnRate() {
//     // Dynamically adjust star spawn rate based on game progress
//     // This makes stars appear more or less frequently as the game progresses
//     if (gameSettings.mode === 'pipes-and-stars') {
//         const baseInterval = 2500;
//         const minInterval = 1800;
        
//         // As score increases, stars spawn more frequently, up to a limit
//         const scoreAdjustment = Math.min(gameState.score * 20, 700);
//         gameState.starSpawnInterval = Math.max(baseInterval - scoreAdjustment, minInterval);
//     }
// }

// // Export the functionality
// export { handlePipesAndStarsMode, adjustStarSpawnRate, createPipesAndStarsStar };