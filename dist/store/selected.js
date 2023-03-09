"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleSelected = exports.setSelected = exports.selectSelected = exports.createSelectedSubslice = void 0;

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var name = 'selected';

var createSelectedSubslice = function createSelectedSubslice(dataSet) {
  return {
    name: 'selected',
    initialState: _defineProperty({}, name, []),
    reducers: {
      setSelected: function setSelected(state, action) {
        state[name] = action.payload;
      },
      toggleSelected: function toggleSelected(state, action) {
        var list = state[name];

        var _iterator = _createForOfIteratorHelper(action.payload),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var id = _step.value;
            var i = list.indexOf(id);
            if (i >= 0) list.splice(i, 1);else list.push(id);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    },
    extraReducers: function extraReducers(builder) {
      builder.addMatcher(function (action) {
        return action && action.type && action.type.startsWith(dataSet) && action.type.match(/(removeOne|removeMany|getSuccess)$/);
      }, function (state, action) {
        var list = state[name];
        var ids = state.ids;
        var newList = list.filter(function (id) {
          return ids.includes(id);
        });
        state[name] = newList.length === list.length ? list : newList;
      });
    }
  };
};
/* Actions */


exports.createSelectedSubslice = createSelectedSubslice;

var setSelected = function setSelected(dataSet, ids) {
  return {
    type: dataSet + '/setSelected',
    payload: ids
  };
};

exports.setSelected = setSelected;

var toggleSelected = function toggleSelected(dataSet, ids) {
  return {
    type: dataSet + '/toggleSelected',
    payload: ids
  };
};
/* Selectors */


exports.toggleSelected = toggleSelected;

var selectSelected = function selectSelected(state, dataSet) {
  return state[dataSet][name];
};

exports.selectSelected = selectSelected;