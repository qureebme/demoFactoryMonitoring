var app = require('express')(),
    http = require('http').createServer(app),
    bodyParser = require('body-parser').json({ strict: false });
    
const Station = require('./station');
const sockets = require('./index');

var storStat = new Station("Storing Station", "192.168.3.65", 3009);
storStat.getEvents([ 'blackE','startE', 'placedE'/*, 'silverE', 'redE'*/]);
storStat.subscribe()

let blackCount = 0,
    redCount = 0,
    silverCount = 0;

let newBlack = false,
    newRed = false,
    newSilver = false;

storStat.reset = async function(axis){
    let ref = this;

    return Promise.all([
        ref.makeServicePost('resetBits', {}),
        axis == 'linear' ? ref.makeServicePost('resetLinear', {}) : null,
        axis == 'rotary' ? ref.makeServicePost('resetRotary', {}) :  null
    ])
}

storStat.extendSlide = function(){ //ok
    let ref = this;
    return new Promise(function(res, rej){
        res(ref.makeServicePost('extSlide', {}))
    })
}

storStat.retractSlide = function(){ //ok
    let ref = this;
    return new Promise(function(res, rej){
        res(ref.makeServicePost('retSlide', {}))
    })
}

storStat.closeGripper = function(){  //ok
    let ref = this;
    return new Promise(function(res, rej){
        res(ref.makeServicePost('clsGripper', {}))
    })
}

storStat.openGripper = function(){  //ok
    let ref = this;
    return new Promise(function(res, rej){
        res(ref.makeServicePost('openGripper', {}))
    })
}

storStat.goLinear = async function(bit0, bit1, bit2){
    let ref = this;

    try{
        await Promise.all([
            bit0 ? ref.makeServicePost('setBit0', {}) : null,
            bit1 ? ref.makeServicePost('setBit1', {}) : null,
            bit2 ? ref.makeServicePost('setBit2', {}) : null
            ])
        await ref.makeServicePost('setLinear', {});
        await ref.reset('linear')
    }
    catch(e1){
        console.log('ERROR1', e1)
    }
}

storStat.goRotary = async function(bit0, bit1, bit2){
    let ref = this;
    try {
        await Promise.all([
            bit0 ? ref.makeServicePost('setBit0', {}) : null,
            bit1 ? ref.makeServicePost('setBit1', {}) : null,
            bit2 ? ref.makeServicePost('setBit2', {}) : null
            ])
        await ref.makeServicePost('setRotary', {})
        await ref.reset('rotary')
    } catch (e2) {
        console.log('ERROR2', e2)
    }
}

storStat.go = async function(linArr, rotArr){
    let ref = this;
    try{
        await ref.goLinear(linArr[0], linArr[1], linArr[2])
        ref.goRotary(rotArr[0], rotArr[1], rotArr[2])
        setTimeout(() => ref.sendHandshake(), 6000)
    }
    catch(e3){
        console.log('ERROR3 ', e3)
    }
}

storStat.transferWkpc = async function(linArr, rotArr){
    let ref = this;

    try{
        await ref.goLinear(1,1,1)// await useful?
        setTimeout(() => ref.closeGripper(), 2000) //out for now
        console.log('linear 1') //
        setTimeout(() => ref.goLinear(1,0,1), 4000)
        setTimeout(() => ref.retractSlide(), 6000)
        setTimeout(() => ref.go(linArr, rotArr), 8000)
    }
    catch(e4){
        console.log('ERROR  ', e4)
    }
}

storStat.sendHandshake = function(){
    let ref = this;
    ref.makeServicePost('handShake', {})
    console.log('           handshake           ') //
}

storStat.runServer = function(){
    var ref = this;

    app.use(bodyParser);

    app.post('/', function(req, res){
        let id = req.body.eventID
        
        switch (id) {
            case ('start'): // dont forget to emit only on rising edge
                if(req.body.status){
                    console.log('starrrrrt')
                    ref.openGripper()/////////////////////////////just added
                    ref.goLinear(1,0,1) // to color ID
                    //ref.goLinear(1,0,0)
                    setTimeout(() => ref.goRotary(0,1,1),2000)
                    //setTimeout(() => ref.goRotary(0,1,0),2000)

                    //ref.go([1,0,1,], [0,1,1]) //real
                    //ref.go([1,0,0], [0,0,0])

                    setTimeout(() => ref.extendSlide(), 8000)
                }
                
                break
            case ('linearComplete'):
                //reset start linear. resetBits?
                console.log('linear is done')
                break
            case ('rotaryComplete'):
                //reset start rotary. resetBits?
                console.log('rotary is done')
                break
            case('placed'):
                console.log('placed******')
                if (newBlack){
                    blackCount++;
                    newBlack = false;
                    console.log('blackCount: ', blackCount)
                }
                else if (newRed){
                    redCount++;
                    newRed = false;
                }
                else if (newSilver){
                    silverCount++;
                    newSilver = false;
                }
                break
            case ('isBlack'):
                if (req.body.status){
                    console.log('Black detected')
                    newBlack = true;
                    if (blackCount == 0){ // still some yet unfilled places?
                        ref.transferWkpc([1, 0, 0], [0,0,0])
                        //console.log('here0')
                    }
                    else if (blackCount == 1) {
                        ref.transferWkpc([1, 0, 0], [1,0,0])
                        //console.log('here1')
                    }
                    else if (blackCount == 2) {
                        ref.transferWkpc([1, 0, 0], [0,1,0])
                        //console.log('here2')
                    }
                    else if (blackCount == 3) {
                        ref.transferWkpc([1, 0, 0], [1,1,0])
                        console.log('here3')
                    }
                    else if (blackCount == 4) {
                        ref.transferWkpc([1, 0, 0], [0,0,1])
                        console.log('here4')
                    }
                    else if (blackCount == 5) {
                        ref.transferWkpc([1, 0, 0], [1,0,1])
                        console.log('here5')
                    }
                    else console.log('FULL') //full
                }
                break
                /*
            case ('isSilver'):
                if (req.body.status){
                    console.log('Silver detected')
                    if (silverCount == 0){ // still some yet unfilled places?
                    }
                    else if (silverCount == 1) ref.transferWkpc([1, 0, 0], [1,0,0])
                    else if (sliverCount == 2) ref.transferWkpc([1, 0, 0], [0,1,0])
                    else if (silverCount == 3) ref.transferWkpc([1, 0, 0], [1,1,0])
                    else if (silverCount == 4) ref.transferWkpc([1, 0, 0], [0,0,1])
                    else if (silverCount == 5) ref.transferWkpc([1, 0, 0], [1,0,1])
                    else console.log('FULL') //full
                }
                break
            case ('isRed'):
                if (req.body.status){
                    console.log('Red detected')
                    if (redCount < 6){ // still some yet unfilled places?
                    }
                }
                break
                */
            default:
                break
        }
        res.end()
    })

    http.listen(ref.eventPort, function() {
        console.log(ref.name, ': listening on port', ref.eventPort);
    })
}

module.exports = {storStat}