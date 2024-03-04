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

		// Controles da rodada
		this.gameControls = {
			over: false,
			current_col_scored: false,
			score: 0,
		};
	}

	foguete;
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
	}

	create() {
		// Cria o background
		this.map = this.add.image(200, 325, 'bg').setScale(0.7).setOrigin(0.5, 0.5);

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
		this.nuvem.setVisible(true)

		// Permite que acessemos inputs do teclado
		this.cursors = this.input.keyboard.createCursorKeys();

		// Cria o placar do jogo
		this.placar = this.add.text(
			this.player.obj.x - 35,
			this.player.obj.y,
			'Pontuação: ' + this.gameControls.score,
			{ fontSize: '10px', fill: '#ffffff' }
		);
		this.placar.setVisible(false);

		this.physics.add.existing(this.nuvem);

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
			this.nuvem.setFlip(false, false); 
			this.nuvem.ida = true; 
		}
		
		if (this.nuvem.x < 700 && this.nuvem.ida === true) {
			this.nuvem.x += 10;
			this.nuvem.y = 5 * Math.sin(0.03 * this.nuvem.x) + 100;
		}

		if (this.nuvem.x >= 700) {
			this.nuvem.setFlip(true, false);
			this.nuvem.ida = false;
		}

		if (this.nuvem.x > 100 && this.nuvem.ida == false) {
			this.nuvem.x -= 10;
			this.nuvem.y = 5 * Math.sin(0.03 * this.nuvem.x) + 100; 
		}
		
		// Detecta se o jogador e o pássaro se tocaram. Usei pois não estava funcionando o "overlap"
		if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.obj.getBounds(), this.bird.getBounds())) {
			this.gameControls.over = true;
		}

		// Detecta se o jogador e o pássaro 2 se tocaram
		if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.obj.getBounds(), this.bird2.getBounds())) {
			this.gameControls.over = true;
		}

		// Detecta se a nuvem e o jogador se tocaram.
		if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.obj.getBounds(), this.nuvem.getBounds())) {
			this.nuvem.setVisible(false);
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

		if (this.player.obj.y <= 18){
			this.scene.start('cena_espaço')
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
