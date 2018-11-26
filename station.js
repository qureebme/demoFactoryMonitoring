let request = require('request');
let express = require('express');
let app = express();
let myIP = "http://192.168.3.100"
    //let http = require('http').Server;
    //let socket = require('socketio');

var help = require('./helpers');

class Station {
    constructor(name, ip, eventPort) {
        this.name = name;
        this.ip = ip;
        this.eventPort = eventPort;

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

    //run a server
    runServer() {
        var ref = this;
        app.post('/', function(req, res) { // for event notifications
            // on request, emit an event with the eventID and data. different for each station.
            res.end();
        });

        app.listen(ref.eventPort, function() {
            console.log(ref.name, 'is listening on port', ref.eventPort);
        });
    }

    getInputs(obj) { // specify inputs as {"matPush":undefined, "swivel":undefined}
        var ref = this;
        ref.inputs = obj;
        ref.nInputs = help.getSize(obj); // creating new obj ppty////////////////////////////////
    };

    getOutputs(obj) { // specify outputs as {"matPush":undefined, "swivel":undefined}
        var ref = this;
        ref.outputs = obj;
        ref.nOutputs = help.getSize(obj); // creating new obj ppty////////////////////////////////
    };

    getEvents(arr) { // specify eventIDs as ['xChanged', 'yChanged']
        var ref = this;
        ref.events = arr;
        ref.nEvents = arr.length; // creating new obj ppty////////////////////////////////
    }

    //make subscriptions OPTION 1
    subscribe(baseURI, ...events) { // a variable number of events

        var ref = this;
        baseURI = "http://" + ref.ip + "/rest/events/";

        events.forEach(element => { //subscribe             //////////////////// BAD IDEA? //ASYNC-AWAIT??
            var uri = baseURI + element + "/notifs";
            var destUrl = "http://" + ref.ip + ":" + ref.eventPort; // event notifs returned here!
            request.post({ uri: uri, json: true, body: { destUrl: destUrl } }, function(err, res, body) {
                if (!err) console.log(element, res.statusCode);
                else console.log(element, 'error', '    statusCode:', res.statusCode);
            });
        });
    }

    //make a POST request
    makePostRequest(uri, body) {
        var ref = this;
        return new Promise(function(resolve, reject) {
            request.post({ uri: uri, json: true, body: body }, function(err, res, body) {
                if (res.statusCode.toString().substr(0, 1) == 2) { // 200 class response
                    resolve(res.statusCode);
                } else reject(new Error(ref.name + ": 1 subscription failed   statusCode:", res.statusCode));
            });
        })
    }

    //make subscriptions OPTION 2
    subscribe2(baseURI, events) { //events as an array of strings
        var ref = this;
        //baseURI = "http://" + ref.ip + "/rest/events/";

        //var nEvents = events.length;
        var uri = baseURI + events[ref.eventCount] + "/notifs";
        var body = { destUrl: "http://" + myIP + ":" + ref.eventPort };
        ref.makePostRequest(uri, body)
            .then(function(data) { // data is the response code
                if (data.toString().substr(0, 1) == 2) { // success = 2xx
                    ref.eventCount++;
                    if (ref.eventCount < ref.nEvents - 1) { /////////////////////////////////////////////////
                        return ref.subscribe2(baseURI, events); // recursive
                    }
                }
            })
            .catch(function(err) {
                console.error(err);
            });
    }

    //get the initial statuses of all IOs
    // 2nd OPTION: Manually set initial IO values, OR...//////////////////////////////////////////////////////
    initInputs(baseURI) { // initialize inputs
        var ref = this;
        //var inp = ref.inputs;
        //baseURI = "http://" + ref.ip + "/rest/services/";
        uri = baseURI + ref.inputs[ref.inputCount];
        var body = {};
        ref.makePostRequest(uri, body)
            .then(function(data) {
                if (data.toString().substr(0, 1) == 2) {
                    ref.inputCount++;
                    if (ref.inputCount < nInputs - 1) { /////////////////////////////////////////////////
                        return ref.initInputs(baseURI); // recursive
                    }
                }
            });
    }

    initOutputs(baseURI) { // initialize inputs
        var ref = this;
        //var inp = ref.inputs;
        //baseURI = "http://" + ref.ip + "/rest/services/";
        uri = baseURI + ref.inputs[ref.inputCount];
        var body = {};
        ref.makePostRequest(uri, body)
            .then(function(data) {
                if (data.toString().substr(0, 1) == 2) {
                    ref.inputCount++;
                    if (ref.inputCount < nInputs - 1) { /////////////////////////////////////////////////
                        return ref.initInputs(baseURI); // recursive
                    }
                }
            });
    }
}

module.exports = Station;