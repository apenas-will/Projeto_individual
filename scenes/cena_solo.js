class cena_solo extends Phaser.Scene {
	constructor() {
		super({
			key: 'cena_solo',
		});
	}

	init() {
		// Jogador
		this.player = {
			obj: null,
		};

		// Efeito de fogo
		this.fogo = {
			obj: null,
		};

		// Controles da rodada. Aproveitado do exemplo do github
		this.gameControls = {
			over: false,
			score: 0,
			restartBt: null,
		};
	}

	preload() {
		// Carrega elementos dentro do jogo
		this.load.image('bg', 'assets/mapa solo.png');
		this.load.image('fogo', 'assets/foguinho.png');
		this.load.image('foguete', 'assets/foguete.png');
		this.load.spritesheet('passaro', 'assets/red-bird.png', {
			frameWidth: 75,
			frameHeight: 75,
		});
		this.load.image('nuvem', 'assets/nuvem.png');

		// Carrega mensagens personalizadas
		this.load.image('bemVindo', 'assets/Bemvindo.png');
		this.load.image('gameOver', 'assets/Gameover.png');
		this.load.image('restart', 'assets/reiniciar.png');
		this.load.image('1pont', 'assets/1pont.png');
		this.load.image('2pont', 'assets/2pont.png');
		this.load.image('3pont', 'assets/3pont.png');
		this.load.image('coment', 'assets/coment.png');
	}

	create() {
		// Cria o background
		this.map = this.add.image(200, 325, 'bg').setScale(0.7).setOrigin(0.5, 0.5);

		// Cria as mensagens
		this.gameOver = this.add.image(200, 0, 'gameOver').setScale(0.3);
		this.gameOver.setVisible(false);
		this.coment = this.add.image(200,0,'coment').setScale(0.3).setVisible(false)
		this.gameControls.restartBt = this.add
			.image(200, 0, 'restart')
			.setScale(0.3);
		this.gameControls.restartBt.setVisible(false);
		this.pont1 = this.add
			.image(200, 0, '1pont')
			.setScale(0.3)
			.setVisible(false);
		this.pont2 = this.add
			.image(200, 0, '2pont')
			.setScale(0.3)
			.setVisible(false);
		this.pont3 = this.add
			.image(200, 0, '3pont')
			.setScale(0.3)
			.setVisible(false);
		this.list = [this.pont1, this.pont2, this.pont3];

		// Adiciona o efeito do fogo no código e esconde ele
		this.fogo.obj = this.add.sprite(0, 0, 'fogo').setScale(0.3);
		this.fogo.obj.setVisible(false);

		// Cria o personagem e suas propriedades
		this.player.obj = this.physics.add
			.sprite(200, 600, 'foguete')
			.setScale(0.03);
		this.player.obj.setCollideWorldBounds(true);

		// Cria a câmera e suas propriedades
		this.cameras.main.startFollow(this.player.obj, true).setZoom(1.8);
		this.cameras.main.setBounds(
			0,
			0,
			this.map.width / 1.67,
			this.map.height / 1.6
		);

		// Cria os pássaros e sua animação
		this.bird = this.physics.add.sprite(44, 300, 'passaro').setScale(0.15);
		this.bird.body.allowGravity = false;
		this.bird2 = this.physics.add.sprite(700, 500, 'passaro').setScale(0.15);
		this.bird2.body.allowGravity = false;
		this.anims.create({
			key: 'fly',
			frames: this.anims.generateFrameNumbers('passaro', { start: 0, end: 7 }),
			frameRate: 10,
			repeat: -1,
		});
		this.bird.anims.play('fly', true);
		this.bird2.anims.play('fly', true);

		// Cria a nuvem
		this.nuvem = this.physics.add.sprite(44, 100, 'nuvem').setScale(0.1);
		this.nuvem.setVisible(true);

		// Permite que acessemos inputs do teclado
		this.cursors = this.input.keyboard.createCursorKeys(); // Inputs de movimentação
		this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R) // Input da tecla "R"

		// Cria o placar do jogo
		this.placar = this.add.text(
			this.player.obj.x - 35,
			this.player.obj.y,
			'Pontuação: ' + this.gameControls.score,
			{ fontSize: '10px', fill: '#ffffff' }
		);
		this.placar.setVisible(false);

		this.physics.add.existing(this.bird);
		this.physics.add.existing(this.bird2);
		this.physics.add.existing(this.nuvem);

		// Colisões
		this.physics.add.overlap(
			this.player.obj,
			this.bird,
			function () {
				this.gameControls.over = true;
			},
			null,
			this
		);

		this.physics.add.overlap(
			this.player.obj,
			this.bird2,
			function () {
				this.gameControls.over = true;
			},
			null,
			this
		);

		this.physics.add.overlap(
			this.player.obj,
			this.nuvem,
			function () {
				this.nuvem.setVisible(false);
				this.coment.setPosition(this.player.obj.x, this.player.obj.y + 15);
				this.coment.setVisible(true);
				setTimeout(() => {
					this.coment.destroy();
				}, 1000);
			},
			null,
			this
		);
	}

	update() {
		// Controla a movimentação do pássaro "1"
		if (this.bird.x <= 100) {
			this.bird.setFlip(false, false);
			this.bird.ida = true;
		}

		if (this.bird.x < 700 && this.bird.ida === true) {
			this.bird.x += 10;
			this.bird.y = 10 * Math.sin(0.03 * this.bird.x) + 500;
		}

		if (this.bird.x >= 700) {
			this.bird.setFlip(true, false);
			this.bird.ida = false;
		}

		if (this.bird.x > 100 && this.bird.ida == false) {
			this.bird.x -= 10;
			this.bird.y = 10 * Math.sin(0.03 * this.bird.x) + 500;
		}

		// Controla a movimentação do pássaro2
		if (this.bird2.x <= 100) {
			this.bird2.setFlip(false, false);
			this.bird2.ida = true;
		}

		if (this.bird2.x < 700 && this.bird2.ida === true) {
			this.bird2.x += 15;
			this.bird2.y = 30 * Math.sin(0.03 * this.bird2.x) + 300;
		}

		if (this.bird2.x >= 700) {
			this.bird2.setFlip(true, false);
			this.bird2.ida = false;
		}

		if (this.bird2.x > 100 && this.bird2.ida == false) {
			this.bird2.x -= 15;
			this.bird2.y = 30 * Math.sin(0.03 * this.bird2.x) + 300;
		}

		// Controla a movimentação do nuvem
		if (this.nuvem.x <= 100) {
			this.nuvem.ida = true;
		}

		if (this.nuvem.x < 700 && this.nuvem.ida === true) {
			this.nuvem.x += 10;
			this.nuvem.y = 5 * Math.sin(0.03 * this.nuvem.x) + 100;
		}

		if (this.nuvem.x >= 700) {
			this.nuvem.ida = false;
		}

		if (this.nuvem.x > 100 && this.nuvem.ida == false) {
			this.nuvem.x -= 10;
			this.nuvem.y = 5 * Math.sin(0.03 * this.nuvem.x) + 100;
		}

		// Cria a movimentação do foguete
		if (this.cursors.left.isDown) {
			this.player.obj.setX(this.player.obj.x - 2);
		} else if (this.cursors.right.isDown) {
			this.player.obj.setX(this.player.obj.x + 2);
		} else if (this.cursors.up.isDown || this.cursors.space.isDown) {
			this.player.obj.setY(this.player.obj.y - 3);
			this.ativarFoguinho(); // Adiciona o efeito do foguinho no foguete
		} else {
			this.semFoguinho(); // Remove o efeito de foguinho no foguete
		}

		// Determina posição do foguinho
		this.fogo.obj.setPosition(this.player.obj.x, this.player.obj.y + 17);

		// Determina pontuação e desencadeia uma reação
		if (this.player.obj.y < this.bird.y && this.gameControls.score == 0) {
			this.gameControls.score += 1;
			this.pont1.setPosition(this.player.obj.x, this.player.obj.y + 15);
			this.list[this.gameControls.score-1].setVisible(true);
			setTimeout(() => {
				this.pont1.destroy();
			}, 1000);
		}

		if (this.player.obj.y < this.bird2.y && this.gameControls.score == 1) {
			this.gameControls.score += 1;
			this.pont2.setPosition(this.player.obj.x, this.player.obj.y + 15);
			this.list[this.gameControls.score-1].setVisible(true);
			setTimeout(() => {
				this.pont2.destroy();
			}, 1000);
		}

		if (this.player.obj.y < this.nuvem.y && this.gameControls.score == 2 && this.nuvem.visible) {
			this.gameControls.score += 1;
			this.pont3.setPosition(this.player.obj.x, this.player.obj.y + 15);
			this.list[this.gameControls.score-1].setVisible(true);
			setTimeout(() => {
				this.pont3.destroy();
			}, 1000);
		}

		if (this.player.obj.y <= 18) {
			this.scene.start('cena_espaço', { score: this.gameControls.score });
		}

		if (this.gameControls.over) {
			this.player.obj.destroy();
			this.fogo.obj.destroy();
			this.gameOver.setPosition(this.player.obj.x, this.player.obj.y);
			this.gameOver.setVisible(true);
			this.gameControls.restartBt.setPosition(
				this.player.obj.x,
				this.player.obj.y + 30
			);
			this.gameControls.restartBt.setVisible(true);

			if (this.keyR.isDown) {
				this.scene.restart()
			}
		}
	}

	// Define a função que ativa o foguinho
	ativarFoguinho() {
		this.fogo.obj.setVisible(true);
	}

	// Define a função que some com o foguinho
	semFoguinho() {
		this.fogo.obj.setVisible(false);
	}
}
