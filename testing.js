var app = require('express')(),
    http = require('http').createServer(app),
    bodyParser = require('body-parser').json({ strict: false }),
    request = require('request');
    
const Station = require('./station');
const socket = require('./index').testSocket;

var testStat = new Station("Testing Station", "192.168.3.27", 3008);
testStat.getEvents(['liftIsDownE','liftIsUpE','heightOKE','partAvE','pushCylBackE','airSlideE','startE']);
testStat.subscribe()

let lift, height;
let n = 0; // programming to the liftIsDown sensor problem

testStat.sendLiftUp = function(){
    let ref = this;
    //ref.makeServicePost('sendliftUp', {})
    request.post({uri: ref.baseURI2 + 'sendLiftUp', json: true, body:{}})
}
testStat.sendLiftDown = function(){
    let ref = this;
    //ref.makeServicePost('sendLiftDown', {})
    request.post({uri: ref.baseURI2 + 'sendLiftDown', json: true, body:{}})
}
testStat.airSlideOn = function(){
    let ref = this;
    //ref.makeServicePost('airSlideOn', {})
    request.post({uri: ref.baseURI2 + 'airSlideOn', json: true, body:{}})
}
testStat.airSlideOff = function(){
    let ref = this;
    //ref.makeServicePost('airSlideOff', {})
    request.post({uri: ref.baseURI2 + 'airSlideOff', json: true, body:{}})
}
testStat.pushCyl = function(){
    let ref = this;
    //ref.makeServicePost('pushCyl', {})
    request.post({uri: ref.baseURI2 + 'pushCyl', json: true, body:{}})
}
testStat.runServer = function(){
    var ref = this;

    app.use(bodyParser);

    app.post('/', function(req, res){
        let id = req.body.eventID;

        clearTimeout(idle)
        ref.light('Amber', false)
        idle = setTimeout(() => ref.light('Amber', true), 300000)
        
        switch (id) {
            case ('start'):
                ref.sendLiftUp();
                socket.emit('start', req.body.status)
                break
            case ('liftIsUp'):
                lift = req.body.status
                if (lift){
                    setTimeout(() => {
                        if (height) {
                            ref.pushCyl()
                            ref.airSlideOn()
                            setTimeout(()=> ref.airSlideOff(), 3000)
                        }
                        else ref.sendLiftDown()
                    }, 1000)
                }
                socket.emit('liftIsUp', req.body.status)
                break
            case ('liftIsDown'):
                n++;
                if (n==3 || n==4) { // only every other liftIsDown event (pair, 0 and 1) is acceptable
                    if (req.body.status){
                        if (!height) setTimeout(() => {ref.pushCyl();}, 4000)
                    }
                    else n = 0 // n must be 4
                socket.emit('liftIsDown', req.body.status)
                }
                break
            case ('heightOK'):
                if (req.body.status) height = req.body.status
                else setTimeout(()=> height = req.body.status,5000)
                socket.emit('heightOK', req.body.status)
                break
            case('airSlide'):
                if(!req.body.status) ref.sendLiftDown()  //for accepted wkpc
                socket.emit('airSlide', req.body.status)
            case ('partAv'):
                socket.emit('partAv', req.body.status)
                break
            case ('pushCylBack'):
                socket.emit('pushCylBack', req.body.status)
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

let idle = setTimeout(() => testStat.light('Amber', true), 300000)
module.exports = {testStat}