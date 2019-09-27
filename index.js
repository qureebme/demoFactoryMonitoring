var express = require('express'),
    app = require('express')(),
    http = require('http').createServer(app),
    bodyParser = require('body-parser').json({ strict: false }),
    staticFile = require('path').resolve(__dirname, 'public'),
    io = require('socket.io')(http),
    chalk = require('chalk');

//let  distSocket, testSocket, storSocket; //procSocket, handSocket,

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
    test = require('./testing')


proc.procStat.runServer()
hand.handStat.runServer()
dist.distStat.runServer()
test.testStat.runServer()
stor.storStat.runServer()

io.on('connection', (socket) => {
    console.log('main server: connected to a client');
    hand.handStat.initInputs(handSocket)
    proc.procStat.initInputs(procSocket)
    dist.distStat.initInputs(distSocket)
    test.testStat.initInputs(testSocket)
    stor.storStat.initInputs(storSocket)
})

let handSocket = io.of('/handling')
                    .on('connection', function(socket){
                        console.log(chalk.green('hand client is connected'))

                        socket.on('initialStatusError', function(mssg){
                            console.log(chalk.red.bold(`Hand station, INITIAL STATUS ERROR: ${mssg}`))
                            hand.handStat.unsubscribe()
                        })
                    }),

    procSocket = io.of('/processing')
                    .on('connection', function(socket){
                        console.log(chalk.green(`Proc client is connected`))

                        socket.on('initialStatusError', function(mssg){
                            console.log(chalk.red.bold(`Proc station, INITIAL STATUS ERROR: ${mssg}`))
                            proc.procStat.unsubscribe()
                        })
                    }),

    testSocket = io.of('/testing')
                    .on('connection', function(socket){
                        console.log(chalk.green(`test client is connected`))

                        socket.on('initialStatusError', function(mssg){
                            console.log(chalk.red.bold(`test station, INITIAL STATUS ERROR: ${mssg}`))
                            test.testStat.unsubscribe()
                        })
                    }),

    distSocket = io.of('/distributing')
                    .on('connection', function(socket){
                        console.log(chalk.green(`dist client is connected`))

                        socket.on('initialStatusError', function(mssg){
                            console.log(chalk.red.bold(`Dist Station, INITIAL STATUS ERROR: ${mssg}`))
                            dist.distStat.unsubscribe()
                        })
                    }),

    storSocket = io.of('/storing')
                    .on('connection', function(socket){
                        console.log(chalk.green(`stor client is connected`))

                        socket.on('initialStatusError', function(mssg){
                            console.log(chalk.red.bold(`Storing Station, INITIAL STATUS ERROR: ${mssg}`))
                            stor.storStat.unsubscribe()
                        })
                    });

module.exports.handSocket = handSocket
module.exports.procSocket = procSocket
module.exports.testSocket = testSocket
module.exports.distSocket = distSocket
module.exports.storSocket = storSocket