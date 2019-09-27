//2 processing station

var app = require('express')(),
    http = require('http').createServer(app),
    bodyParser = require('body-parser').json({ strict: false });

const Station = require('./station');
const sockets = require('./index');

var procStat = new Station("Processing Station", "192.168.3.60", 3006);
procStat.getEvents(['rotateE','partAvE','atRubE','atTestE','inPositionE','wkpcOKE', 'testingE']);
procStat.subscribe()

procStat.runServer = function(){
    var ref = this;
    
    app.use(bodyParser);

    app.post('/', function(req, res){
        let id = req.body.eventID;
        switch (id) {
            case ('rotate'):
                sockets.procSocket.emit('rotate', req.body.status)
                break;
            case ('partAv'):
                sockets.procSocket.emit('partAv', req.body.status)
                break;
            case ('atRub'):
                sockets.procSocket.emit('atRub', req.body.status)
                break;
            case ('atTest'):
                sockets.procSocket.emit('atTest', req.body.status)
                break;
            case ('inPosition'):
                sockets.procSocket.emit(id, req.body.status)
                break
            case ('wkpcOK'):
                procSocket.emit('wkpcOK', req.body.status)
                break;
            case ('testing'):
                sockets.procSocket.emit('testing', req.body.status)
            case ('rubUp')://doesnt work. bad device
                sockets.procSocket.emit('rubIsUp', req.body.status)
                break;
            case ('rubDown'): //doesnt work, bad device
                sockets.procSocket.emit('rubIsDown', req.body.status)
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

module.exports = {procStat}