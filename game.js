var game;

window.onload = function() {

    game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO);
    game.state.add("Play", play, true);
}
 

var play = function(){}
play.prototype = {

	preload:function(){
        game.load.spritesheet("player", "fly.png", 32,32);
        game.load.image("enemy", "hotdog.png");
	},

    create:function(){

        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = '#3763d4';

        // set the score to zero
        this.score = 0;

        this.topScore = localStorage.getItem("tophotdogs") == null ? 0 : localStorage.getItem("tophotdogs");

        this.scoreText = game.add.text(10, 10, "-", {
            font:"bold 16px Arial",
            fill: "#fff"
		});

        this.updateScore();

        this.player = game.add.sprite(game.width / 2, game.height / 5 * 4, "player");
        this.player.animations.add('fly');
        this.player.animations.play('fly', 20, true);
        this.player.anchor.setTo(0.5);

        this.enemy = game.add.sprite(game.width, 0, "enemy");
        this.enemy.scale.setTo(1.7,1.7);
        this.enemy.anchor.set(0.5);
        this.placePlayer();
		this.placeEnemy();
	},

	update:function(){

        // if the player touches the enemy
		if(Phaser.Math.distance(this.player.x, this.player.y, this.enemy.x, this.enemy.y) < this.player.width / 2 + this.enemy.width / 2){
            this.enemyTween.stop();
			this.playerTween.stop();
            this.score ++;
            
			if(Math.abs(this.player.x - this.enemy.x) < 10){

                this.score += 2;
			}
            this.placeEnemy();
            this.placePlayer();
            this.updateScore();
		}
	},

    updateScore: function(){
		this.scoreText.text = "Score: " + this.score + " - Best: " + this.topScore;
	},

    placePlayer: function(){

        this.player.x = game.width / 2;

        this.player.y = game.height / 5 * 4;

        this.playerTween = game.add.tween(this.player).to({
			y: game.height
		}, 10000 - this.score * 10, Phaser.Easing.Linear.None, true);

        this.playerTween.onComplete.add(this.die, this);

        game.input.onDown.add(this.fire, this);
	},

    // game over
	die: function(){

		localStorage.setItem("tophotdogs", Math.max(this.score, this.topScore));

        // start the game again
        game.state.start("Play");
	},

    
    placeEnemy: function(){

    
        this.enemy.x = game.width - this.enemy.width / 2;
		this.enemy.y = -this.enemy.width / 2;

        var enemyEnterTween = game.add.tween(this.enemy).to({
			y: game.rnd.between(this.enemy.width * 2, game.height / 4 * 3 - this.player.width / 2)
		}, 200, Phaser.Easing.Linear.None, true);

        enemyEnterTween.onComplete.add(this.moveEnemy, this);
	},

    moveEnemy: function(){

        this.enemyTween = game.add.tween(this.enemy).to({
			x: this.enemy.width / 2
		}, 500 + game.rnd.between(0, 2500), Phaser.Easing.Cubic.InOut, true, 0, -1, true);
	},

    fire: function(){

        game.input.onDown.remove(this.fire, this);

        this.playerTween.stop();

        this.playerTween = game.add.tween(this.player).to({
			y: -this.player.width
		}, 500, Phaser.Easing.Linear.None, true);

        this.playerTween.onComplete.add(this.die, this);
	}
}
