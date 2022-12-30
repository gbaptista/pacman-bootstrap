const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  parent: 'div-do-jogo',
  input: {
    gamepad: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: { preload, create, update },
};

const VELOCIDADE = 300;

const game = new Phaser.Game(config);

const dados = {
  pontos: 0,
};

function preload() {
  // this.load.image('pacman', 'imagens/pacman.gif');
}

function create() {
  this.teclas = this.input.keyboard.addKeys({
    praCima: 'W', praEsquerda: 'A', praBaixo: 'S', praDireita: 'D',
  });

  this.add.grid(
    config.width / 2,
    config.height / 2,
    config.width,
    config.height,
    32,
    32,
    0x333333,
  );

  this.coisas = {};
  this.coisas.textoMouse = this.add.text(40, 455, 'X: 0');
  this.coisas.textoPontos = this.add.text(620, 455, `Pontos: ${dados.pontos}`);

  this.coisas.pacman = this.add.circle(96, 32, 12, 0xd1af17);
  // this.coisas.pacman = this.add.image(96, 32, 'pacman');

  this.coisas.comida = this.add.circle(200, 100, 12, 0xf403fc).setOrigin(0, 0);

  this.coisas.parede = this.add.rectangle(32, 32, 32, 32 * 13, 0x6666ff).setOrigin(0, 0);

  this.physics.world.enable(this.coisas.pacman, Phaser.Physics.Arcade.DYNAMIC_BODY);
  this.physics.world.enable([this.coisas.parede, this.coisas.comida], Phaser.Physics.Arcade.STATIC_BODY);

  this.coisas.pacman.body.setCollideWorldBounds(true);
  // this.coisas.pacman.body.setBounce(1, 1);
  this.coisas.pacman.body.setVelocity(100, 200);

  this.coisas.pacman.body.onCollide = true;
  this.coisas.pacman.body.onOverlap = true;

  this.coisas.pacman.data = {
    nome: 'pacman',
    tipo: 'pacman',
  };

  this.coisas.comida.data = {
    nome: 'cereja',
    tipo: 'comida',
  };

  this.physics.world.on('collide', encostou);
  this.physics.world.on('overlap', encostou);
}

function encostou(coisa1, coisa2) {
  if (coisa1.data && coisa1.data.tipo === 'comida') {
    dados.pontos += 1;
    coisa1.active = false;
    coisa1.visible = false;
    coisa1.body.enable = false;
  }

  if (coisa2.data && coisa2.data.tipo === 'comida') {
    dados.pontos += 1;
    coisa2.active = false;
    coisa2.visible = false;
    coisa2.body.enable = false;
  }
}

function update() {
  this.coisas.pacman.body.setVelocity(0, 0);

  this.coisas.textoMouse.setText(
    `X: ${parseInt(game.input.mousePointer.x, 10)}    `
    + `Y: ${parseInt(game.input.mousePointer.y, 10)}    `
    + `GridX: ${parseInt(game.input.mousePointer.x / 32.0, 10) * 32}    `
    + `GridY: ${parseInt(game.input.mousePointer.y / 32.0, 10) * 32}    `,
  );

  this.coisas.textoPontos.setText(`Pontos: ${dados.pontos}`);

  // Teclado
  if (this.teclas.praEsquerda.isDown) {
    this.coisas.pacman.body.setVelocityX(-VELOCIDADE);
  } else if (this.teclas.praDireita.isDown) {
    this.coisas.pacman.body.setVelocityX(VELOCIDADE);
  }

  if (this.teclas.praCima.isDown) {
    this.coisas.pacman.body.setVelocityY(-VELOCIDADE);
  } else if (this.teclas.praBaixo.isDown) {
    this.coisas.pacman.body.setVelocityY(VELOCIDADE);
  }

  // Controle
  if (this.input.gamepad.total !== 0) {
    const pad = this.input.gamepad.getPad(0);

    if (pad.axes.length) {
      const x = pad.axes[0].getValue();
      const y = pad.axes[1].getValue();

      if (x !== 0.0) {
        this.coisas.pacman.body.setVelocityX(x * VELOCIDADE);
      }

      if (x !== 0.0) {
        this.coisas.pacman.body.setVelocityY(y * VELOCIDADE);
      }
    }
  }

  this.physics.world.collide(this.coisas.pacman, [this.coisas.parede]);
  this.physics.world.overlap(this.coisas.pacman, [this.coisas.comida]);
}
