
var express = require('express'),
    app = require('express')(),
    http = require('http').createServer(app),
    bodyParser = require('body-parser').json({ strict: false }),
    staticFile = require('path').resolve(__dirname, 'public'),
    io = require('socket.io')(http);

let handSocket, procSocket, distSocket, testSocket, storSocket;

const Station = require('./station');

app.use(bodyParser);
app.use(express.static(staticFile));

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

io.on('connection', (socket) => {
    console.log('main server: connected to a client');
    handStat.initInputs(handSocket)
    //procStat.initInputs(procSocket)
    //distStat.initInputs(distSocket)
    //testStat.initInputs(testSocket)
    //storStat.initInputs(storSocket)
})

const port = 3000;
http.listen(port, function() {
    console.log('Main server: running on port', port);
});


//1 handling station
var handStat = new Station("Handling Station", "192.168.3.81", 3005);
handStat.getEvents(["atFollowE", "atPreviousE", "partAvE", "atSortE", "gripperDownE", "gripperUpE", "colorCheckE", "gripperOpenE"]);
handStat.subscribe()

handStat.runServer = function(){
    var ref = this;
    var http = require('http').createServer(app);
    handSocket = io.of('/handling');
    app.use(bodyParser);

    app.post('/', function(req, res) {
        let id = req.body.eventID;
        console.log(id)
        switch (id) {
            case ('partAv'):
                console.log('partAv event')
                handSocket.emit('partAv', req.body.status)
                break;
            case('atPrevious'):
                console.log('atPrevious event')
                handSocket.emit('atPrevious', req.body.status)
                break;
            case('atFollow'):
                console.log('atFollow event')
                handSocket.emit('atFollow', req.body.status)
                break;
            case('atSort'):
                console.log('atSort event')
                handSocket.emit('atSort', req.body.status)
                break;
            case('gripperDown'):
                console.log('gripperDown event')
                handSocket.emit('gripperDown', req.body.status)
                break;
            case('gripperUp'):
                console.log('gripperUp event')
                handSocket.emit('gripperUp', req.body.status)
                break;
            case('gripperOpen'):
                console.log('gripperOpen event')
                handSocket.emit('gripperOpen', req.body.status)
                break;
            default:
                break;
        }
        res.end();
    });

    http.listen(ref.eventPort, function() {
        console.log(ref.name, ': listening on port', ref.eventPort);
    });
}
handStat.runServer()
/*
//2 processing station
var procStat = new Station("Processing Station", "192.168.3.60", 3006);
procStat.getEvents(['rotateE','partAvE','workRubE','workTestE','rubUpE','rubDownE','rotPosE','workOKE']);
procStat.subscribe()

procStat.runServer = function(){
    var ref = this;
    var http = require('http').createServer(app);
    procSocket = io.of('/processing');
    app.use(bodyParser);

    app.post('/', function(req, res){
        let id = req.body.eventID;
        
        switch (id) {
            case ('rotate'):
                console.log(ref.name, id)
                break;
            case ('partAv'):
                console.log(ref.name, id)
                break;
            case ('workRub'):
                console.log(ref.name, id)
                break;
            case ('workTest'):
                console.log(ref.name, id)
                break;
            case ('rubUp'):
                    console.log(ref.name, id)
                    break;
            case ('rubDown'):
                    console.log(ref.name, id)
                    break;
            case ('rotPos'):
                // possibly use this for rotate event
                    console.log(ref.name, id)
                    break
            case ('workOK'):
                    console.log(ref.name, id)
                    break;
            default:
                break;
        }
        res.end()
    })

    http.listen(ref.eventPort, function() {
        console.log(ref.name, ': listening on port', ref.eventPort);
    });
}
procStat.runServer()

//3 distributing station
var distStat = new Station("Distributing Station", "192.168.3.63", 3007);
distStat.getEvents(['magEmptyE','armPutE','armTakeE','pushCylFrontE','pushCylBackE','vacuumE']);
distStat.subscribe()

distStat.runServer = function(){
    var ref = this;
    var http = require('http').createServer(app);
    distSocket = io.of('/distributing');
    app.use(bodyParser);

    app.post('/', function(req, res){
        let id = req.body.eventID;
        
        switch (id) {
            case ('magEmpty'):
                console.log(ref.name, id)
                break;
            case ('armPut'):
                console.log(ref.name, id)
                break;
            case ('armTake'):
                console.log(ref.name, id)
                break;
            case ('pushCylFront'):
                console.log(ref.name, id)
                break;
            case ('pushCylBack'):
                console.log(ref.name, id)
                break;
            case ('vacuum'):
                console.log(ref.name, id)
                break;
            default:
                break;
        }
        res.end()
    })

    http.listen(ref.eventPort, function() {
        console.log(ref.name, ': listening on port', ref.eventPort);
    });
}
distStat.runServer()

//4 testing station
var testStat = new Station("Testing Station", "192.168.3.27", 3008);
testStat.getEvents(['liftIsDownE','liftIsUpE','heightOKE','partAvE','pushCylBackE']);
testStat.subscribe()

testStat.runServer = function(){
    var ref = this;
    var http = require('http').createServer(app);
    testSocket = io.of('/testing');
    app.use(bodyParser);

    app.post('/', function(req, res){
        let id = req.body.eventID;
        
        switch (id) {
            case ('liftIsDown'):
                console.log(ref.name, id)
                break
            case ('liftIsUp'):
                console.log(ref.name, id)
                break
            case ('heightOK'):
                console.log(ref.name, id)
                break
            case ('partAv'):
                console.log(ref.name, id)
                break
            case ('pushCylBack'):
                console.log(ref.name, id)
                break
            default:
                break
        }
        res.end()
    })

    http.listen(ref.eventPort, function() {
        console.log(ref.name, ': listening on port', ref.eventPort);
    });
}
testStat.runServer()
*/
/*
//5 storing station
var storStat = new Station("Storing Station", "192.168.3.65", 3009);
storStat.getEvents([]);
storStat.subscribe()

storStat.runServer = function(){
    var ref = this;
    var http = require('http').createServer(app);
    storSocket = io.of('/storing');
    app.use(bodyParser);

    app.post('/', function(req, res){
        let id = req.body.eventID
        
        switch (id) {
            case (wxyz):
                console.log()
                break
            case (wxyz):
                console.log()
                break
            case (wxyz):
                console.log()
                break
            case (wxyz):
                console.log()
                break
            default:
                break
        }
        res.end()
    })

    http.listen(ref.eventPort, function() {
        console.log(ref.name, ': listening on port', ref.eventPort);
    })
}
storStat.runServer()
*/