"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadModule;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function loadModule(directory, name) {
  let jsModule = false;

  if (process.env.JEST_WORKER_ID) {
    jest.useFakeTimers();
  }

  jsModule = require(_path.default.resolve(process.env.PWD, directory, name));

  if (process.env.JEST_WORKER_ID) {
    jest.useRealTimers();
  }

  if (Object.keys(jsModule).length > 0) {
    return jsModule;
  } else {
    throw new Error(`The module ${_path.default.join(directory, name)} doesn't export anything! You must export function/s with module.exports = {...}`);
  }
}