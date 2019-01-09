let request = require('request');
let app = require('express')();
let bodyParser = require('body-parser').json({ strict: false });
//let myIP = "192.168.3.100"
let myIP = '127.0.0.1';
let http = require('http').Server(app);
let io = require('socket.io')(http);

var help = require('./helpers');

class Station {
    constructor(name, ip, eventPort) {
        this.name = name;
        this.ip = ip; // ip of the real station
        this.eventPort = eventPort; // for instances of this object

        this.events = undefined; // events array
        this.eventCount = 0; // num of successful subscriptions

        this.inputs = undefined; // json array
        this.inputCount = 0; // same idea as eventCount (initial input statuses)

        this.outputs = undefined; // json array
        this.outputCount = 0; // same idea as eventCount (initial output statuses)
        //this.nInputs
        //this.nOutputs
        //this.nEvents
    }

    // specify inputs as {"matPush":undefined, "swivel":undefined}
    getInputs(obj) {
        var ref = this;
        ref.inputs = obj;
        ref.nInputs = help.getSize(obj);
    };

    // specify outputs as {"matPush":undefined, "swivel":undefined}
    getOutputs(obj) {
        var ref = this;
        ref.outputs = obj;
        ref.nOutputs = help.getSize(obj);
    };

    // specify eventIDs as ['xChanged', 'yChanged']
    getEvents(arr) {
        var ref = this;
        ref.events = arr;
        ref.nEvents = arr.length;
    }

    // make a POST request (for fetching IO values)
    fetchIOstatus(uri, body) {
        var ref = this;
        return new Promise(function(resolve, reject) {
            request.post({ uri: uri, body: {} }, function(err, res, body) {
                resolve(res.body); // expected body = {"IO_name": value}**********
            });
        });
    }

    //make a POST request (for subscriptions)
    makeSubscriptionPost(uri, body) {
        var ref = this;
        return new Promise(function(resolve, reject) {
            request.post({ uri: uri, json: true, body: body }, function(err, res, body) {
                if (res) {
                    resolve(res.statusCode);
                } else reject(new Error(ref.name + ": 1 subscription failed   statusCode:", res.statusCode));
            });
        })
    }

    //make subscriptions
    subscribe(baseURI) {
        var ref = this;
        //baseURI = "http://" + ref.ip + "/rest/events/";
        if (ref.nEvents) {
            var uri = baseURI + ref.events[ref.eventCount] + "/notifs";
            var body = { destUrl: "http://" + myIP + ":" + ref.eventPort };

            ref.makeSubscriptionPost(uri, body)
                .then(function(data) { // data is the response code to the most recent subscription
                    if (data.toString().substr(0, 1) == 2) { // success = 2xx
                        console.log(ref.events[ref.eventCount], 'SUBSCRIBED!');
                        ref.eventCount++;
                        if (ref.eventCount < ref.nEvents) {
                            return ref.subscribe(baseURI); // recursive
                        }
                    }
                })
                .catch(function(err) {
                    console.error(err);
                });
        } else {
            console.log(ref.name, ": No events specified, therefore no subscriptions.");
        }
    }

    //get the initial statuses of all inputs
    initInputs(baseURI) {
        var ref = this;
        //baseURI = "http://" + ref.ip + "/rest/services/";
        if (ref.nInputs) {
            var uri = baseURI + ref.inputs[Object.keys(ref.inputs)[ref.inputCount]];
            var body = {};
            ref.fetchIOstatus(uri, body)
                .then(function(data) {
                    if (data) {
                        ref.inputs[Object.keys(ref.inputs)[ref.inputCount]] = data; //shd be data.something

                        ref.inputCount++;
                        if (ref.inputCount < ref.nInputs) {
                            return ref.initInputs(baseURI);
                        }
                    }
                })
                .catch(function(err) {
                    console.error(err);
                });
        }
    }

    //get the initial statuses of all outputs
    initOutputs(baseURI) {
        var ref = this;
        //baseURI = "http://" + ref.ip + "/rest/services/";
        if (ref.nOutputs) {
            var uri = baseURI + ref.inputs[Object.keys(ref.outputs)[ref.outputCount]];
            var body = {};
            ref.fetchIOstatus(uri, body)
                .then(function(data) {
                    if (data) {
                        ref.inputs[Object.keys(ref.outputs)[ref.outputCount]] = data; // shd be data.something

                        ref.outputCount++;
                        if (ref.outputCount < ref.nOutputs) {
                            return ref.initOutputs(baseURI);
                        }
                    }
                })
                .catch(function(err) {
                    console.error(err);
                });
        }
    }

    //run a server
    runServer() {
        var ref = this;
        app.use(bodyParser);

        app.post('/', function(req, res) { // for event notifications

            res.end();
        });

        http.on('request', function(req) {
            // on request, emit an event with the eventID and data. different for each station.
            req.on('end', function() {
                console.log('req.body is:', req.body);
            });
        });

        io.on('connection', function(socket) {
            console.log('a user connected');
        });

        http.listen(ref.eventPort, function() {
            console.log(ref.name, 'is listening on port', ref.eventPort);
        });
    }
}

module.exports = Station;