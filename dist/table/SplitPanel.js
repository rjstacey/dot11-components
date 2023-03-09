"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Panel = void 0;
exports.SplitPanel = SplitPanel;
exports.SplitPanelButton = SplitPanelButton;
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _form = require("../form");

var _appTableData = require("../store/appTableData");

var _ColumnResizer = _interopRequireDefault(require("./ColumnResizer"));

var _excluded = ["dataSet", "title"],
    _excluded2 = ["children"],
    _excluded3 = ["dataSet", "style", "children"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function SplitPanelButton(_ref) {
  var dataSet = _ref.dataSet,
      title = _ref.title,
      otherProps = _objectWithoutProperties(_ref, _excluded);

  var dispatch = (0, _reactRedux.useDispatch)();

  var selectPanelConfig = _react.default.useCallback(function (state) {
    return (0, _appTableData.selectCurrentPanelConfig)(state, dataSet);
  }, [dataSet]);

  var _useSelector = (0, _reactRedux.useSelector)(selectPanelConfig),
      isSplit = _useSelector.isSplit;

  var setIsSplit = function setIsSplit(isSplit) {
    return dispatch((0, _appTableData.setPanelIsSplit)(dataSet, undefined, isSplit));
  };

  return /*#__PURE__*/_react.default.createElement(_form.ActionButton, _extends({
    name: "book-open",
    title: title || 'Show detail',
    isActive: isSplit,
    onClick: function onClick() {
      return setIsSplit(!isSplit);
    }
  }, otherProps));
}

SplitPanelButton.propTypes = {
  dataSet: _propTypes.default.string.isRequired,
  title: _propTypes.default.string
};

var Panel = function Panel(_ref2) {
  var children = _ref2.children,
      otherProps = _objectWithoutProperties(_ref2, _excluded2);

  return /*#__PURE__*/_react.default.createElement("div", otherProps, children);
};

exports.Panel = Panel;

function SplitPanel(_ref3) {
  var dataSet = _ref3.dataSet,
      style = _ref3.style,
      children = _ref3.children,
      otherProps = _objectWithoutProperties(_ref3, _excluded3);

  var dispatch = (0, _reactRedux.useDispatch)();

  var ref = _react.default.useRef();

  var selectPanelConfig = _react.default.useCallback(function (state) {
    return (0, _appTableData.selectCurrentPanelConfig)(state, dataSet);
  }, [dataSet]);

  var _useSelector2 = (0, _reactRedux.useSelector)(selectPanelConfig),
      isSplit = _useSelector2.isSplit,
      width = _useSelector2.width;

  var content;

  if (isSplit) {
    if (typeof width !== 'number' || isNaN(width) || width < 0 || width > 1) width = 0.5;

    var leftStyle = _objectSpread(_objectSpread({}, children[0].props.style), {}, {
      flex: "".concat(width * 100, "%")
    });

    var rightStyle = _objectSpread(_objectSpread({}, children[1].props.style), {}, {
      flex: "".concat((1 - width) * 100, "%")
    });

    var onDrag = function onDrag(event, _ref4) {
      var x = _ref4.x,
          deltaX = _ref4.deltaX;
      var b = ref.current.getBoundingClientRect();
      dispatch((0, _appTableData.setPanelWidth)(dataSet, undefined, (x - b.x) / (b.width - 5)));
    };

    content = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.cloneElement(children[0], {
      style: leftStyle
    }), /*#__PURE__*/_react.default.createElement(_ColumnResizer.default, {
      onDrag: onDrag
    }), /*#__PURE__*/_react.default.cloneElement(children[1], {
      style: rightStyle
    }));
  } else {
    var _leftStyle = _objectSpread(_objectSpread({}, children[0].props.style), {}, {
      flex: '100%'
    });

    content = /*#__PURE__*/_react.default.cloneElement(children[0], {
      style: _leftStyle
    });
  }

  return /*#__PURE__*/_react.default.createElement("div", _extends({
    ref: ref,
    style: _objectSpread({
      display: 'flex',
      flex: 1,
      width: '100%',
      overflow: 'hidden'
    }, style)
  }, otherProps), content);
}

var checkChildren = function checkChildren(props, propName, componentName) {
  var children = props.children;
  if (_react.default.Children.count(children) !== 2) return new Error('`' + componentName + '` has invalid number of children; expect exactly two');
  var error;

  _react.default.Children.forEach(children, function (el) {
    if (el.type !== Panel) error = new Error('`' + componentName + '` has invalid child; expect only Panel children');
  });

  return error;
};

SplitPanel.propTypes = {
  dataSet: _propTypes.default.string.isRequired,
  children: checkChildren
};
var _default = SplitPanel;
exports.default = _default;