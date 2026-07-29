/* ==========================================================================
   Shadow Escape - Dual Input System (Keyboard + Mobile Touch Controls)
   ========================================================================== */

class InputHandler {
    constructor() {
        this.keys = {};
        this.jumpPressed = false;
        this.touch = {
            left: false,
            right: false,
            up: false,
            down: false,
            jump: false,
            dash: false
        };

        this.setupKeyboardListeners();
        this.setupTouchListeners();
    }

    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.keys[e.key] = true;

            if (!e.repeat && ['KeyW', 'ArrowUp', 'Space'].includes(e.code)) {
                this.jumpPressed = true;
            }

            // Prevent scroll on arrow keys or space
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            this.keys[e.key] = false;
        });
    }

    setupTouchListeners() {
        const bindBtn = (id, keyName) => {
            const btn = document.getElementById(id);
            if (!btn) return;

            const handleStart = (e) => {
                e.preventDefault();
                this.touch[keyName] = true;
                if (keyName === 'jump') {
                    this.jumpPressed = true;
                }
                if (window.soundEngine) window.soundEngine.ensureContext();
            };

            const handleEnd = (e) => {
                e.preventDefault();
                this.touch[keyName] = false;
            };

            btn.addEventListener('touchstart', handleStart, { passive: false });
            btn.addEventListener('touchend', handleEnd, { passive: false });
            btn.addEventListener('mousedown', handleStart);
            btn.addEventListener('mouseup', handleEnd);
            btn.addEventListener('mouseleave', handleEnd);
        };

        // Attach elements when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            bindBtn('btnTouchLeft', 'left');
            bindBtn('btnTouchRight', 'right');
            bindBtn('btnTouchJump', 'jump');
            bindBtn('btnTouchDash', 'dash');
        });
    }

    // Directional getters
    isLeft() {
        return !!(this.keys['KeyA'] || this.keys['ArrowLeft'] || this.touch.left);
    }

    isRight() {
        return !!(this.keys['KeyD'] || this.keys['ArrowRight'] || this.touch.right);
    }

    isJumpPressed() {
        return !!(this.keys['KeyW'] || this.keys['ArrowUp'] || this.keys['Space'] || this.touch.jump);
    }

    consumeJumpPressed() {
        const pressed = this.jumpPressed;
        this.jumpPressed = false;
        return pressed;
    }

    isDashPressed() {
        return !!(this.keys['ShiftLeft'] || this.keys['ShiftRight'] || this.keys['KeyK'] || this.touch.dash);
    }

    isPausePressed() {
        return !!(this.keys['KeyP'] || this.keys['Escape']);
    }

    // Reset touch state
    reset() {
        this.jumpPressed = false;
        for (let k in this.touch) {
            this.touch[k] = false;
        }
    }
}

const input = new InputHandler();
window.inputHandler = input;
