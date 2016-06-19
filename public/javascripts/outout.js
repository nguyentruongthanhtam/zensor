var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var child;

//Put path to mongoexport here
mel = "/Users/tamnguyen/sensorNode/sensorApp/mongodb/bin/mongoexport"
module.exports = function(inC){
	console.log(inC);
function mongoexport(collection)
{
        out_string = mel + " --db sensorApp --collection \"" +inC+"\" --out /Users/tamnguyen/sensorNode/sensorApp/public/22052016.json";
        child = exec(out_string, function (error, stdout, stderr) 
        {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                        console.log('exec error: ' + error);
                }
        })
        
}


mongoexport(process.argv[2]);

};

