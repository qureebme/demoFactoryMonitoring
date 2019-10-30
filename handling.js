var app = require('express')(),
    http = require('http').createServer(app),
    bodyParser = require('body-parser').json({ strict: false });

const socket = require('./index').handSocket;
const Station = require('./station');

var handStat = new Station("Handling Station", "192.168.3.68", 3005);
handStat.getEvents(["partAvE","atPreviousE","atFollowE","atSortE","gripperDownE","gripperUpE","colorCheckE","gripperOpenE"]);
handStat.subscribe()

handStat.runServer = function(){
    var ref = this;
    
    app.use(bodyParser);

    app.post('/', function(req, res) {
        let id = req.body.eventID;

        clearTimeout(idle)
        ref.light('Amber', false)
        idle = setTimeout(() => ref.light('Amber', true), 300000)

        switch (id) {
            case ('partAv'):
                socket.emit('partAv', req.body.status)
                break;
            case('atPrevious'):
                socket.emit('atPrevious', req.body.status)
                break;
            case('atFollow'):
                socket.emit('atFollow', req.body.status)
                break;
            case('atSort'):
                socket.emit('atSort', req.body.status)
                break;
            case('colorCheck'):
                socket.emit('colorCheck', req.body.status)
                break;
            case('gripperDown'):
                socket.emit('gripperDown', req.body.status)
                break;
            case('gripperUp'):
                socket.emit('gripperUp', req.body.status)
                break;
            case('gripperOpen'):
                socket.emit('gripperOpen', req.body.status)
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

let idle = setTimeout(() => handStat.light('Amber', true), 300000)
module.exports = {handStat}