"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _presetEnv = _interopRequireDefault(require("@babel/preset-env"));

var _pluginProposalNullishCoalescingOperator = _interopRequireDefault(require("@babel/plugin-proposal-nullish-coalescing-operator"));

var _pluginProposalOptionalChaining = _interopRequireDefault(require("@babel/plugin-proposal-optional-chaining"));

var _standalone = require("@babel/standalone");

var _terser = require("terser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const couchjs = async source => {
  let out = (0, _standalone.transform)(source, {
    presets: [_presetEnv.default],
    plugins: [_pluginProposalNullishCoalescingOperator.default, _pluginProposalOptionalChaining.default],
    //@ts-ignore
    targets: 'firefox 78',
    sourceType: 'script',
    assumptions: {
      noDocumentAll: true
    }
  }); // console.log("Babel :", out.code)

  let outm = await (0, _terser.minify)({
    'file.js': out.code
  }, {
    module: false
  }); // console.log("Minify :", outm)

  return outm.code;
};

var _default = couchjs;
exports.default = _default;