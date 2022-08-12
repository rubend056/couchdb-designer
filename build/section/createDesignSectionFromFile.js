"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promises = _interopRequireDefault(require("fs/promises"));

var _loadModule = _interopRequireDefault(require("../util/loadModule"));

var _extractFileStats = _interopRequireDefault(require("../util/extractFileStats"));

var _couchjsLoader = _interopRequireDefault(require("./couchjs-loader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const nameRegexp = /^function\s{1,}(\S{1,})\s{0,}\(/;

const createDesignSectionFromFile = async (directory, fileName) => {
  let fileStats = (0, _extractFileStats.default)(directory, fileName);

  if (!fileStats.isJavaScript || fileStats.isLib) {
    try {
      const content = await _promises.default.readFile(fileStats.filePath, {
        encoding: 'utf8'
      });

      if (fileStats.isJSON) {
        try {
          let jsonObject = JSON.parse(content.trim());
          return {
            [fileStats.name]: jsonObject
          };
        } catch (err) {
          throw typeof err === 'string' ? err : `Bad content in ${fileStats.filePath}. It must be valid json! ${err.message}`;
        }
      } else {
        return {
          [fileStats.name]: content.trim()
        };
      }
    } catch (err) {
      throw typeof err === 'string' ? err : `Bad structure! ${fileStats.filePath} must be regular file! ${err.message}`;
    }
  } else {
    try {
      const designModule = await (0, _loadModule.default)(directory, fileStats.name);
      let moduleKeys = Object.keys(designModule);

      if (moduleKeys.length === 1 && moduleKeys[0] === fileStats.name) {
        let functionString = designModule[moduleKeys[0]].toString();
        functionString = await (0, _couchjsLoader.default)(functionString);
        let designFunction = functionString.replace(nameRegexp, 'function (');
        return {
          [fileStats.name]: designFunction
        };
      } else {
        let elemenets = {};

        for (const element of moduleKeys) {
          if (typeof designModule[element] === 'function') {
            const functionString = designModule[element].toString();
            functionString = await (0, _couchjsLoader.default)(functionString);
            let designFunction = functionString.replace(nameRegexp, 'function (');
            elemenets = Object.assign(elemenets, {
              [element]: designFunction
            });
          } else {
            elemenets = Object.assign(elemenets, {
              [element]: designModule[element]
            });
          }
        }

        return {
          [fileStats.name]: elemenets
        };
      }
    } catch (err) {
      throw typeof err === 'string' ? err : `Can't load module from ${fileStats.filePath}! ${err.message}`;
    }
  }
};

var _default = createDesignSectionFromFile;
exports.default = _default;