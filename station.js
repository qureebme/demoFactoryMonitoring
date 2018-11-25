let request = require('request');
let express = require('express');
let app = express();
//let http = require('http').Server;
//let socket = require('socketio');


class Station {
    constructor(name, ip, eventPort) {
        this.name = name;
        this.ip = ip;
        this.eventPort = eventPort;
        this.eventCount = 0;
        this.inputs = undefined; // json array
        this.outputs = undefined; // json array

    }

    //run a server
    runServer() {
        var ref = this;
        //app.set('port', process.env.PORT || ref.eventPort);
        app.post('/', function(req, res) { // for event notifications
            // on request, emit an event with the eventID and data. different for each station.
            res.end();
        });

        app.listen(ref.eventPort, function() {
            console.log(ref.name, 'is listening on port', ref.eventPort);
        });
    }


    getInputs() { // get initial statuses of inputs
        return new Promise(function(resolve, reject) {

        });
    };

    getOutputs() { // get initial statuses of outputs
        return new Promise(function(resolve, reject) {

        });
    };

    //get the statuses of all IOs
    initialize() {
        var ref = this;

        ref.getInputs();
        ref.getOutputs();
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

    //make subscriptions OPTION 2
    subscribe2(baseURI, ...events) {
        var ref = this;
        baseURI = "http://" + ref.ip + "/rest/events/";

        nEvents = events.length;
        var uri = baseURI + events[ref.eventCount] + "/notifs";
        var body = { destUrl: "http://" + ref.ip + ":" + ref.eventPort };
        ref.makePostRequest(uri, body)
            .then(function(data) { // data is the response code
                if (data.toString().substr(0, 1) == 2) { // success = 2xx
                    ref.eventCount++;
                    if (ref.eventCount < nEvents - 1) { /////////////////////////////////////////////////
                        return subscribe2(baseURI, ...events); // recursive
                    }
                }
            })
            .catch(function(err) {
                console.error(err);
            });
    }
}

module.exports = Station;