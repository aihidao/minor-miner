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

        this.wallMap[0].setCollisionBetween(0, 2000, true, Demo.WallAry[0]);
        this.cementMap[0].setCollisionBetween(0, 2000, true, Demo.CementAry[0]);


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

        //Tools Box
        this.BoxPosition = new Phaser.Point(this.game.world.centerX,this.game.world.centerY);
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

        // 用bitmap对象创建精灵
        this.ToolBox = this.game.add.sprite(this.BoxPosition.x, this.BoxPosition.y, BtnBox);
        this.ToolBox.inputEnabled = true
        this.ToolBox.input.enableDrag();
        this.ToolBox.events.onDragStart.add(this.ToolBoxMoveStart,this);
        this.ToolBox.events.onDragUpdate.add(this.ToolBoxMove,this);
        this.ToolBox.events.onDragStop.add(this.ToolBoxMoveStop,this);

        var ButtonScale = 2
        this.BtnCave = this.game.add.button(this.BoxPosition.x + 20,this.BoxPosition.y + 40, Demo.CaveAry[0], this.DrawTypeCave, this, 8, 0, 15);
        this.BtnCave.anchor.setTo(0.5, 0.5);
        this.BtnCave.scale.setTo(ButtonScale,ButtonScale)
        this.BtnWall = this.game.add.button(this.BoxPosition.x + 60,this.BoxPosition.y + 40, Demo.WallAry[0], this.DrawTypeWall, this, 8, 0, 15);
        this.BtnWall.anchor.setTo(0.5, 0.5);
        this.BtnWall.scale.setTo(ButtonScale,ButtonScale)
        this.BtnCement = this.game.add.button(this.BoxPosition.x + 100, this.BoxPosition.y + 40, Demo.CementAry[0], this.DrawTypeCement, this, 8, 0, 15);
        this.BtnCement.anchor.setTo(0.5, 0.5);
        this.BtnCement.scale.setTo(ButtonScale,ButtonScale)

        //this.player_drill = this.game.add.sprite(this.player)
        //this.player.bringToTop();
        //the camera will follow the player in the world
        //this.game.camera.follow(this.player);
    },

    update: function(){
        // stage collisions this.player2
        //this.game.physics.arcade.collide(this.player, this.stageLayer);new Phaser.Point(this.game.world.centerX,this.game.world.centerY)
        this.game.debug.text( "("+Math.ceil(this.game.input.mousePointer.x/Demo.TILE_SIZE_W)+","+Math.ceil(this.game.input.mousePointer.y/Demo.TILE_SIZE_H)+")", 20, Demo.SCREEN_HEIGHT - 30);
        //mouse click
        if(this.game.input.activePointer.leftButton.isDown && !this.isToolBoxMove)
        {
            //var marker = new Phaser.Point(0,0);
            //marker.x = this.testLayer.getTileX(this.game.input.activePointer.worldX) * 16;
            //marker.y = this.testLayer.getTileY(this.game.input.activePointer.worldY) * 16;


            //this.map.putTile(2, this.testLayer.getTileX(marker.x), this.testLayer.getTileY(marker.y), this.testLayer);
            //this.map.setCollisionByExclusion([0]);
            //this.map.putTile(3,0,0,this.testLayer);
            //this.drawMap(this.game.input.mousePointer);
            this.drawMap(this.game.input.activePointer);
            this.player.bringToTop();
            this.player.drill.bringToTop();

            this.ToolBox.bringToTop();
            this.BtnCave.bringToTop();
            this.BtnWall.bringToTop();
            this.BtnCement.bringToTop();

        }
        // this.caveMap[0].setCollisionBetween(1, 2000, true, Demo.CaveAry[0]);
        // this.wallMap[0].setCollisionBetween(1, 2000, true, Demo.WallAry[0]);
        // this.cementMap[0].setCollisionBetween(1, 2000, true, Demo.CementAry[0]);

        //this.game.physics.arcade.collide(this.player, this.caveLayer);
        this.game.physics.arcade.collide(this.player, this.wallLayer);
        this.game.physics.arcade.collide(this.player, this.cementLayer);
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
                   var tileID = (Math.ceil(Math.random() * 100)) % Demo.CaveAry.length;
                   //tileSprite = this.game.add.sprite(j*Demo.TILE_SIZE_W, i*Demo.TILE_SIZE_H, Demo.CaveAry[tileID]);
                   //tileSprite.frame = tileVal;
                   tileSprite=this.caveMap[0].putTile(tileVal,j,i,this.caveLayer);

                   break;
           case Demo.WALL_VALUE: 
                   var tileVal = Demo.Helper.mathHelper.calcWallVal(i,j,this.sceneAry);
                   var tileID = (Math.ceil(Math.random() * 100)) % Demo.WallAry.length;
                   //tileSprite = this.game.add.sprite(j*Demo.TILE_SIZE_W, i*Demo.TILE_SIZE_H, Demo.WallAry[tileID]);
                   //tileSprite=this.map.putTile(tileVal,this.wallLayer.getTileX(j*Demo.TILE_SIZE_W),this.wallLayer.getTileY(i*Demo.TILE_SIZE_H),this.wallLayer);
                   //tileSprite.frame = tileVal;
                   tileSprite=this.wallMap[0].putTile(tileVal,j,i,this.wallLayer);

                   break;
           case Demo.CEMENT_VALUE: 
                   var tileVal = Demo.Helper.mathHelper.calcCementVal(i,j,this.sceneAry);
                   var tileID = (Math.ceil(Math.random() * 100)) % Demo.CementAry.length;
                   //tileSprite = this.game.add.sprite(j*Demo.TILE_SIZE_W, i*Demo.TILE_SIZE_H, Demo.CementAry[tileID])
                   //tileSprite.frame = tileVal;
                   tileSprite=this.cementMap[0].putTile(tileVal,j,i,this.cementLayer);

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
            default:    tileVal = Demo.Helper.mathHelper.calcCaveVal(tileX,tileY,this.sceneAry);
        }
        if(tileVal != -1){
            //this.tileAry[tileX][tileY].frame = tileVal;
            this.tileAry[tileX][tileY].index = tileVal;
        }
        return
    },

    updateToolPos:function(){
        this.BtnCave.x = this.BoxPosition.x  + 20;
        this.BtnWall.x = this.BoxPosition.x  + 60;
        this.BtnCement.x = this.BoxPosition.x +100;

        this.BtnCave.y = this.BoxPosition.y + 40;
        this.BtnWall.y = this.BoxPosition.y + 40;
        this.BtnCement.y = this.BoxPosition.y + 40;
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

    DrawTypeWall:function(){
        this.DrawType = Demo.WALL_VALUE ;
    },

    DrawTypeCave:function(){
        this.DrawType = Demo.CAVE_VALUE ;
    },

    DrawTypeCement:function(){
        this.DrawType = Demo.CEMENT_VALUE ;
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