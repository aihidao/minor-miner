var Demo = Demo||{};
//Demo.SCREEN_WIDTH = 64;
//Demo.SCREEN_HEIGHT = 48;

Demo.SCREEN_WIDTH = 1024 ;
Demo.SCREEN_HEIGHT = 768 ;
Demo.TILE_SIZE_W = 16;
Demo.TILE_SIZE_H = 16;

Demo.TILE_COL_NUM = 0;
Demo.TILE_ROW_NUM = 0;

Demo.VOID_VALUE = -1;
Demo.CAVE_VALUE = 0;
Demo.WALL_VALUE = 1;
Demo.CEMENT_VALUE = 2;

Demo.drillEnabled = true;
Demo.hardMode = true;

Demo.Helper.mathHelper.initMathHelper();
Demo.game = new Phaser.Game(Demo.SCREEN_WIDTH, Demo.SCREEN_HEIGHT, Phaser.AUTO, '', null, false, false);
Demo.game.state.add('boot', Demo.bootState);
Demo.game.state.add('menu', Demo.menuState);
Demo.game.state.add('preload', Demo.preloadState);
Demo.game.state.add('construct', Demo.construcState);

// run game
Demo.game.state.start('boot');