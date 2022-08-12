"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = designer;

var _promises = _interopRequireDefault(require("fs/promises"));

var _createDesignDocument = _interopRequireDefault(require("./createDesignDocument"));

var _createMangoDocument = _interopRequireDefault(require("./createMangoDocument"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function designer(root) {
  const names = await _promises.default.readdir(root);
  return await Promise.all(names.map(name => {
    if (/.*\.json$/.test(name.toLowerCase())) {
      return (0, _createMangoDocument.default)(root, name);
    } else {
      return (0, _createDesignDocument.default)(_path.default.join(root, name));
    }
  })).catch(err => {
    throw err;
  });
}