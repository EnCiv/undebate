#!/usr/bin/env node
'use strict';

var MongoClient = require('mongodb').MongoClient;

var start=new Date();
start.setDate(start.getDate()-1); // start yesterday


// colors on bash console
const Reset = "\x1b[0m"
const Bright = "\x1b[1m"
const Dim = "\x1b[2m"
const Underscore = "\x1b[4m"
const Blink = "\x1b[5m"
const Reverse = "\x1b[7m"
const Hidden = "\x1b[8m"

const FgBlack = "\x1b[30m"
const FgRed = "\x1b[31m"
const FgGreen = "\x1b[32m"
const FgYellow = "\x1b[33m"
const FgBlue = "\x1b[34m"
const FgMagenta = "\x1b[35m"
const FgCyan = "\x1b[36m"
const FgWhite = "\x1b[37m"

const BgBlack = "\x1b[40m"
const BgRed = "\x1b[41m"
const BgGreen = "\x1b[42m"
const BgYellow = "\x1b[43m"
const BgBlue = "\x1b[44m"
const BgMagenta = "\x1b[45m"
const BgCyan = "\x1b[46m"
const BgWhite = "\x1b[47m"

const colorLevel={
    error: FgRed+Reverse,
    warn: FgYellow+Reverse,
    debug: FgCyan,
    info: Reset,
    trace: Reset
}

function polldb(){
    var p1= new Promise((ok,ko)=>{
        this.db.collection('logs').find({startTime: {"$gt": this.start}})
        .sort({startTime: 1})
        .limit(args.limit || 0)
        .toArray((err,logs)=>{
            if(err) ko(err);
            else if(!logs.length) {
                this.pollcount= this.pollcount+1 || 1; // might not be initialized
                process.stdout.write(".");
                ok(); // if no date, come back later
            } else {
                if(this.pollcount){
                    this.pollcount=0;
                    process.stdout.write('\n');
                }
                logs.forEach(log=>{
                        console.log(colorLevel[log.level]+log.startTime.toLocaleTimeString(undefined,{timeStyle: "short"}), log.source, log.level, Reset, log.data);
                })
                this.start=logs[logs.length-1].startTime;
                ok();
            }
        })
    });
    p1.then(()=>setTimeout(()=>polldb.call(this),5000),
        err=>{console.info("closing",err); this.client.close();}
    )
}

// fetch args from command line
var argv=process.argv;
var args={};
for(let arg=2;arg<argv.length;arg++){
    switch(argv[arg]){
        case "db": // the mongo database URI
            args[argv[arg]]=argv[++arg];
            break;
        case 'limit':
            args[argv[arg]]=parseInt(argv[++arg]);
            break;
        case 'start':
            args[argv[arg]]=new Date((new Date()).getTime() + parseInt(argv[++arg])*60000);
            break;
        default: 
            console.error("ignoring unexpected argument:",argv[arg]);
    }
}



MongoClient.connect(args.db).then(client => {
    console.log("Connected to server:", args.db);
    this.client=client;
    this.db=client.db();
    this.start=args.start || start;
    polldb.call(this);
});

