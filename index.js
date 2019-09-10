var express = require('express'),
    app = require('express')(),
    http = require('http').createServer(app),
    bodyParser = require('body-parser').json({ strict: false }),
    staticFile = require('path').resolve(__dirname, 'public'),
    io = require('socket.io')(http),
    chalk = require('chalk');

let handSocket, procSocket, distSocket, testSocket, storSocket;

const Station = require('./station');

app.use(bodyParser);
app.use(express.static(staticFile));

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

io.on('connection', (socket) => {
    console.log('main server: connected to a client');
    //handStat.initInputs(handSocket)
    procStat.initInputs(procSocket)
    //distStat.initInputs(distSocket)
    //testStat.initInputs(testSocket)
    //storStat.initInputs(storSocket)
})

const port = 3000;
http.listen(port, function() {
    console.log('Main server: running on port', port);
});

//2 processing station
var procStat = new Station("Processing Station", "192.168.3.60", 3006);
procStat.getEvents(['rotateE','atRubE','atTestE','wkpcOKE','partAvE','inPositionE', 'testingE']);
procStat.subscribe()

procStat.runServer = function(){
    var ref = this;
    var http = require('http').createServer(app);
    procSocket = io.of('/processing')
                    .on('connection', function(socket){
                        console.log('processing station client is connected')

                        socket.on('initialStatusError', function(mssg){
                            console.log('INITIAL STATUS ERROR:', mssg)
                            procStat.unsubscribe()
                        })
                    })

    app.use(bodyParser);

    app.post('/', function(req, res){
        let id = req.body.eventID;
        switch (id) {
            case ('rotate')://perfect
                //console.log(ref.name, id)
                procSocket.emit('rotate', req.body.status)
                break;
            case ('partAv')://ok?
                //console.log(ref.name, id)
                procSocket.emit('partAv', req.body.status)
                break;
            case ('atRub'):// perfect
                procSocket.emit('atRub', req.body.status)
                break;
            case ('atTest'):// perfect
                console.log(ref.name, id, req.body.status)
                procSocket.emit('atTest', req.body.status)
                break;
            case ('inPosition')://very good
                //console.log(ref.name, id, req.body.status)
                procSocket.emit(id, req.body.status)
                break
            case ('wkpcOK')://good
                console.log(ref.name, id, req.body.status)
                procSocket.emit('wkpcOK', req.body.status)
                break;
            case ('testing'):
                //console.log('testing a wkpc')
                procSocket.emit('testing', req.body.status)
            case ('rubUp')://doesnt work. bad device
                console.log(ref.name, id)
                procSocket.emit('rubIsUp', req.body.status)
                break;
            case ('rubDown'): //doesnt work, bad device
                console.log(ref.name, id)
                procSocket.emit('rubIsDown', req.body.status)
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



/*
//1 distributing station
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
                distSocket.emit('magEmpty', req.body.status)
                break;
            case ('armPut'):
                console.log(ref.name, id)
                distSocket.emit('armPut', req.body.status)
                break;
            case ('armTake'):
                console.log(ref.name, id)
                distSocket.emit('armTake', req.body.status)
                break;
            case ('pushCylFront'):
                console.log(ref.name, id)
                distSocket.emit('pushCylFront', req.body.status)
                break;
            case ('pushCylBack'):
                console.log(ref.name, id)
                distSocket.emit('pushCylBack', req.body.status)
                break;
            case ('vacuum'):
                console.log(ref.name, id)
                distSocket.emit('vacuum', req.body.status)
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
*/
/*
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
        //console.log(id)
        switch (id) {
            case ('partAv')://
                console.log('partAv event', req.body.status)
                handSocket.emit('partAv', req.body.status)
                break;
            case('atPrevious')://
                console.log('atPrevious event')
                handSocket.emit('atPrevious', req.body.status)
                break;
            case('atFollow')://
                console.log('atFollow event')
                handSocket.emit('atFollow', req.body.status)
                break;
            case('atSort')://
                console.log('atSort event')
                handSocket.emit('atSort', req.body.status)
                break;
            case('colorCheck'): // never worked! Dunno.
                console.log('colorCheck event', req.body.status)
                handSocket.emit('colorCheck', req.body.status)
                break;
            case('gripperDown')://
                console.log('gripperDown event')
                handSocket.emit('gripperDown', req.body.status)
                break;
            case('gripperUp')://
                console.log('gripperUp event')
                handSocket.emit('gripperUp', req.body.status)
                break;
            case('gripperOpen')://
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
*/


/*
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

