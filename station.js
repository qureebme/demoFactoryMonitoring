let request = require('request'),
    chalk = require('chalk')

    myIP = '192.168.3.100';

    class Station {
        constructor(name, ip, eventPort) {
            this.name = name;
            this.ip = ip; // ip of the real station
            this.eventPort = eventPort; // for instances of this object
            this.baseURI = "http://" + ip + "/rest/events/"; // for subscriptions

            this.events = undefined; // events array
            this.eventCount = 0; // num of successful subscriptions

            this.inputs = undefined; // array
            this.inputCount = 0; // same idea as eventCount (initial input statuses)

            this.outputs = undefined; // array
            this.outputCount = 0; // same idea as eventCount (initial output statuses)
            //this.nInputs
            //this.nOutputs
            //this.nEvents
        }

        // specify events as an array
        getEvents(arr) {
            var ref = this;
            ref.events = arr;
            ref.nEvents = arr.length;
        }

        // make a POST request (for fetching IO values) // DELETE?
        fetchIOstatus(uri, body) {
            var ref = this;
            return new Promise(function(resolve, reject) {
                request.post({ uri: uri, json: true, body: {} }, function(err, res, body) {
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
                    } else reject(new Error(ref.name + ": 1 subscription failed.   statusCode:", res.statusCode));
                });
            })
        }

        //make subscriptions
        subscribe() {
            var ref = this;
            if (ref.nEvents) {
                var uri = ref.baseURI + ref.events[ref.eventCount] + "/notifs";
                var body = { destUrl: "http://" + myIP + ":" + ref.eventPort };

                ref.makeSubscriptionPost(uri, body)
                    .then(function(data) { // data is the response code to the most recent subscription
                        if (data.toString().substr(0, 1) == 2) { // success = 2xx
                            console.log(ref.events[ref.eventCount], 'SUBSCRIBED!');
                            ref.eventCount++;
                            if (ref.eventCount < ref.nEvents) {
                                return ref.subscribe(); // recursive
                            }
                        } else {
                            // what to do when a subscription fails?***************
                            //NOTIFY THE OPERATOR!
                        }
                    })
                    .catch(function(err) {
                        console.error(err);
                    });
            } else {
                console.log(ref.name, ": No events specified, therefore no subscriptions.");
            }
        }

        //unsubscribe
        unsubscribe(){
            var ref = this,
                uri = ref.baseURI,
                body = {}

                request.delete(uri, function(err, res, body){
                    let code = res.statusCode.toString().substr(0, 1)
                    
                    if (code == 2){ // success
                        console.log(`${ref.name} has unsubscribed from all events`)
                        console.log(`${ref.name}: ${chalk.red.bold('no monitoring will be done')}`)
                    }
                    else if(code == 4){ // failure
                        console.log(`${ref.name} has no events subscribed`)
                    }
                    else{
                        //dunno yet
                    }
                })
        }

        //get the initial statuses of all inputs,
        //for DRAWing the initial state of the GUI
        // This function fetches all the input statuses from the controller,
        // as defined in the showAllInputs Web service
        initInputs(socket) {
            let uri = "http://" + this.ip + "/rest/services/showAllInputs";
            request.post({ uri: uri, json: true, body: {} }, function(err, res, body) {
                this.inputs = Object.keys(res.body);
                this.nInputs = this.inputs.length;

                // and then emit an event carrying the statuses of the Inputs
                setTimeout(() => socket.emit('initialStatus', res.body), 2000)
            })
        }

        initOutputs(ioObj) {
            let uri = "http://" + this.ip + "/rest/services/showAllOutputs";
            request.post({ uri: uri, json: true, body: {} }, function(err, res, body) {
                this.outputs = Object.keys(res.body);
                this.nOutputs = this.outputs.length;

                if (Object.values(res.body).includes(true)) {
                    //problem: an output is set
                    ioObj.emit('initialStateError'); //---> to the front-end
                    console.log("Error: check that no output on the station is active.");
                }
            })
        }

        //run a server
        runServer(){
            // each station instance must implement on its own
        }
    }

module.exports = Station;