/* ==========================================================================
   Shadow Escape - Physics Engine (AABB Collisions & Raycasting)
   ========================================================================== */

class Physics {
    // Axis-Aligned Bounding Box (AABB) intersection check
    static checkAABB(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    // Resolve Player vs Platform Collisions
    static resolvePlatformCollision(player, platform) {
        const pLeft = player.x;
        const pRight = player.x + player.width;
        const pTop = player.y;
        const pBottom = player.y + player.height;

        const platLeft = platform.x;
        const platRight = platform.x + platform.width;
        const platTop = platform.y;
        const platBottom = platform.y + platform.height;

        // Calculate overlap depths
        const overlapX1 = pRight - platLeft;
        const overlapX2 = platRight - pLeft;
        const overlapY1 = pBottom - platTop;
        const overlapY2 = platBottom - pTop;

        const minX = overlapX1 < overlapX2 ? overlapX1 : -overlapX2;
        const minY = overlapY1 < overlapY2 ? overlapY1 : -overlapY2;

        if (Math.abs(minX) < Math.abs(minY)) {
            // Horizontal Collision (Walls)
            if (minX > 0) {
                player.x = platLeft - player.width;
                player.velocityX = 0;
            } else {
                player.x = platRight;
                player.velocityX = 0;
            }
        } else {
            // Vertical Collision (Floor / Ceiling)
            if (minY > 0) {
                // Landing on platform top
                player.y = platTop - player.height;
                player.velocityY = 0;
                player.isGrounded = true;
                player.canDoubleJump = true;
            } else {
                // Hitting platform bottom
                player.y = platBottom;
                player.velocityY = 0;
            }
        }
    }

    // Line to Box Raycast check for Laser Beams
    static lineIntersectsBox(x1, y1, x2, y2, box) {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);

        // Quick bounding check
        if (maxX < box.x || minX > box.x + box.width || maxY < box.y || minY > box.y + box.height) {
            return false;
        }

        return true;
    }
}

window.Physics = Physics;
