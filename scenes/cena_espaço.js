class cena_espaço extends Phaser.Scene {
	constructor() {
		super({
			key: 'cena_espaço',
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

		// Controles da rodada. Aproveitado do exemplo no github
		this.gameControls = {
			over: false,
			score: 0,
			restartBt: null,
		};
	}

	preload() {
		// Carrega elementos dentro do jogo
		this.load.image('bg1', 'assets/mapa espaço.png');
		this.load.image('fogo', 'assets/foguinho.png');
		this.load.image('foguete', 'assets/foguete.png');
		this.load.image('nave', 'assets/etezinho.png');
		this.load.image('nuvem', 'assets/nuvem.png');

		// Carrega mensagens personalizadas
		this.load.image('final', 'assets/final.png');
		this.load.image('gameOver', 'assets/Gameover.png');
		this.load.image('restart', 'assets/reiniciar.png');
		this.load.image('3pont', 'assets/3pont.png');
		this.load.image('3pont', 'assets/3pont.png');
		this.load.image('5pont', 'assets/5pont.png');
		this.load.image('6pont', 'assets/6pont.png');
	}

	create(data) {
        // recupera os dados da cena anterior
        this.gameControls.score = data;

		// Muda a gravidade do mapa
		this.physics.world.gravity.y = 5;

		// Cria o background
		this.map = this.add
			.image(200, 325, 'bg1')
			.setScale(0.7)
			.setOrigin(0.5, 0.5);

		// Cria as mensagens
		this.gameOver = this.add.image(200, 0, 'gameOver').setScale(0.3);
		this.gameOver.setVisible(false);
		this.gameControls.restartBt = this.add.image(200, 0, 'restart').setScale(0.3);
		this.gameControls.restartBt.setVisible(false);

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

		// Cria as naves
		this.nave = this.physics.add.sprite(44, 300, 'nave').setScale(0.5);
		this.nave.body.allowGravity = false;
		this.nave2 = this.physics.add.sprite(700, 500, 'nave').setScale(0.5);
		this.nave2.body.allowGravity = false;

		// Cria a nuvem
		this.nuvem = this.physics.add.sprite(44, 100, 'nuvem').setScale(0.1);
		this.nuvem.setVisible(true);

		// Permite que acessemos inputs do teclado
		this.cursors = this.input.keyboard.createCursorKeys();
        this.pointer = this.input.activePointer;

		this.physics.add.existing(this.nave);
		this.physics.add.existing(this.nave2);
		this.physics.add.existing(this.nuvem);

		// Colisões
		this.physics.add.overlap(
			this.player.obj,
			this.nave,
			function () {
				this.gameControls.over = true;
			},
			null,
			this
		);

		this.physics.add.overlap(
			this.player.obj,
			this.nave2,
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
			},
			null,
			this
		);

        // this.gameControls.restartBt.on('pointerdown', () => {
        //     console.log("Foi")
        //     this.scene.restart('cena_solo');
        // });
	}

	update() {
		// Controla a movimentação do pássaro "1"
		if (this.nave.x <= 100) {
			this.nave.setFlip(false, false);
			this.nave.ida = true;
		}

		if (this.nave.x < 700 && this.nave.ida === true) {
			this.nave.x += 10;
			this.nave.y = 10 * Math.sin(0.03 * this.nave.x) + 500;
		}

		if (this.nave.x >= 700) {
			this.nave.setFlip(true, false);
			this.nave.ida = false;
		}

		if (this.nave.x > 100 && this.nave.ida == false) {
			this.nave.x -= 10;
			this.nave.y = 10 * Math.sin(0.03 * this.nave.x) + 500;
		}

		// Controla a movimentação do pássaro2
		if (this.nave2.x <= 100) {
			this.nave2.setFlip(false, false);
			this.nave2.ida = true;
		}

		if (this.nave2.x < 700 && this.nave2.ida === true) {
			this.nave2.x += 20;
			this.nave2.y = 30 * Math.sin(0.03 * this.nave2.x) + 300;
		}

		if (this.nave2.x >= 700) {
			this.nave2.setFlip(true, false);
			this.nave2.ida = false;
		}

		if (this.nave2.x > 100 && this.nave2.ida == false) {
			this.nave2.x -= 20;
			this.nave2.y = 30 * Math.sin(0.03 * this.nave2.x) + 300;
		}

		// Controla a movimentação do nuvem
		if (this.nuvem.x <= 100) {
			this.nuvem.setFlip(false, false);
			this.nuvem.ida = true;
		}

		if (this.nuvem.x < 700 && this.nuvem.ida === true) {
			this.nuvem.x += 15;
			this.nuvem.y = 5 * Math.sin(0.03 * this.nuvem.x) + 100;
		}

		if (this.nuvem.x >= 700) {
			this.nuvem.setFlip(true, false);
			this.nuvem.ida = false;
		}

		if (this.nuvem.x > 100 && this.nuvem.ida == false) {
			this.nuvem.x -= 15;
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

		if (this.gameControls.over) {
            this.player.obj.destroy();
			this.fogo.obj.destroy();
			this.gameOver.setPosition(this.player.obj.x, this.player.obj.y);
			this.gameOver.setVisible(true);
			this.gameControls.restartBt.setPosition(this.player.obj.x, this.player.obj.y + 30);
			this.gameControls.restartBt.setVisible(true);
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
