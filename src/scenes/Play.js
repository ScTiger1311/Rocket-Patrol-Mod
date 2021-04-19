class Play extends Phaser.Scene
{
    constructor()
    {
       super("playScene"); 
    }

    preload()
    {
        //load sprites
        //this.load.image("rocket", "./assets/rocket.png");
        this.load.image("staticBG", "./assets/static_bg.png")

        //load spritesheet
        this.load.spritesheet("explosion", "./assets/torus_explode.png", 
        {   
            frameWidth: 128,
            frameHeight: 128,
            startFrame: 0,
            endFrame: 14,
        });
        this.load.spritesheet("cityFlyby", "./assets/city_flyby.png",
        {
            frameWidth: 640,
            frameHeight: 480,
            startFrame: 1,
            endFrame: 198, 
        });
        this.load.spritesheet("rocket", "./assets/icosphere.png",
        {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 1,
            endFrame: 29, 
        });
        this.load.spritesheet("spaceship", "./assets/torus_spin.png",
        {
            frameWidth: 64,
            frameHeight: 64,
            startFrame: 1,
            endFrame: 19, 
        });
        
    }

    create()
    {
        this.staticBackGround = this.add.sprite(0, 0, "staticBG").setOrigin(0,0);
        this.backgroundAnim = this.add.sprite(0, 0, "cityFlyby").setOrigin(0,0);
        //black UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width,
            borderUISize*2, 0x000000).setOrigin(0, 0); 
             
        //add rocket player 1
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, "rocket").setOrigin(0.5, 0);

        //add spaceship x3
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, "spaceship", 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, "spaceship", 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderUISize*4, "spaceship", 0, 10).setOrigin(0,0);
        

        //define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //animation config
        this.anims.create(
        {
            key: "explode", 
            frames: this.anims.generateFrameNumbers("explosion", 
            {
                start: 0,
                end: 14,
                first: 30,
            }),
            frameRate: 20,
        });

        this.anims.create(
            {
                key: "flyby", 
                frames: this.anims.generateFrameNumbers("cityFlyby", 
                {
                    start: 1,
                    end: 198,
                    nextAnim: "flyby",
                }),
                frameRate: 10,
            });

        //initialize score
        this.p1Score = 0;

        //display score
        let scoreConfig = 
        {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#F3B141",
            color: "#843605",
            align: "right",
            padding: 
            {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100,
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);

        //display time left
        this.timeLeft = game.settings.gameTimer; //remaining time. A really inefficient and bad implementation. But I don't think it matters that much.
        let timeConfig = 
        {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#F3B141",
            color: "#843605",
            align: "right",
            padding: 
            {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100,
        }
        this.timeLeftText = this.add.text(500, borderUISize + borderPadding*2, this.timeLeft / 1000, timeConfig);
        

        //game over flag
        this.gameOver = false;

        //60 second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => 
        {
            this.add.text(game.config.width/2, game.config.height/2, "GAME OVER", scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, "Press R to Restart or ← for Menu", scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        this.backgroundAnim.anims.play("flyby");
        this.backgroundAnim.anims.setRepeat(-1);

    }

    update(time, delta)
    {
        let deltaMultiplier = (delta/16.66667); //for refresh rate indepence

        //check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR))
        {
            this.scene.restart();
        }
        else if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT))
        {
            this.scene.start("menuScene");
        }

        if(this.gameOver == false)
        {
            //update rocket
            this.p1Rocket.update(time, delta);

            //update ships
            this.ship01.update(time, delta);
            this.ship02.update(time, delta);
            this.ship03.update(time, delta);
        }
        

        //check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01))
        {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        //console.log("timeLeft: " + this.timeLeft);
        
        if(this.timeLeft - delta >= 0)
        {
            this.timeLeft -= delta;
        }
        else
        {
            this.timeLeft = 0.000;
        }
        this.timeLeftText.text = this.timeLeft / 1000;
    }

    checkCollision(rocket, ship)
    {
        //simple AABB checking
        if( rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height+rocket.y > ship.y)
            {
                return true;
            }
            else
            {
                return false;
            }
    }

    shipExplode(ship)
    {
        //temporarily hide ship
        ship.alpha = 0;
        //create explosion sprite at the ships position
        let boom = this.add.sprite(ship.x, ship.y, "explosion").setOrigin(0.5, 0.25);
        boom.anims.play('explode');
        boom.on("animationcomplete", () => 
        {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        //score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        this.sound.play("sfx_explosion");
    }
}