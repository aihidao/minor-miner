var Demo = Demo||{}

Demo.Helper = function(){};

Demo.Helper.mathHelper = {
    initMathHelper:function(){

    },

    calcCaveVal:function(posX,posY,aryVal){
        if(posX<0 ||posX > Demo.TILE_ROW_NUM - 1||posY < 0 || posY > Demo.TILE_COL_NUM - 1 )
        {
            //alert("no val")
            return -1;
        }
        var value = 0;
        if(posX-1>=0 && aryVal[posX-1][posY]==1)
        {
            var tmp = (Math.ceil(Math.random() * 1000)) % 12;
            value = tmp;
        }else if(posX+1 < Demo.TILE_ROW_NUM && aryVal[posX+1][posY]==1)
        {
            var tmp = ((Math.ceil(Math.random() * 1000)) % 12)+4;
            value = tmp;
        }else
        {
            var tmp = ((Math.ceil(Math.random() * 1000)) % 8)+4;
            value = tmp;
        }
        return value;
    },

    calcCementVal:function(posX,posY,aryVal){
        if(posX<0 ||posX > Demo.TILE_ROW_NUM - 1||posY < 0 || posY > Demo.TILE_COL_NUM - 1 )
        {
            return -1;
        }
        var value = 0;
        if(posX > 0 && aryVal[posX-1][posY]==2 || posX == 0)
        {
            value+=1;
        }
        if(posY < Demo.TILE_COL_NUM - 1 && aryVal[posX][posY+1]==2 || posY == Demo.TILE_COL_NUM - 1)
        {
            value+=2;
        }
        if(posX < Demo.TILE_ROW_NUM - 1 && aryVal[posX+1][posY]==2 || posX == Demo.TILE_ROW_NUM - 1)
        {
            value+=4;
        }
        if(posY > 0 && aryVal[posX][posY-1]==2 || posY == 0) 
        {
            value+=8;
        }
        return value;
    },

    calcWallVal:function(posX,posY,aryVal){
        if(posX<0 ||posX > Demo.TILE_ROW_NUM - 1||posY < 0 || posY > Demo.TILE_COL_NUM - 1 )
        {
            return -1;
        }
        var value = 0;
        if(posX > 0 && aryVal[posX-1][posY]==1 ||posX == 0)
        {
            value+=1;
        }
        if(posY < Demo.TILE_COL_NUM - 1 && aryVal[posX][posY+1]==1 || posY == Demo.TILE_COL_NUM - 1)
        {
            value+=2;
        }
        if(posX < Demo.TILE_ROW_NUM - 1 && aryVal[posX+1][posY]==1 || posX == Demo.TILE_ROW_NUM - 1)
        {
            value+=4;
        }
        if(posY > 0 && aryVal[posX][posY-1]==1 || posY == 0)
        {
            value+=8;
        }
        return value;
    },
    calcLavaVal:function(posX,posY,aryVal){
        if(posX<0 ||posX > Demo.TILE_ROW_NUM - 1||posY < 0 || posY > Demo.TILE_COL_NUM - 1 )
        {
            return -1;
        }
        var value = 0;
        if(posX > 0 && aryVal[posX-1][posY]==1 ||posX == 0)
        {
            value = 0;
        }

        if(posX < Demo.TILE_ROW_NUM - 1 && aryVal[posX+1][posY]==1 || posX == Demo.TILE_ROW_NUM - 1)
        {
            value+=4;
        }

    },
    calcDTrapsVal:function(posX,posY,aryVal){
        if(posX<0 ||posX > Demo.TILE_ROW_NUM - 1||posY < 0 || posY > Demo.TILE_COL_NUM - 1 )
        {
            return -1;
        }
        var value = -1;
        alert(aryVal[posX][posY-1]);
        if(posY == 0 && aryVal[posX][posY-1]==1)
        {
            value = 1;
        }
        alert(aryVal[posX+1][posY]);

        if(posY+1 == Demo.TILE_COL_NUM - 1 && aryVal[posX][posY+1]==1)
        {
            value = 3;
        }
        alert(aryVal[posX-1][posY]);

        if(posX == 0 && aryVal[posX-1][posY]==1){
            value = 0;
        }
        alert(aryVal[posX+1][posY]);
        if(posX+1 == Demo.TILE_ROW_NUM - 1 && aryVal[posX+1][posY]==1){
            value = 2;
        }
        return value;
    },
}