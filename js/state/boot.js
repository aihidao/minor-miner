var Demo = Demo||{}

Demo.bootState = function(){};

Demo.bootState.prototype = {
    preload: function(){
        // load the loader bar
        this.load.image('load-bar', 'assets/img/load-bar.png');

        // load font
        this.load.bitmapFont('carrier_command', 'assets/font/carrier_command.png', 'assets/font/carrier_command.xml');
    },

    create: function(){
        this.game.stage.background = '#02171f';

        // scaling
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        // physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.state.start('preload');
    },

};