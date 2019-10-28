var express = require('express'),
    app = require('express')(),
    http = require('http').createServer(app),
    bodyParser = require('body-parser').json({ strict: false }),
    staticFile = require('path').resolve(__dirname, 'public'),
    io = require('socket.io')(http),
    chalk = require('chalk');

app.use(bodyParser);
app.use(express.static(staticFile));

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

const port = 3000;
http.listen(port, function() {
    console.log('Main server: running on port', port);
});

let proc = require('./process'),
    hand = require('./handling'),
    dist = require('./distrib'),
    stor = require('./storing'),
    test = require('./testing');


proc.procStat.runServer()
hand.handStat.runServer()
dist.distStat.runServer()
test.testStat.runServer()
stor.storStat.runServer()

io.on('connection', (socket) => {
    console.log('main server: connected to a client');
    //hand.handStat.initInputs(handSocket)
    //proc.procStat.initInputs(procSocket)
    dist.distStat.initInputs(distSocket)
    //test.testStat.initInputs(testSocket)
    //stor.storStat.initInputs(storSocket)
})

let handSocket = io.of('/handling')
                    .on('connection', function(socket){
                        console.log(chalk.green('hand client is connected'))

                        socket.on('initialStatusError', function(mssg){
                            console.log(chalk.red.bold(`Hand station, INITIAL STATUS ERROR: ${mssg}`))
                            hand.handStat.unsubscribe()
                            hand.handStat.light('Red', true)
                            hand.handStat.light('Green', false)

                            proc.procStat.unsubscribe()
                            dist.distStat.unsubscribe()
                            test.testStat.unsubscribe()
                            stor.storStat.unsubscribe()
                        })

                        socket.on('success', function(data){
                            hand.handStat.light('Green', true)
                            hand.handStat.light('Red', false)
                        })

                        socket.on('disconnect', function(){
                            hand.handStat.light('Green', false)
                            hand.handStat.light('Red', false)
                            hand.handStat.light('Amber', false)
                        })
                    }),

    procSocket = io.of('/processing')
                    .on('connection', function(socket){
                        console.log(chalk.green(`Proc client is connected`))

                        socket.on('initialStatusError', function(mssg){
                            console.log(chalk.red.bold(`Proc station, INITIAL STATUS ERROR: ${mssg}`))
                            proc.procStat.unsubscribe()
                            proc.procStat.light('Red', true)
                            proc.procStat.light('Green', false)

                            hand.handStat.unsubscribe()
                            dist.distStat.unsubscribe()
                            test.testStat.unsubscribe()
                            stor.storStat.unsubscribe()
                        })

                        socket.on('success', function(data){
                            proc.procStat.light('Green', true)
                            proc.procStat.light('Red', false)
                        })

                        socket.on('disconnect', function(){
                            proc.procStat.light('Green', false)
                            proc.procStat.light('Red', false)
                            //proc.procStat.light('Amber', false) //amber light not connected
                        })
                    }),

    testSocket = io.of('/testing')
                    .on('connection', function(socket){
                        console.log(chalk.green(`test client is connected`))

                        socket.on('initialStatusError', function(mssg){
                            console.log(chalk.red.bold(`test station, INITIAL STATUS ERROR: ${mssg}`))
                            test.testStat.unsubscribe()
                            test.testStat.light('Red', true)
                            test.testStat.light('Green', false)

                            hand.handStat.unsubscribe()
                            dist.distStat.unsubscribe()
                            proc.procStat.unsubscribe()
                            stor.storStat.unsubscribe()
                        })

                        socket.on('success', function(data){
                            test.testStat.light('Green', true)
                            test.testStat.light('Red', false)
                        })

                        socket.on('disconnect', function(){
                            test.testStat.light('Green', false)
                            test.testStat.light('Red', false)
                            test.testStat.light('Amber', false)
                        })
                    }),

    distSocket = io.of('/distributing')
                    .on('connection', function(socket){
                        console.log(chalk.green(`dist client is connected`))

                        socket.on('initialStatusError', function(mssg){
                            console.log(chalk.red.bold(`Dist Station, INITIAL STATUS ERROR: ${mssg}`))
                            dist.distStat.unsubscribe()
                            dist.distStat.light('Red', true)
                            dist.distStat.light('Green', false)

                            hand.handStat.unsubscribe()
                            proc.procStat.unsubscribe()
                            test.testStat.unsubscribe()
                            stor.storStat.unsubscribe()
                        })

                        socket.on('success', function(data){
                            dist.distStat.light('Green', true)
                            dist.distStat.light('Red', false)
                        })

                        socket.on('disconnect', function(){
                            dist.distStat.light('Green', false)
                            dist.distStat.light('Red', false)
                            dist.distStat.light('Amber', false)
                        })
                    }),

    storSocket = io.of('/storing')
                    .on('connection', function(socket){
                        console.log(chalk.green(`stor client is connected`))

                        socket.on('initialStatusError', function(mssg){
                            console.log(chalk.red.bold(`Storing Station, INITIAL STATUS ERROR: ${mssg}`))
                            stor.storStat.unsubscribe()

                            hand.handStat.unsubscribe()
                            dist.distStat.unsubscribe()
                            test.testStat.unsubscribe()
                            proc.procStat.unsubscribe()
                        })

                        socket.on('success', function(data){
                            /*stor.storStat.light('Green', true) // has no light
                            stor.storStat.light('Red', false)*/
                        })

                        socket.on('disconnect', function(){
                            /*stor.storStat.light('Green', false)
                            stor.storStat.light('Red', false)
                            stor.storStat.light('Amber', false)*/
                        })

                        socket.on('getBlack', function(){
                            stor.storStat.makeServicePost('getBlack', {})
                        })
                        socket.on('getSilver', function(){
                            stor.storStat.makeServicePost('getSilver', {})
                        })
                        socket.on('getRed', function(){
                            stor.storStat.makeServicePost('getRed', {})
                        })
                    });

module.exports.handSocket = handSocket
module.exports.procSocket = procSocket
module.exports.testSocket = testSocket
module.exports.distSocket = distSocket
module.exports.storSocket = storSocket
