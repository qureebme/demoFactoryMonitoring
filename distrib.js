var app = require('express')(),
    http = require('http').createServer(app),
    bodyParser = require('body-parser').json({ strict: false });
    
const Station = require('./station');
const sockets = require('./index');

var distStat = new Station("Distributing Station", "192.168.3.63", 3007);
distStat.getEvents(['magEmptyE','armPutE','armTakeE','pushCylFrontE','pushCylBackE','vacuumE']);
//distStat.subscribe()

distStat.runServer = function(){
    var ref = this;

    app.use(bodyParser);

    app.post('/', function(req, res){
        let id = req.body.eventID;

        clearTimeout(idle)
        ref.light('Amber', false)
        idle = setTimeout(() => ref.light('Amber', true), 300000)

        switch (id) {
            case ('magEmpty'):
                sockets.distSocket.emit('magEmpty', req.body.status)
                break;
            case ('armPut'):
                sockets.distSocket.emit('armPut', req.body.status)
                break;
            case ('armTake'):
                sockets.distSocket.emit('armTake', req.body.status)
                break;
            case ('pushCylFront'):
                sockets.distSocket.emit('pushCylFront', req.body.status)
                break;
            case ('pushCylBack'):
                sockets.distSocket.emit('pushCylBack', req.body.status)
                break;
            case ('vacuum'):
                sockets.distSocket.emit('vacuum', req.body.status)
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

let idle = setTimeout(() => distStat.light('Amber', true), 300000)
module.exports = {distStat}