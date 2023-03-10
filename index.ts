if (typeof window === "object") {
  const scoreEl = document.querySelector("#scoreEl") as HTMLElement;
  const canvas: HTMLCanvasElement = document.querySelector(
    "#canvas"
  ) as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  canvas.width = 1024;
  canvas.height = 576;

  // // Interface 只約束 Class 最低需要
  interface Item1 {
    position: { x: number; y: number };
    velocity?: { x: number; y: number };
  }

  type TypeProjectile = {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
  };
  // interface Item2 {
  //   width: number;
  //   height: number;
  // }

  // 一個 Class 能夠同時被多個 Interface 給約束
  class Player implements Item1 {
    position!: { x: number; y: number };
    velocity: { x: number; y: number };
    width!: number;
    height!: number;
    image?: HTMLImageElement;
    rotation: number | any;
    opacity: number;

    constructor() {
      this.velocity = {
        x: 0,
        y: 0,
      };

      this.rotation = 0;
      this.opacity = 1;

      const image = new Image();
      image.src = "./assets/spaceship.png";
      image.onload = () => {
        const scale = 0.15;
        this.image = image;
        this.width = image.width * scale;
        this.height = image.height * scale;

        this.position = {
          x: canvas.width / 2 - this.width / 2,
          y: canvas.height - this.height - 20,
        };
      };
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(
        player.position.x + player.width / 2,
        player.position.y + player.height / 2
      );
      ctx.rotate(this.rotation);
      ctx.translate(
        -player.position.x - player.width / 2,
        -player.position.y - player.height / 2
      );
      ctx.drawImage(
        this.image as HTMLImageElement,
        this.position.x,
        this.position.y,
        this.width as number,
        this.height as number
      );
      ctx.restore();
    }

    update() {
      if (this.image) {
        this.draw();
        this.position.x += this.velocity.x;
      }
    }
  }

  class Projectile {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    radius: number;

    constructor({ position, velocity }: TypeProjectile) {
      this.position = position;
      this.velocity = velocity;

      this.radius = 3;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();
    }

    update() {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }

  class Particle {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    radius: number;
    color: string;
    opacity: number;
    fades: boolean;

    constructor({ position, velocity, radius, color, fades }: any) {
      this.position = position;
      this.velocity = velocity;

      this.radius = radius;
      this.color = color;
      this.opacity = 1;
      this.fades = fades;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }

    update() {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      if (this.fades) {
        this.opacity -= 0.01;
      }
    }
  }

  class InvaderProjectile {
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    width: number;
    height: number;

    constructor({ position, velocity }: TypeProjectile) {
      this.position = position;
      this.velocity = velocity;

      this.width = 3;
      this.height = 10;
    }

    draw() {
      ctx.fillStyle = "white";
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }

  class Invader {
    position!: { x: number; y: number };
    velocity: { x: number; y: number };
    width!: number;
    height!: number;
    image?: HTMLImageElement;

    constructor({ position }: Item1) {
      this.velocity = {
        x: 0,
        y: 0,
      };

      const image = new Image();
      image.src = "./assets/invader.png";
      image.onload = () => {
        const scale = 1;
        this.image = image;
        this.width = image.width * scale;
        this.height = image.height * scale;
        this.position = {
          x: position.x,
          y: position.y,
        };
      };
    }
    draw() {
      ctx.drawImage(
        this.image as HTMLImageElement,
        this.position.x,
        this.position.y,
        this.width as number,
        this.height as number
      );
    }

    update({ velocity }: any) {
      if (this.image) {
        this.draw();
        this.position.x += velocity.x;
        this.position.y += velocity.y;
      }
    }

    shoot(invaderProjectiles: InvaderProjectile[]) {
      invaderProjectiles.push(
        new InvaderProjectile({
          position: {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height,
          },
          velocity: {
            x: 0,
            y: 5,
          },
        })
      );
    }
  }

  class Grid implements Item1 {
    position!: { x: number; y: number };
    velocity: { x: number; y: number };
    invaders: Invader[];
    width: number;

    constructor() {
      this.position = {
        x: 0,
        y: 0,
      };

      this.velocity = {
        x: 2.5,
        y: 0,
      };

      this.invaders = [];

      // 5-15 行
      // 2-7 列
      const columns = Math.floor(Math.random() * 10 + 5);
      const rows = Math.floor(Math.random() * 5 + 2);

      this.width = columns * 30;

      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          this.invaders.push(
            new Invader({
              position: {
                x: i * 30,
                y: j * 30,
              },
            })
          );
        }
      }
    }

    update() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      this.velocity.y = 0;

      if (
        this.position.x + this.width >= canvas.width ||
        this.position.x <= 0
      ) {
        this.velocity.x = -this.velocity.x;
        this.velocity.y = 30;
      }
    }
  }

  const player = new Player();
  const projectiles: Projectile[] = [];
  const grids: Grid[] = [];
  const invaderProjectiles: InvaderProjectile[] = [];
  const particles: Particle[] = [];

  const keys = {
    ArrowLeft: {
      pressed: false,
    },
    ArrowRight: {
      pressed: false,
    },
    space: {
      pressed: false,
    },
  };

  let frame: number = 0;
  let randomInterval = Math.floor(Math.random() * 500 + 500);
  let game = {
    over: false,
    active: true,
  };
  let score = 0;

  for (let i = 0; i < 100; i++) {
    particles.push(
      new Particle({
        position: {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
        },
        velocity: {
          x: 0,
          y: 0.3,
        },
        radius: Math.random() * 2,
        color: "white",
      })
    );
  }

  function createParticle({ object, color, fades }: any) {
    for (let i = 0; i < 15; i++) {
      particles.push(
        new Particle({
          position: {
            x: object.position.x + object.width / 2,
            y: object.position.y + object.height / 2,
          },
          velocity: {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
          },
          radius: Math.random() * 3,
          color: color || "#BAA0DE",
          fades,
        })
      );
    }
  }

  function animate() {
    if (!game.active) return;
    requestAnimationFrame(animate);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    particles.forEach((particle, i) => {
      if (particle.position.y - particle.radius >= canvas.height) {
        particle.position.x = Math.random() * canvas.width;
        particle.position.y = -particle.radius;
      }

      if (particle.opacity <= 0) {
        setTimeout(() => {
          particles.splice(i, 1);
        }, 0);
      } else {
        particle.update();
      }
    });

    invaderProjectiles.forEach((invaderProjectile, index) => {
      if (
        invaderProjectile.position.y + invaderProjectile.height >=
        canvas.height
      ) {
        setTimeout(() => {
          invaderProjectiles.splice(index, 1);
        }, 0);
      } else invaderProjectile.update();

      // projectile hit player
      if (
        invaderProjectile.position.y + invaderProjectile.height >=
          player.position.y &&
        invaderProjectile.position.x + invaderProjectile.width >=
          player.position.x &&
        invaderProjectile.position.x <= player.position.x + player.width
      ) {
        setTimeout(() => {
          invaderProjectiles.splice(index, 1);
          player.opacity = 0;
          game.over = true;
        }, 0);
        setTimeout(() => {
          game.active = false;
        }, 1500);

        createParticle({ object: player, color: "white", fades: true });
      }
    });

    projectiles.forEach((projectile, index) => {
      if (projectile.position.y + projectile.radius <= 0) {
        setTimeout(() => {
          projectiles.splice(index, 1);
        }, 0);
      } else {
        projectile.update();
      }
    });

    grids.forEach((grid, gridIndex) => {
      grid.update();

      // spawn projectiles
      if (frame % 100 === 0 && grid.invaders.length > 0) {
        grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
          invaderProjectiles
        );
      }

      grid.invaders.forEach((invader, i) => {
        invader.update({ velocity: grid.velocity });

        // projectile hit enemy
        projectiles.forEach((projectile, j) => {
          if (
            projectile.position.y - projectile.radius <=
              invader.position.y + invader.height &&
            projectile.position.x + projectile.radius >= invader.position.x &&
            projectile.position.x - projectile.radius <=
              invader.position.x + invader.width &&
            projectile.position.y + projectile.radius >= invader.position.y
          ) {
            setTimeout(() => {
              const invaderFound = grid.invaders.find(
                (invader2) => invader2 === invader
              );
              const projectileFound = projectiles.find(
                (projectile2) => projectile2 === projectile
              );

              // remove invader and projectile
              if (invaderFound && projectileFound) {
                score += 100;
                scoreEl.innerHTML = `${score}`;
                createParticle({ object: invader, fades: true });

                grid.invaders.splice(i, 1);
                projectiles.splice(j, 1);

                if (grid.invaders.length > 0) {
                  const firstInvader = grid.invaders[0];
                  const lastInvader = grid.invaders[grid.invaders.length - 1];

                  grid.width =
                    lastInvader.position.x -
                    firstInvader.position.x +
                    lastInvader.width;
                  grid.position.x = firstInvader.position.x;
                } else {
                  grids.splice(gridIndex, 1);
                }
              }
            }, 0);
          }
        });
      });
    });

    if (keys.ArrowLeft.pressed && player.position.x >= 0) {
      player.velocity.x = -7;
      player.rotation = -0.15;
    } else if (
      keys.ArrowRight.pressed &&
      player.position.x + player.width <= canvas.width
    ) {
      player.velocity.x = 7;
      player.rotation = 0.15;
    } else {
      player.velocity.x = 0;
      player.rotation = 0;
    }

    // spawning enemies
    if (frame % randomInterval === 0) {
      grids.push(new Grid());
      frame = 0;
      randomInterval = Math.floor(Math.random() * 500 + 500);
    }

    frame++;
  }

  animate();

  addEventListener("keydown", ({ key }) => {
    if (game.over) return;
    switch (key) {
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        break;
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        break;
      case " ":
        projectiles.push(
          new Projectile({
            position: {
              x: player.position.x + player.width / 2,
              y: player.position.y,
            },
            velocity: {
              x: 0,
              y: -10,
            },
          })
        );
        break;
    }
  });
  addEventListener("keyup", ({ key }) => {
    switch (key) {
      case "ArrowLeft":
        keys.ArrowLeft.pressed = false;
        break;
      case "ArrowRight":
        keys.ArrowRight.pressed = false;
        break;
      case " ":
        break;
    }
  });
}
