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
            dash: false,
            flight: false
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
        const triggerHaptic = () => {
            try {
                if (navigator.vibrate) {
                    navigator.vibrate(12);
                }
            } catch (err) {}
        };

        const bindBtn = (id, keyName) => {
            const btn = document.getElementById(id);
            if (!btn) return;

            const handleStart = (e) => {
                if (e.cancelable) e.preventDefault();
                if (!this.touch[keyName]) {
                    triggerHaptic();
                }
                this.touch[keyName] = true;
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');

                if (keyName === 'jump') {
                    this.jumpPressed = true;
                }
                if (window.soundEngine) window.soundEngine.ensureContext();
            };

            const handleEnd = (e) => {
                if (e.cancelable) e.preventDefault();
                this.touch[keyName] = false;
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            };

            btn.addEventListener('touchstart', handleStart, { passive: false });
            btn.addEventListener('touchend', handleEnd, { passive: false });
            btn.addEventListener('touchcancel', handleEnd, { passive: false });
            btn.addEventListener('mousedown', handleStart);
            btn.addEventListener('mouseup', handleEnd);
            btn.addEventListener('mouseleave', handleEnd);
            btn.addEventListener('contextmenu', (e) => e.preventDefault());
        };

        const setupLeftClusterSlideSteering = () => {
            const leftCluster = document.querySelector('.left-cluster');
            const btnLeft = document.getElementById('btnTouchLeft');
            const btnRight = document.getElementById('btnTouchRight');
            if (!leftCluster || !btnLeft || !btnRight) return;

            const processTouches = (e) => {
                if (e.cancelable) e.preventDefault();

                let touchLeftActive = false;
                let touchRightActive = false;

                const leftRect = btnLeft.getBoundingClientRect();
                const rightRect = btnRight.getBoundingClientRect();

                // Hit padding around buttons for smooth continuous touch steering
                const hitPadding = 25;

                for (let i = 0; i < e.touches.length; i++) {
                    const t = e.touches[i];
                    const tx = t.clientX;
                    const ty = t.clientY;

                    // Check Left Button Hitbox
                    if (
                        tx >= leftRect.left - hitPadding &&
                        tx <= leftRect.right + hitPadding &&
                        ty >= leftRect.top - hitPadding &&
                        ty <= leftRect.bottom + hitPadding
                    ) {
                        touchLeftActive = true;
                    }

                    // Check Right Button Hitbox
                    if (
                        tx >= rightRect.left - hitPadding &&
                        tx <= rightRect.right + hitPadding &&
                        ty >= rightRect.top - hitPadding &&
                        ty <= rightRect.bottom + hitPadding
                    ) {
                        touchRightActive = true;
                    }
                }

                // If moving from false to true, trigger subtle haptic
                if ((touchLeftActive && !this.touch.left) || (touchRightActive && !this.touch.right)) {
                    triggerHaptic();
                }

                this.touch.left = touchLeftActive;
                this.touch.right = touchRightActive;

                btnLeft.classList.toggle('active', touchLeftActive);
                btnLeft.setAttribute('aria-pressed', touchLeftActive ? 'true' : 'false');

                btnRight.classList.toggle('active', touchRightActive);
                btnRight.setAttribute('aria-pressed', touchRightActive ? 'true' : 'false');
            };

            leftCluster.addEventListener('touchstart', processTouches, { passive: false });
            leftCluster.addEventListener('touchmove', processTouches, { passive: false });
            leftCluster.addEventListener('touchend', processTouches, { passive: false });
            leftCluster.addEventListener('touchcancel', processTouches, { passive: false });
        };

        const attachControls = () => {
            bindBtn('btnTouchLeft', 'left');
            bindBtn('btnTouchRight', 'right');
            bindBtn('btnTouchJump', 'jump');
            bindBtn('btnTouchDash', 'dash');
            bindBtn('btnTouchFlight', 'flight');

            setupLeftClusterSlideSteering();

            const canvas = document.getElementById('gameCanvas');
            if (canvas) {
                canvas.addEventListener('mousedown', (e) => {
                    if (e.button === 0) { // Left click
                        this.touch.flight = true;
                        if (window.soundEngine) window.soundEngine.ensureContext();
                    }
                });
                canvas.addEventListener('mouseup', () => {
                    this.touch.flight = false;
                });
                canvas.addEventListener('touchstart', (e) => {
                    if (window.soundEngine) window.soundEngine.ensureContext();
                }, { passive: true });
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', attachControls);
        } else {
            attachControls();
        }

        window.addEventListener('blur', () => this.reset());
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

    isFlightPressed() {
        return !!(this.keys['KeyF'] || this.keys['KeyE'] || this.keys['KeyJ'] || this.keys['f'] || this.keys['e'] || this.keys['j'] || this.touch.flight);
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
