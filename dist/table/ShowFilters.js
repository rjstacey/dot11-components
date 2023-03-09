"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _icons = require("../icons");

var _appTableData = require("../store/appTableData");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ActiveFilterLabel = _styled.default.label(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n\tfont-weight: bold;\n\tline-height: 22px;\n\tmargin: 3px;\n"])));

var ActiveFilterContainer = _styled.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n\tdisplay: flex;\n\tflex-direction: row;\n\theight: 22px;\n\tmax-width: 200px;\n\tmargin: 3px 3px 3px 0;\n\tbackground: #0074d9;\n\tcolor: #fff;\n\tborder-radius: 3px;\n\talign-items: center;\n\t:hover {opacity: 0.9}"])));

var ActiveFilterItem = _styled.default.span(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n\tcolor: #fff;\n\tline-height: 21px;\n\tpadding: 0 0 0 5px;\n\toverflow: hidden;\n\twhite-space: nowrap;\n\ttext-overflow: ellipsis;\n"])));

var ActiveFilter = function ActiveFilter(_ref) {
  var children = _ref.children,
      remove = _ref.remove;
  return /*#__PURE__*/_react.default.createElement(ActiveFilterContainer, {
    role: "listitem",
    direction: "ltr"
  }, children && /*#__PURE__*/_react.default.createElement(ActiveFilterItem, null, children), /*#__PURE__*/_react.default.createElement(_icons.ActionIcon, {
    style: {
      minWidth: 16
    },
    type: "clear",
    onClick: remove
  }));
};

function renderActiveFilters(_ref2) {
  var fields = _ref2.fields,
      filters = _ref2.filters,
      removeFilter = _ref2.removeFilter,
      clearAllFilters = _ref2.clearAllFilters;
  var elements = [];

  var _loop = function _loop() {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        dataKey = _Object$entries$_i[0],
        filter = _Object$entries$_i[1];

    if (dataKey === '__global__') return "continue";

    if (!fields[dataKey]) {
      console.warn("".concat(dataKey, " not present in fields"));
      return "continue";
    }

    var _fields$dataKey = fields[dataKey],
        label = _fields$dataKey.label,
        dataRenderer = _fields$dataKey.dataRenderer;
    var comps = filter.comps,
        options = filter.options;

    if (comps.length > 0) {
      elements.push( /*#__PURE__*/_react.default.createElement(ActiveFilterLabel, {
        key: dataKey
      }, label + ':'));

      var _iterator = _createForOfIteratorHelper(comps),
          _step;

      try {
        var _loop2 = function _loop2() {
          var comp = _step.value;
          var o = options && options.find(function (o) {
            return o.value === comp.value;
          });
          var s = o ? o.label : dataRenderer ? dataRenderer(comp.value) : comp.value;
          if (s === '') s = '(Blank)';
          elements.push( /*#__PURE__*/_react.default.createElement(ActiveFilter, {
            key: "".concat(dataKey, "_").concat(comp.value),
            remove: function remove() {
              return removeFilter(dataKey, comp.value, comp.filterType);
            }
          }, s));
        };

        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop2();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  };

  for (var _i = 0, _Object$entries = Object.entries(filters); _i < _Object$entries.length; _i++) {
    var _ret = _loop();

    if (_ret === "continue") continue;
  }

  if (elements.length > 2) {
    elements.push( /*#__PURE__*/_react.default.createElement(ActiveFilterLabel, {
      key: "clear_all_label"
    }, "Clear All:"));
    elements.push( /*#__PURE__*/_react.default.createElement(ActiveFilter, {
      key: "clear_all",
      remove: clearAllFilters
    }));
  }

  return elements;
}

var FiltersContainer = _styled.default.div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n\tdisplay: flex;\n\tflex-direction: row;\n\twidth: 100%;\n\tpadding: 10px;\n\tbox-sizing: border-box;\n"])));

var FiltersLabel = _styled.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n\tmargin-right: 5px;\n\t& label {\n\t\tfont-weight: bold;\n\t}\n"])));

var FiltersPlaceholder = _styled.default.span(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n\tcolor: #ccc;\n\tmargin-left: 5px;\n"])));

var FiltersContent = _styled.default.div(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n\tflex: 1;\n\tdisplay: flex;\n\tflex-direction: row;\n\tflex-wrap: wrap;\n\talign-content: flex-start;\n\tborder: solid 1px #ccc;\n\tborder-radius: 3px;\n"])));

function ShowFilters(_ref3) {
  var style = _ref3.style,
      className = _ref3.className,
      fields = _ref3.fields,
      dataSet = _ref3.dataSet;
  var dispatch = (0, _reactRedux.useDispatch)();

  var selectfiltersInfo = _react.default.useCallback(function (state) {
    return {
      totalRows: (0, _appTableData.selectIds)(state, dataSet).length,
      shownRows: (0, _appTableData.selectSortedFilteredIds)(state, dataSet).length,
      filters: (0, _appTableData.selectFilters)(state, dataSet)
    };
  }, [dataSet]);

  var _useSelector = (0, _reactRedux.useSelector)(selectfiltersInfo),
      filters = _useSelector.filters,
      totalRows = _useSelector.totalRows,
      shownRows = _useSelector.shownRows;

  var activeFilterElements = _react.default.useMemo(function () {
    var dispatchRemoveFilter = function dispatchRemoveFilter(dataKey, value, filterType) {
      return dispatch((0, _appTableData.removeFilter)(dataSet, dataKey, value, filterType));
    };

    var dispatchClearAllFilters = function dispatchClearAllFilters() {
      return dispatch((0, _appTableData.clearAllFilters)(dataSet));
    };

    return renderActiveFilters({
      fields: fields,
      filters: filters,
      removeFilter: dispatchRemoveFilter,
      clearAllFilters: dispatchClearAllFilters
    });
  }, [dataSet, fields, filters, dispatch]);

  return /*#__PURE__*/_react.default.createElement(FiltersContainer, {
    style: style,
    className: className
  }, /*#__PURE__*/_react.default.createElement(FiltersLabel, null, /*#__PURE__*/_react.default.createElement("label", null, "Filters:"), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("span", null, "Showing ".concat(shownRows, " of ").concat(totalRows))), /*#__PURE__*/_react.default.createElement(FiltersContent, null, activeFilterElements.length ? activeFilterElements : /*#__PURE__*/_react.default.createElement(FiltersPlaceholder, null, "No filters")));
}

ShowFilters.propTypes = {
  dataSet: _propTypes.default.string.isRequired,
  fields: _propTypes.default.object.isRequired
};
var _default = ShowFilters;
exports.default = _default;