"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Basic = Basic;
exports.ContainedSelect = ContainedSelect;
exports.IconItems = IconItems;
exports.IconSelect = IconSelect;
exports.SelectInModal = SelectInModal;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _loremIpsum = require("lorem-ipsum");

var _modals = require("../modals");

var _ = _interopRequireDefault(require("."));

var _icons = require("../icons");

var _excluded = ["usePortal", "useCreate", "portalRef", "numberOfItems", "onChange"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var lorem = new _loremIpsum.LoremIpsum();

var genOptions = function genOptions(n) {
  return Array(n).fill().map(function (value, index) {
    return {
      value: index,
      label: lorem.generateWords(4),
      disabled: Math.random() > 0.8
    };
  });
};

function WrappedSelect(args) {
  var usePortal = args.usePortal,
      useCreate = args.useCreate,
      portalRef = args.portalRef,
      numberOfItems = args.numberOfItems,
      onChange = args.onChange,
      otherArgs = _objectWithoutProperties(args, _excluded);

  var _React$useState = _react.default.useState([]),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      select = _React$useState2[0],
      setSelect = _React$useState2[1];

  var _React$useState3 = _react.default.useState(function () {
    return genOptions(numberOfItems);
  }),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      options = _React$useState4[0],
      setOptions = _React$useState4[1];

  function addOption(_ref) {
    var props = _ref.props,
        state = _ref.state,
        methods = _ref.methods;
    var newItem = {
      value: options.length,
      label: state.search
    };
    var newOptions = [].concat(_toConsumableArray(options), [newItem]);
    setOptions(newOptions);
    return newItem;
  }

  if (usePortal) otherArgs.portal = portalRef.current;

  if (useCreate) {
    otherArgs.createOption = addOption;
    otherArgs.create = true;
  }

  return /*#__PURE__*/_react.default.createElement(_.default, _extends({
    options: options,
    values: select,
    onChange: setSelect
  }, otherArgs));
}

function Basic(args) {
  var portalRef = _react.default.useRef();

  var style = {
    display: 'flex',
    width: '300px'
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    style: style
  }, /*#__PURE__*/_react.default.createElement(WrappedSelect, _extends({
    portalRef: portalRef
  }, args)));
}

var itemRenderer = function itemRenderer(_ref2) {
  var item = _ref2.item,
      props = _ref2.props;
  var style = {
    color: '#555',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    style: style
  }, /*#__PURE__*/_react.default.createElement(_icons.Icon, {
    name: "user-check"
  }), /*#__PURE__*/_react.default.createElement("span", {
    style: {
      marginLeft: 10
    }
  }, item[props.labelField]));
};

function IconItems(args) {
  var portalRef = _react.default.useRef();

  var style = {
    display: 'flex',
    width: '300px'
  };
  return /*#__PURE__*/_react.default.createElement(WrappedSelect, _extends({
    style: style,
    portalRef: portalRef,
    create: true,
    itemRenderer: itemRenderer,
    selectItemRenderer: itemRenderer
  }, args));
}

IconItems.args = {
  useCreate: true
};

function ContainedSelect(args) {
  var portalRef = _react.default.useRef();

  var style = {
    overflow: 'hidden',
    width: '300px',
    height: '200px',
    border: '2px dashed black'
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    ref: portalRef,
    style: style
  }, /*#__PURE__*/_react.default.createElement(WrappedSelect, _extends({
    portalRef: portalRef
  }, args)));
}

ContainedSelect.args = {
  usePortal: true
};

function SelectInModal(args) {
  var portalRef = {};
  portalRef.current = document.querySelector('#root');
  return /*#__PURE__*/_react.default.createElement(_modals.AppModal, {
    isOpen: true
  }, /*#__PURE__*/_react.default.createElement("label", null, "Select:"), /*#__PURE__*/_react.default.createElement(WrappedSelect, _extends({
    portalRef: portalRef
  }, args)));
}

function IconSelect(args) {
  var options = genOptions(10);
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/_react.default.createElement(_.default, {
    style: {
      border: 'none',
      padding: 'none'
    },
    options: options,
    values: [],
    onChange: function onChange() {},
    placeholder: "",
    searchable: false,
    handle: false,
    dropdownWidth: 300,
    dropdownAlign: "left",
    contentRenderer: function contentRenderer() {
      return /*#__PURE__*/_react.default.createElement(_icons.ActionIcon, {
        name: "import"
      });
    }
  }), /*#__PURE__*/_react.default.createElement(_.default, {
    style: {
      border: 'none',
      padding: 'none'
    },
    options: options,
    values: [],
    onChange: function onChange() {},
    placeholder: "",
    searchable: false,
    handle: false,
    dropdownWidth: 300,
    dropdownAlign: "right",
    contentRenderer: function contentRenderer() {
      return /*#__PURE__*/_react.default.createElement(_icons.ActionIcon, {
        name: "import"
      });
    }
  }));
}

var story = {
  title: 'Select',
  component: _.default,
  args: {
    numberOfItems: 100,
    usePortal: false,
    useCreate: false
  }
};
var _default = story;
exports.default = _default;