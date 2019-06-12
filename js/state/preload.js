var Demo = Demo || {};

Demo.preloadState = function(){};



Demo.preloadState.prototype = {
    
    preload:function(){
        Demo.CaveAry = ["Cave1" , "Cave2"];
        Demo.WallAry = ["Wall1" , "Wall2" , "Wall3" , "Wall4"];
        Demo.CementAry = ["Cement1" , "Cement2", "Cement3", "Cement4"];
        this.initTile(Demo.CaveAry);
        this.initTile(Demo.WallAry);
        this.initTile(Demo.CementAry);
        this.load.spritesheet('Wall4', 'assets/tiles/Wall1.bmp', 16, 16,16);

        this.load.spritesheet('dust', 'assets/img/dust.png', 8, 8);
        this.load.spritesheet('player', 'assets/img/player.png', 16, 16, 16);
        this.load.spritesheet('player-speedo', 'assets/img/player-speedo.png', 16, 16, 16);
        this.load.spritesheet('drill', 'assets/img/drill.png', 16, 8);
        this.load.spritesheet('other', 'assets/tiles/other.png', 16, 16,16);

        Demo.TILEINDEX_DRILL = 12
        Demo.TILEINDEX_FRAGILE = 13
        Demo.TILEINDEX_TRAPS = 14
        Demo.TILEINDEX_SPRING = 15

        this.load.spritesheet('battery', 'assets/img/battery.png', 36, 16);
        this.load.image('infinite-battery', 'assets/img/infinite-battery.png');
        this.load.image('particle', 'assets/img/particle.png');
        // load tilemaps
        
        this.load.tilemap('menu', 'assets/tilemaps/menu.json', null, Phaser.Tilemap.TILED_JSON);
        // load audio assets
        this.load.audio('intro', 'assets/audio/intro.mp3');
        this.load.audio('start_game', 'assets/audio/start_game.wav');
        this.load.audio('field1', 'assets/audio/field1.mp3');
        this.load.audio('field2', 'assets/audio/field2.mp3');
        this.load.audio('jump', 'assets/audio/jump.wav');
        this.load.audio('player_die', 'assets/audio/player_die.wav');
        this.load.audio('secret', 'assets/audio/secret.wav');
        this.load.audio('footstep', 'assets/audio/footstep.wav');
        this.load.audio('dust', 'assets/audio/dust.wav');
        this.load.audio('spring', 'assets/audio/spring.wav');
        this.load.audio('drill', 'assets/audio/drill.wav');
        this.load.audio('drill-burst', 'assets/audio/drill_burst.wav');
        this.load.audio('powerup', 'assets/audio/powerup.wav');
        this.load.audio('blip', 'assets/audio/blip.wav');
        this.load.audio('dead-drill', 'assets/audio/dead-drill.wav');
        this.load.audio('final-level', 'assets/audio/final-level.mp3');
        this.load.audio('victory', 'assets/audio/victory.mp3');
        this.load.audio('hard-mode', 'assets/audio/hard-mode.mp3');
        this.load.audio('rumble', 'assets/audio/rumble.wav');
    },

    create:function(){

        this.state.start('menu');
    },

    initTile:function(tileAry){
        for(var i=0;i<tileAry.length;i++)
        {
            this.load.spritesheet(tileAry[i], 'assets\\tiles\\'+tileAry[i]+'.png', 16, 16, 16);
        }
    }
}