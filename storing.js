var app = require('express')(),
    http = require('http').createServer(app),
    bodyParser = require('body-parser').json({ strict: false });
    
const Station = require('./station');
const sockets = require('./index');

var storStat = new Station("Storing Station", "192.168.3.65", 3009);
storStat.getEvents(['colorE','placedE','removeRedE','removeBlackE','removeSilverE', 'rotateE']);
storStat.subscribe()

let blackCount = 0,
    redCount = 0,
    silverCount = 0;

storStat.runServer = function(){
    var ref = this;

    app.use(bodyParser);

    app.post('/', function(req, res){
        let id = req.body.eventID
        /*
        clearTimeout(idle)
        ref.light('Amber', false)
        idle = setTimeout(() => ref.light('Amber', true), 300000)
        */
        switch (id) {
            case('rotate'):
                sockets.storSocket.emit('rotate', req.body.status)
                break
            case('translate'):
                sockets.storSocket.emit('translate', req.body)
                break    
            case ('linearComplete'):
                break
            case ('rotaryComplete'):
                break
            case('placed'):
                if (req.body.black){
                    blackCount++;
                    sockets.storSocket.emit('placed', {color: 'black', num: blackCount})
                }
                else if (req.body.red){
                    redCount++;
                    sockets.storSocket.emit('placed', {color: 'red', num: redCount})
                }
                else if (req.body.silver){
                    silverCount++;
                    sockets.storSocket.emit('placed', {color: 'silver', num: silverCount})
                }
                break
            case('removeRed'):
                sockets.storSocket.emit('removeRed', {color: 'red', num: redCount})
                redCount--;
                break;
            case('removeBlack'):
                sockets.storSocket.emit('removeBlack', {color: 'black', num: blackCount})
                blackCount--;
                break;
            case('removeSilver'):
                sockets.storSocket.emit('removeSilver', {color: 'silver', num: silverCount})
                silverCount--;
                break;
            case('color'):
                if (req.body.red){
                    sockets.storSocket.emit('color', 'red')
                }
                else if(req.body.black){
                    sockets.storSocket.emit('color', 'black')
                }
                else if(req.body.silver){
                    sockets.storSocket.emit('color', 'silver')
                }
                break;
            default:
                break
        }
        res.end()
    })

    http.listen(ref.eventPort, function() {
        console.log(ref.name, ': listening on port', ref.eventPort);
    })
}

//let idle = setTimeout(() => storStat.light('Amber', true), 300000)
module.exports = {storStat}