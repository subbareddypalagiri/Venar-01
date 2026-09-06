export function initParticleText() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Scale for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    // Set logical size big enough for the text
    const logicalWidth = 850;
    const logicalHeight = 110;
    
    canvas.style.width = logicalWidth + 'px';
    canvas.style.height = logicalHeight + 'px';
    
    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    ctx.scale(dpr, dpr);
    
    let particles = [];
    let mouse = { x: null, y: null, radius: 70 };
    
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    canvas.addEventListener('mouseleave', function() {
        mouse.x = null;
        mouse.y = null;
    });
    
    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.size = 2.5; // Fine particle size
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;
            
            if (distance < mouse.radius && mouse.x !== null) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 15; // Return speed
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 15;
                }
            }
        }
    }
    
    function init() {
        particles = [];
        // Clear canvas before drawing text
        ctx.clearRect(0, 0, logicalWidth, logicalHeight);
        
        // Draw the text
        ctx.font = "800 80px 'Plus Jakarta Sans', sans-serif";
        if (ctx.letterSpacing !== undefined) {
            ctx.letterSpacing = "-2.5px";
        }
        
        const words = [
            { text: "The ", color: "#ffffff" },
            { text: "Entire ", color: "#ffffff" },
            { text: "AI ", color: "#ffffff" },
            { text: "Market.", color: "#ffffff" }
        ];
        
        let totalWidth = 0;
        for (let word of words) {
            totalWidth += ctx.measureText(word.text).width;
        }
        
        let currentX = (logicalWidth - totalWidth) / 2;
        for (let word of words) {
            ctx.fillStyle = word.color;
            ctx.fillText(word.text, currentX, 85);
            currentX += ctx.measureText(word.text).width;
        }
        
        // Extract pixel data
        const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Create particles
        const step = Math.floor(4 * dpr); // Step size controls particle density
        for (let y = 0; y < textCoordinates.height; y += step) {
            for (let x = 0; x < textCoordinates.width; x += step) {
                const index = (y * 4 * textCoordinates.width) + (x * 4);
                if (textCoordinates.data[index + 3] > 128) {
                    let r = textCoordinates.data[index];
                    let g = textCoordinates.data[index + 1];
                    let b = textCoordinates.data[index + 2];
                    let color = `rgb(${r},${g},${b})`;
                    
                    // Convert back to logical coordinates for rendering
                    let positionX = x / dpr;
                    let positionY = y / dpr;
                    particles.push(new Particle(positionX, positionY, color));
                }
            }
        }
        // Clear the hardcoded text so we only render particles
        ctx.clearRect(0, 0, logicalWidth, logicalHeight);
    }
    
    function animate() {
        ctx.clearRect(0, 0, logicalWidth, logicalHeight);
        for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
            particles[i].update();
        }
        requestAnimationFrame(animate);
    }
    
    // Ensure fonts are loaded before calculating text pixels
    document.fonts.ready.then(() => {
        init();
        animate();
    });
}
