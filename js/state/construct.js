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



        //init
        this.DrawType = Demo.WALL_VALUE;

        Demo.TILE_COL_NUM = Math.ceil(Demo.SCREEN_WIDTH/Demo.TILE_SIZE_W);
        Demo.TILE_ROW_NUM = Math.ceil(Demo.SCREEN_HEIGHT/Demo.TILE_SIZE_H);
        this.sceneAry = new Array(Demo.TILE_COL_NUM);
        this.tileAry = new Array(Demo.TILE_COL_NUM);
        for(var i=0;i<Demo.TILE_ROW_NUM;i++)
        {
            this.sceneAry[i] = new Array(Demo.TILE_COL_NUM).fill(0);
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
        BtnBox= this.game.add.bitmapData(128,128);
        // 使用Canvas的api进行绘制
        BtnBox.ctx.beginPath();

        BtnBox.ctx.fillStyle = '#A0A0A0';
        BtnBox.ctx.fillRect(0,0,220,128);
        BtnBox.ctx.fill();

        BtnBox.ctx.fillStyle = '#2020ff';
        BtnBox.ctx.fillRect(0,0,220,20);
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

        //create player
        this.input = new Demo.Input(this.game);
        //var objects = this.findObjectsByType('playerStart', this.map, 'objectsLayer');
        this.player = new Demo.Player(this.game, this.input, 100, 200);
        //this.player_drill = this.game.add.sprite(this.player)
        //this.player.bringToTop();
        //the camera will follow the player in the world
        //this.game.camera.follow(this.player);
    },

    update: function(){

        this.game.debug.text( "("+Math.ceil(this.game.input.mousePointer.x/Demo.TILE_SIZE_W)+","+Math.ceil(this.game.input.mousePointer.y/Demo.TILE_SIZE_H)+")", 20, Demo.SCREEN_HEIGHT - 30);
        //mouse click
        if(this.game.input.activePointer.leftButton.isDown && !this.isToolBoxMove)
        {
            this.drawMap(this.game.input.mousePointer);
            this.ToolBox.bringToTop();
            this.BtnCave.bringToTop();
            this.BtnWall.bringToTop();
            this.BtnCement.bringToTop();
            this.player.bringToTop();
            this.player.drill.bringToTop();
        }
    },

    drawMap:function(mousePointer){
        //alert('hahah');
        var tileY = Math.ceil(mousePointer.x/Demo.TILE_SIZE_W) - 1;
        var tileX = Math.ceil(mousePointer.y/Demo.TILE_SIZE_H) - 1;
        this.sceneAry[tileX][tileY] = this.DrawType;
        if(this.sceneAry!=this.DrawType)
        {
            if(this.tileAry[tileX][tileY]){
                var deSprite = this.tileAry[tileX][tileY];
                this.createTile(tileX,tileY);
                if (deSprite)
                {
                    deSprite.destroy();
                }
            }else{
                this.createTile(tileX,tileY);
            };


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
                    tileSprite = this.game.add.sprite(j*Demo.TILE_SIZE_W, i*Demo.TILE_SIZE_H, Demo.CaveAry[tileID]);
                    tileSprite.en
                    tileSprite.frame = tileVal;
                    break;
            case Demo.WALL_VALUE: 
                    var tileVal = Demo.Helper.mathHelper.calcWallVal(i,j,this.sceneAry);
                    var tileID = (Math.ceil(Math.random() * 100)) % Demo.WallAry.length;
                    tileSprite = this.game.add.sprite(j*Demo.TILE_SIZE_W, i*Demo.TILE_SIZE_H, Demo.WallAry[tileID]);
                    tileSprite.frame = tileVal;
                    break;
            case Demo.CEMENT_VALUE: 
                    var tileVal = Demo.Helper.mathHelper.calcCementVal(i,j,this.sceneAry);
                    var tileID = (Math.ceil(Math.random() * 100)) % Demo.CementAry.length;
                    tileSprite = this.game.add.sprite(j*Demo.TILE_SIZE_W, i*Demo.TILE_SIZE_H, Demo.CementAry[tileID])
                    tileSprite.frame = tileVal;
                    break;
            default: 
                    var tileVal = Demo.Helper.mathHelper.calcCaveVal(i,j,this.sceneAry);
                    var tileID = (Math.ceil(Math.random() * 100)) % Demo.CaveAry.length;
                    tileSprite = this.game.add.sprite(j*Demo.TILE_SIZE_W, i*Demo.TILE_SIZE_H, Demo.CaveAry[tileID]);
                    tileSprite.frame = tileVal;
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
            this.tileAry[tileX][tileY].frame = tileVal;
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

    
}