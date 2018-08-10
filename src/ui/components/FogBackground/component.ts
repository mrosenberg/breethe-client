import Component from '@glimmer/component';
import FloatingParticle from './particle';

export default class FogBackground extends Component {
  particles: FloatingParticle[] = [];
  ctx: CanvasRenderingContext2D;
  fogImage: HTMLImageElement;

  didInsertElement() {
    if (window.requestAnimationFrame) {
      this.renderParticlesBackground();
    }
  }

  particlesForIntensity(intensity: number): number {
    return intensity === 0 ? 0 : 0.1 * Math.pow(2, intensity);
  }

  loadFogImage(): Promise<HTMLImageElement> {
    let fogImage = new Image(500, 500);
    return new Promise((resolve, reject) => {
      fogImage.onload = () => {
        resolve(fogImage);
      };
      fogImage.onerror = (error) => {
        reject(error);
      };
      fogImage.src = '/images/fog-particle.png';
    });
  }

  async renderParticlesBackground() {
    let canvas: HTMLCanvasElement = document.querySelector(
      '#ParticlesBackgroundCanvas'
    );
    let image = await this.loadFogImage();
    let ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.ctx = ctx;
    this.fogImage = image;
    this.setupParticles(115);
    window.requestAnimationFrame(this.drawParticles);
  }

  setupParticles(extras: number) {
    let newParticles = [];
    for (let i = 0; i < extras; i++) {
      let posX = Math.round(Math.random() * window.innerWidth);
      let posY = Math.round(Math.random() * window.innerHeight);
      let newParticle = new FloatingParticle(posX, posY);
      newParticles.push(newParticle);
    }
    this.particles = [...this.particles, ...newParticles];
  }

  drawParticles = () => {
    let { ctx, particles } = this;
    let { innerWidth, innerHeight } = window;
    let opacityFactor = this.particlesForIntensity(this.args.intensity);

    ctx.clearRect(0, 0, innerWidth, innerHeight);

    let length = this.particles.length;
    for (let i = 0; i < length; i++) {
      particles[i].draw(
        ctx,
        this.fogImage,
        innerWidth,
        innerHeight,
        opacityFactor
      );
    }

    window.requestAnimationFrame(this.drawParticles);
  }
}
