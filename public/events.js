let socket = io();
socket.on('connect', () => console.log('main server, client side'))
let handSocket = io('/handling')
let distSocket = io('/distributing'),
    procSocket = io('/processing'),
    testSocket = io('/testing'),
    storSocket = io('/storing');

// handling station
handSocket.on('connect', () => {
    console.log('handsocket, client side')
    //console.log(s)
})
handSocket.on('partAvE', function(){})
handSocket.on('atPreviousE', function(){})
handSocket.on('atFollowE', function(){})
handSocket.on('atSortE', function(){})
handSocket.on('gripperDownE', function(){})
handSocket.on('gripperUpE', function(){})
handSocket.on('gripperOpenE', (data) => {
    console.log('status:', data)
    console.log(s)
})