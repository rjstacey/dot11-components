"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SplitTableButtonGroup = SplitTableButtonGroup;
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _form = require("../form");

var _TableViewSelector = _interopRequireDefault(require("./TableViewSelector"));

var _TableColumnSelector = _interopRequireDefault(require("./TableColumnSelector"));

var _SplitPanel = require("./SplitPanel");

var _excluded = ["dataSet", "columns"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function SplitTableButtonGroup(_ref) {
  var dataSet = _ref.dataSet,
      columns = _ref.columns,
      otherProps = _objectWithoutProperties(_ref, _excluded);

  return /*#__PURE__*/_react.default.createElement(_form.ButtonGroup, null, /*#__PURE__*/_react.default.createElement("div", null, "Table view"), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/_react.default.createElement(_TableViewSelector.default, {
    dataSet: dataSet
  }), /*#__PURE__*/_react.default.createElement(_TableColumnSelector.default, {
    dataSet: dataSet,
    columns: columns
  }), /*#__PURE__*/_react.default.createElement(_SplitPanel.SplitPanelButton, {
    dataSet: dataSet
  })));
}

SplitTableButtonGroup.propTypes = {
  dataSet: _propTypes.default.string.isRequired,
  columns: _propTypes.default.array.isRequired
};
var _default = SplitTableButtonGroup;
exports.default = _default;