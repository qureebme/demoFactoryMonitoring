//in the browser
let socket = io();
socket.on('connect', () => console.log('main server is connected'))

let distSocket = io.connect('/distributing'),
    handSocket = io.connect('/handling'),
    procSocket = io.connect('/processing'),
    testSocket = io.connect('/testing'),
    storSocket = io.connect('/storing');

//for the handling station                  //DONE
//connect
handSocket.on('connect', function(){
    console.log('Handling station server is connected');
})
//disconnect
handSocket.on('disconnect', function(){
    console.log('Handling station server is disconnected');
    s.select('#hand').attr({
        stroke: '',
        strokeWidth: 0,
    })
})
//initial status
handSocket.on('initialStatus', function(data) {
    //set initial status of the GUI
    console.log('hand socket initial status:', data)

    if(!data.atFollow && !data.atSort && !data.atPrevious){
        handSocket.emit('initialStatusError', 'Handling Station has has wrong configuration');
        s.select('#hand').attr({
            stroke: 'red',
            strokeWidth: 3,
        })
        handSocket.emit('failure')
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
        //then animate the xy vals
        line_m.animate({y2: line_m.attr('y1')},2000) //630
        line_c.animate({y1: line_m.attr('y1'), y2: line_m.attr('y1')},500)
        line_r.animate({y1: line_m.attr('y1'), y2: line_m.attr('y1')},500)
        line_l.animate({y1: line_m.attr('y1'), y2: line_m.attr('y1')},500)
    }
    else if (data.atSort == true){
        wkpc_hand[0].animate({ cy: 690 }, 500, mina.easein)
        wkpc_hand[1].animate({ cy: 690 }, 500, mina.easein)

        //set gr_line props as suitable. changing the y atrrs
        gr_line.animate({opacity: 0.5}, 400)
        //then animate the xy vals ..p2s= 118
        line_m.animate({y2: line_m.attr('y1')-115},500) //630
        line_c.animate({y1: line_c.attr('y1')-115, y2: line_c.attr('y2')-115},500)
        line_r.animate({y1: line_r.attr('y1')-115},500)
        line_l.animate({y1: line_l.attr('y1')-115},500)
    }
    else if (data.atPrevious == true){

        wkpc_hand[0].animate({ cy: 805 }, 500, mina.easein)
        wkpc_hand[1].animate({ cy: 805 }, 500, mina.easein)
        gr_line.animate({opacity: 1}, 250) // starting xy vals
    }
})

handSocket.on('partAv', function(data){
    //console.log('partAv:                        ', data);
    data ? wkpc_hand.animate({opacity: 1}, 500) : wkpc_hand.animate({opacity: 0}, 500)
})

handSocket.on('atFollow', function(data){

    wkpc_hand[0].animate({ cy: 630 }, 500, mina.easein)
    wkpc_hand[1].animate({ cy: 630 }, 500, mina.easein)
    /////////////////////////////////////////
    line_m.animate({y2: line_m.attr('y1')},500, mina.easein)
    line_c.animate({y1: line_m.attr('y1'), y2: line_m.attr('y1')},500, mina.easein)
    line_r.animate({y1: line_m.attr('y1'), y2: line_m.attr('y1')},500, mina.easein)
    line_l.animate({y1: line_m.attr('y1'), y2: line_m.attr('y1')},500, mina.easein)
    gr_line.animate({opacity: 0}, 500)
})

handSocket.on('atSort', function(data){

    wkpc_hand[0].animate({ cy: 690 }, 500, mina.easein)
    wkpc_hand[1].animate({ cy: 690 }, 500, mina.easein)
    // animate y props to 
    gr_line.animate({opacity: 1}, 500)

    line_m.animate({y2: 667},500, mina.easein) /////////////////
    line_c.animate({y1: 667, y2: 667}, 500, mina.easein)
    line_r.animate({y1: 667, y2: 687}, 500, mina.easein)
    line_l.animate({y1: 667, y2: 687}, 500, mina.easein)
})

handSocket.on('atPrevious', function(data){

    wkpc_hand[0].animate({ cy: 805 }, 500, mina.easein)
    wkpc_hand[1].animate({ cy: 805 }, 500, mina.easein)
    // animate y props to 0
    gr_line.animate({opacity: 1}, 500)

    line_m.animate({y2: 782},500, mina.easein) /////////////////
    line_c.animate({y1: 782, y2: 782}, 500, mina.easein)
    line_r.animate({y1: 782, y2: 802}, 500, mina.easein)
    line_l.animate({y1: 782, y2: 802}, 500, mina.easein)
})

handSocket.on('gripperDown', function(data){ //no need
    //console.log('gripperDown', data);
})
handSocket.on('gripperUp', function(data){ //no need
    //console.log('gripperUp', data);
})

handSocket.on('gripperOpen', (data) => { //no need
    //console.log('gripperOpen', data);
})

handSocket.on('colorCheck', function(data){ // work this out
    //set workpiece color
    var colorToken = data ? 'black' : 'blue'
    //wkpc.attr({fill : colorToken})
})


//processing station

let text,
    mat = new Snap.Matrix();
    
    //console.log('matrix:', mat)
    //console.log('bb:', bb.cx, bb.cy)
//connect
procSocket.on('connect', function(){
    console.log('Processing station server is connected');
})
//disconnect
procSocket.on('disconnect', function(){
    console.log('Processing station server is disconnected');
    s.select('#proc').attr({
        stroke: '',
        strokeWidth: 0,
    })
})
//initial status
procSocket.on('initialStatus', function(data) {
    //set initial status of the GUI
    console.log('proc socket initial status:', data)
    if(!data.inPosition){   //rotary table is out of place. do something
        procSocket.emit('initialStatusError', 'Processing Station rotary table OUT OF PLACE');
        s.select('#proc').attr({
            stroke: 'red',
            strokeWidth: 3,
        })
        //procSocket.emit('failure')
    }
    else if(data.atTest){
        procSocket.emit('initialStatusError', 'Processing Station has an object at its testing station');
        s.select('#proc').attr({
            stroke: 'red',
            strokeWidth: 3,
        })
        //procSocket.emit('failure')
    }
    else if(data.atRub){
        procSocket.emit('initialStatusError', 'Processing Station has an object at its rubbing station');
        s.select('#proc').attr({
            stroke: 'red',
            strokeWidth: 3,
        })
        //procSocket.emit('failure')
    }
    else{
        //EVERYTHING OKAY. draw green bbox
        s.select('#proc').attr({
            stroke: 'green',
            strokeWidth: 3,
        })
        procSocket.emit('success')
    }
})
procSocket.on('rotate', function(data){
    //console.log('rotate', data)
})
procSocket.on('partAv', function(data){
    //
     //* keep just to show an example tricky issue.
     //* Comment body out when running
     //
    console.log('part av', data)
    if(data) wkpc_proc.attr({visibility: 'visible'})
    else wkpc_proc.attr({visibility: 'hidden'})
})
procSocket.on('atRub', function(data){
    //console.log('at Rub', data)
    //briefly increase wkpc outer strke width
})
procSocket.on('atTest', function(data){
    //console.log('at test', data)
    if (data) plunger = s.select('#plun').animate({transform: new Snap.Matrix().translate(10,0)}, 100)
    else plunger = s.select('#plun').animate({transform: new Snap.Matrix().translate(-10,0)}, 100)
})
procSocket.on('rubIsUp', function(data){
    //console.log('rub up', data)
})
procSocket.on('rubIsDown', function(data){
    //console.log('rub down', data)
})
procSocket.on('inPosition', function(data){
    console.log('rot pos', data)
   
   if (data){
    bb = spinner.getBBox();
    mat.rotate(60, bb.cx, bb.cy)
    s.select("#spin").attr({ transform: mat }) //fallback
   }
   
})
procSocket.on('testing', function(data){
    
})
procSocket.on('wkpcOK', function(data){
    console.log('workOK', data)
    let textCoord = [wkpc_proc.attr('cx'), wkpc_proc.attr('cy')]
    if (data){
        text = s.text(textCoord[0], textCoord[1], 'OK').attr({
            stroke: 'green',
            transform: new Snap.Matrix().translate(-55,85)
        })
    }

    setTimeout(function(){ 
        text.attr({visibility: 'hidden'})
    }, 500)
})



/////distributing station
let objInMag, objToPick;
//connect
distSocket.on('connect', function(){
    console.log('Distributing station server is connected');
})

//disconnect
distSocket.on('disconnect', function(){
    console.log('Distributing station server is disconnected');
    s.select('#dist').attr({
        stroke: '',
        strokeWidth: 0,
    })
})

distSocket.on('initialStatus', function(data) {
    //set initial status of the GUI
    console.log('dist socket initial status:', data)

    if(data.magFrontPos){
        //red
        distSocket.emit('initialStatusError', 'Distributing Station piston is in extended position. Retract the piston.')
        s.select('#dist').attr({
            stroke: 'red',
            strokeWidth: 3,
        })
        //distSocket.emit('failure')
        return
    }
    else if(data.vacuum){
        //red
        distSocket.emit('initialStatusError', 'Distributing Station vacuum is switched on.')
        s.select('#dist').attr({
            stroke: 'red',
            strokeWidth: 3,
        })
        //distSocket.emit('failure')
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

distSocket.on('magEmpty', function(data){ //okay
    console.log('magempty', data)
    if(data) wkpc_dist2 = wkpc_dist2.attr({opacity: 0})
    else wkpc_dist2 = wkpc_dist2.attr({opacity: 1})
})

distSocket.on('armPut', function(data){
    //console.log('armput',data)
    if (!objToPick){ //okay
        swivel = swivel.attr({transform: new Snap.Matrix().rotate(60, Number(knob.attr('cx')), Number(knob.attr('cy')))})
    }
    else{
        // move swivel
        swivel = swivel.attr({transform: new Snap.Matrix().rotate(60, Number(knob.attr('cx')), Number(knob.attr('cy')))})
        
        // and objtopick
        
        swivel = swivel.attr({transform: new Snap.Matrix().rotate(60, Number(knob.attr('cx')), Number(knob.attr('cy')))})
        wkpc_dist[0] = wkpc_dist[0].attr({transform: new Snap.Matrix().rotate(60, Number(knob.attr('cx')), Number(knob.attr('cy')))})
        wkpc_dist[1] = wkpc_dist[1].attr({transform: new Snap.Matrix().rotate(60, Number(knob.attr('cx')), Number(knob.attr('cy')))})
        
       //assign wkpc dist to wkpc_test????
        //objToPick = false;
    }
    
})
distSocket.on('armTake', function(data){ //okay
    //console.log('armtake', data)
    swivel = swivel.attr({transform: new Snap.Matrix().rotate(-17, Number(knob.attr('cx')), Number(knob.attr('cy')))})
})
distSocket.on('pushCylFront', function(data){ //okay
    //console.log('pushCylF', data)
    if (data) {
        wkpc_dist = makeWkpc(s, Number(pusherCasing.getBBox().x2) + 8, pusherCasing.getBBox().y2-12.5)
                    .attr({opacity: 1})
        //wkpc_dist.animate({cx: Number(wkpc_dist[0].attr('cx'))+125}, 100, mina.linear, ()=> {objToPick = true})
        wkpc_dist[0] = wkpc_dist[0].animate({cx: Number(wkpc_dist[0].attr('cx'))+125}, 100, mina.linear, ()=> {objToPick = true})
        wkpc_dist[1] = wkpc_dist[1].animate({cx: Number(wkpc_dist[0].attr('cx'))+125}, 100, mina.linear, ()=> {objToPick = true})
    }
})
distSocket.on('pushCylBack', function(data){
    //console.log('pushCylBack', data)
    
});


//testing station
//connect
testSocket.on('connect', function(){
    console.log('Testing station server is connected');
})

//disconnect
testSocket.on('disconnect', function(){
    console.log('Testing station server is disconnected');
    s.select('#test').attr({
        stroke: '',
        strokeWidth: 0,
    })
})

testSocket.on('initialStatus', function(data) {
    console.log('test socket initial status:', data)

    if (data.liftIsUp){
        testSocket.emit('initialStatusError', 'Testing Station lift is up. Send lift down.')
        s.select('#test').attr({
            stroke: 'red',
            strokeWidth: 3,
        })
        //testSocket.emit('failure')
        return
    }

    if (!data.pushCylIsBack){
        testSocket.emit('initialStatusError', 'Testing Station piston is extended. Retract the piston.')
        s.select('#test').attr({
            stroke: 'red',
            strokeWidth: 3,
        })
        //testSocket.emit('failure')
        return
    }

    testSocket.emit('success')
    s.select('#test').attr({
        stroke: 'green',
        strokeWidth: 3,
    })
})

testSocket.on('liftIsDown', function(data) {
        console.log('lift is down', data)
})
testSocket.on('liftIsUp', function(data) {
    console.log('lift is up', data)
})
testSocket .on('heightOK', function(data) {
    console.log('height ok', data)
})
testSocket.on('partAv', function(data) {
    console.log('part av', data)
})
testSocket.on('pushCylBack', function(data) {
    console.log('push Cyl back', data)
})


//storing station
//connect
storSocket.on('connect', function(){
    console.log('Storing station server is connected');
})

//disconnect
storSocket.on('disconnect', function(){
    console.log('Storing station server is disconnected');
    s.select('#stor').attr({
        stroke: '',
        strokeWidth: 0,
    })
})

storSocket.on('initialStatus', function(data) {
    console.log('stor socket initial status:', data)
})