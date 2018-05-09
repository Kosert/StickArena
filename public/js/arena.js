var arenaTimer;
var tmp = {
    hp: 45,
    hpMax: 120,
    armor: 20,
    armorMax: 60,
    energy: 80,
    energyMax: 100
}
var tmpOp = {
    hp: 5,
    hpMax: 100,
    armor: 0,
    armorMax: 50,
    energy: 20,
    energyMax: 300
}


function showArena() {
    canvas.clear();
    canvas.localization = 'arena';
    load();
    removeLeftBars().then(refLeftBars).then(formatBars);
    removeRightBars().then(refRightBars).then(formatBars);


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
    canvas.on('mouse:down', function (e) {
        if (e.target != null && canvas.localization == 'arena') {
            switch (e.target.name) {
                case 'weapon1':
                    //atack1
                    break;
                case 'weapon2':
                    //atack2

                    break;
                case 'weapon3':
                    //atack3

                    break;
                case 'zzz':
                    //sleep
                    break;
                case 'exitArena':
                    //exitArena
                    clearInterval(arenaTimer);


            }
            canvas.renderAll();
        }
    });

    function load() {
        fabric.loadSVGFromURL('svg/arena/arenaBG.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(1.2);
            obj.set({ left: canvas.width / 2, top: 140 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'bg';
            obj.on('added', function () {
                canvas.bringToFront(canvas.getItemByName('menu'))
                canvas.bringToFront(canvas.getItemByName('weapon3'))
                canvas.bringToFront(canvas.getItemByName('weapon2'))
                canvas.bringToFront(canvas.getItemByName('weapon1'))
                canvas.bringToFront(canvas.getItemByName('stickman'))
                canvas.bringToFront(canvas.getItemByName('opponent'))
                formatBars();
            });
            canvas.add(obj);

        });

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

        fabric.loadSVGFromURL('svg/weapon.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(0.3);
            obj.set({ left: 40, top: 440 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'weapon1';
            obj.on('added', function () {
                timer(60)
                canvas.bringToFront(canvas.getItemByName('timer'))
            });
            canvas.add(obj);

        });
        fabric.loadSVGFromURL('svg/weapon.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(0.3);
            obj.set({ left: 120, top: 440 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'weapon2';
            obj.on('added', function () {
            });
            canvas.add(obj);

        });
        fabric.loadSVGFromURL('svg/weapon.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(0.3);
            obj.set({ left: 200, top: 440 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'weapon3';
            obj.on('added', function () {
            });
            canvas.add(obj);

        });
        fabric.loadSVGFromURL('svg/arena/zzz.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(0.3);
            obj.set({ left: 290, top: 460 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'zzz';
            obj.on('added', function () {
            });
            canvas.add(obj);

        });
        fabric.loadSVGFromURL('svg/Stickman.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(2);
            obj.set({ left: 330, top: 300 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'stickman';
            canvas.add(obj);
        });
        fabric.loadSVGFromURL('svg/Stickman.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(1.7);
            obj.set({ left: 420, top: 280 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'opponent';
            canvas.add(obj);
        });
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
        refLeftBars();
        refRightBars();




        canvas.renderAll();
    }

    function timer(time) {


        arenaTimer = setInterval(function () {
            time = time - 1;

            canvas.remove(canvas.getItemByName('timer'))
            var timer = new fabric.Text(String(time), {
                left: canvas.width / 2,
                top: 45,
                selectable: false,
                scalable: false,
                name: 'timer',
                fill: 'red',
                fontSize: 50,
                fontFamily: 'Comic Sans',
                textAlign: 'center',
            });
            canvas.add(timer);
            canvas.renderAll();
            if (time <= 0) {
                clearInterval(arenaTimer);
                //TODO  END ROUND
            }
        }, 1000);

    }

    function mouseOverWeapon1() {
        fabric.loadSVGFromURL('svg/arena/Cloud.svg', function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            obj.scale(12);
            obj.set({ left: 52, top: 370 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'overWeapon1';
            obj.on('added', function () {
                canvas.bringToFront(obj);
                canvas.bringToFront(canvas.getItemByName('skillText'))
            });
            canvas.add(obj);
        });

        var skillText = new fabric.Text(String('Zwykły atak \nobrażenia:\t' + 12 + ' - ' + 23 + '\nszansa:\t' + 50 + '%' + '\nkoszt:\t' + 30), {
            left: 10,
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
            obj.scale(12);
            obj.set({ left: 130, top: 370 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'overWeapon2';
            obj.on('added', function () {
                canvas.bringToFront(obj);
                canvas.bringToFront(canvas.getItemByName('skillText'))

            });
            canvas.add(obj);

        });
        var skillText = new fabric.Text(String('Szybki atak \nobrażenia:\t' + 6 + ' - ' + 13 + '\nszansa:\t' + 70 + '%' + '\nkoszt:\t' + 20), {
            left: 85,
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
            obj.scale(12);
            obj.set({ left: 215, top: 370 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'overWeapon3';
            obj.on('added', function () {
                canvas.bringToFront(obj);
                canvas.bringToFront(canvas.getItemByName('skillText'))

            });
            canvas.add(obj);

        });
        var skillText = new fabric.Text(String('POTĘŻNY atak \nobrażenia:\t' + 30 + ' - ' + 42 + '\nszansa:\t' + 20 + '%' + '\nkoszt:\t' + 60), {
            left: 172,
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
            obj.scale(12);
            obj.set({ left: 300, top: 370 });
            obj.selectable = false;
            obj.scalable = false;
            obj.name = 'overZzz';
            obj.on('added', function () {
                canvas.bringToFront(obj);
                canvas.bringToFront(canvas.getItemByName('skillText'))
            });
            canvas.add(obj);
        });
        var skillText = new fabric.Text(String('Odpocznij \n\nRegen:\t' + 35 + '%'), {
            left: 260,
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
    function refLeftBars() {
        return new Promise(function (resolve, reject) {

            var hpL = new fabric.Rect({
                top: 27,
                left: 24,
                width: (tmp.hp * 293) / tmp.hpMax,//max 293
                height: 13,
                selectable: false,
                originX: 'left',
                scalable: false,
                name: 'hpL',
                fill: 'red',
            });
            canvas.add(hpL);

            var hpLText = new fabric.Text(String(tmp.hp + '/' + tmp.hpMax), {
                left: 175,
                top: 27,
                selectable: false,
                scalable: false,
                name: 'hpLText',
                fill: 'black',
                fontSize: 10,
                fontFamily: 'Comic Sans',
                textAlign: 'center',
            });
            canvas.add(hpLText);

            var arL = new fabric.Rect({
                top: 47,
                left: 24,
                width: (tmp.armor * 293) / tmp.armorMax,//max 293
                height: 13,
                selectable: false,
                originX: 'left',
                scalable: false,
                name: 'arL',
                fill: 'grey',
            });
            canvas.add(arL);

            var arLText = new fabric.Text(String(tmp.armor + '/' + tmp.armorMax), {
                left: 175,
                top: 47,
                selectable: false,
                scalable: false,
                name: 'arLText',
                fill: 'black',
                fontSize: 10,
                fontFamily: 'Comic Sans',
                textAlign: 'center',
            });
            canvas.add(arLText);
            var enL = new fabric.Rect({
                top: 72,
                left: 24,
                width: (tmp.energy * 293) / tmp.energyMax,//max 293
                height: 13,
                selectable: false,
                originX: 'left',
                scalable: false,
                name: 'enL',
                fill: 'khaki',
            });
            canvas.add(enL);

            var enLText = new fabric.Text(String(tmp.energy + '/' + tmp.energyMax), {
                left: 175,
                top: 72,
                selectable: false,
                scalable: false,
                name: 'enLText',
                fill: 'black',
                fontSize: 10,
                fontFamily: 'Comic Sans',
                textAlign: 'center',
            });
            canvas.add(enLText);

        });
    }
    function refRightBars() {
        return new Promise(function (resolve, reject) {
            var hpP = new fabric.Rect({
                top: 27,
                left: 404,
                width: (tmpOp.hp * 293) / tmpOp.hpMax,//max 293
                height: 13,
                selectable: false,
                originX: 'left',
                scalable: false,
                name: 'hpP',
                fill: 'red',
            });
            canvas.add(hpP);

            var hpPText = new fabric.Text(String(tmpOp.hp + '/' + tmpOp.hpMax), {
                left: 555,
                top: 27,
                selectable: false,
                scalable: false,
                name: 'hpPText',
                fill: 'black',
                fontSize: 10,
                fontFamily: 'Comic Sans',
                textAlign: 'center',
            });
            canvas.add(hpPText);

            var arP = new fabric.Rect({
                top: 47,
                left: 404,
                width: (tmpOp.armor * 293) / tmpOp.armorMax,//max 293
                height: 13,
                selectable: false,
                originX: 'left',
                scalable: false,
                name: 'arP',
                fill: 'grey',
            });
            canvas.add(arP);

            var arPText = new fabric.Text(String(tmpOp.armor + '/' + tmpOp.armorMax), {
                left: 555,
                top: 47,
                selectable: false,
                scalable: false,
                name: 'arPText',
                fill: 'black',
                fontSize: 10,
                fontFamily: 'Comic Sans',
                textAlign: 'center',
            });
            canvas.add(arPText);
            var enP = new fabric.Rect({
                top: 72,
                left: 404,
                width: (tmpOp.energy * 293) / tmpOp.energyMax,//max 293
                height: 13,
                selectable: false,
                originX: 'left',
                scalable: false,
                name: 'enP',
                fill: 'khaki',
            });
            canvas.add(enP);

            var enPText = new fabric.Text(String(tmpOp.energy + '/' + tmpOp.energyMax), {
                left: 555,
                top: 72,
                selectable: false,
                scalable: false,
                name: 'enPText',
                fill: 'black',
                fontSize: 10,
                fontFamily: 'Comic Sans',
                textAlign: 'center',
            });
            canvas.add(enPText);
            resolve();
        });

    }
    function formatBars() {
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
            canvas.remove(canvas.getItemByName('hpL'))
            canvas.remove(canvas.getItemByName('hpLText'))
            canvas.remove(canvas.getItemByName('arL'))
            canvas.remove(canvas.getItemByName('arLText'))
            canvas.remove(canvas.getItemByName('enL'))
            canvas.remove(canvas.getItemByName('enLText'))
            resolve();
        });
    }
    function removeRightBars() {
        return new Promise(function (resolve, reject) {
            canvas.remove(canvas.getItemByName('hpP'))
            canvas.remove(canvas.getItemByName('hpPText'))
            canvas.remove(canvas.getItemByName('arP'))
            canvas.remove(canvas.getItemByName('arPText'))
            canvas.remove(canvas.getItemByName('enP'))
            canvas.remove(canvas.getItemByName('enPText'))
            resolve();
        });
    }


}