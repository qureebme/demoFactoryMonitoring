var app = require('express')(),
    http = require('http').createServer(app),
    bodyParser = require('body-parser').json({ strict: false });

const sockets = require('./index');
const Station = require('./station');

var handStat = new Station("Handling Station", "192.168.3.68", 3005);
handStat.getEvents(["partAvE","atPreviousE","atFollowE","atSortE","gripperDownE","gripperUpE","colorCheckE","gripperOpenE"]);
handStat.subscribe()
let gripperStuck;
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
                sockets.handSocket.emit('partAv', req.body.status)
                break;
            case('atPrevious'):
                sockets.handSocket.emit('atPrevious', req.body.status)
                break;
            case('atFollow'):
                sockets.handSocket.emit('atFollow', req.body.status)
                break;
            case('atSort'):
                sockets.handSocket.emit('atSort', req.body.status)
                break;
            case('colorCheck'):
                sockets.handSocket.emit('colorCheck', req.body.status)
                break;
            case('gripperDown'):
                sockets.handSocket.emit('gripperDown', req.body.status)
                break;
            case('gripperUp'):
                sockets.handSocket.emit('gripperUp', req.body.status)
                if (!req.body.status) gripperStuck = setTimeout(()=>{sockets.handSocket.emit('stationError')}, 20000)
                else {
                    clearTimeout(gripperStuck)
                    sockets.handSocket.emit('errorCleared')
                };
                break;
            case('gripperOpen'):
                sockets.handSocket.emit('gripperOpen', req.body.status)
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