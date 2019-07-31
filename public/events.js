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
})
handSocket2.on('partAv', function(data){})
handSocket2.on('atPrevious', function(data){})
handSocket2.on('atFollow', function(data){})
handSocket2.on('atSort', function(data){})
handSocket2.on('gripperDown', function(data){})
handSocket2.on('gripperUp', function(data){})
handSocket2.on('gripperOpen', (data) => {})