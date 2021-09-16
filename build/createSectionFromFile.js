"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _promises = _interopRequireDefault(require("fs/promises"));

var _loadModule = _interopRequireDefault(require("./loadModule"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const extractFileStats = (directory, fileName) => {
  let fileParts = fileName.split('.');
  let isJSON = fileParts[fileParts.length - 1].toLowerCase() === 'json';
  let isJavaScript = fileParts[fileParts.length - 1].toLowerCase() === 'js';
  let isLib = false;
  let name = fileParts[0];

  let filePath = _path.default.join(directory, fileName);

  if (!isJSON && fileParts.length === 3) isLib = true;
  return {
    isJSON,
    isLib,
    name,
    filePath,
    isJavaScript
  };
};

const nameRegexp = /^function\s{1,}(\S{1,})\s{0,}\(/;

const createSectionFromFile = (directory, fileName) => {
  return new Promise((resolve, reject) => {
    let fileStats = extractFileStats(directory, fileName);

    if (!fileStats.isJavaScript || fileStats.isLib) {
      _promises.default.readFile(fileStats.filePath, {
        encoding: 'utf8'
      }).then(content => {
        if (fileStats.isJSON) {
          try {
            let jsonObject = JSON.parse(content.trim());
            resolve({
              [fileStats.name]: jsonObject
            });
          } catch (err) {
            reject(`Bad content in ${fileStats.filePath}. It must be valid json! ${err.message}`);
          }
        } else {
          resolve({
            [fileStats.name]: content.trim()
          });
        }
      }, err => reject(`Bad structure! ${fileStats.filePath} must be regular file! ${err.message}`));
    } else {
      (0, _loadModule.default)(directory, fileStats.name).then(designModule => {
        let moduleFunctions = Object.keys(designModule).map(funcName => {
          let functionString = designModule[funcName].toString();
          let functionName = nameRegexp.exec(functionString)[1];
          let designFunction = functionString.replace(nameRegexp, 'function (');
          return {
            functionName,
            designFunction
          };
        });

        if (moduleFunctions.length === 1 && moduleFunctions[0].functionName === fileStats.name) {
          resolve({
            [fileStats.name]: moduleFunctions[0].designFunction
          });
        } else {
          let moduleFunctionsObject = {};
          moduleFunctions.forEach(moduleFunction => {
            moduleFunctionsObject = Object.assign(moduleFunctionsObject, {
              [moduleFunction.functionName]: moduleFunction.designFunction
            });
          });
          resolve({
            [fileStats.name]: moduleFunctionsObject
          });
        }
      }, err => reject(`Can't load module from ${fileStats.filePath}! ${err.message}`));
    }
  });
};

var _default = createSectionFromFile;
exports.default = _default;