//in the browser
let socket = io();
socket.on('connect', () => console.log('main server is connected'))

let handSocket2 = io('/handling')
let distSocket = io('/distributing'),
    procSocket = io('/processing'),
    testSocket = io('/testing'),
    storSocket = io('/storing');

// handling station

handSocket2.on('initialStatus', function(data) {
    //set initial status of the GUI
    console.log('hand socket initial status:', data)
    /*if (data.atFollow == true) {
        handler.animate({ height: 5 }, 1500, mina.easein)
    }
    else if(data.atSort == true){
        handler.animate({ height: 65 }, 1500, mina.easein)
    }
    else if(data.atPrevious == true){
        handler.animate({ height: 183 }, 1500, mina.easein)
    }
    else {
        //THE STATION IS IN AN ERROR STATE
    }*/
})

handSocket2.on('partAv', function(data){
    console.log('partAv');
})
handSocket2.on('atPrevious', function(data){
    data ? handler.animate({ height: 183 }, 500, mina.easein) : null
    console.log('atPrevius');
})
handSocket2.on('atFollow', function(data){
    data ? handler.animate({ height: 5 }, 500, mina.easein) : null
    console.log('atFollow');
})
handSocket2.on('atSort', function(data){
    data ? handler.animate({ height: 65 }, 500, mina.easein) : null
    console.log('atSort');
})
handSocket2.on('gripperDown', function(data){
    console.log('gripperDown');
})
handSocket2.on('gripperUp', function(data){
    console.log('gripperUp');
})
handSocket2.on('gripperOpen', (data) => {
    console.log('gripperOPPem');
})

/////
distSocket.on('initialStatus', function(data) {
    //set initial status of the GUI
    console.log('dist socket initial status:', data)
})

testSocket.on('initialStatus', function(data) {
    //set initial status of the GUI
    console.log('test socket initial status:', data)
})

procSocket.on('initialStatus', function(data) {
    //set initial status of the GUI
    console.log('proc socket initial status:', data)
})