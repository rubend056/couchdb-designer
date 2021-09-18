"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promises = _interopRequireDefault(require("fs/promises"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createTestContextModule = (fileStats, testContextName, signal) => {
  if (!signal.aborted) {
    return new Promise((resolve, reject) => {
      _promises.default.readFile(fileStats.filePath, {
        encoding: 'utf8'
      }).then(content => {
        let moduleContent = `const environment = require('../build/testing/testEnvironment').testEnvironment("${testContextName}");\n` + 'require = environment.require;\n' + 'const emit = environment.emit' + `//original\n${content}`;

        _promises.default.writeFile(_path.default.resolve(__dirname, fileStats.testPath), moduleContent, {
          signal
        }).then(resolve, reject);
      }, err => reject(err));
    });
  }
};

var _default = createTestContextModule;
exports.default = _default;