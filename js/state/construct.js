var Demo = Demo||{}

Demo.construcState = function(){};

Demo.construcState.prototype = {
    create: function(){
            // actor/fx rendering layers
        this.game.layers = {
            player: this.game.add.group(),
            foreground: this.game.add.group(),
            effects: this.game.add.group(), // bullets and dust
            ui: this.game.add.group(), 
        };

        // init sfx
        this.playerDieSound = this.add.audio('player_die');
        this.playerDieSound.volume -= .7;
        this.portalSound = this.add.audio('start_game');
        this.portalSound.volume -= .6;
        this.secretSound = this.add.audio('secret');
        this.secretSound.volume -= .85;
        this.breakBlockSound = this.add.audio('dust');
        this.breakBlockSound.volume -= .3;
        this.springSound = this.add.audio('spring');
        this.springSound.volume -= .5;
        this.drillBurstSound = this.game.add.audio('drill-burst');
        this.drillBurstSound.volume -= .65;
        this.drillBurstSoundClock = 0;
        this.powerupSound = this.game.add.audio('powerup');
        this.powerupSound.volume -= 0.5;
        this.blipSound = this.game.add.audio('blip');
        this.blipSound.volume -= 0.6;

        // make lava splash emitter (for player deaths)
        this.lavaSplash = this.game.add.emitter(0, 0, 200);
        this.lavaSplash.makeParticles('particle');
        this.lavaSplash.minRotation = 0;
        this.lavaSplash.maxRotation = 0;
        this.lavaSplash.minParticleScale = 0.3;
        this.lavaSplash.maxParticleScale = 1.5;
        this.lavaSplash.setYSpeed(-280, -150);
        this.lavaSplash.gravity = 500;
        this.game.layers.foreground.add(this.lavaSplash);
        //this.game.add(this.lavaSplash);
        //init map set;
        this.caveMap = new Array(Demo.CaveAry.length);
        this.wallMap = new Array(Demo.WallAry.length);
        this.cementMap = new Array(Demo.CementAry.length);

        this.initMap(this.caveMap,Demo.CaveAry);
        this.initMap(this.wallMap,Demo.WallAry);
        this.initMap(this.cementMap,Demo.CementAry);

        this.caveLayer = this.caveMap[0].create(Demo.CaveAry[0],Demo.SCREEN_WIDTH/Demo.TILE_SIZE_W , Demo.SCREEN_HEIGHT/Demo.TILE_SIZE_H, Demo.TILE_SIZE_W, Demo.TILE_SIZE_H);
        this.caveLayer.resizeWorld();

        this.wallLayer = this.wallMap[0].create(Demo.WallAry[0],Demo.SCREEN_WIDTH/Demo.TILE_SIZE_W , Demo.SCREEN_HEIGHT/Demo.TILE_SIZE_H, Demo.TILE_SIZE_W, Demo.TILE_SIZE_H);

        this.cementLayer = this.cementMap[0].create(Demo.CementAry[0],Demo.SCREEN_WIDTH/Demo.TILE_SIZE_W , Demo.SCREEN_HEIGHT/Demo.TILE_SIZE_H, Demo.TILE_SIZE_W, Demo.TILE_SIZE_H);

        this.drillMap= this.game.add.tilemap();
        this.drillMap.addTilesetImage("other","other",Demo.TILE_SIZE_W,Demo.TILE_SIZE_H,0,0,0);
        this.drillLayer = this.drillMap.create("other",Demo.SCREEN_WIDTH/Demo.TILE_SIZE_W , Demo.SCREEN_HEIGHT/Demo.TILE_SIZE_H, Demo.TILE_SIZE_W, Demo.TILE_SIZE_H);

        this.springMap= this.game.add.tilemap();
        this.springMap.addTilesetImage("other","other",Demo.TILE_SIZE_W,Demo.TILE_SIZE_H,0,0,0);
        this.springLayer = this.springMap.create("other",Demo.SCREEN_WIDTH/Demo.TILE_SIZE_W , Demo.SCREEN_HEIGHT/Demo.TILE_SIZE_H, Demo.TILE_SIZE_W, Demo.TILE_SIZE_H);

        this.fragileMap= this.game.add.tilemap();
        this.fragileMap.addTilesetImage("other","other",Demo.TILE_SIZE_W,Demo.TILE_SIZE_H,0,0,0);
        this.fragileLayer = this.fragileMap.create("other",Demo.SCREEN_WIDTH/Demo.TILE_SIZE_W , Demo.SCREEN_HEIGHT/Demo.TILE_SIZE_H, Demo.TILE_SIZE_W, Demo.TILE_SIZE_H);

        this.trapsMap= this.game.add.tilemap();
        this.trapsMap.addTilesetImage("other","other",Demo.TILE_SIZE_W,Demo.TILE_SIZE_H,0,0,0);
        this.trapsLayer = this.trapsMap.create("other",Demo.SCREEN_WIDTH/Demo.TILE_SIZE_W , Demo.SCREEN_HEIGHT/Demo.TILE_SIZE_H, Demo.TILE_SIZE_W, Demo.TILE_SIZE_H);

        this.wallMap[0].setCollisionBetween(0, 2000, true, Demo.WallAry[0]);
        this.cementMap[0].setCollisionBetween(0, 2000, true, Demo.CementAry[0]);
        this.drillMap.setCollisionBetween(0, 2000, true, "other");
        this.springMap.setCollisionBetween(0, 2000, true, "other");
        this.fragileMap.setCollisionBetween(0, 2000, true, "other");
        this.trapsMap.setCollisionBetween(0, 2000, true, "other");
        


        //create player
        this.input = new Demo.Input(this.game);
        this.player = new Demo.Player(this.game, this.input, 100, 200);

        //init Data
        this.DrawType = Demo.WALL_VALUE;

        Demo.TILE_COL_NUM = Math.ceil(Demo.SCREEN_WIDTH/Demo.TILE_SIZE_W);
        Demo.TILE_ROW_NUM = Math.ceil(Demo.SCREEN_HEIGHT/Demo.TILE_SIZE_H);
        this.sceneAry = new Array(Demo.TILE_COL_NUM);
        this.tileAry = new Array(Demo.TILE_COL_NUM);

        for(var i=0;i<Demo.TILE_ROW_NUM;i++)
        {
            if(i<Demo.TILE_ROW_NUM - 4){
                this.sceneAry[i] = new Array(Demo.TILE_COL_NUM).fill(0);
            }
            else
            {
                this.sceneAry[i] = new Array(Demo.TILE_COL_NUM).fill(1);
            }
            //this.sceneAry[i] = new Array(Demo.TILE_COL_NUM).fill(0);
            this.tileAry[i] = new Array(Demo.TILE_COL_NUM);
        }

        for(var i=0;i<Demo.TILE_ROW_NUM;i++){
            for(var j=0;j<Demo.TILE_COL_NUM;j++){
                //var tileSprite;
                this.createTile(i,j);
            }
        } 

        // 创建一个bitmap对象
        var boxWidth = 128
        var boxHeight = 512


        BtnBox= this.game.add.bitmapData(boxWidth,boxHeight);
        // 使用Canvas的api进行绘制
        BtnBox.ctx.beginPath();

        BtnBox.ctx.fillStyle = '#A0A0A0';
        BtnBox.ctx.fillRect(0,0,boxWidth,boxHeight);
        BtnBox.ctx.fill();

        BtnBox.ctx.fillStyle = '#2020ff';
        BtnBox.ctx.fillRect(0,0,boxWidth,20);
        BtnBox.ctx.fill();

        //BtnBox.ctx.rect(0, 0, 128, 128);
        //BtnBox.ctx.fillStyle = '#0000ff';
        //Tools Box
        this.BoxPosition = new Phaser.Point(this.game.world.centerX * 2 - boxWidth,this.game.world.centerY - boxHeight/2);
        // 用bitmap对象创建精灵
        this.ToolBox = this.game.add.sprite(this.BoxPosition.x, this.BoxPosition.y, BtnBox);
        this.ToolBox.inputEnabled = true
        this.ToolBox.input.enableDrag();
        this.ToolBox.events.onDragStart.add(this.ToolBoxMoveStart,this);
        this.ToolBox.events.onDragUpdate.add(this.ToolBoxMove,this);
        this.ToolBox.events.onDragStop.add(this.ToolBoxMoveStop,this);

        var ButtonScale = 2
        this.btnAry = [this.BtnCave,this.BtnWall,this.BtnCave,this.BtuDrill,this.BtuSpring,this.BtuFragile,this.BtuTraps];
        var btnSprite = [Demo.CaveAry[0], Demo.WallAry[0], Demo.CementAry[0], "other","other","other","other"];
        var btnfunction = [this.DrawTypeCave, this.DrawTypeWall,this.DrawTypeCement,this.DrawTypeDrill,this.DrawTypeSpring,this.DrawTypeFragile,this.DrawTypeTraps];

        for(var i=0;i<this.btnAry.length;i++)
        {
            var normIndex=0;
            var overIndex=15;
            switch(i)
            {
                case Demo.CAVE_VALUE:;
                case Demo.WALL_VALUE:;
                case Demo.CEMENT_VALUE:
                        normIndex=0;
                        overIndex=15;    
                        break;
                case Demo.DRILL_VALUE:
                        normIndex=12;
                        overIndex=12;
                        break;
                case Demo.SPRING_VALUE:
                        normIndex=15;
                        overIndex=15;
                        break;
                case Demo.FRAGILE_VALUE:
                        normIndex=13;
                        overIndex=13;
                        break;
                case Demo.TRAPS_VALUE:
                        normIndex=14;
                        overIndex=14;
                        break;
            }
            this.btnAry[i] = this.game.add.button(this.BoxPosition.x + 20 + (i%3) * 40,this.BoxPosition.y + 40 * (((i-i%3)/3)+1), btnSprite[i], btnfunction[i], this, normIndex, normIndex, overIndex);
            this.btnAry[i].anchor.setTo(0.5, 0.5);
            this.btnAry[i].scale.setTo(ButtonScale,ButtonScale)
        }
    },

    update: function(){
        // stage collisions this.player2
        this.game.debug.text( "("+Math.ceil(this.game.input.mousePointer.x/Demo.TILE_SIZE_W)+","+Math.ceil(this.game.input.mousePointer.y/Demo.TILE_SIZE_H)+")", 20, Demo.SCREEN_HEIGHT - 30);
        //mouse click
        if(this.game.input.activePointer.leftButton.isDown && !this.isToolBoxMove)
        {
            this.drawMap(this.game.input.activePointer);

            this.player.bringToTop();
            this.player.drill.bringToTop();

            this.ToolBox.bringToTop();
            for(var i = 0;i <this.btnAry.length ; i++)
            {
                this.btnAry[i].bringToTop();
            }


        }
        this.game.physics.arcade.collide(this.player, this.wallLayer);
        this.game.physics.arcade.collide(this.player, this.cementLayer);

        // traps collisions
        this.game.physics.arcade.collide(this.player, this.trapsLayer, this.playerTrapHandler, null, this);
        // collision with fragile blocks
        this.game.physics.arcade.collide(this.player,this.fragileLayer, this.playerFragileHandler, null, this);
        // collision with spring blocks
        this.game.physics.arcade.collide(this.player,this.springLayer, this.playerSpringHandler, null, this);
        // collision with drill blocks
        this.game.physics.arcade.collide(this.player, this.drillLayer, this.drillBlockHandler, null, this);
    },

    drawMap:function(mousePointer){
        //alert('hahah');
        var tileY = Math.ceil(mousePointer.x/Demo.TILE_SIZE_W) - 1;
        var tileX = Math.ceil(mousePointer.y/Demo.TILE_SIZE_H) - 1;

        if(tileX<0 ||tileX > Demo.TILE_ROW_NUM - 1||tileY < 0 || tileY > Demo.TILE_COL_NUM - 1 )
        {
            return ;
        }
        
        //this.sceneAry[tileX][tileY] = this.DrawType;
        if(this.sceneAry[tileX][tileY]!=this.DrawType)
        {
            var orginType = this.sceneAry[tileX][tileY];
            this.sceneAry[tileX][tileY] = this.DrawType;
            var deSprite = this.tileAry[tileX][tileY];
            if(deSprite)
            {
                switch(orginType){
                    case Demo.CAVE_VALUE:this.caveMap[0].removeTile(tileY,tileX,this.caveLayer);break;
                    case Demo.WALL_VALUE:this.wallMap[0].removeTile(tileY,tileX,this.wallLayer);break;
                    case Demo.CEMENT_VALUE:this.cementMap[0].removeTile(tileY,tileX,this.cementLayer);break;

                    case Demo.DRILL_VALUE:
                                            this.caveMap[0].removeTile(tileY,tileX,this.caveLayer);
                                            this.drillMap.removeTile(tileY,tileX,this.drillLayer);
                                            break;
                    case Demo.SPRING_VALUE:
                                            this.caveMap[0].removeTile(tileY,tileX,this.caveLayer);
                                            this.springMap.removeTile(tileY,tileX,this.springLayer);
                                            break;
                    case Demo.FRAGILE_VALUE:
                                            this.caveMap[0].removeTile(tileY,tileX,this.caveLayer);
                                            this.fragileMap.removeTile(tileY,tileX,this.fragileLayer);
                                            break;
                    case Demo.TRAPS_VALUE:
                                            this.caveMap[0].removeTile(tileY,tileX,this.caveLayer);
                                            this.trapsMap.removeTile(tileY,tileX,this.trapsLayer);
                                            break;
                }
            }
            this.createTile(tileX,tileY);
        }
        

        this.updateTile(tileX,tileY);
        this.updateTile(tileX - 1,tileY - 1);
        this.updateTile(tileX - 1,tileY);
        this.updateTile(tileX - 1,tileY + 1);
        this.updateTile(tileX,tileY - 1);
        this.updateTile(tileX,tileY);
        this.updateTile(tileX,tileY + 1);
        this.updateTile(tileX + 1,tileY - 1);
        this.updateTile(tileX + 1,tileY);
        this.updateTile(tileX + 1,tileY + 1);
    },

    createTile:function(i,j){
        var tileSprite;

        switch(this.sceneAry[i][j])
        {
           case Demo.CAVE_VALUE: 
                   var tileVal = Demo.Helper.mathHelper.calcCaveVal(i,j,this.sceneAry);
                   //var tileID = (Math.ceil(Math.random() * 100)) % Demo.CaveAry.length;
                   //tileSprite = this.game.add.sprite(j*Demo.TILE_SIZE_W, i*Demo.TILE_SIZE_H, Demo.CaveAry[tileID]);
                   //tileSprite.frame = tileVal;
                   tileSprite=this.caveMap[0].putTile(tileVal,j,i,this.caveLayer);

                   break;
           case Demo.WALL_VALUE: 
                   var tileVal = Demo.Helper.mathHelper.calcWallVal(i,j,this.sceneAry);
                   //var tileID = (Math.ceil(Math.random() * 100)) % Demo.WallAry.length;
                   //tileSprite = this.game.add.sprite(j*Demo.TILE_SIZE_W, i*Demo.TILE_SIZE_H, Demo.WallAry[tileID]);
                   //tileSprite=this.map.putTile(tileVal,this.wallLayer.getTileX(j*Demo.TILE_SIZE_W),this.wallLayer.getTileY(i*Demo.TILE_SIZE_H),this.wallLayer);
                   //tileSprite.frame = tileVal;
                   tileSprite=this.wallMap[0].putTile(tileVal,j,i,this.wallLayer);

                   break;
           case Demo.CEMENT_VALUE: 
                   var tileVal = Demo.Helper.mathHelper.calcCementVal(i,j,this.sceneAry);
                   //var tileID = (Math.ceil(Math.random() * 100)) % Demo.CementAry.length;
                   //tileSprite = this.game.add.sprite(j*Demo.TILE_SIZE_W, i*Demo.TILE_SIZE_H, Demo.CementAry[tileID])
                   //tileSprite.frame = tileVal;
                   tileSprite=this.cementMap[0].putTile(tileVal,j,i,this.cementLayer);

                   break;

            case Demo.DRILL_VALUE: 
                    var tileVal = Demo.Helper.mathHelper.calcCaveVal(i,j,this.sceneAry);
                    //var tileID = (Math.ceil(Math.random() * 100)) % Demo.CaveAry.length;
                    this.caveMap[0].putTile(tileVal,j,i,this.caveLayer);
                    tileSprite=this.drillMap.putTile(Demo.TILEINDEX_DRILL,j,i,this.drillLayer);
                    break;

            case Demo.SPRING_VALUE: 
                    var tileVal = Demo.Helper.mathHelper.calcCaveVal(i,j,this.sceneAry);
                    //var tileID = (Math.ceil(Math.random() * 100)) % Demo.CaveAry.length;
                    this.caveMap[0].putTile(tileVal,j,i,this.caveLayer);
                    tileSprite=this.springMap.putTile(Demo.TILEINDEX_SPRING,j,i,this.springLayer);
                    break;

            case Demo.FRAGILE_VALUE: 
                    var tileVal = Demo.Helper.mathHelper.calcCaveVal(i,j,this.sceneAry);
                    //var tileID = (Math.ceil(Math.random() * 100)) % Demo.CaveAry.length;
                    this.caveMap[0].putTile(tileVal,j,i,this.caveLayer);
                    tileSprite=this.fragileMap.putTile(Demo.TILEINDEX_FRAGILE,j,i,this.fragileLayer);
                    break;  

            case Demo.TRAPS_VALUE: 
                    var tileVal = Demo.Helper.mathHelper.calcCaveVal(i,j,this.sceneAry);
                    //var tileID = (Math.ceil(Math.random() * 100)) % Demo.CaveAry.length;
                    this.caveMap[0].putTile(tileVal,j,i,this.caveLayer);
                    tileSprite=this.trapsMap.putTile(Demo.TILEINDEX_TRAPS,j,i,this.trapsLayer);
                    break;  

           default: 
                   //var tileVal = Demo.Helper.mathHelper.calcCaveVal(i,j,this.sceneAry);
                   //var tileID = (Math.ceil(Math.random() * 100)) % Demo.CaveAry.length;
                   //tileSprite = this.game.add.sprite(j*Demo.TILE_SIZE_W, i*Demo.TILE_SIZE_H, Demo.CaveAry[tileID]);
                   //tileSprite.frame = tileVal;
                   //tileSprite=this.map.putTile(tileVal,this.caveLayer.getTileX(j*Demo.TILE_SIZE_W),this.caveLayer.getTileX(i*Demo.TILE_SIZE_H),this.caveLayer);
        }

        this.tileAry[i][j] = tileSprite;
    },

    updateTile:function(tileX,tileY){

        var tileVal = -1;
        if(tileX<0 ||tileX > Demo.TILE_ROW_NUM - 1||tileY < 0 || tileY > Demo.TILE_COL_NUM - 1 )
        {
            return -1;
        }

        if(!this.tileAry[tileX][tileY])
        {
            return;
        }

        switch(this.sceneAry[tileX][tileY]){
            case Demo.CAVE_VALUE:     tileVal = Demo.Helper.mathHelper.calcCaveVal(tileX,tileY,this.sceneAry);break;
            case Demo.WALL_VALUE:     tileVal = Demo.Helper.mathHelper.calcWallVal(tileX,tileY,this.sceneAry);break;
            case Demo.CEMENT_VALUE:     tileVal = Demo.Helper.mathHelper.calcCementVal(tileX,tileY,this.sceneAry);break;
            //default:    tileVal = Demo.Helper.mathHelper.calcCaveVal(tileX,tileY,this.sceneAry);
        }
        if(tileVal != -1){
            //this.tileAry[tileX][tileY].frame = tileVal;
            this.tileAry[tileX][tileY].index = tileVal;
        }
        return
    },

    updateToolPos:function(){
        // this.BtnCave.x = this.BoxPosition.x  + 20;
        // this.BtnWall.x = this.BoxPosition.x  + 60;
        // this.BtnCement.x = this.BoxPosition.x +100;
        // this.BtnCave.y = this.BoxPosition.y + 40;
        //this.BtnWall.y = this.BoxPosition.y + 40;
        //this.BtnCement.y = this.BoxPosition.y + 40;

        for(var i=0;i<this.btnAry.length;i++)
        {
            this.btnAry[i].x = this.BoxPosition.x + 20 + (i%3) * 40;
            this.btnAry[i].y = this.BoxPosition.y + 40 * (((i-i%3)/3)+1);
        }
    },

    ToolBoxMove:function(){
        //alert('ha');
        //this.player.body.y = 200;
        this.BoxPosition.x = this.ToolBox.x;
        this.BoxPosition.y = this.ToolBox.y;
        this.updateToolPos();
    },

    ToolBoxMoveStart:function(){
        //alert('ha');
        this.isToolBoxMove = true;
    },

    ToolBoxMoveStop:function(){
        //alert('ha');
        this.isToolBoxMove = false;

    },
    //var btnfunction = ( this.DrawTypeCave, this.DrawTypeWall,this.DrawTypeCement,this.DrawTypeDrill,this.DrawTypeSpring,this.DrawTypeFragile);
    //
    DrawTypeWall:function(){
        this.DrawType = Demo.WALL_VALUE ;
    },

    DrawTypeCave:function(){
        this.DrawType = Demo.CAVE_VALUE ;
    },

    DrawTypeCement:function(){
        this.DrawType = Demo.CEMENT_VALUE ;
    },

    DrawTypeDrill:function(){
        this.DrawType = Demo.DRILL_VALUE ;
    },

    DrawTypeSpring:function(){
        //this.DrawType = Demo.SPRING_VALUE ;
        this.DrawType = Demo.SPRING_VALUE ;
    },

    DrawTypeFragile:function(){
        //this.DrawType = Demo.FRAGILE_VALUE ;
        this.DrawType = Demo.FRAGILE_VALUE ;
    },

    DrawTypeTraps:function(){
        this.DrawType = Demo.TRAPS_VALUE ;
    },

    initMap:function(mapAry,tileAry){
        //var mapAry = new Array(tileAry.length);
        for(var i=0;i<tileAry.length;i++)
        {
            //this.load.spritesheet(tileAry[i], 'assets\\tiles\\'+tileAry[i]+'.png', 16, 16, 16);
            //this.map.addTilesetImage(tileAry[i]);
            //map.addTilesetImage(tileAry[i],tileAry[i],Demo.TILE_SIZE_W,Demo.TILE_SIZE_H,0,0,i);
            mapAry[i] = this.game.add.tilemap();
            mapAry[i].addTilesetImage(tileAry[i],tileAry[i],Demo.TILE_SIZE_W,Demo.TILE_SIZE_H,0,0,i);
        }
        //return mapAry;
    },

    //initTileImg:function(mapAry,tileAry){
    //    for(var i=0;i<tileAry.length;i++)
    //    {
    //        //this.load.spritesheet(tileAry[i], 'assets\\tiles\\'+tileAry[i]+'.png', 16, 16, 16);
    //        //this.map.addTilesetImage(tileAry[i]);
    //        mapAry[i].addTilesetImage(tileAry[i],tileAry[i],Demo.TILE_SIZE_W,Demo.TILE_SIZE_H,0,0,i);
    //    }
    //},

    
}

Demo.construcState.prototype.playerTrapHandler = function(player, trap) {
    // kill drill
    //player.drill.pendingDestroy = true;
    //camera stops following player
    //this.game.camera.unfollow();
    // player dies
    //player.pendingDestroy = true;
  
    // increment death count
    //if (Demo.hardMode) {
    //  Demo.hardModeDeaths++;
    //} else {
    //  Demo.deaths++;
    //}
  
    // shake camera
    // this.startCameraShake();
  
    // show some text, if not already showing any
    //if (!this.drawTutText) {
    //  var text = '';
    //  var rand = Math.random();
    //  if (rand < 0.1) {
    //    text = 'HAHAHAHA';
    //  } else if (rand < 0.2) {
    //    text = 'OUCHIE :[';
    //  } else if (rand < 0.3) {
    //    text = 'Try again T.T';
    //  } else if (rand < 0.4){
    //    text = 'You win! JK you died.';
    //  } else if (rand < 0.5) {
    //    text = '*burp*';
    //  } else if (rand < 0.6) {
    //    text = 'come on now :[';
    //  } else if (rand < 0.7) {
    //    text = 'What is... feeling?';
    //  } else if (rand < 0.8) {
    //    text = 'Juicy';
    //  } else if (rand < 0.9) {
    //    text = 'nice try, you got this <3';
    //  } else {
    //    text = 'You\'re breaking my <3';
    //  }
    //  this.deathText = this.game.add.bitmapText(this.game.camera.x + (this.game.camera.width / 2), this.game.camera.y + (this.game.camera.height / 2), 'carrier_command', text, 12);
    //  this.deathText.anchor.setTo(0.5, 0.5);
    //}
  
    //play death sound
    this.playerDieSound.play();
  
  
    // start lava splash
    this.lavaSplash.x = player.x;
    this.lavaSplash.y = player.bottom + 8;
    this.lavaSplash.start(false, 5000, 20);
  
      // shake the camera
    this.game.camera.shake(0.004, 1200);
    // shake the camera
    //this.game.camera.shake(0.004, 1200);
    //this.game.camera.onShakeComplete.addOnce(function() {
    //  // restart level after camera shake
    //  this.game.camera.fade(0x000000, 250);
    //  this.game.camera.onFadeComplete.addOnce(function() {
    //    this.game.state.start(this.game.state.current);
    //  }, this);
    //}, this);
};

Demo.construcState.prototype.playerFragileHandler = function(player, block) {
    // block disappears after .25 seconds
    this.game.time.events.add(250, function() {
        // play block breaking sound
        if (!this.breakBlockSound.isPlaying) {
            this.breakBlockSound.play();
        }

        var index = block.index;
        this.fragileMap.removeTile(block.x, block.y, this.fragileLayer);

        this.game.time.events.add(1500, function() {
            //this.fragileMap.putTile(block.x, block.y, this.fragileLayer);
            this.fragileMap.putTile(Demo.TILEINDEX_FRAGILE,block.x,block.y,this.fragileLayer);
            if (!this.breakBlockSound.isPlaying) {
                this.breakBlockSound.play();
            }
        },this);
    },this);
};

Demo.construcState.prototype.drillBlockHandler = function(player, block) {
    if(!player.drilling) {
      return;
    }
    // recharge player's drill
    player.drillCharge = player.maxDrillCharge;
  
    // play breaking block sound
    if (!this.breakBlockSound.isPlaying) {
      this.breakBlockSound.play();
    }
    // make block dust
    //var dust = this.blockDust.getFirstDead();
    //dust.reset(block.worldX, block.worldY);
    //dust.animations.play('burst', 20, false, true);
    // make drill particle effect
    //this.drillBurst(block.worldX + block.width / 2, block.worldY + block.height / 2);
    // remove block
    this.drillMap.removeTile(block.x, block.y, this.drillLayer);
};

Demo.construcState.prototype.playerSpringHandler = function(player, block) {
    // player has to hit from the top of the block
    if (player.bottom > block.top) {
      return;
    }
  
    // player bounces high
    player.body.velocity.y = -400;
    player.spring = true; // disable player jump...
    // play spring noise
    if (!this.springSound.isPlaying) {
      this.springSound.play();
    }
  };

