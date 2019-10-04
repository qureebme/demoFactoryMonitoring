let request = require('request'),
    chalk = require('chalk'),

    myIP = '192.168.3.100';

    class Station {
        constructor(name, ip, eventPort) {
            this.name = name;
            this.ip = ip; // ip of the real station
            this.eventPort = eventPort; // for instances of this object
            this.baseURI = "http://" + ip + "/rest/events/"; // for subscriptions
            this.baseURI2 = "http://" + ip + "/rest/services/"; // for service consumption

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

        makeServicePost(uri, body){
            var ref = this;
            return new Promise(function(resolve, reject){
                request.post({uri: ref.baseURI2 + uri, json: true, body: body}, function(err, res, body){
                    //if(res.statusCode.toString().substr(0,1) == 2) resolve(res.body)
                    if (res) resolve(res.body)
                })
            })
        }

        //make a POST request (for subscriptions)
        makeSubscriptionPost(uri, body) {
            var ref = this;
            return new Promise(function(resolve, reject) {
                request.post({ uri: uri, json: true, body: body }, function(err, res, body) {
                    if (res) {
                        resolve(res.statusCode);
                    } else console.log('line 65...', uri) //in case it's broken
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
                            //console.log(ref.name, ref.events[ref.eventCount], 'SUBSCRIBED!');
                            ref.eventCount++;
                            if (ref.eventCount < ref.nEvents) {
                                return ref.subscribe(); // recursive
                            }
                            else if(ref.eventCount == ref.nEvents) {
                                console.log(chalk.green(`${ref.name}: all subscriptions successful!`))
                            }
                        } 
                    })
                    .catch(function(err) {
                        console.error(`Subscription error in, ${ref.name}, ${err}`);
                    });
            } else {
                console.log(ref.name, chalk.yellow(': No events specified, therefore no subscriptions.'));
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
                if (res){
                    this.inputs = Object.keys(res.body);
                    this.nInputs = this.inputs.length;
                    setTimeout(() => socket.emit('initialStatus', res.body), 2000)
                }
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

        light(color, state){
            let ref = this;
            let uri = 'light' + color;
            ref.makeServicePost('showLights', {})
                .then((outputs) => {
                    if ((color == 'Red') && (outputs.d1 !== state)) ref.makeServicePost(uri, {})
                    else if ((color == 'Amber') && (outputs.d2 !== state)) ref.makeServicePost(uri, {})
                    else if ((color == 'Green') && (outputs.d3 !== state)) ref.makeServicePost(uri, {})
                })
                .catch((err) => console.log(chalk.red.bold('Error in lighting:', ref.name, uri)))
            /*ref.makeServicePost(uri, {})
                .then((data) => {
                    if (state != data.status) ref.makeServicePost(uri, {})
                })
                .catch((err) => console.log(chalk.red.bold('Error in lighting:', ref.name, uri)))*/
        }

        //run a server
        runServer(){
            // each station instance must implement on its own
        }
    }

module.exports = Station;