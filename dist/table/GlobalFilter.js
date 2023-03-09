"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _form = require("../form");

var _appTableData = require("../store/appTableData");

var _excluded = ["dataSet"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function GlobalFilter(_ref) {
  var dataSet = _ref.dataSet,
      otherProps = _objectWithoutProperties(_ref, _excluded);

  var inputRef = _react.default.useRef();

  var dispatch = (0, _reactRedux.useDispatch)();

  var selectGlobalFilter = _react.default.useCallback(function (state) {
    return (0, _appTableData.selectFilter)(state, dataSet, _appTableData.globalFilterKey);
  }, [dataSet]);

  var globalFilter = (0, _reactRedux.useSelector)(selectGlobalFilter);
  var value = globalFilter && globalFilter.comps.length > 0 ? globalFilter.comps[0].value : '';

  _react.default.useEffect(function () {
    if (value === '//') inputRef.current.setSelectionRange(1, 1);
  }, [value]);

  var setGlobalFilter = function setGlobalFilter(newValue) {
    if (!value && newValue === '/') {
      // If search is empty and / is pressed, then add // to search
      // and position the cursor between the slashes (using the useEffect above)
      newValue = '//';
    }

    var comp = {
      value: newValue,
      filterType: _appTableData.FilterType.CONTAINS
    };

    if (newValue[0] === '/') {
      var parts = newValue.split('/');

      if (parts.length > 2) {
        // User is entering a regex in the form /pattern/flags.
        // If the regex doesn't validate then ignore it
        try {
          new RegExp(parts[1], parts[2]);
          comp.filterType = _appTableData.FilterType.REGEX;
        } catch (err) {}
      }
    }

    dispatch((0, _appTableData.setFilter)(dataSet, _appTableData.globalFilterKey, [comp]));
  };

  return /*#__PURE__*/_react.default.createElement(_form.Input, _extends({
    type: "search",
    value: value,
    ref: inputRef,
    onChange: function onChange(e) {
      return setGlobalFilter(e.target.value);
    },
    placeholder: "Search..."
  }, otherProps));
}

GlobalFilter.propTypes = {
  dataSet: _propTypes.default.string.isRequired
};
var _default = GlobalFilter;
exports.default = _default;