const environment = require('../build/testing/testEnvironment').testEnvironment("ad56076cdd3fb5c9b83d976fecfcb1b4");
require = environment.require;
const emit = environment.emit;
const log = environment.log;
const isArray = Array.isArray;
const sum = environment.sum;
const toJSON = JSON.stringify;
const getRow = environment.getRow;
const provides = environment.provides;
const registerType = environment.registerType;
const start = environment.start;
const send = environment.send;
const index = environment.index;
const exports = module.exports;
//Original content 


module.exports.libfunction = function (){
   return 'libfunction call updated';
   // https://docs.couchdb.org/en/stable/query-server/javascript.html?highlight=commonJS%20modules#commonjs-modules
}
