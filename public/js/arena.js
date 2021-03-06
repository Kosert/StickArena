var socket = io()
var user
var opponent

var characters = []

function getCharacterIndex(login) {
    if (characters) {
        if (characters[0].login == login) {
            return 0;
        } else {
            return 1;
        }
    }
    return -1;
}

function refreshBars(characterIndex) {
    if (characterIndex == 0) {
        animateLeftBars().then(formatBars)
    } else {
        animateRightBars().then(formatBars)
    }
}

function refreshBars() {
    animateLeftBars().then(formatBars)
    animateRightBars().then(formatBars)
}

socket.on('endDuel', function (prize) {
    clearInterval(arenaTimer)
    showPrize(prize.exp, prize.gold)
})

socket.on('gameFound', function (us, opp, nickStart) {
    characters[0] = us
    characters[1] = opp
    sticks.setColors('black', 'black')
    sticks.setWeapons(us.weaponImage, opp.weaponImage)
    showArena(nickStart)
    inArenaButtonText_fight()
})

socket.on('noEnoughEnergy', function () {
    arenaAlert('Za mało energii!')
})

socket.on('incorrectAction', function () {
    arenaAlert('Niepoprawna akcja!')

})

socket.on('notYourTurn', function () {
    arenaAlert('Aktualnie trwa tura przeciwnika!')
})

socket.on('turn', function (nick) {
    setTurn(nick)
    resetTimer()
})

socket.on('attack', function (attackType, attacker, attacked) {

    var attackerIndex = getCharacterIndex(attacker.login)

    if (attackerIndex == 0)
        sticks.animateUserAttack()
    else
        sticks.animateEnemyAttack()

    characters[attackerIndex] = attacker

    var attackedIndex = getCharacterIndex(attacked.login)
    var armDiff = characters[attackedIndex].stats.armor - attacked.stats.armor
    var hpDiff = characters[attackedIndex].stats.hp - attacked.stats.hp
    sticks.animateDamageHint(hpDiff + armDiff)
    characters[attackedIndex] = attacked
    resetTimer()
    refreshBars()
})

socket.on('miss', function (missType, character) {

    var index = getCharacterIndex(character.login)

    if (index == 0)
        sticks.animateUserAttack()
    else
        sticks.animateEnemyAttack()
    sticks.animateDamageHint()

    characters[index] = character
    resetTimer()
    refreshBars(index)
})

socket.on('rest', function (character) {
    var index = getCharacterIndex(character.login)
    characters[index] = character
    arenaAlert('Gracz ' + character.login + ' odpoczywa')
    resetTimer()
    refreshBars(index)
})

function setTurn(nick) {
    if (nick == characters[0].login) {
        canvas.getItemByName('weapon1').scale(0.5, 0.5)
        canvas.getItemByName('weapon2').scale(0.5, 0.5)
        canvas.getItemByName('weapon3').scale(0.5, 0.5)
        canvas.getItemByName('zzz').scale(0.3, 0.3)
    }
    else {
        canvas.getItemByName('weapon1').scale(0, 0)
        canvas.getItemByName('weapon2').scale(0, 0)
        canvas.getItemByName('weapon3').scale(0, 0)
        canvas.getItemByName('zzz').scale(0, 0)
        canvas.remove(canvas.getItemByName('overWeapon1'));
        canvas.remove(canvas.getItemByName('overWeapon2'));
        canvas.remove(canvas.getItemByName('overWeapon3'));
        canvas.remove(canvas.getItemByName('overZzz'));
        canvas.remove(canvas.getItemByName('skillText'));
    }
    canvas.renderAll()
}

function showArena(nickStart) {
    canvas.clear();
    canvas.localization = 'arena';
    load();
    removeLeftBars().then(createLeftBars).then(formatBars);
    removeRightBars().then(createRightBars).then(formatBars);


    canvas.on('mouse:over', function (e) {
        if (e.target != null && canvas.localization == 'arena') {
            switch (e.target.name) {
                case 'weapon1':
                    mouseOverWeapon1();
                    break;
                case 'weapon2':
                    mouseOverWeapon2();

                    break;
                case 'weapon3':
                    mouseOverWeapon3();

                    break;
                case 'zzz':
                    mouseOverZzz();
                    break;
                case 'stickman':
                    mouseOverStickman();
                    break;
                case 'opponent':
                    mouseOverOpponent();
                    break;

            }
            canvas.renderAll();
        }
    });
    canvas.on('mouse:out', function (e) {
        if (e.target != null && canvas.localization == 'arena') {
            canvas.remove(canvas.getItemByName('overWeapon1'));
            canvas.remove(canvas.getItemByName('overWeapon2'));
            canvas.remove(canvas.getItemByName('overWeapon3'));
            canvas.remove(canvas.getItemByName('overZzz'));
            canvas.remove(canvas.getItemByName('skillText'));

        }
    });

    function load() {


        var menu = new fabric.Rect({
            top: 436,
            left: canvas.width / 2,
            width: canvas.width,
            height: 100,
            selectable: false,
            scalable: false,
            name: 'menu',
            fill: 'green',
        });
        menu.on('added', function () {

        });
        canvas.add(menu);

        fabric.loadSVGFromURL('svg/weaponYellow.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(0);
            obj.set({ left: 40, top: 440 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'weapon1';
            canvas.add(obj);

        });
        fabric.loadSVGFromURL('svg/weaponWhite.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(0);
            obj.set({ left: 140, top: 440 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'weapon2';
            obj.on('added', function () {
            });
            canvas.add(obj);

        });
        fabric.loadSVGFromURL('svg/weaponRed.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(0);
            obj.set({ left: 240, top: 440 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'weapon3';
            obj.on('added', function () {
            });
            canvas.add(obj);

        });
        fabric.loadSVGFromURL('svg/arena/zzz.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(0);
            obj.set({ left: 360, top: 460 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'zzz';
            obj.on('added', function () {
            });
            canvas.add(obj);

        });
        fabric.loadSVGFromURL('svg/arena/flag.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(0.3);
            obj.set({ left: 650, top: 440 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'flag';
            obj.on('added', function () {
            });
            canvas.add(obj);

        });
        sticks.initialize()
        fabric.loadSVGFromURL('svg/arena/HealthBar.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(0.38);
            obj.set({ left: canvas.width / 2 - 150, top: 0 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'HealthBarL';
            canvas.add(obj);
        });
        fabric.loadSVGFromURL('svg/arena/HealthBar.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(0.38);
            obj.set({ left: canvas.width / 2 + 230, top: 0 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'HealthBarP';
            canvas.add(obj);
        });
        fabric.loadSVGFromURL('svg/arena/ArmorBar.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(0.38);
            obj.set({ left: canvas.width / 2 - 150, top: 20 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'ArmorBarL';
            canvas.add(obj);
        });
        fabric.loadSVGFromURL('svg/arena/ArmorBar.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(0.38);
            obj.set({ left: canvas.width / 2 + 230, top: 20 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'ArmorBarP';
            canvas.add(obj);
        });
        fabric.loadSVGFromURL('svg/arena/EnergyBar.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(0.38);
            obj.set({ left: canvas.width / 2 - 150, top: 45 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'EnergyBarL';
            canvas.add(obj);
        });
        fabric.loadSVGFromURL('svg/arena/EnergyBar.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(0.38);
            obj.set({ left: canvas.width / 2 + 230, top: 45 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'EnergyBarP';
            canvas.add(obj);
        });

        fabric.loadSVGFromURL('https://upload.wikimedia.org/wikipedia/commons/c/cf/Ubuntu_alternative_background.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.opacity = 0.5
            obj.set({ left: canvas.width / 2, top: 140 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'bg';
            obj.on('added', function () {
                canvas.bringToFront(canvas.getItemByName('menu'))
                canvas.bringToFront(canvas.getItemByName('weapon3'))
                canvas.bringToFront(canvas.getItemByName('weapon2'))
                canvas.bringToFront(canvas.getItemByName('weapon1'))
                canvas.bringToFront(canvas.getItemByName('zzz'))
                canvas.bringToFront(canvas.getItemByName('stickman'))
                canvas.bringToFront(canvas.getItemByName('opponent'))
                canvas.bringToFront(canvas.getItemByName('flag'))
                canvas.bringToFront(canvas.getItemByName('timer'))
                sticks.bringToFront()
                formatBars()
                arenaAlert("Zaczyna gracz " + nickStart)
                setTurn(nickStart)
            });
            canvas.add(obj);
        });

        createTimer()
        canvas.renderAll();
    }

    function createTimer() {
        var timer = new fabric.Text(String(60), {
            left: canvas.width / 2,
            top: 45,
            selectable: false,
            scalable: false,
            name: 'timer',
            fill: 'red',
            fontSize: 50,
            fontFamily: 'Comic Sans',
            textAlign: 'center',
        })
        canvas.add(timer)
        resetTimer()
    }
    var oppTimeout
    function mouseOverOpponent() {
        if (!canvas.getItemByName('oppStat')) {
            var oppStat = new fabric.Group([new fabric.Rect({
                width: 150,
                height: 150,
                fill: 'grey',
                rx: 10,
                ry: 10,
                selectable: false
            }),
            new fabric.Text("Siła: "+String(characters[1].stats.str), {
                 left: 50,
                top: -40,
                originX: 'right',
                textAlign: 'right',
                fill: '#fff',
                fontSize: 14
            }),
            new fabric.Text("Celność: "+String(characters[1].stats.att), {
                 left: 50,
                top: -20,
                originX: 'right',
                textAlign: 'right',
                fill: '#fff',
                fontSize: 14
            }),
            new fabric.Text("Zręczność: "+String(characters[1].stats.agi), {
                 left: 50,
                top: 0,
                originX: 'right',
                textAlign: 'right',
                fill: '#fff',
                fontSize: 14
            }),
            new fabric.Text("Wytrzymałość: "+String(characters[1].stats.sta), {
                 left: 50,
                originX: 'right',
                textAlign: 'right',
                top: 20,
                fill: '#fff',
                fontSize: 14
            }),
            new fabric.Text("Witalność: "+String(characters[1].stats.vit), {
                 left: 50,
                originX: 'right',
                textAlign: 'right',
                top: 40,
                fill: '#fff',
                fontSize: 14
            })], {
                    name: 'oppStat',
                    left: canvas.width / 2 + 250,
                    top: 200,
                    opacity: 1,
                    selectable: false

                });


            canvas.add(oppStat);
            canvas.bringToFront(oppStat)
            oppTimeout = setTimeout(function () {
                if (canvas.getItemByName('oppStat')) {
                    canvas.remove(canvas.getItemByName('oppStat'))
                    canvas.renderAll()
                }
            }, 3000)
        }
        else {

            clearTimeout(oppTimeout)

            canvas.remove(canvas.getItemByName('oppStat'));
        }


    }
    var usrTimeout
    function mouseOverStickman() {
        if (!canvas.getItemByName('usrStat')) {
            var usrStat = new fabric.Group([new fabric.Rect({
                width: 150,
                height: 150,
                fill: 'grey',
                rx: 10,
                ry: 10,
                selectable: false
            }),
                       new fabric.Text("Siła: "+String(characters[0].stats.str), {
                left: 50,
                originX: 'right',
                textAlign: 'right',
                top: -40,
                fill: '#fff',
                fontSize: 14
            }),
            new fabric.Text("Celność: "+String(characters[0].stats.att), {
                 left: 50,
                textAlign: 'right',
                originX: 'right',
                top: -20,
                fill: '#fff',
                fontSize: 14
            }),
            new fabric.Text("Zręczność: "+String(characters[0].stats.agi), {
                left: 50,
                top: 0,
                textAlign: 'right',
                originX: 'right',
                fill: '#fff',
                fontSize: 14
            }),
            new fabric.Text("Wytrzymałość: "+String(characters[0].stats.sta), {
                 left: 50,
                textAlign: 'right',
                originX: 'right',
                top: 20,
                fill: '#fff',
                fontSize: 14
            }),
            new fabric.Text("Witalność: "+String(characters[0].stats.vit), {
                left: 50,
                top: 40,
                textAlign: 'right',
                originX: 'right',
                fill: '#fff',
                fontSize: 14
            })], {
                    name: 'usrStat',
                    left: canvas.width / 2 - 270,
                    top: 200,
                    opacity: 1,
                    selectable: false

                });


            canvas.add(usrStat);
            canvas.bringToFront(usrStat)
            usrTimeout = setTimeout(function () {
                if (canvas.getItemByName('usrStat')) {
                    canvas.remove(canvas.getItemByName('usrStat'))
                    canvas.renderAll()
                }
            }, 3000)
        }
        else {

            clearTimeout(usrTimeout)

            canvas.remove(canvas.getItemByName('usrStat'));
        }
    }

    function mouseOverWeapon1() {
        fabric.loadSVGFromURL('svg/arena/Cloud.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(13);
            obj.set({ left: 70, top: 370 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'overWeapon1';
            obj.on('added', function () {
                canvas.bringToFront(obj);
                canvas.bringToFront(canvas.getItemByName('skillText'))
            });
            canvas.add(obj);
        });

        var skillText = new fabric.Text(String('Zwykły atak \nobrażenia:\t' + characters[0].stats.damageMin + ' - ' + characters[0].stats.damageMax + '\nszansa:\t' + characters[0].stats.hitChance + '%' + '\nkoszt:\t' + 8), {
            left: 28,
            top: 355,
            selectable: false,
            scalable: false,
            name: 'skillText',
            fill: '#000',
            fontSize: 12,
            fontFamily: 'Comic Sans',
            textAlign: 'left',
            originX: 'left',
        });
        canvas.add(skillText);
        canvas.bringToFront(skillText);

    }
    function mouseOverWeapon2() {
        fabric.loadSVGFromURL('svg/arena/Cloud.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(13);
            obj.set({ left: 170, top: 370 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'overWeapon2';
            obj.on('added', function () {
                canvas.bringToFront(obj);
                canvas.bringToFront(canvas.getItemByName('skillText'))

            });
            canvas.add(obj);
        });
        var skillText = new fabric.Text(String('Szybki atak \nobrażenia:\t' + Math.round(characters[0].stats.damageMin * 0.7) + ' - ' + Math.round(characters[0].stats.damageMax * 0.7) + '\nszansa:\t' + Math.round(characters[0].stats.hitChance * 1.3) + '%' + '\nkoszt:\t' + 6), {
            left: 125,
            top: 355,
            selectable: false,
            scalable: false,
            name: 'skillText',
            fill: '#000',
            fontSize: 12,
            fontFamily: 'Comic Sans',
            textAlign: 'left',
            originX: 'left',
        });
        canvas.add(skillText);
        canvas.bringToFront(skillText);
    }
    function mouseOverWeapon3() {
        fabric.loadSVGFromURL('svg/arena/Cloud.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(13);
            obj.set({ left: 267, top: 370 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'overWeapon3';
            obj.on('added', function () {
                canvas.bringToFront(obj);
                canvas.bringToFront(canvas.getItemByName('skillText'))

            });
            canvas.add(obj);

        });
        var skillText = new fabric.Text(String('P O T Ę Ż N Y atak \nobrażenia:\t' + Math.round(characters[0].stats.damageMin * 1.3) + ' - ' + Math.round(characters[0].stats.damageMax * 1.3) + '\nszansa:\t' + Math.round(characters[0].stats.hitChance * 0.7) + '%' + '\nkoszt:\t' + 10), {
            left: 220,
            top: 355,
            selectable: false,
            scalable: false,
            name: 'skillText',
            fill: '#000',
            fontSize: 12,
            fontFamily: 'Comic Sans',
            textAlign: 'left',
            originX: 'left',
        });
        canvas.add(skillText);
        canvas.bringToFront(skillText);
    }
    function mouseOverZzz() {
        fabric.loadSVGFromURL('svg/arena/Cloud.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(13);
            obj.set({ left: 380, top: 370 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'overZzz';
            obj.on('added', function () {
                canvas.bringToFront(obj);
                canvas.bringToFront(canvas.getItemByName('skillText'))
            });
            canvas.add(obj);
        });
        var skillText = new fabric.Text(String('Odpocznij \n\nRegen:\t' + Math.round(characters[0].stats.energyMax * 0.2) + ' (20%)'), {
            left: 340,
            top: 355,
            selectable: false,
            scalable: false,
            name: 'skillText',
            fill: '#000',
            fontSize: 12,
            fontFamily: 'Comic Sans',
            textAlign: 'left',
            originX: 'left',
        });
        canvas.add(skillText);
        canvas.bringToFront(skillText);
    }


    canvas.on('mouse:down', function (e) {
        if (e.target != null && canvas.localization == 'arena') {
            switch (e.target.name) {
                case 'weapon1':
                    socket.emit('action', 'attack')
                    break;

                case 'weapon2':
                    socket.emit('action', 'swiftAttack')
                    break;

                case 'weapon3':
                    socket.emit('action', 'powerfulAttack')
                    break;

                case 'zzz':
                    socket.emit('action', 'rest')
                    break;

                case 'flag':
                    resetTimer()
                    socket.emit('surrender')
                    break;

                case 'exitButton':
                    location.reload()
            }
            canvas.renderAll();
        }
    });

}

function createBarText(name, text, left, top) {
    var barText = new fabric.Text(String(text), {
        "left": left,
        "top": top,
        "selectable": false,
        "scalable": false,
        "name": name,
        "fill": 'black',
        "fontSize": 12,
        "fontFamily": '"Comic Sans MS", "Comic Sans", cursive',
        "fontWeight": 'bold',
        "textAlign": 'center',
    })
    canvas.add(barText)
}

function createLeftBars() {
    return new Promise(function (resolve, reject) {
        var nickL = new fabric.Text(String(characters[0].login), {
            left: 175,
            top: 12,
            selectable: false,
            scalable: false,
            name: 'nickL',
            fill: 'black',
            fontSize: 16,
            textAlign: 'center',
        });
        canvas.add(nickL);
        var hpL = new fabric.Rect({
            top: 27,
            left: 24,
            width: (characters[0].stats.hp * 293) / characters[0].stats.hpMax,//max 293
            height: 13,
            selectable: false,
            originX: 'left',
            scalable: false,
            name: 'hpL',
            fill: 'red',
        });
        canvas.add(hpL);
        createBarText('hpLText', characters[0].stats.hp + '/' + characters[0].stats.hpMax, 175, 28)

        var arL = new fabric.Rect({
            top: 47,
            left: 24,
            width: (characters[0].stats.armor * 293) / characters[0].stats.armorMax,//max 293
            height: 13,
            selectable: false,
            originX: 'left',
            scalable: false,
            name: 'arL',
            fill: 'grey',
        });
        canvas.add(arL);
        createBarText('arLText', characters[0].stats.armor + '/' + characters[0].stats.armorMax, 175, 48)

        var enL = new fabric.Rect({
            top: 72,
            left: 24,
            width: (characters[0].stats.energy * 293) / characters[0].stats.energyMax,//max 293
            height: 13,
            selectable: false,
            originX: 'left',
            scalable: false,
            name: 'enL',
            fill: 'khaki',
        });
        canvas.add(enL);
        createBarText('enLText', characters[0].stats.energy + '/' + characters[0].stats.energyMax, 175, 73)
    });
}
function createRightBars() {
    return new Promise(function (resolve, reject) {
        var nickP = new fabric.Text(String(characters[1].login), {
            left: 555,
            top: 12,
            selectable: false,
            scalable: false,
            name: 'nickP',
            fill: 'black',
            fontSize: 16,
            textAlign: 'center',
        });
        canvas.add(nickP);

        var hpP = new fabric.Rect({
            top: 27,
            left: 404,
            width: (characters[1].stats.hp * 293) / characters[1].stats.hpMax,//max 293
            height: 13,
            selectable: false,
            originX: 'left',
            scalable: false,
            name: 'hpP',
            fill: 'red',
        });
        canvas.add(hpP);
        createBarText('hpPText', characters[1].stats.hp + '/' + characters[1].stats.hpMax, 555, 28)

        var arP = new fabric.Rect({
            top: 47,
            left: 404,
            width: (characters[1].stats.armor * 293) / characters[1].stats.armorMax,//max 293
            height: 13,
            selectable: false,
            originX: 'left',
            scalable: false,
            name: 'arP',
            fill: 'grey',
        });
        canvas.add(arP);
        createBarText('arPText', characters[1].stats.armor + '/' + characters[1].stats.armorMax, 555, 48)

        var enP = new fabric.Rect({
            top: 72,
            left: 404,
            width: (characters[1].stats.energy * 293) / characters[1].stats.energyMax,//max 293
            height: 13,
            selectable: false,
            originX: 'left',
            scalable: false,
            name: 'enP',
            fill: 'khaki',
        });
        canvas.add(enP);

        createBarText('enPText', characters[1].stats.energy + '/' + characters[1].stats.energyMax, 555, 73)
        resolve();
    });
}

var animDuration = 500

function animateLeftBars() {
    return new Promise(function (resolve, reject) {
        canvas.getItemByName('hpL').animate('width', (characters[0].stats.hp * 293) / characters[0].stats.hpMax, {
            duration: animDuration,
            onChange: canvas.renderAll.bind(canvas)
        })
        canvas.getItemByName('hpLText').text = characters[0].stats.hp + '/' + characters[0].stats.hpMax
        canvas.getItemByName('arL').animate('width', (characters[0].stats.armor * 293) / characters[0].stats.armorMax, {
            duration: animDuration,
            onChange: canvas.renderAll.bind(canvas)
        })
        canvas.getItemByName('arLText').text = characters[0].stats.armor + '/' + characters[0].stats.armorMax
        canvas.getItemByName('enL').animate('width', (characters[0].stats.energy * 293) / characters[0].stats.energyMax, {
            duration: animDuration,
            onChange: canvas.renderAll.bind(canvas)
        })
        canvas.getItemByName('enLText').text = characters[0].stats.energy + '/' + characters[0].stats.energyMax

        setTimeout(function () { resolve() }, animDuration)
    })
}

function animateRightBars() {
    return new Promise(function (resolve, reject) {
        canvas.getItemByName('hpP').animate('width', (characters[1].stats.hp * 293) / characters[1].stats.hpMax, {
            duration: animDuration,
            onChange: canvas.renderAll.bind(canvas)
        })
        canvas.getItemByName('hpPText').text = characters[1].stats.hp + '/' + characters[1].stats.hpMax
        canvas.getItemByName('arP').animate('width', (characters[1].stats.armor * 293) / characters[1].stats.armorMax, {
            duration: animDuration,
            onChange: canvas.renderAll.bind(canvas)
        })
        canvas.getItemByName('arPText').text = characters[1].stats.armor + '/' + characters[1].stats.armorMax
        canvas.getItemByName('enP').animate('width', (characters[1].stats.energy * 293) / characters[1].stats.energyMax, {
            duration: animDuration,
            onChange: canvas.renderAll.bind(canvas)
        })
        canvas.getItemByName('enPText').text = characters[1].stats.energy + '/' + characters[1].stats.energyMax

        setTimeout(function () { resolve() }, animDuration)
    })
}

var arenaTimer
function resetTimer() {
    var turnTime = 60
    clearInterval(arenaTimer)
    arenaTimer = setInterval(function () {
        turnTime -= 1
        canvas.getItemByName('timer').text = turnTime.toString()
        canvas.renderAll()
        if (turnTime <= 0) {
            clearInterval(arenaTimer)
        }
    }, 1000)
}

function formatBars() {
    canvas.bringToFront(canvas.getItemByName('nickL'))
    canvas.bringToFront(canvas.getItemByName('nickP'))
    canvas.bringToFront(canvas.getItemByName('hpL'))
    canvas.bringToFront(canvas.getItemByName('hpLText'))
    canvas.bringToFront(canvas.getItemByName('hpP'))
    canvas.bringToFront(canvas.getItemByName('hpPText'))
    canvas.bringToFront(canvas.getItemByName('HealthBarL'))
    canvas.bringToFront(canvas.getItemByName('HealthBarP'))
    canvas.bringToFront(canvas.getItemByName('arL'))
    canvas.bringToFront(canvas.getItemByName('arLText'))
    canvas.bringToFront(canvas.getItemByName('arP'))
    canvas.bringToFront(canvas.getItemByName('arPText'))
    canvas.bringToFront(canvas.getItemByName('ArmorBarL'))
    canvas.bringToFront(canvas.getItemByName('ArmorBarP'))
    canvas.bringToFront(canvas.getItemByName('enL'))
    canvas.bringToFront(canvas.getItemByName('enLText'))
    canvas.bringToFront(canvas.getItemByName('enP'))
    canvas.bringToFront(canvas.getItemByName('enPText'))
    canvas.bringToFront(canvas.getItemByName('EnergyBarL'))
    canvas.bringToFront(canvas.getItemByName('EnergyBarP'))
}
function removeLeftBars() {
    return new Promise(function (resolve, reject) {
        if (canvas.getItemByName('nickL')) { canvas.remove(canvas.getItemByName('nickL')) }
        if (canvas.getItemByName('hpL')) { canvas.remove(canvas.getItemByName('hpL')) }
        if (canvas.getItemByName('hpLText')) { canvas.remove(canvas.getItemByName('hpLText')) }
        if (canvas.getItemByName('arL')) { canvas.remove(canvas.getItemByName('arL')) }
        if (canvas.getItemByName('arLText')) { canvas.remove(canvas.getItemByName('arLText')) }
        if (canvas.getItemByName('enL')) { canvas.remove(canvas.getItemByName('enL')) }
        if (canvas.getItemByName('enLText')) { canvas.remove(canvas.getItemByName('enLText')) }
        resolve();
    });
}
function removeRightBars() {
    return new Promise(function (resolve, reject) {
        if (canvas.getItemByName('nickP')) { canvas.remove(canvas.getItemByName('nickP')) }
        if (canvas.getItemByName('hpP')) { canvas.remove(canvas.getItemByName('hpP')) }
        if (canvas.getItemByName('hpPText')) { canvas.remove(canvas.getItemByName('hpPText')) }
        if (canvas.getItemByName('arP')) { canvas.remove(canvas.getItemByName('arP')) }
        if (canvas.getItemByName('arPText')) { canvas.remove(canvas.getItemByName('arPText')) }
        if (canvas.getItemByName('enP')) { canvas.remove(canvas.getItemByName('enP')) }
        if (canvas.getItemByName('enPText')) { canvas.remove(canvas.getItemByName('enPText')) }
        resolve();
    });
}

var arenaAlertTimeout

function arenaAlert(input) {
    if (canvas.getItemByName('arenaAlert')) { canvas.remove(canvas.getItemByName('arenaAlert')) }

    clearTimeout(arenaAlertTimeout)

    var arenaAlert = new fabric.Text(String(input), {
        left: canvas.width / 2,
        top: 120,
        selectable: false,
        scalable: false,
        name: 'arenaAlert',
        fill: '#000',
        fontSize: 22,
        fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
        textAlign: 'center',
        originX: 'center',
    });
    canvas.add(arenaAlert);
    canvas.bringToFront(arenaAlert);
    canvas.renderAll()

    arenaAlertTimeout = setTimeout(function () {
        if (canvas.getItemByName('arenaAlert')) {
            canvas.remove(canvas.getItemByName('arenaAlert'))
            canvas.renderAll()
        }
    }, 3000)

}

function showPrize(exp, gold, itemImgPath, itemName, Stat1, Stat2, Stat3, Stat4) {
    if (!canvas.getItemByName('prizePage')) {
        fabric.Image.fromURL('png/inTavern.png', function (obj) {
            obj.scale(1);
            obj.set({ left: canvas.width / 2, top: canvas.height / 2 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'prizePage';
            obj.on('added', function () {
                canvas.bringToFront(obj);

                var exitButton = new fabric.Group([new fabric.Rect({
                    width: 200,
                    height: 40,
                    rx: 10,
                    ry: 10,
                    fill: '#ccc',
                    selectable: false
                }),
                new fabric.Text(String('Wyjdź'), {
                    // left: 200,
                    // top: 100,
                    fill: '#000',
                    fontSize: 18
                })], {
                        name: 'exitButton',
                        left: canvas.width / 2,
                        top: 360,
                        opacity: 1,
                        selectable: false

                    });

                canvas.add(exitButton);
                canvas.bringToFront(exitButton);


                if (gold) {
                    var arenaTitlePrize = new fabric.Text(String("Wygrałeś!"), {
                        left: canvas.width / 2,
                        top: canvas.height / 2 - 120,
                        selectable: false,
                        scalable: false,
                        name: 'arenaTitlePrize',
                        fill: '#fff',
                        fontSize: 28,
                        fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                        textAlign: 'center',
                        originX: 'center',
                    });
                    canvas.add(arenaTitlePrize);
                    canvas.bringToFront(arenaTitlePrize);
                    var arenaExpPrize = new fabric.Text(String("Otrzymałeś " + exp + " punktów doświadczenia."), {
                        left: canvas.width / 2,
                        top: canvas.height / 2 - 70,
                        selectable: false,
                        scalable: false,
                        name: 'arenaExpPrize',
                        fill: '#fff',
                        fontSize: 20,
                        fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                        textAlign: 'center',
                        originX: 'center',
                    });
                    canvas.add(arenaExpPrize);
                    canvas.bringToFront(arenaExpPrize);
                    var arenaCoinPrize = new fabric.Text(String("Otrzymałeś " + gold + " sztuk złota."), {
                        left: canvas.width / 2,
                        top: canvas.height / 2 - 40,
                        selectable: false,
                        scalable: false,
                        name: 'arenaCoinPrize',
                        fill: '#fff',
                        fontSize: 20,
                        fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                        textAlign: 'center',
                        originX: 'center',
                    });
                    canvas.add(arenaCoinPrize);
                    canvas.bringToFront(arenaCoinPrize);


                    fabric.loadSVGFromURL(itemImgPath, function (objects, options) {
                        var obj = fabric.util.groupSVGElements(objects, options);
                        obj.scale(0.2);
                        obj.set({ left: canvas.width / 2 - 100, top: canvas.height / 2 + 30 });
                        obj.selectable = false;
                        obj.scalable = false;
                        obj.name = 'prizeImg';
                        obj.on('added', function () {
                        });
                        canvas.add(obj);

                    });



                    var itemPrizeName = new fabric.Text('Otrzymałeś ' + String(itemName), {
                        left: canvas.width / 2 + 70,
                        top: canvas.height / 2 - 15,
                        selectable: false,
                        scalable: false,
                        name: 'itemPrizeName',
                        fill: '#fff',
                        fontSize: 20,
                        fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                        textAlign: 'center',
                    });
                    canvas.add(itemPrizeName);
                    var stat1 = new fabric.Text(String(Stat1), {
                        left: canvas.width / 2 + 70,
                        top: canvas.height / 2 + 15,
                        selectable: false,
                        scalable: false,
                        name: 'stat1',
                        fill: '#fff',
                        fontSize: 16,
                        fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                        textAlign: 'center',
                    });
                    canvas.add(stat1);
                    var stat2 = new fabric.Text(String(Stat2), {
                        left: canvas.width / 2 + 70,
                        top: canvas.height / 2 + 35,
                        selectable: false,
                        scalable: false,
                        name: 'stat2',
                        fill: '#fff',
                        fontSize: 16,
                        fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                        textAlign: 'center',
                    });
                    canvas.add(stat2);
                    var stat3 = new fabric.Text(String(Stat3), {
                        left: canvas.width / 2 + 70,
                        top: canvas.height / 2 + 55,
                        selectable: false,
                        scalable: false,
                        name: 'stat3',
                        fill: '#fff',
                        fontSize: 16,
                        fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                        textAlign: 'center',
                    });
                    canvas.add(stat3);
                    var stat4 = new fabric.Text(String(Stat4), {
                        left: canvas.width / 2 + 70,
                        top: canvas.height / 2 + 75,
                        selectable: false,
                        scalable: false,
                        name: 'stat4',
                        fill: '#fff',
                        fontSize: 16,
                        fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                        textAlign: 'center',
                    });
                    canvas.add(stat4);









                }
                else {
                    var arenaTitlePrize = new fabric.Text(String("Przegrałeś!"), {
                        left: canvas.width / 2,
                        top: canvas.height / 2 - 120,
                        selectable: false,
                        scalable: false,
                        name: 'arenaTitlePrize',
                        fill: '#fff',
                        fontSize: 28,
                        fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                        textAlign: 'center',
                        originX: 'center',
                    });
                    canvas.add(arenaTitlePrize);
                    canvas.bringToFront(arenaTitlePrize);

                    var arenaExpPrize = new fabric.Text(String("Otrzymałeś " + exp + " punktów doświadczenia."), {
                        left: canvas.width / 2,
                        top: canvas.height / 2 - 70,
                        selectable: false,
                        scalable: false,
                        name: 'arenaExpPrize',
                        fill: '#fff',
                        fontSize: 20,
                        fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                        textAlign: 'center',
                        originX: 'center',
                    });
                    canvas.add(arenaExpPrize);
                    canvas.bringToFront(arenaExpPrize);


                }


            });
            canvas.add(obj);
        });




    }


}