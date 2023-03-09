"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFiltersSubslice = exports.clearFilter = exports.clearAllFilters = exports.addFilter = exports.FilterType = void 0;
exports.filterData = filterData;
exports.setFilter = exports.selectFilters = exports.selectFilter = exports.removeFilter = exports.globalFilterKey = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// filter.js - filter utility
//
// Began life here https://github.com/koalyptus/TableFilter
//
var FilterType = {
  EXACT: 0,
  CONTAINS: 1,
  REGEX: 2,
  NUMERIC: 3,
  STRING: 4,
  CLAUSE: 5,
  PAGE: 6
};
exports.FilterType = FilterType;
var globalFilterKey = '__global__';
exports.globalFilterKey = globalFilterKey;

var parseNumber = function parseNumber(value) {
  // Return the value as-is if it's already a number
  if (typeof value === 'number') return value; // Build regex to strip out everything except digits, decimal point and minus sign

  var regex = new RegExp('[^0-9-.]', ['g']);
  var unformatted = parseFloat(('' + value).replace(regex, '')); // This will fail silently

  return !isNaN(unformatted) ? unformatted : 0;
};
/* Exact match
 * Exact if truthy true, but any truthy false will match
 */


var cmpExact = function cmpExact(d, val) {
  return d ? d === val : !val;
};
/* Clause match
 */


var cmpClause = function cmpClause(d, val) {
  var len = val.length;
  if (len && val[len - 1] === '.') len = len - 1;
  return d === val || d && d.substring(0, len) === val.substring(0, len) && d[len] === '.';
};
/* Page match:
 * floating point number => match page and line
 * Integer value => match page
 */


var cmpPage = function cmpPage(d, val) {
  var n = parseNumber(val);
  return val.search(/\d+\./) !== -1 ? d === n : Math.round(d) === n;
};

var cmpRegex = function cmpRegex(d, regex) {
  return regex.test(d);
};

function cmpValue(comp, d) {
  var value = comp.value,
      filterType = comp.filterType;
  var regex, parts;

  switch (filterType) {
    case FilterType.EXACT:
      return cmpExact(d, value);

    case FilterType.REGEX:
      parts = value.split('/');

      if (value[0] === '/' && parts.length > 2) {
        try {
          regex = new RegExp(parts[1], parts[2]);
        } catch (err) {
          console.error(err);
        }
      }

      return regex ? cmpRegex(d, regex) : false;

    case FilterType.CONTAINS:
      try {
        regex = new RegExp(value, 'i');
      } catch (err) {
        console.error(err);
      }

      return regex ? cmpRegex(d, regex) : false;

    case FilterType.CLAUSE:
      return cmpClause(d, value);

    case FilterType.PAGE:
      return cmpPage(d, value);

    default:
      console.error("Unexpected filter type ".concat(filterType));
      return false;
  }
}
/*
 * Applies the column filters in turn to the data.
 * Returns a list of ids that meet the filter requirements.
 */


function filterData(filters, getField, entities, ids) {
  var filteredIds = ids.slice();
  var dataKeys = Object.keys(filters).filter(function (dataKey) {
    return dataKey !== '__global__';
  }); // Apply the column filters

  var _iterator = _createForOfIteratorHelper(dataKeys),
      _step;

  try {
    var _loop = function _loop() {
      var dataKey = _step.value;
      var comps = filters[dataKey].comps;
      if (comps.length === 0) return "continue";
      filteredIds = filteredIds.filter(function (id) {
        return comps.reduce(function (result, comp) {
          return result || cmpValue(comp, getField(entities[id], dataKey));
        }, false);
      });
    };

    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _ret = _loop();

      if (_ret === "continue") continue;
    } // Apply the global filter

  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  if (filters[globalFilterKey]) {
    var comps = filters[globalFilterKey].comps;

    if (comps.length) {
      var comp = comps[0];
      filteredIds = filteredIds.filter(function (id) {
        var entity = entities[id];
        return dataKeys.reduce(function (result, dataKey) {
          return result || cmpValue(comp, getField(entity, dataKey));
        }, false);
      });
    }
  }

  return filteredIds;
}

var filterCreate = function filterCreate(_ref) {
  var options = _ref.options;
  return {
    options: options,
    // Array of {label, value} objects
    comps: [] // Array of compare objects where a compare object {value, FilterType}

  };
};

function filtersInit(fields) {
  var filters = {};

  for (var _i = 0, _Object$entries = Object.entries(fields); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        dataKey = _Object$entries$_i[0],
        field = _Object$entries$_i[1];

    if (!field.dontFilter) filters[dataKey] = filterCreate(field);
  }

  filters[globalFilterKey] = filterCreate({});
  return filters;
}

var name = 'filters';

var createFiltersSubslice = function createFiltersSubslice(dataSet, fields) {
  return {
    name: name,
    initialState: _defineProperty({}, name, filtersInit(fields)),
    reducers: {
      setFilter: function setFilter(state, action) {
        var filters = state[name];
        var _action$payload = action.payload,
            dataKey = _action$payload.dataKey,
            comps = _action$payload.comps;
        var filter = filterCreate(filters[dataKey] || {});
        filter.comps = comps;
        filters[dataKey] = filter;
      },
      addFilter: function addFilter(state, action) {
        var filters = state[name];
        var _action$payload2 = action.payload,
            dataKey = _action$payload2.dataKey,
            value = _action$payload2.value,
            filterType = _action$payload2.filterType;
        filters[dataKey].comps.push({
          value: value,
          filterType: filterType
        });
      },
      removeFilter: function removeFilter(state, action) {
        var filters = state[name];
        var _action$payload3 = action.payload,
            dataKey = _action$payload3.dataKey,
            value = _action$payload3.value,
            filterType = _action$payload3.filterType;
        filters[dataKey].comps = filters[dataKey].comps.filter(function (comp) {
          return comp.value !== value || comp.filterType !== filterType;
        });
      },
      clearFilter: function clearFilter(state, action) {
        var filters = state[name];
        var dataKey = action.payload.dataKey;
        filters[dataKey] = filterCreate(filters[dataKey]);
      },
      clearAllFilters: function clearAllFilters(state, action) {
        state[name] = filtersInit(state[name]);
      }
    }
  };
};
/* Actions */


exports.createFiltersSubslice = createFiltersSubslice;

var setFilter = function setFilter(dataSet, dataKey, comps) {
  return {
    type: dataSet + '/setFilter',
    payload: {
      dataKey: dataKey,
      comps: comps
    }
  };
};

exports.setFilter = setFilter;

var addFilter = function addFilter(dataSet, dataKey, value, filterType) {
  return {
    type: dataSet + '/addFilter',
    payload: {
      dataKey: dataKey,
      value: value,
      filterType: filterType
    }
  };
};

exports.addFilter = addFilter;

var removeFilter = function removeFilter(dataSet, dataKey, value, filterType) {
  return {
    type: dataSet + '/removeFilter',
    payload: {
      dataKey: dataKey,
      value: value,
      filterType: filterType
    }
  };
};

exports.removeFilter = removeFilter;

var clearFilter = function clearFilter(dataSet, dataKey) {
  return {
    type: dataSet + '/clearFilter',
    payload: {
      dataKey: dataKey
    }
  };
};

exports.clearFilter = clearFilter;

var clearAllFilters = function clearAllFilters(dataSet) {
  return {
    type: dataSet + '/clearAllFilters'
  };
};
/* Selectors */


exports.clearAllFilters = clearAllFilters;

var selectFilters = function selectFilters(state, dataSet) {
  return state[dataSet][name];
};

exports.selectFilters = selectFilters;

var selectFilter = function selectFilter(state, dataSet, dataKey) {
  return state[dataSet][name][dataKey];
};

exports.selectFilter = selectFilter;