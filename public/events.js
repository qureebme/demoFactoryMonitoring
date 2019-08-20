//in the browser
let socket = io();
socket.on('connect', () => console.log('main server is connected'))

let handSocket = io('/handling')
let distSocket = io('/distributing'),
    procSocket = io('/processing'),
    testSocket = io('/testing'),
    storSocket = io('/storing');

//for the handling station
let wkpcAv = false,
    atPreviousTracker = false,
    atFollowTracker = false,
    atSortTracker = false;

handSocket.on('initialStatus', function(data) {
    //set initial status of the GUI
    console.log('hand socket initial status:', data)
    if (data.atFollow == true) {
        handler.animate({ height: 5 }, 500, mina.easein)
        wkpc.animate({ cy: 567 }, 500, mina.easein)
    }
    else if(data.atSort == true){
        handler.animate({ height: 65 }, 500, mina.easein)
        wkpc.animate({ cy: 627 }, 500, mina.easein)
    }
    else if(data.atPrevious == true){
        handler.animate({ height: 183 }, 500, mina.easein)
        wkpc.animate({ cy: 805 }, 500, mina.easein)
    }
    else {
        //THE STATION IS IN AN ERROR STATE
    }
})

handSocket.on('partAv', function(data){
    console.log('partAv');
    wkpcAv = data ? true : false;
    //let statn emit partAv after it has done the color check, and in both directions of the handler
    data ? wkpc.attr({visibility:'visible'}) : wkpc.attr({visibility:'hidden'})
})
handSocket.on('atPrevious', function(data){
    console.log('atPrevious');
    atPreviousTracker = data ? true : false
    data ? handler.animate({ height: 183 }, 500, mina.easein) : null
    wkpcAv ? wkpc.animate({ cy: 805 }, 500, mina.easein) : null

    // use a global var to track wkpc availability
})
handSocket.on('atFollow', function(data){
    console.log('atFollow');
    atFollowTracker = data ? true : false // Boolean(data)
    data ? handler.animate({ height: 5 }, 500, mina.easein) : null
    wkpcAv ? wkpc.animate({ cy: 567 }, 500, mina.easein) : null

     // use a global var to track wkpc availability
})
handSocket.on('atSort', function(data){
    console.log('atSort');
    atSortTracker = data ? true : false
    data ? handler.animate({ height: 65 }, 500, mina.easein) : null
    wkpcAv ? wkpc.animate({ cy: 627 }, 500, mina.easein) : null

     // use a global var to track wkpc availability
})
handSocket.on('gripperDown', function(data){
    console.log('gripperDown', data);
    if (atPreviousTracker){}
    else if(atFollowTracker){}
    else if (atSortTracker){}
})
handSocket.on('gripperUp', function(data){
    console.log('gripperUp', data);
    if (atPreviousTracker){}
    else if(atFollowTracker){}
    else if (atSortTracker){}
})
handSocket.on('gripperOpen', (data) => {
    console.log('gripperOpen', data);
})
handSocket.on('colorCheck', function(data){
    //set workpiece color
    var colorToken = data ? 'black' : 'green'
    wkpc.attr({fill : colorToken})
})

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

//processing station
procSocket.on('initialStatus', function(data) {
    //set initial status of the GUI
    console.log('proc socket initial status:', data)
})
procSocket.on('rotate', function(data){
    console.log('rotate', data)
})
procSocket.on('partAv', function(data){
    console.log('part av', data)
})
procSocket.on('workRub', function(data){
    console.log('workRub', data)
})
procSocket.on('workTest', function(data){
    console.log('work test', data)
})
procSocket.on('rubUp', function(data){
    console.log('rub up', data)
})
procSocket.on('rubDown', function(data){
    console.log('rub down', data)
})
procSocket.on('rotPos', function(data){
    console.log('rot pos', data)
})
procSocket.on('workOK', function(data){
    console.log('workOK', data)
})