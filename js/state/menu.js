var Demo = Demo || {};
Demo.menuState = function(){};

Demo.menuState.prototype = {
    create:function(){
        //////////////////////////////
        ////load tile
        //////////////////////////////
        // create background
        this.map = this.game.add.tilemap('menu');
        
        //////////////////////////////
        ////set button 
        //////////////////////////////
        this.START_BUTTON = Phaser.Keyboard.X;
        this.CONSTRUC_BUTTON = Phaser.Keyboard.C;

        //////////////////////////////
        ////craete text
        //////////////////////////////
        // create logo
        this.TITLE_POS = [this.game.world.centerX,this.game.world.centerY];
        this.titleText = this.game.add.bitmapText(this.TITLE_POS[0], this.TITLE_POS[1], 'carrier_command', 'MINOR MINER', 32);
        this.titleText.anchor.setTo(0.5, 0.5);

        // create menu text
        this.MENU_POS = [this.game.world.centerX,this.game.world.centerY + 150];
        this.startText = this.game.add.bitmapText(this.MENU_POS[0], this.MENU_POS[1], 'carrier_command', 'PRESS \''+String.fromCharCode(this.START_BUTTON)+'\' TO START', 12);
        this.startText.anchor.setTo(0.5, 0.5);

        // create construction text
        this.CONSTRUCT_POS = [this.game.world.centerX,this.game.world.centerY + 150 + 20];
        this.constructText = this.game.add.bitmapText(this.CONSTRUCT_POS[0], this.CONSTRUCT_POS[1], 'carrier_command', 'PRESS \''+String.fromCharCode(this.CONSTRUC_BUTTON)+'\' TO CONSTRUCT', 12);
        //this.constructText = this.game.add.bitmapText(this.game.world.centerX, this.game.height - 150 + 20, 'carrier_command', 'PRESS \'E\' TO CONSTRUCT', 12);
        this.constructText.anchor.setTo(0.5, 0.5);

        // cred
        this.game.add.bitmapText(this.game.world.centerX, this.game.height - 12, 'carrier_command', 'A game by alex morris', 8).anchor.setTo(0.5, 0.5);

        //////////////////////////////
        ////register button action
        //////////////////////////////
        var startKey = this.game.input.keyboard.addKey(this.START_BUTTON);
        var constuctKey = this.game.input.keyboard.addKey(this.CONSTRUC_BUTTON);
        startKey.onDown.add(this.startButtonAction,this);
        constuctKey.onDown.add(this.ConstructButtonAction,this);
    },

    update: function(){
        this.shakeText(this.titleText,this.TITLE_POS)
        this.shakeText(this.startText,this.MENU_POS)
        this.shakeText(this.constructText,this.CONSTRUCT_POS)
    },

    startButtonAction:function(){
        //alert(Demo.preloadState.CaveAry[0]);
    },

    ConstructButtonAction:function(){
        if (this.hasSelected) {
            return;
        }
        this.hasSelected = true;
        var startTween = this.game.add.tween(this.constructText).to({ alpha: 0 }, 100, "Linear", true, 0, -1, true);
        this.game.time.events.add(700, function() {
            this.game.camera.fade(0x000000, 250);
            this.game.camera.onFadeComplete.addOnce(function() {
                this.hasSelected = false;
                this.game.state.start('construct');
              }, this);
        },this);

    },

    shakeText: function(text,originPos) {
        if (text) {
          var randX = Math.random();
          var randY = Math.random();
          switch (this.game.time.time % 3) {
            case 0 :
                    randX = originPos[0] - text.x;
                    randY = originPos[1] - text.y;
                    break;
            case 1 :randX *= -1;
                    randY *= -1;
                    break;
          }
          text.x = text.x + randX;
          text.y = text.y + randY;
        }
      }
}