"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectSorts = exports.selectSort = exports.createSortsSubslice = exports.cmpString = exports.cmpNumeric = exports.cmpDate = exports.cmpClause = exports.SortType = exports.SortDirection = void 0;
exports.sortData = sortData;
exports.sortFunc = void 0;
exports.sortOptions = sortOptions;
exports.sortSet = void 0;

var _sortFunc;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SortType = {
  STRING: 0,
  NUMERIC: 1,
  CLAUSE: 2,
  DATE: 3
};
exports.SortType = SortType;
var SortDirection = {
  NONE: 'NONE',
  ASC: 'ASC',
  DESC: 'DESC'
};
exports.SortDirection = SortDirection;

var parseNumber = function parseNumber(value) {
  // Return the value as-is if it's already a number
  if (typeof value === 'number') return value; // Build regex to strip out everything except digits, decimal point and minus sign

  var regex = new RegExp('[^0-9-.]', ['g']);
  var unformatted = parseFloat(('' + value).replace(regex, '')); // This will fail silently

  return !isNaN(unformatted) ? unformatted : 0;
};

var cmpNumeric = function cmpNumeric(a, b) {
  var A = parseNumber(a);
  var B = parseNumber(b);
  return A - B;
};

exports.cmpNumeric = cmpNumeric;

var cmpClause = function cmpClause(a, b) {
  var A = a.split('.');
  var B = b.split('.');

  for (var i = 0; i < Math.min(A.length, B.length); i++) {
    if (A[i] !== B[i]) {
      // compare as a number if it looks like a number
      // otherwise, compare as string
      if (!isNaN(A[i]) && !isNaN(B[i])) {
        return parseNumber(A[i]) - parseNumber(B[i], 10);
      } else {
        return A[i] < B[i] ? -1 : 1;
      }
    }
  } // Equal so far, so straight string compare


  return A < B ? -1 : A > B ? 1 : 0;
};

exports.cmpClause = cmpClause;

var cmpString = function cmpString(a, b) {
  var A = ('' + a).toLowerCase();
  var B = ('' + b).toLowerCase();
  return A < B ? -1 : A > B ? 1 : 0;
};

exports.cmpString = cmpString;

var cmpDate = function cmpDate(a, b) {
  return a - b;
};

exports.cmpDate = cmpDate;
var sortFunc = (_sortFunc = {}, _defineProperty(_sortFunc, SortType.NUMERIC, cmpNumeric), _defineProperty(_sortFunc, SortType.CLAUSE, cmpClause), _defineProperty(_sortFunc, SortType.STRING, cmpString), _defineProperty(_sortFunc, SortType.DATE, cmpDate), _sortFunc);
exports.sortFunc = sortFunc;

function sortData(sorts, getField, entities, ids) {
  var sortedIds = ids.slice();

  var _iterator = _createForOfIteratorHelper(sorts.by),
      _step;

  try {
    var _loop = function _loop() {
      var dataKey = _step.value;
      var _sorts$settings$dataK = sorts.settings[dataKey],
          direction = _sorts$settings$dataK.direction,
          type = _sorts$settings$dataK.type;
      if (direction !== SortDirection.ASC && direction !== SortDirection.DESC) return {
        v: void 0
      };
      var cmpFunc = sortFunc[type];
      sortedIds = sortedIds.sort(function (id_a, id_b) {
        return cmpFunc(getField(entities[id_a], dataKey), getField(entities[id_b], dataKey));
      });
      if (direction === SortDirection.DESC) sortedIds.reverse();
    };

    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _ret = _loop();

      if (_typeof(_ret) === "object") return _ret.v;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return sortedIds;
}

function sortOptions(sort, options) {
  var direction = sort.direction,
      type = sort.type;
  var sortedOptions = options;

  if (direction === SortDirection.ASC || direction === SortDirection.DESC) {
    var cmpFunc = sortFunc[type];
    sortedOptions = sortedOptions.sort(function (itemA, itemB) {
      return cmpFunc(itemA.value, itemB.value);
    });
    if (direction === SortDirection.DESC) sortedOptions.reverse();
  }

  return sortedOptions;
}

function _setSort(sorts, dataKey, direction) {
  var by = sorts.by,
      settings = sorts.settings;

  if (by.indexOf(dataKey) >= 0) {
    if (direction === SortDirection.NONE) by = by.filter(function (d) {
      return d !== dataKey;
    }); // remove from sort by list
  } else {
    by = by.slice();
    by.unshift(dataKey);
  }

  if (direction !== settings[dataKey].direction) {
    settings = _objectSpread(_objectSpread({}, settings), {}, _defineProperty({}, dataKey, _objectSpread(_objectSpread({}, settings[dataKey]), {}, {
      direction: direction
    })));
  }

  return _objectSpread(_objectSpread({}, sorts), {}, {
    by: by,
    settings: settings
  });
}

function sortsInit(fields) {
  var settings = {};

  for (var _i = 0, _Object$entries = Object.entries(fields); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        dataKey = _Object$entries$_i[0],
        field = _Object$entries$_i[1];

    if (field.dontSort) continue;
    var type = field.sortType || SortType.STRING;
    if (!Object.values(SortType).includes(type)) console.error("Invalid sort type ".concat(type, " for dataKey=").concat(dataKey));
    var direction = field.sortDirection || SortDirection.NONE;
    if (!Object.values(SortDirection).includes(direction)) console.error("Invalid sort direction ".concat(direction, " for dataKey=").concat(dataKey));
    var getField = field.getField;
    if (getField && typeof getField !== 'function') console.error("Invalid getField; needs to be a function getField(rowData, dataKey)");
    settings[dataKey] = {
      type: type,
      direction: direction,
      getField: getField
    };
  }

  return {
    by: [],
    settings: settings
  };
}

var name = 'sorts';

var createSortsSubslice = function createSortsSubslice(dataSet, fields) {
  return {
    name: name,
    initialState: _defineProperty({}, name, sortsInit(fields)),
    reducers: {
      setSort: function setSort(state, action) {
        var _action$payload = action.payload,
            dataKey = _action$payload.dataKey,
            direction = _action$payload.direction;
        state[name] = _setSort(state[name], dataKey, direction);
      }
    }
  };
};
/* Actions */


exports.createSortsSubslice = createSortsSubslice;

var sortSet = function sortSet(dataSet, dataKey, direction) {
  return {
    type: dataSet + '/setSort',
    payload: {
      dataKey: dataKey,
      direction: direction
    }
  };
};
/* Selectors */


exports.sortSet = sortSet;

var selectSorts = function selectSorts(state, dataSet) {
  return state[dataSet][name];
};

exports.selectSorts = selectSorts;

var selectSort = function selectSort(state, dataSet, dataKey) {
  return state[dataSet][name].settings[dataKey];
};

exports.selectSort = selectSort;