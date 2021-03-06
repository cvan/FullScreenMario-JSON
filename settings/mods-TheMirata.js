FullScreenMario.prototype.settings.mods = {
    "mods": [
        {
            "name": "Luigi",
            "description": "The little brother who could!",
            "enabled": false,
            "events": {
                "onModEnable": function () {
                    this.StatsHolder.set("luigi", true);
                    this.ObjectMaker.getFunction("Player").prototype.title = "Luigi";
                    
                    if(this.player) {
                        this.player.title = "Luigi";
                        this.PixelDrawer.setThingSprite(this.player);
                    }
                },
                "onModDisable": function () {
                    this.StatsHolder.set("luigi", false);
                    this.ObjectMaker.getFunction("Player").prototype.title = "Player";
                    
                    if(this.player) {
                        this.player.title = "Player";
                        this.PixelDrawer.setThingSprite(this.player);
                    }
                }
            }
        },
        {
            "name": "ParallaxClouds",
            "description": "Clouds in the sky scroll at about 63% the normal rate.",
            "enabled": false,
            "events": {
                "onModEnable": function () {
                    this.ObjectMaker.getFunction("Cloud").prototype.parallax = .63;
                },
                "onModDisable": function () {
                    this.ObjectMaker.getFunction("Cloud").prototype.parallax = undefined;
                }
            }
        },
        {
            "name": "QCount",
            "description": "QQQQQQQ",
            "enabled": true,
            "events": {
                "onModEnable": function (mod) {
                    var FSM = this,
                        characters = mod.settings.characters,
                        charactersFSM = FSM.GroupHolder.getCharacterGroup(),
                        random = Math.random,
                        floor = Math.floor,
                        level;
                    
                    this.InputWriter.addEvent("onkeydown", "q", function () {
                        mod.settings.qcount += 1;
                        
                        if(mod.settings.levels[mod.settings.qcount]) {
                            var level = mod.settings.levels[mod.settings.qcount];
                            FSM.TimeHandler.addEventInterval(function () {
                                if(charactersFSM.length < 210) {
                                    var num = floor(random() * level.length),
                                        lul = FSM.ObjectMaker.make.apply(FSM, level[num]);
                                    
                                    lul.yvel = random() * FSM.unitsize / 4;
                                    lul.xvel = lul.speed = random() * FSM.unitsize * 2;
                                    if(floor(random() * 2)) {
                                        lul.xvel *= -1;
                                    }
                                    
                                    characters.push(lul);
                                    FSM.addThing(lul, 
                                        (32 * random() + 128) * FSM.unitsize,
                                        88 * random() * FSM.unitsize);
                                }
                            }, 7, Infinity);
                        }
                    });
                    this.InputWriter.addAlias("q", [81]);
                }
            },
            "settings": {
                "qcount": 0,
                "characters": [],
                "levels": {
                    "7": [ ["Goomba"] ],
                    "14": [ 
                        ["Koopa"],
                        ["Koopa", { "smart": true }],
                        ["Koopa", { "jumping": true }],
                        ["Koopa", { "smart": true, "jumping": true }],
                        // ["Beetle"],
                        // ["HammerBro"],
                        // ["Lakitu"],
                        // ["Blooper"]
                    ],
                    "21": [ ["Bowser"] ]
                }
            }
        },
        {
            "name": "High Speed",
            "description": "Mario's maximum speed is quadrupled.",
            "enabled": false,
            "events": {
                "onModEnable": function (mod) {
                    var stats = this.ObjectMaker.getFunction("Player").prototype;
                    mod.value_old = stats.maxspeedsave;
                    stats.maxspeedsave = stats.maxspeed = stats.scrollspeed = mod.value_old * 4;
                },
                "onModDisable": function (mod) {
                    var stats = this.ObjectMaker.getFunction("Player").prototype;
                    stats.maxspeedsave = stats.maxspeed = stats.scrollspeed = mod.value_old;
                }
            }
        },
        {
            "name": "Invincibility",
            "description": "Mario is constantly given star power.",
            "enabled": false,
            "events": {
                "onModEnable": function () {
                    if(this.player) {
                        playerStar(this.player, Infinity);
                    }
                },
                "onModDisable": function () {
                    playerRemoveStar(this.player);
                },
                "onLocationSet": function () {
                    playerStar(this.player, Infinity);
                }
            }
        },
        {
            "name": "Super Fireballs",
            "description": "Fireballs blow up solids, and Mario has unlimited.",
            "enabled": false,
            "events": {
                "onModEnable": function (mod) {
                    this.ObjectMaker.getFunction("solid").prototype.nofire = 0;
                    this.ObjectMaker.getFunction("solid").prototype.firedeath = 1;
                },
                "onModDisable": function (mod) {
                    this.ObjectMaker.getFunction("solid").prototype.nofire = 2;
                    this.ObjectMaker.getFunction("solid").prototype.firedeath = 0;
                }
            }
        },
        {
            "name": "Invisible Player",
            "description": "You can't see the player anymore.",
            "enabled": false,
            "events": {
                "onModEnable": function (mod) {
                    this.ObjectMaker.getFunction("Player").prototype.hidden = 1;
                },
                "onModDisable": function (mod) {
                    this.ObjectMaker.getFunction("Player").prototype.hidden = 0;
                }
            }
        },
        {
            "name": "Acid Trip",
            "description": "Sprites aren't cleared from the screen each game tick.",
            "enabled": false,
            "events": {
                "onModEnable": function (mod) {
                    this.PixelDrawer.setNoRefill(true);
                },
                "onModDisable": function (mod) {
                    this.PixelDrawer.setNoRefill(false);
                }
            }
        }
    ]
}