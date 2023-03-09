"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _reactRedux = require("react-redux");

var _form = require("../form");

var _general = require("../general");

var _appTableData = require("../store/appTableData");

var _templateObject, _templateObject2, _templateObject3;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Row = _styled.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n\tmargin: 5px 10px;\n\tdisplay: flex;\n\tjustify-content: space-between;\n\talign-items: center;\n"])));

var ItemList = _styled.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n\tmin-height: 10px;\n\tborder: 1px solid #ccc;\n\tborder-radius: 3px;\n\tmargin: 10px;\n\tpadding: 10px;\n\toverflow: auto;\n"])));

var Item = _styled.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n\toverflow: hidden;\n\twhite-space: nowrap;\n\ttext-overflow: ellipsis;\n\t", "\n\t", "\n\t& > span {\n\t\tmargin: 5px 5px;\n\t\t", "\n\t}\n"])), function (_ref) {
  var disabled = _ref.disabled;
  return disabled && 'text-decoration: line-through;';
}, function (_ref2) {
  var isSelected = _ref2.isSelected;
  return isSelected ? 'background: #0074d9;' : ':hover{background: #ccc;}';
}, function (_ref3) {
  var isSelected = _ref3.isSelected;
  return isSelected && 'color: #fff;';
});

function ColumnSelectorDropdown(_ref4) {
  var dataSet = _ref4.dataSet,
      columns = _ref4.columns;
  var dispatch = (0, _reactRedux.useDispatch)();

  var selectInfo = _react.default.useCallback(function (state) {
    return {
      view: (0, _appTableData.selectCurrentView)(state, dataSet),
      tableConfig: (0, _appTableData.selectCurrentTableConfig)(state, dataSet)
    };
  }, [dataSet]);

  var _useSelector = (0, _reactRedux.useSelector)(selectInfo),
      view = _useSelector.view,
      tableConfig = _useSelector.tableConfig;
  /* Build an array of 'selectable' column config that includes a column label */


  var selectableColumns = [];

  var _loop = function _loop() {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        config = _Object$entries$_i[1];

    if (!config.unselectable) {
      var column = columns.find(function (c) {
        return c.key === key;
      });
      selectableColumns.push(_objectSpread(_objectSpread({
        key: key
      }, config), {}, {
        label: column ? column.label : key
      }));
    }
  };

  for (var _i = 0, _Object$entries = Object.entries(tableConfig.columns); _i < _Object$entries.length; _i++) {
    _loop();
  }

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(Row, null, /*#__PURE__*/_react.default.createElement("label", null, "Table view:"), /*#__PURE__*/_react.default.createElement("span", null, view)), /*#__PURE__*/_react.default.createElement(Row, null, /*#__PURE__*/_react.default.createElement("label", null, "Fixed width:"), /*#__PURE__*/_react.default.createElement(_form.Button, {
    onClick: function onClick() {
      return dispatch((0, _appTableData.toggleTableFixed)(dataSet, view));
    },
    isActive: tableConfig.fixed
  }, "On")), /*#__PURE__*/_react.default.createElement(ItemList, null, selectableColumns.map(function (col) {
    return /*#__PURE__*/_react.default.createElement(Item, {
      key: col.key,
      isSelected: col.shown
    }, /*#__PURE__*/_react.default.createElement("input", {
      type: "checkbox",
      checked: col.shown,
      onChange: function onChange() {
        return dispatch((0, _appTableData.setTableColumnShown)(dataSet, view, col.key, !col.shown));
      }
    }), /*#__PURE__*/_react.default.createElement("span", null, col.label));
  })));
}

var ColumnSelector = function ColumnSelector(props) {
  return /*#__PURE__*/_react.default.createElement(_general.ActionButtonDropdown, {
    name: "columns",
    title: "Configure table"
  }, /*#__PURE__*/_react.default.createElement(ColumnSelectorDropdown, props));
};

ColumnSelector.propTypes = {
  dataSet: _propTypes.default.string.isRequired,
  columns: _propTypes.default.array.isRequired
};
var _default = ColumnSelector;
exports.default = _default;