/*
 * Made by b1g UIDer exnull
 * You can take code from this script but mention me please.
 * Still in development!
 * 574265328bc422cdecaafe191bc16a785afe831a8c669de388b389e2cdf0f5ea
 * 5e5a67e79d277bb8b0f5ffac2a90ceded134c9e08fa5fd6739c2fb12bf780849
 * null#7403
 */

var hentaiScripts = {
    colorHelper: {
        getColor(r, g, b) {
            return [r, g, b, 255];
        },

        getColorAlpha(r, g, b, a) {
            var alpha = 255 * a;

            if(alpha < 0) {
                alpha = 0;
            } else if(alpha > 255) {
                alpha = 255;
            }

            return [r, g, b, alpha];
        }
    },

    ui: {
        GetValue(uiItem) {
            return UI.GetString.apply(this, uiItem);
        },

        GetChecked(uiCheckbox) {
            return UI.GetString.apply(this, uiCheckbox) == "true";
        }
    },

    featureManager: {
        featureList: [],

        createEmptyCallback() {
            return {
                callback: function() {}
            }
        },

        createTimedCallback(realCallback, interval) {
            return {
                lastExecution: 0,
                interval: interval,

                callback: function() {
                    var currTime =  Globals.Realtime();
                    var timeSinceLastExecution = currTime - this.lastExecution;
                    
                    if(timeSinceLastExecution > interval) {
                        this.lastExecution = currTime;
                        realCallback();
                    }
                },

                realCallback: realCallback
            };
        },

        createFeature(name) {
            var feature = {
                name: name,

                /* ui elements initialization */

                createUiElements: function() {},

                /* callbacks */

                onCreateMove: this.createEmptyCallback(),
                onDraw: this.createEmptyCallback(),
                onFSN: this.createEmptyCallback()
            };

            this.featureList.push(feature);
            return feature;
        }
    },

    entryPoint() {
        this.printLogo();
        this.createUI();
        this.registerCallbacks();
    },

    isInGame() {
        return World.GetServerString().length > 0;
    },

    printLogo() {
        var wtfIsThatBro = [
            "\n",
            "   __ __         __       _ ____        _      __    \n",
            "  / // /__ ___  / /____ _(_) __/_______(_)__  / /____\n",
            " / _  / -_) _ \\/ __/ _ `/ /\\ \\/ __/ __/ / _ \\/ __(_-<\n",
            "/_//_/\\__/_//_/\\__/\\_,_/_/___/\\__/_/ /_/ .__/\\__/___/\n",
            "                                      /_/            \n",
            "\n"];
        
        var color = this.colorHelper.getColor(255, 0, 0);

        for(var i = 0; i < wtfIsThatBro.length; i++) {
            Cheat.PrintColor(color, wtfIsThatBro[i]);
        }

        Cheat.PrintColor(this.colorHelper.getColor(56, 242, 245), "Thank you for using my script <3\n\n");

        if(this.isInGame()) {
            Cheat.PrintChat(" \x02[HentaiScripts] \x0CThank you for using my script <3");
        }
    },

    createUI() {
        UI.AddLabel("====== HentaiScripts ======");
        UI.AddLabel("Need anything? null#7403");
        UI.AddSliderFloat("", 0, 0);

        this.featureManager.featureList.forEach(function(feature) {
            UI.AddLabel(feature.name);
            feature.createUiElements();
            UI.AddSliderFloat("", 0, 0);
        });

        UI.AddSliderFloat("", 0, 0);
        UI.AddLabel("======================");
    },

    registerCallbacks() {
        Cheat.RegisterCallback("CreateMove", "onCreateMove");
        Cheat.RegisterCallback("Draw", "onDraw");
        Cheat.RegisterCallback("FrameStageNotify", "onFSN");
    },

    onCreateMove() {
        this.featureManager.featureList.forEach(function(e) {
            e.onCreateMove.callback();
        });
    },

    onDraw() {
        this.featureManager.featureList.forEach(function(e) {
            e.onDraw.callback();
        });
    },

    onFSN() {
        this.featureManager.featureList.forEach(function(e) {
            e.onFSN.callback();
        });
    }
}

/* callback workaround, onetap can't find functions inside of the object and can't receive it by pass-by-reference */

function onCreateMove() {
    hentaiScripts.onCreateMove();
}

function onDraw() {
    hentaiScripts.onDraw();
}

function onFSN() {
    hentaiScripts.onFSN();
}

/* Features! */

var featureManager = hentaiScripts.featureManager;
var ui = hentaiScripts.ui;

// Custom clantag feature

(function() {
    var clantagFeature = featureManager.createFeature("Custom clantags");

    var wasEnabled;
    var ccCheckbox, ccTextBox, ccDropdown;

    var textModificators = {
        "CAPS toggle": {
            capsFlag: false,
            processText: function(text) {
                this.capsFlag = !this.capsFlag;
                
                if(this.capsFlag) {
                    // we need to add first space because CSGO wont change clantag (probably check if prev. is equals, ignoring case)
                    text = " " + text.toUpperCase();
                }

                return text;
            }
        },
        "Random numbers": {
            processText: function(text) {
                return Math.floor(Math.random() * 100000000000).toString(); // pseudorandom smh
            }
        },
        "911": {
            animation: [
                "____█_█",
                "✈___█_█",
                "_✈__█_█",
                "__✈_█_█",
                "___✈█_█",
                "_____☠_█",
                "____☠✈█",
                "____☠_☠"
            ],
            lastIndex: 0,
            processText: function(text) {
                this.lastIndex++;

                if(this.lastIndex > this.animation.length - 1) {
                    this.lastIndex = 0;
                }

                return this.animation[this.lastIndex];
            }
        },
        "Typewriter": {
            lastLength: 0,
            cursorBlink: false,
            processText: function(text) {
                this.lastLength++;

                if(this.lastLength > text.length) {
                    this.lastLength = 0;
                }

                var typedText = text.substr(0, this.lastLength);

                this.cursorBlink = !this.cursorBlink;

                if(this.cursorBlink) {
                    typedText += "|";
                }

                var processed = "[" + typedText + "]";
                return processed;
            }
        },
        "Prefix: warning": {
            processText: function(text) { return "⚠ " + text; }
        },
        "Prefix: lightning": {
            processText: function(text) { return "⚡ " + text; }
        },
        "Prefix: check": {
            processText: function(text) { return "✓ " + text; }
        },
        "Prefix: star": {
            processText: function(text) { return "★ " + text; }
        },
        "Prefix: skull": {
            processText: function(text) { return "☠ " + text; }
        },
        "Static: Onetap username": {
            processText: function(text) { return Cheat.GetUsername(); }
        },
        "Skull blink": {
            blink: false,
            processText: function(text) {
                this.blink = !this.blink;

                if(this.blink) {
                    text = "☠".repeat(text.length);
                }

                return text;
            }
        },
        "Hide name (break)": {
            processText: function(text) {
                return "\t\x0d";
            }
        },
        "Hide name (overflow)": {
            processText: function(text) {
                return "\t".repeat(15);
            }
        },
        "Hide name (newline)": {
            processText: function(text) {
                return "\n".repeat(15);
            }
        },
        "Custom name": {
            processText: function(text) {
                return text + "\n\n";
            }
        },
        "Random clantag": {
            // https://stackoverflow.com/a/1497512; too lazy to make my own
            generateRandomText: function() {
                var length = 15,
                    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                    retVal = "";
                for (var i = 0, n = charset.length; i < length; ++i) {
                    retVal += charset.charAt(Math.floor(Math.random() * n));
                }
                return retVal;
            },
            processText: function(text) {
                return this.generateRandomText();
            }
        },
        "Random name": {
            // TODO: remove repeating code?
            generateRandomText: function() {
                var length = 13,
                    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                    retVal = "";
                for (var i = 0, n = charset.length; i < length; ++i) {
                    retVal += charset.charAt(Math.floor(Math.random() * n));
                }
                return retVal;
            },
            processText: function(text) {
                return this.generateRandomText() + "\n\n";
            }
        },
        "Teammate namesteal": {
            lastIndex: 0,
            processText: function(text) {
                var localplayer = Entity.GetLocalPlayer();
                var players = Entity.GetTeammates();

                if(this.lastIndex > players.length - 1) {
                    this.lastIndex = 0;
                }

                var entId = players[this.lastIndex];

                if(entId == localplayer) {
                    this.lastIndex++;
                    entId = players[this.lastIndex];
                }

                var name = Entity.GetName(entId);
                var isBot = Entity.IsBot(entId);

                if(isBot) {
                    name = "BOT " + name;
                }

                this.lastIndex++;

                return name + "\n\n";
            }
        },
        "Enemy namesteal": {
            lastIndex: 0,
            processText: function(text) {
                var players = Entity.GetEnemies();

                if(this.lastIndex > players.length - 1) {
                    this.lastIndex = 0;
                }

                var entId = players[this.lastIndex];
                var name = Entity.GetName(entId);
                var isBot = Entity.IsBot(entId);

                if(isBot) {
                    name = "BOT " + name;
                }

                this.lastIndex++;

                return name + "\n\n";
            }
        }
    };

    clantagFeature.createUiElements = function() {
        ccCheckbox = UI.AddCheckbox("Enable custom clantag");
        ccTextBox = UI.AddTextbox("Custom clantag text");

        var textModificatorTypes = Object.getOwnPropertyNames(textModificators);

        ccDropdown = UI.AddDropdown("Custom clantag animation type", textModificatorTypes);
    };

    function clantagFeatureFrameStageNotify() {
        var customClantagEnabled = ui.GetChecked(ccCheckbox);

        if(!customClantagEnabled) {
            if(wasEnabled) {
                wasEnabled = false;
                Local.SetClanTag("");
            }

            return;
        }

        wasEnabled = true;

        var customText = ui.GetValue(ccTextBox);
        var textModificator = ui.GetValue(ccDropdown);

        var newText = textModificators[textModificator].processText(customText);

        Local.SetClanTag(newText);
    }

    clantagFeature.onDraw = featureManager.createTimedCallback(clantagFeatureFrameStageNotify, 0.5);
})();

// End of custom clantag feature

// Player revealer feature

(function() {
    var playerRevealer = featureManager.createFeature("Player revealer");

    var prCheckbox, prRevealFriendly, prRevealEnemy, prRevealSelf, prTeamChatOnly;
    var lastPlayerIndex = 0;

    playerRevealer.createUiElements = function() {
        prCheckbox = UI.AddCheckbox("Enable player revealer");

        prRevealFriendly = UI.AddCheckbox("Reveal friendly players");
        prRevealEnemy = UI.AddCheckbox("Reveal enemy players");
        prRevealSelf = UI.AddCheckbox("Reveal self");

        prTeamChatOnly = UI.AddCheckbox("Team chat only");
    };

    function clantagFeatureCreateMove() {
        var playerRevealerEnabled = ui.GetChecked(prCheckbox);

        if(!playerRevealerEnabled) {
            return;
        }

        var revealEnemies = ui.GetChecked(prRevealEnemy);
        var revealFriendly = ui.GetChecked(prRevealFriendly);
        var revealSelf = ui.GetChecked(prRevealSelf);

        if(!revealEnemies && !revealFriendly) {
            return;
        }

        var players;

        if(revealEnemies && revealFriendly) {
            players = Entity.GetPlayers();
        } else {
            players = revealFriendly ?
                            Entity.GetTeammates() :
                            Entity.GetEnemies();
        }

        if(!revealSelf) {
            var localplayer = Entity.GetLocalPlayer();
            var selfIndex = players.indexOf(localplayer);

            if (selfIndex != -1) {
                players.splice(selfIndex, 1);
            }
        }

        if(lastPlayerIndex > players.length - 1) {
            lastPlayerIndex = 0;
        }

        var player = players[lastPlayerIndex];

        while(!Entity.IsAlive(player)) {
            lastPlayerIndex++;

            if(lastPlayerIndex > players.length - 1) {
                return;
            }

            player = players[lastPlayerIndex];
        }

        lastPlayerIndex++;

        var name = Entity.GetName(player);
        var loc = Entity.GetProp(player, "CBasePlayer", "m_szLastPlaceName");
        var hp = Entity.GetProp(player, "CBasePlayer", "m_iHealth");

        var teamChatOnly = ui.GetChecked(prTeamChatOnly);
        var command = !teamChatOnly ? "say" : "say_team";

        Cheat.ExecuteCommand(command + " Player " + name + " is at " + loc + " with " + hp + "hp");
    }

    playerRevealer.onDraw = featureManager.createTimedCallback(clantagFeatureCreateMove, 1);
})();

// End of player revealer feature

hentaiScripts.entryPoint();