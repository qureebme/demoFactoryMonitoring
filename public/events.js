//in the browser
let socket = io();
socket.on('connect', () => console.log('main server is connected'))

let handSocket = io.connect('/handling')
let distSocket = io.connect('/distributing'),
    procSocket = io.connect('/processing'),
    testSocket = io.connect('/testing'),
    storSocket = io.connect('/storing');


//processing station
let inter,
    mat = new Snap.Matrix()
    //bb = spinner.getBBox();
    console.log('matrix:', mat)
    //console.log('bb:', bb.cx, bb.cy)
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
    //set initial status of the GUI
    console.log('proc socket initial status:', data)
    if(!data.inPosition){   //rotary table is out of place. do something
        procSocket.emit('initialStatusError', 'Processing Station rotary table OUT OF PLACE');
        s.select('#proc').attr({
            stroke: 'red',
            strokeWidth: 3,
        })
    }
    else if(data.atTest){
        //remove something from the test station
        //emit sth and then exit the process
        procSocket.emit('initialStatusError', 'Processing Station has an object at the testing station');
        s.select('#proc').attr({
            stroke: 'red',
            strokeWidth: 3,
        })
    }
    else if(data.atRub){
        //remove something from the rubbing station
        //emit sth and then exit the process
        procSocket.emit('initialStatusError', 'Processing Station has an object at the rubbing station');
        s.select('#proc').attr({
            stroke: 'red',
            strokeWidth: 3,
        })
    }
    else if(data.inPosition && !data.partAv){
        //expecting a wkpc
        //emit sth bt don't exit the process
    }
    else{
        //EVERYTHING OKAY. draw green bbox
        s.select('#proc').attr({
            stroke: 'green',
            strokeWidth: 3,
        })
    }
})
procSocket.on('rotate', function(data){
    console.log('rotate', data)
})
procSocket.on('partAv', function(data){
    //console.log('part av', data)
})
procSocket.on('atRub', function(data){
    //console.log('at Rub', data)
})
procSocket.on('atTest', function(data){
    //console.log('at test', data)
})
procSocket.on('rubIsUp', function(data){
    //console.log('rub up', data)
})
procSocket.on('rubIsDown', function(data){
    //console.log('rub down', data)
})
procSocket.on('inPosition', function(data){
    console.log('rot pos', data)
   
   if (data){   //works
    bb = spinner.getBBox();
    mat.rotate(60, bb.cx, bb.cy)
    spinner = s.select("#spin").attr({ transform: mat }) //fallback
   }
   
})
procSocket.on('wkpcOK', function(data){
    //console.log('workOK', data)
})
//for the handling station                  //DONE
/*
let wkpcAv = false,
    atPreviousTracker = false,
    atFollowTracker = false,
    atSortTracker = false;
*/
/*
handSocket.on('initialStatus', function(data) {
    //set initial status of the GUI
    console.log('hand socket initial status:', data)
    //console.log('wkpc: ', wkpc.attr('cy'))
    if (data.atFollow == true) {
        handler.animate({ height: 5 }, 500, mina.easein)
        wkpc.animate({ cy: 630 }, 500, mina.easein) //630

        gr_line.animate({opacity: 0}, 500)
        //then animate the xy vals
        line_m.animate({y2: line_m.attr('y1')},2000) //630
        line_c.animate({y1: line_m.attr('y1'), y2: line_m.attr('y1')},500)
        line_r.animate({y1: line_m.attr('y1'), y2: line_m.attr('y1')},500)
        line_l.animate({y1: line_m.attr('y1'), y2: line_m.attr('y1')},500)
    }
    else if (data.atSort == true){
        handler.animate({ height: 65 }, 500, mina.easein)
        wkpc.animate({ cy: 760 }, 500, mina.easein)
        //set gr_line props as suitable. changing the y atrrs
        gr_line.animate({opacity: 0.5}, 400)
        //then animate the xy vals ..p2s= 118
        line_m.animate({y2: line_m.attr('y1')-115},500) //630
        line_c.animate({y1: line_c.attr('y1')-115, y2: line_c.attr('y2')-115},500)
        line_r.animate({y1: line_r.attr('y1')-115},500)
        line_l.animate({y1: line_l.attr('y1')-115},500)
    }
    else if (data.atPrevious == true){
        handler.animate({ height: 183 }, 500, mina.easein)
        wkpc.animate({ cy: 805 }, 500, mina.easein) //805
        gr_line.animate({opacity: 1}, 250) // starting xy vals
    }
    else {
        //THE STATION IS IN AN ERROR STATE
    }
})

handSocket.on('partAv', function(data){
    console.log('partAv:                        ', data);
    //wkpcAv = data;
    //let statn emit partAv after it has done the color check, and in both directions of the handler
    data ? wkpc.attr({visibility:'visible'}) : wkpc.attr({visibility:'hidden'})
    //data ? wkpc.atrr({opacity: 0}).animate({opacity:1}, 200) : wkpc.animate({opacity:0}, 200) //for later
})

handSocket.on('atFollow', function(data){
    //console.log('atFollow');
    //atFollowTracker = data ? true : false // Boolean(data)
    data ? handler.animate({ height: 5 }, 500, mina.easein) : null //ok
    wkpc.animate({ cy: 630 }, 500, mina.easein) //ok
    /////////////////////////////////////////
    line_m.animate({y2: line_m.attr('y1')},500, mina.easein)
    line_c.animate({y1: line_m.attr('y1'), y2: line_m.attr('y1')},500, mina.easein)
    line_r.animate({y1: line_m.attr('y1'), y2: line_m.attr('y1')},500, mina.easein)
    line_l.animate({y1: line_m.attr('y1'), y2: line_m.attr('y1')},500, mina.easein)
    gr_line.animate({opacity: 0}, 500)
    ////////////////////////////////////////
     // use a global var to track wkpc availability
})
handSocket.on('atSort', function(data){
    //console.log('atSort');
    //atSortTracker = data ? true : false
    data ? handler.animate({ height: 65 }, 500, mina.easein) : null //ok
    wkpc.animate({ cy: 690 }, 500, mina.easein) //ok
    // animate y props to 
    gr_line.animate({opacity: 1}, 500)

    line_m.animate({y2: 667},500, mina.easein) /////////////////
    line_c.animate({y1: 667, y2: 667}, 500, mina.easein)
    line_r.animate({y1: 667, y2: 687}, 500, mina.easein)
    line_l.animate({y1: 667, y2: 687}, 500, mina.easein)

     // use a global var to track wkpc availability
})
handSocket.on('atPrevious', function(data){
    //console.log('atPrevious');
    //atPreviousTracker = data ? true : false
    data ? handler.animate({ height: 183 }, 500, mina.easein) : null //ok
    wkpc.animate({ cy: 805 }, 500, mina.easein) //ok
    // animate y props to 0
    gr_line.animate({opacity: 1}, 500)

    line_m.animate({y2: 782},500, mina.easein) /////////////////
    line_c.animate({y1: 782, y2: 782}, 500, mina.easein)
    line_r.animate({y1: 782, y2: 802}, 500, mina.easein)
    line_l.animate({y1: 782, y2: 802}, 500, mina.easein)

    

    // use a global var to track wkpc availability
})

handSocket.on('gripperDown', function(data){ //no need
    console.log('gripperDown', data);

})
handSocket.on('gripperUp', function(data){ //no need
    console.log('gripperUp', data);

})

handSocket.on('gripperOpen', (data) => { //no need
    console.log('gripperOpen', data);
})
handSocket.on('colorCheck', function(data){ // work this out
    //set workpiece color
    var colorToken = data ? 'black' : 'green'
    //wkpc.attr({fill : colorToken})
})
*/
/*
/////distributing station
distSocket.on('initialStatus', function(data) {
    //set initial status of the GUI
    console.log('dist socket initial status:', data)
})
distSocket.on('magEmpty', function(data){
    console.log('magempty', data)
})
distSocket.on('armPut', function(data){
    console.log('armput',data)
})
distSocket.on('armTake', function(data){
    console.log('armtake', data)
})
distSocket.on('pushCylFront', function(data){
    console.log('pushCylF', data)
})
distSocket.on('pushCylBack', function(data){
    console.log('pushCylBack', data)
});


//testing station
testSocket.on('initialStatus', function(data) {
    console.log('test socket initial status:', data)
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


*/