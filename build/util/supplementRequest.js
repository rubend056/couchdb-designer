"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _testEnvironment = require("../../build/testing/testEnvironment");

var _crypto = _interopRequireDefault(require("crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const supplementRequest = (request = {}, id, contextId, uri, preSupplement = false) => {
  if (!preSupplement && request.__supplemented) {
    let {
      __supplemented,
      ...req
    } = request;
    return req;
  } else {
    let {
      database,
      update_seq,
      secObj,
      userCtx
    } = (0, _testEnvironment.getTestContext)(contextId);
    let req = Object.assign(request, {
      secObj
    });
    let headers = {
      Accept: '*/*',
      Host: 'localhost:5984',
      'User-Agent': 'couchdb-designer/testing environment'
    };
    let info = {
      db_name: database.name,
      doc_count: database.length,
      doc_del_count: 0,
      update_seq: update_seq,
      purge_seq: 0,
      compact_running: false,
      sizes: {
        active: 0,
        disk: 0,
        external: 0
      },
      instance_start_time: Date.now().valueOf(),
      disk_format_version: 6,
      committed_update_seq: update_seq
    };
    req.userCtx = req.userCtx ? req.userCtx : userCtx;
    req.body = req.body ? req.body : 'undefined';
    req.headers = req.headers ? req.headers : headers;
    req.form = req.form ? req.form : {};
    req.query = req.query ? req.query : {};
    req.cookie = req.cookie ? req.cookie : {};
    req.method = req.method ? req.method : 'POST';
    req.peer = req.peer ? req.peer : '127.0.0.1';
    req.uuid = req.uuid ? req.uuid : _crypto.default.createHash('md5').update(Date.now().valueOf().toString()).digest('hex');
    req.path = uri.split('/');
    req.id = id ? id : null;
    if (req.id !== null) req.path.push(id);
    req.requested_path = req.path;
    req.raw_path = `/${req.path.join('/')}`;
    req.info = info;

    if (preSupplement) {
      return { ...req,
        __supplemented: true
      };
    }

    return req;
  }
};

var _default = supplementRequest;
exports.default = _default;