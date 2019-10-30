var app = require('express')(),
    http = require('http').createServer(app),
    bodyParser = require('body-parser').json({ strict: false });

const Station = require('./station');
const socket = require('./index').procSocket;

var procStat = new Station("Processing Station", "192.168.3.60", 3006);
procStat.getEvents(['rotateE','partAvE','atRubE','atTestE','inPositionE','wkpcOKE', 'testingE']);
procStat.subscribe()

procStat.runServer = function(){
    var ref = this;
    
    app.use(bodyParser);

    app.post('/', function(req, res){
        let id = req.body.eventID;
        /*clearTimeout(idle)
        ref.light('Amber', false)     //no amber light
        idle = setTimeout(() => ref.light('Amber', true), 300000)*/

        switch (id) {
            case ('rotate'):
                socket.emit('rotate', req.body.status)
                break;
            case ('partAv'):
                socket.emit('partAv', req.body.status)
                break;
            case ('atRub'):
                socket.emit('atRub', req.body.status)
                break;
            case ('atTest'):
                socket.emit('atTest', req.body.status)
                break;
            case ('inPosition'):
                socket.emit(id, req.body.status)
                break
            case ('wkpcOK'):
                socket.emit('wkpcOK', req.body.status)
                break;
            case ('testing'):
                socket.emit('testing', req.body.status)
            case ('rubUp')://doesnt work. bad device
                socket.emit('rubIsUp', req.body.status)
                break;
            case ('rubDown'): //doesnt work, bad device
                socket.emit('rubIsDown', req.body.status)
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

//let idle = setTimeout(() => procStat.light('Amber', true), 300000) //no amber light
module.exports = {procStat}