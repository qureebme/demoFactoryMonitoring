let socket = io();
socket.on('connect', () => console.log('main server is connected'))

let distSocket = io.connect('/distributing'),
    handSocket = io.connect('/handling'),
    procSocket = io.connect('/processing'),
    testSocket = io.connect('/testing'),
    storSocket = io.connect('/storing');

//for the handling station
let colorToken;

handSocket.on('connect', function(){
    console.log('Handling station server is connected');
})

handSocket.on('disconnect', function(){
    console.log('Handling station server is disconnected');
    s.select('#hand').attr({
        stroke: '',
        strokeWidth: 0,
    })
})

handSocket.on('initialStatus', function(data) {

    if(!data.atFollow && !data.atSort && !data.atPrevious){
        handSocket.emit('initialStatusError', 'Handling Station has has wrong configuration');
        s.select('#hand').attr({
            stroke: 'red',
            strokeWidth: 3,
        })
        return
    }
    else{
        s.select('#hand').attr({
            stroke: 'green',
            strokeWidth: 3,
        })
        handSocket.emit('success')
    }

    if (data.atFollow == true) {

        wkpc_hand[0].animate({ cy: 630 }, 500, mina.easein)
        wkpc_hand[1].animate({ cy: 630 }, 500, mina.easein)

        gr_line.animate({opacity: 0}, 500)

        line_m.animate({y2: line_m.attr('y1')},2000)
        line_c.animate({y1: line_m.attr('y1'), y2: line_m.attr('y1')},500)
        line_r.animate({y1: line_m.attr('y1'), y2: line_m.attr('y1')},500)
        line_l.animate({y1: line_m.attr('y1'), y2: line_m.attr('y1')},500)
    }
    else if (data.atSort == true){
        wkpc_hand[0].animate({ cy: 690 }, 500, mina.easein)
        wkpc_hand[1].animate({ cy: 690 }, 500, mina.easein)

        gr_line.animate({opacity: 0.5}, 400)
        line_m.animate({y2: line_m.attr('y1')-115},500)
        line_c.animate({y1: line_c.attr('y1')-115, y2: line_c.attr('y2')-115},500)
        line_r.animate({y1: line_r.attr('y1')-115},500)
        line_l.animate({y1: line_l.attr('y1')-115},500)
    }
    else if (data.atPrevious == true){
        wkpc_hand[0].animate({ cy: 805 }, 500, mina.easein)
        wkpc_hand[1].animate({ cy: 805 }, 500, mina.easein)
        gr_line.animate({opacity: 1}, 250)
    }
})

handSocket.on('partAv', function(data){
    data ? wkpc_hand.animate({opacity: 1}, 500) : wkpc_hand.animate({opacity: 0}, 500)
})

handSocket.on('atFollow', function(data){
    if (data){
        wkpc_hand[0].animate({ cy: 630 }, 500, mina.easein)
        wkpc_hand[1].animate({ cy: 630 }, 500, mina.easein)
    
        line_m.animate({y2: line_m.attr('y1')},500, mina.easein)
        line_c.animate({y1: line_m.attr('y1'), y2: line_m.attr('y1')},500, mina.easein)
        line_r.animate({y1: line_m.attr('y1'), y2: line_m.attr('y1')},500, mina.easein)
        line_l.animate({y1: line_m.attr('y1'), y2: line_m.attr('y1')},500, mina.easein)
        gr_line.animate({opacity: 0}, 500)
    }  
})

handSocket.on('atSort', function(data){
    if (data){
        wkpc_hand[0].animate({ cy: 690 }, 500, mina.easein)
        wkpc_hand[1].animate({ cy: 690 }, 500, mina.easein)

        gr_line.animate({opacity: 1}, 500)
        line_m.animate({y2: 667},500, mina.easein)
        line_c.animate({y1: 667, y2: 667}, 500, mina.easein)
        line_r.animate({y1: 667, y2: 687}, 500, mina.easein)
        line_l.animate({y1: 667, y2: 687}, 500, mina.easein)
    }
})

handSocket.on('atPrevious', function(data){
    if (data){
        wkpc_hand[0].animate({ cy: 810 }, 500, mina.easein)
        wkpc_hand[1].animate({ cy: 810 }, 500, mina.easein)
        gr_line.animate({opacity: 1}, 500)

        line_m.animate({y2: 782},500, mina.easein)
        line_c.animate({y1: 782, y2: 782}, 500, mina.easein)
        line_r.animate({y1: 782, y2: 802}, 500, mina.easein)
        line_l.animate({y1: 782, y2: 802}, 500, mina.easein)
    }
})
handSocket.on('stationError', function(){
    gr_line.attr({stroke: 'red'})
})
handSocket.on('errorCleared', function(){
    gr_line.attr({stroke: 'black'})
})
handSocket.on('gripperDown', function(data){})
handSocket.on('gripperUp', function(data){})
handSocket.on('gripperOpen', (data) => {})
handSocket.on('colorCheck', function(data){})

//processing station
let text,
    mat = new Snap.Matrix(),
    inPosition;
    
procSocket.on('connect', function(){
    console.log('Processing station server is connected');
})

procSocket.on('disconnect', function(){
    console.log('Processing station server is disconnected');
    s.select('#proc').attr({
        stroke: '',
        strokeWidth: 0,
    })
})

procSocket.on('initialStatus', function(data) {
    if(!data.inPosition){   //rotary table is out of place. do something
        procSocket.emit('initialStatusError', 'Processing Station rotary table OUT OF PLACE');
        s.select('#proc').attr({
            stroke: 'red',
            strokeWidth: 3,
        })
    }
    else if(data.atTest){
        procSocket.emit('initialStatusError', 'Processing Station has an object at its testing station');
        s.select('#proc').attr({
            stroke: 'red',
            strokeWidth: 3,
        })
    }
    else if(data.atRub){
        procSocket.emit('initialStatusError', 'Processing Station has an object at its rubbing station');
        s.select('#proc').attr({
            stroke: 'red',
            strokeWidth: 3,
        })
    }
    else{
        s.select('#proc').attr({
            stroke: 'green',
            strokeWidth: 3,
        })
        procSocket.emit('success')
    }

    if (data.partAv && data.inPosition){
        wkpc_proc.animate({opacity: 1},2000)
    }
})
procSocket.on('rotate', function(data){})
procSocket.on('partAv', function(data){
    if(data) {
        wkpc_proc.stop()
        wkpc_proc.animate({opacity: 1},500)
    }
    else {
        wkpc_proc.stop()
        wkpc_proc.animate({opacity: 0},5000)
    }
})
procSocket.on('atRub', function(data){
    if (data) wkpc_proc[0].attr({stroke:'blue', strokeWidth:2})
    else wkpc_proc[0].attr({stroke:'', strokeWidth:0})
})
procSocket.on('atTest', function(data){
    if (data) plunger = s.select('#plun').animate({transform: new Snap.Matrix().translate(10,0)}, 100)
    else plunger = s.select('#plun').animate({transform: new Snap.Matrix().translate(0,0)}, 100)
})

procSocket.on('inPosition', function(data){
   if (data){
    bb = spinner.getBBox();
    mat.rotate(60, bb.cx, bb.cy)
    s.select("#spin").attr({ transform: mat })
   }
   
})
procSocket.on('testing', function(data){})
procSocket.on('wkpcOK', function(data){
    let textCoord = [wkpc_proc[0].attr('cx'), wkpc_proc[0].attr('cy')]
    if (data){
        text = s.text(textCoord[0], textCoord[1], 'OK').attr({
            stroke: 'blue',
            transform: new Snap.Matrix().translate(-55,85)
        })
    }

    setTimeout(function(){ 
        text.attr({visibility: 'hidden'})
    }, 300)
})



/////distributing station
let objToPick, vacuumOn, wkpc_dist;

distSocket.on('connect', function(){
    console.log('Distributing station server is connected');
})

distSocket.on('disconnect', function(){
    console.log('Distributing station server is disconnected');
    s.select('#dist').attr({
        stroke: '',
        strokeWidth: 0,
    })
})

distSocket.on('initialStatus', function(data) {
    if(data.magFrontPos){
        distSocket.emit('initialStatusError', 'Distributing Station piston is in extended position. Retract the piston.')
        s.select('#dist').attr({
            stroke: 'red',
            strokeWidth: 3,
        })
        return
    }
    else if(data.vacuum){
        distSocket.emit('initialStatusError', 'Distributing Station vacuum is switched on.')
        s.select('#dist').attr({
            stroke: 'red',
            strokeWidth: 3,
        })
        return
    }
    else {
        s.select('#dist').attr({
            stroke: 'green',
            strokeWidth: 3,
        })
        distSocket.emit('success')
    }

    if(data.armPutPos){
        swivel.attr({ //60 to test, -17 to distr
            transform: new Snap.Matrix().rotate(60, Number(knob.attr('cx')), Number(knob.attr('cy')))
        })
    }
    else if (data.armTakePos){
        swivel.attr({ //60 to test, -17 to distr
            transform: new Snap.Matrix().rotate(-17, Number(knob.attr('cx')), Number(knob.attr('cy')))
        })
    }
    else{
        swivel.attr({ //60 to test, -17 to distr
            transform: new Snap.Matrix().rotate(22, Number(knob.attr('cx')), Number(knob.attr('cy')))
        })
    }

    if (!data.noWkpcAv) wkpc_dist2 = wkpc_dist2.attr({opacity: 1})
})

distSocket.on('magEmpty', function(data){
    if(data) wkpc_dist2 = wkpc_dist2.attr({opacity: 0})
    else wkpc_dist2 = wkpc_dist2.attr({opacity: 1})
})

distSocket.on('pushCylFront', function(data){
    if (data) {
        wkpc_dist = makeWkpc(s, Number(pusherCasing.getBBox().x2) + 8, pusherCasing.getBBox().y2-12.5)
                    .attr({opacity: 1})

        wkpc_dist[0] = wkpc_dist[0].animate({cx: Number(wkpc_dist[0].attr('cx'))+125}, 100, mina.linear, ()=> {
            objToPick = true
        })
        wkpc_dist[1] = wkpc_dist[1].animate({cx: Number(wkpc_dist[0].attr('cx'))+125}, 100, mina.linear, ()=> {
            objToPick = true
        })
    }
})
let n =0;
distSocket.on('armTake', function(data){
    if (!data) {
        Snap.animate(-17, 10, function(step){
            swivel = swivel.attr({transform: new Snap.Matrix().rotate(step, cir.attr('cx'), cir.attr('cy'))})
            if (objToPick) wkpc_dist = wkpc_dist.attr({transform: new Snap.Matrix().rotate(step+17+27/35, cir.attr('cx'), cir.attr('cy'))})
        },350, mina.linear)
    }
    else {
        Snap.animate(10, -17, function(step){
            swivel = swivel.attr({transform: new Snap.Matrix().rotate(step, cir.attr('cx'), cir.attr('cy'))})
        },350, mina.linear)
    }  
})

distSocket.on('armPut', function(data){
    if (data){
        Snap.animate(10, 60, function(step){
            n++; 
            swivel = swivel.attr({transform: new Snap.Matrix().rotate(step, cir.attr('cx'), cir.attr('cy'))})
            wkpc_dist = wkpc_dist.attr({transform: new Snap.Matrix().rotate(step+17+33/18, cir.attr('cx'), cir.attr('cy'))})
        },350, mina.linear, () => {
            wkpc_dist.animate({opacity:0},500)
            wkpc_test2 = makeWkpc(s, Number(testCasing.getBBox().x) + 12.5, testCasing.getBBox().y - 10).animate({opacity:1}, 500)
        })
    }
    else {
        Snap.animate(60, 10, function(step){
            swivel = swivel.attr({transform: new Snap.Matrix().rotate(step, cir.attr('cx'), cir.attr('cy'))})
        },350, mina.linear)
    }
    
})

distSocket.on('pushCylBack', function(data){})

distSocket.on('vacuum', function(data){
    if (data) {
        vacuumOn = true
    }
    else {
        vacuumOn = false
    }
})


//testing station
let liftIsUp, wkpcAv;
let wkpc_test, wkpc_test2, heightOK;
let vacInterval;

testSocket.on('connect', function(){
    console.log('Testing station server is connected');
})

testSocket.on('disconnect', function(){
    console.log('Testing station server is disconnected');
    s.select('#test').attr({
        stroke: '',
        strokeWidth: 0,
    })
})

testSocket.on('initialStatus', function(data) {
    if (data.liftIsUp){
        testSocket.emit('initialStatusError', 'Testing Station lift is up. Send lift down.')
        s.select('#test').attr({
            stroke: 'red',
            strokeWidth: 3,
        })
        return
    }

    if (!data.pushCylIsBack){
        testSocket.emit('initialStatusError', 'Testing Station piston is extended. Retract the piston.')
        s.select('#test').attr({
            stroke: 'red',
            strokeWidth: 3,
        })
        return
    }

    testSocket.emit('success')
    s.select('#test').attr({
        stroke: 'green',
        strokeWidth: 3,
    })
})

testSocket.on('start', function(data){
    wkpcAv = true; //programming to the hardware problems
})

testSocket.on('liftIsUp', function(data) {
    if (data){
        liftIsUp = true;
        if (wkpc_dist){wkpc_dist.attr({opacity:0})} //already zero

    wkpc_test2[0] = wkpc_test2[0].animate({cy: Number(wkpc_test2[0].attr('cy'))-25}, 500, mina.linear)
    wkpc_test2[1] = wkpc_test2[1].animate({cy: Number(wkpc_test2[1].attr('cy'))-25}, 500, mina.linear)
    }
    else liftIsUp = false;
})

testSocket.on('liftIsDown', function(data) {
    if (!heightOK){
        wkpc_test2[0] = wkpc_test2[0].animate({cy: Number(wkpc_test2[0].attr('cy'))+25}, 500, mina.linear)
        wkpc_test2[1] = wkpc_test2[1].animate({cy: Number(wkpc_test2[1].attr('cy'))+25}, 500, mina.linear, ()=>{
            setTimeout(() => {wkpc_test2.animate({opacity: 0}, 1000)}, 3000)
        })
    }
})

testSocket.on('airSlide', function(data){
    if (data){
        vacInterval = setInterval(function(){
            vac1.animate({r: 8},300,mina.easein, () => {vac1.attr({r:1})})
            vac2.animate({r: 8},300,mina.easein, () => {vac2.attr({r:1})})
            vac3.animate({r: 8},300,mina.easein, () => {vac3.attr({r:1})})
            vac4.animate({r: 8},300,mina.easein, () => {vac4.attr({r:1})})
        },500)
    }
    else{
        clearInterval(vacInterval)
    }
})

testSocket.on('heightOK', function(data) {
    if (data) heightOK = data
    else setTimeout(() => {heightOK = data}, 4000)
})

testSocket.on('pushCylBack', function(data) {
    if (!data){
        setTimeout(() => wkpcAv = false, 1000)
        if (liftIsUp) {
            setTimeout(() => {
                wkpc_test2[0] = wkpc_test2[0].animate({cy: wkpc_test2[0].attr('cy')-170}, 500, mina.linear, function(){
                    wkpc_test2[0].animate({opacity: 0}, 1000, mina.easein)
                })
                wkpc_test2[1] = wkpc_test2[1].animate({cy: wkpc_test2[1].attr('cy')-170}, 500, mina.linear, function(){
                    wkpc_test2[1].animate({opacity: 0}, 1000, mina.easein)
                })
            }, 1000);
        }
    }
})

//storing station
let storeMode, retrieveMode;

storSocket.on('connect', function(){
    console.log('Storing station server is connected');
})

storSocket.on('disconnect', function(){
    console.log('Storing station server is disconnected');
    s.select('#stor').attr({
        stroke: '',
        strokeWidth: 0,
    })
})

storSocket.on('initialStatus', function(data) {
    if (!data.linearComplete){
        storSocket.emit('initialStatusError', 'Check input linearComplete')
        return
    }
    if (!data.rotaryComplete){
        storSocket.emit('initialStatusError', 'Check input rotaryComplete')
        return
    }

    s.select('#stor').attr({
        stroke: 'green',
        strokeWidth: 3,
    })
    storSocket.emit('success')
})

storSocket.on('color', function(data){
    pc = makeWkpc2(s, pickP.attr('cx'), pickP.attr('cy'), data).attr({opacity:1})
    storeMode = true;
    retrieveMode = false;
})

storSocket.on('placed', function(data){
    storeMode = false
    retrieveMode = false;
    if (data.color=='black'){
        if(data.num==1) bla1.animate({opacity:1},1000)
        else if(data.num==2) bla2.animate({opacity:1},1000)
        else if(data.num==3) bla3.animate({opacity:1},1000)
        else if(data.num==4) bla4.animate({opacity:1},1000)
        else if(data.num==5) bla5.animate({opacity:1},1000)
        else if(data.num==6) bla6.animate({opacity:1},1000)
    }
    else if(data.color=='red'){
        if(data.num==1) red1.animate({opacity:1},1000)
        else if(data.num==2) red2.animate({opacity:1},1000)
        else if(data.num==3) red3.animate({opacity:1},1000)
        else if(data.num==4) red4.animate({opacity:1},1000)
        else if(data.num==5) red5.animate({opacity:1},1000)
        else if(data.num==6) red6.animate({opacity:1},1000)
    }
    else if(data.color=='silver'){
        if(data.num==1) sil1.animate({opacity:1},1000)
        else if(data.num==2) sil2.animate({opacity:1},1000)
        else if(data.num==3) sil3.animate({opacity:1},1000)
        else if(data.num==4) sil4.animate({opacity:1},1000)
        else if(data.num==5) sil5.animate({opacity:1},1000)
        else if(data.num==6) sil6.animate({opacity:1},1000)
    }
})

storSocket.on('removeRed', function(data){
    storeMode = false;
    retrieveMode = true; 
    if (data.num==1) {
        red1.animate({opacity:0},1000)
        coord = findCoords(30,cp[0],cp[1])
        pc = makeWkpc2(s, coord[0], coord[1],'red').animate({opacity:1},800)
    }
    else if(data.num==2) {
        red2.animate({opacity:0},1000)
        coord = findCoords(18,cp[0],cp[1])
        pc = makeWkpc2(s, coord[0], coord[1],'red').animate({opacity:1},800)
    }
    else if(data.num==3) {
        red3.animate({opacity:0},1000)
        coord = findCoords(6,cp[0],cp[1])
        pc = makeWkpc2(s, coord[0], coord[1],'red').animate({opacity:1},800)
    }
    else if(data.num==4) {
        red4.animate({opacity:0},1000)
        coord = findCoords(-6,cp[0],cp[1])
        pc = makeWkpc2(s, coord[0], coord[1],'red').animate({opacity:1},800)}
    else if(data.num==5) {
        red5.animate({opacity:0},1000)
        coord = findCoords(-18,cp[0],cp[1])
        pc = makeWkpc2(s, coord[0], coord[1],'red').animate({opacity:1},800)
}
    else if(data.num==6) {
        red6.animate({opacity:0},1000)
        coord = findCoords(-30,cp[0],cp[1])
        pc = makeWkpc2(s, coord[0], coord[1],'red').animate({opacity:1},800)}
})

let coords, pc;
storSocket.on('removeBlack', function(data){
    storeMode = false;
    retrieveMode = true; 
    if (data.num==1) {
        bla1.animate({opacity:0},1000)
        coord = findCoords(30,cp[0],cp[1])
        pc = makeWkpc2(s, coord[0], coord[1],'black').animate({opacity:1},800)
    }
    else if(data.num==2) {
        bla2.animate({opacity:0},1000)
        coord = findCoords(18,cp[0],cp[1])
        pc = makeWkpc2(s, coord[0], coord[1],'black').animate({opacity:1},800)
    }
    else if(data.num==3) {
        bla3.animate({opacity:0},1000)
        coord = findCoords(6,cp[0],cp[1])
        pc = makeWkpc2(s, coord[0], coord[1],'black').animate({opacity:1},800)
    }
    else if(data.num==4) {
        bla4.animate({opacity:0},1000)
        coord = findCoords(-6,cp[0],cp[1])
        pc = makeWkpc2(s, coord[0], coord[1],'black').animate({opacity:1},800)
    }
    else if(data.num==5) {
        bla5.animate({opacity:0},1000)
        coord = findCoords(-18,cp[0],cp[1])
        pc = makeWkpc2(s, coord[0], coord[1],'black').animate({opacity:1},800)
    }
    else if(data.num==6) {
        bla6.animate({opacity:0},1000)
        coord = findCoords(-30,cp[0],cp[1])
        pc = makeWkpc2(s, coord[0], coord[1],'black').animate({opacity:1},800)
    }
})

storSocket.on('removeSilver', function(data){// do retrieve anime here
    storeMode = false;
    retrieveMode = true;

    if (data.num==1) {
        sil1.animate({opacity:0},1000)
        coord = findCoords(30,cp[0],cp[1])
        pc = makeWkpc2(s, coord[0], coord[1],'white').animate({opacity:1},800)
    }
    else if(data.num==2) {
        sil2.animate({opacity:0},1000)
        coord = findCoords(18,cp[0],cp[1])
        pc = makeWkpc2(s, coord[0], coord[1],'white').animate({opacity:1},800)
}
    else if(data.num==3) {
        sil3.animate({opacity:0},1000)
        coord = findCoords(6,cp[0],cp[1])
        pc = makeWkpc2(s, coord[0], coord[1],'white').animate({opacity:1},800)
    }
    else if(data.num==4) {
        sil4.animate({opacity:0},1000)
        coord = findCoords(-6,cp[0],cp[1])
        pc = makeWkpc2(s, coord[0], coord[1],'white').animate({opacity:1},800)}
    else if(data.num==5) {
        sil5.animate({opacity:0},1000)
        coord = findCoords(-18,cp[0],cp[1])
        pc = makeWkpc2(s, coord[0], coord[1],'white').animate({opacity:1},800)
    }
    else if(data.num==6) {
        sil6.animate({opacity:0},1000)
        coord = findCoords(-30,cp[0],cp[1])
        pc = makeWkpc2(s, coord[0], coord[1],'white').animate({opacity:1},800)
    } 
})

let toPos,  fromPos2=7;
storSocket.on('rotate', function(data){

    if(data.bit0 && data.bit1 && data.bit2) {
        toPos=0
        rotateGroup(gripper_s,fromPos2, toPos)
    }
    else if(!data.bit0 && !data.bit1 && !data.bit2) {
        toPos=1
        rotateGroup(gripper_s,fromPos2, toPos)
    }
    else if(data.bit0 && !data.bit1 && !data.bit2) {
        toPos=2
        rotateGroup(gripper_s,fromPos2, toPos)
    }
    else if(!data.bit0 && data.bit1 && !data.bit2) {
        toPos=3
        rotateGroup(gripper_s,fromPos2, toPos)
    }
    else if(data.bit0 && data.bit1 && !data.bit2) {
        toPos=4
        rotateGroup(gripper_s,fromPos2, toPos)
    }
    else if(!data.bit0 && !data.bit1 && data.bit2) {
        toPos=5
        rotateGroup(gripper_s,fromPos2, toPos)
    }
    else if(data.bit0 && !data.bit1 && data.bit2) {
        toPos=6
        rotateGroup(gripper_s,fromPos2, toPos)
    }
    else if(!data.bit0 && data.bit1 && data.bit2) { //holder position
        toPos=7
        rotateGroup(gripper_s,fromPos2, toPos)
    }
})