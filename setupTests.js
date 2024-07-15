import '@testing-library/jest-dom/extend-expect';

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

if (typeof performance === 'undefined') {
  global.performance = {};
}

if (typeof performance.markResourceTiming === 'undefined') {
  performance.markResourceTiming = () => {};
}

if (typeof performance.measure === 'undefined') {
  performance.measure = () => {};
}

global.clearImmediate = global.clearImmediate || function (immediateId) {
    clearTimeout(immediateId);
};
