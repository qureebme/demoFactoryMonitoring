
var express = require('express'),
    app = require('express')(),
    http = require('http').createServer(app),
    bodyParser = require('body-parser').json({ strict: false }),
    staticFile = require('path').resolve(__dirname, "public"),
    io = require('socket.io')(http);

const Station = require('./station');

app.use(bodyParser);
app.use(express.static(staticFile));

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

io.on('connection', (socket) => {
    console.log('main server: emitting hello');
})

const port = 3000;
http.listen(port, function() {
    console.log('Main server is on port', port);
});


//handling station

var handStat = new Station("Handling Station", "192.168.3.81", 3005);

//handStat.initInputs2()
//handStat.initOutputs2()
handStat.getEvents(["atFollowE", "atPreviousE", "partAvE", "atSortE", "gripperDownE", "gripperUpE", "colorCheckE", "gripperOpenE"]);
//handStat.subscribe();

handStat.runServer = function(){
    var ref = this;
    var http = require('http').createServer(app),
    handSocket = io.of('/handling');
    app.use(bodyParser);

    app.post('/', function(req, res) { // for event notifications
        console.log(req.body);
        let id = req.body.eventID;
        switch (id) {
            case ('partAvE'):
                io.emit('partAvE', req.body.status)
                break;
            case('atPreviousE'):
                io.emit('atPreviousE', req.body.status)
                break;
            case('atFollowE'):
                io.emit('atFollowE', req.body.status)
                break;
            case('atSortE'):
                io.emit('atSortE', req.body.status)
                break;
            case('gripperDownE'):
                io.emit('gripperDownE', req.body.status)
                break;
            case('gripperUpE'):
                io.emit('gripperUpE', req.body.status)
                break;
            case('gripperOpenE'):
                console.log('gripperOpen')
                handSocket.emit('gripperOpenE', req.body.status)
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
