const environment = require('../build/testing/testEnvironment').testEnvironment("e8a285790e3eb51fc6a7e198b57fd5ea");
require = environment.require;
const emit = environment.emit//original



function updateFromDir(doc,req){
    var probalib = require('lib/couchdb').libfunction;
    return [doc,probalib()];
}

module.exports = { updateFromDir }