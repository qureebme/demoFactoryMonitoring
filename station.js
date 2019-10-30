let request = require('request'),
    chalk = require('chalk'),

    myIP = '192.168.3.100';

    class Station {
        constructor(name, ip, eventPort) {
            this.name = name;
            this.ip = ip;
            this.eventPort = eventPort;
            this.baseURI = "http://" + ip + "/rest/events/";
            this.baseURI2 = "http://" + ip + "/rest/services/";

            this.events = undefined;
            this.eventCount = 0;
            this.inputs = undefined;
            this.outputs = undefined;
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
                    } else console.log(`${ref.name}: ${chalk.red('Subscription problem')}: ${chalk.red(uri)}`)
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
                    .then(function(data) {
                        if (data.toString().substr(0, 1) == 2) {
                            ref.eventCount++;
                            if (ref.eventCount < ref.nEvents) {
                                return ref.subscribe();
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
                    
                    if (code == 2){
                        console.log(`${ref.name} has unsubscribed from all events`)
                        console.log(`${ref.name}: ${chalk.red.bold('no monitoring will be done')}`)
                    }
                    else if(code == 4){ // failure
                        console.log(`${ref.name}: $chalk.yellow{'has no events subscribed'}`)
                    }
                    else{
                        //dunno
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
                    ioObj.emit('initialStateError');
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

        }

        //run a server
        runServer(){
            // each station instance must implement on its own
        }
    }

module.exports = Station;