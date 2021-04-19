class Menu extends Phaser.Scene
{
    constructor()
    {
       super("menuScene"); 
    }

    preload()
    {
        //load audio
        this.load.audio("sfx_select", "./assets/blip_select12.wav");
        this.load.audio("sfx_explosion", "./assets/explosion38.wav");
        this.load.audio("sfx_rocket", "./assets/rocket_shot.wav");
        this.load.audio("music_kawai", "./assets/kawai.mp3");

        this.load.spritesheet("titleBG", "./assets/title.png", 
        {   
            frameWidth: 640,
            frameHeight: 480,
            startFrame: 1,
            endFrame: 59,
        });
    }

    create()
    {
        this.backgroundAnim = this.add.sprite(0, 0, "titleBG").setOrigin(0,0);

        this.anims.create(
            {
                key: "title", 
                frames: this.anims.generateFrameNumbers("titleBG", 
                {
                    start: 1,
                    end: 59,
                    nextAnim: "title",
                }),
                frameRate: 10,
            });

        this.backgroundAnim.anims.play("title");
        this.backgroundAnim.anims.setRepeat(-1);

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update()
    {
        if(Phaser.Input.Keyboard.JustDown(keyLEFT))
        {
            //easyMode
            game.settings = 
            {
                spaceshipSpeed: 3,
                gameTimer: 60000,
            }
            this.sound.play("sfx_select");
            this.scene.start('playScene');

        }
        else if (Phaser.Input.Keyboard.JustDown(keyRIGHT))
        {
            //hard mode
            game.settings = 
            {
                spaceshipSpeed: 4,
                gameTimer: 45000,
            }
            this.sound.play("sfx_select");
            this.scene.start('playScene');
        }
    }
}