class Rocket extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, texture, frame, )
    {
        super(scene, x, y, texture, frame);

        //add object to existing scene
        scene.add.existing(this);
        this.isFiring = false;      //track rocket firing status
        this.moveSpeed = 2;         //pixels per frame

        this.sfxRocket = scene.sound.add("sfx_rocket"); //add rocket sfx

    }

    update(time, delta)
    {

        let deltaMultiplier = (delta/16.66667); //for refresh rate indepence
        //left/rigth movemement
        if(this.isFiring == false)
        {
            //console.log("isFiring = false");
            if(keyLEFT.isDown == true && this.x >= borderUISize + this.width)
            {
                this.x -= this.moveSpeed * deltaMultiplier;

            }
            else if (keyRIGHT.isDown == true && this.x <= game.config.width - borderUISize - this.width)
            {
                this.x += this.moveSpeed * deltaMultiplier;
            }
        }
        if(Phaser.Input.Keyboard.JustDown(keyF) && this.isFiring == false)
        {
            this.isFiring = true;
            this.sfxRocket.play(); //play sfx
        }
        // if fired, move the rocket up
        if(this.isFiring == true && this.y >= borderUISize * 3 + borderPadding)
        {
            this.y -= this.moveSpeed * deltaMultiplier;
        }

        // reset on miss
        if(this.y <= borderUISize * 3 + borderPadding)
        {
            this.reset();
        }
    }
    //reset rocket to "ground"
    reset()
    {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}