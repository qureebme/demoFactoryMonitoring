
var express = require('express'),
    app = require('express')(),
    http = require('http').createServer(app),
    bodyParser = require('body-parser').json({ strict: false }),
    staticFile = require('path').resolve(__dirname, "public"),
    io = require('socket.io')(http);

let handSocket;;

const Station = require('./station');

app.use(bodyParser);
app.use(express.static(staticFile));

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

io.on('connection', (socket) => {
    console.log('main server: connected to a client');
    handStat.initInputs(handSocket)
})

const port = 3000;
http.listen(port, function() {
    console.log('Main server is on port', port);
});


//handling station
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
            case('gripperUpE'):
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
        console.log(ref.name, 'is listening on port', ref.eventPort);
    });
}
handStat.runServer()


