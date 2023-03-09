"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactWindow = require("react-window");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/* ItemWrapper measures and sets the height of the item */
function ItemWrapper(_ref) {
  var style = _ref.style,
      item = _ref.item,
      index = _ref.index,
      setHeight = _ref.setHeight,
      props = _ref.props,
      state = _ref.state,
      methods = _ref.methods;

  var ref = _react.default.useRef();

  _react.default.useEffect(function () {
    if (ref.current) {
      var bounds = ref.current.getBoundingClientRect();
      if (style.height !== bounds.height) setHeight(bounds.height);
    }
  });

  var isSelected = methods.isSelected(item);
  var isDisabled = methods.isDisabled(item);
  var isActive = state.cursor === index;
  var isNew = props.create && state.search && index === 0;
  var className = "dropdown-select-item";
  if (isNew) className += " dropdown-select-item-new";
  if (isActive) className += " dropdown-select-item-active";
  if (isSelected) className += " dropdown-select-item-selected";
  if (isDisabled) className += " dropdown-select-item-disabled";
  var addItem = isNew ? function () {
    return methods.addSearchItem();
  } : function () {
    return methods.addItem(item);
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    style: style
  }, /*#__PURE__*/_react.default.createElement("div", {
    ref: ref,
    className: className,
    onClick: isDisabled ? undefined : addItem,
    role: "option",
    "aria-selected": isSelected,
    "aria-disabled": isDisabled,
    "aria-label": item[props.labelField]
  }, isNew ? props.addItemRenderer({
    index: index,
    item: item,
    props: props,
    state: state,
    methods: methods
  }) : props.itemRenderer({
    index: index,
    item: item,
    props: props,
    state: state,
    methods: methods
  })));
}

function Dropdown(_ref2) {
  var props = _ref2.props,
      state = _ref2.state,
      methods = _ref2.methods;

  var listRef = _react.default.useRef();

  var listInnerRef = _react.default.useRef();

  var heightsRef = _react.default.useRef([]);

  var setItemHeight = function setItemHeight(index, height) {
    var heights = heightsRef.current;
    heights[index] = height;
    if (listRef.current) listRef.current.resetAfterIndex(index, true);
  };

  var getItemHeight = function getItemHeight(index) {
    return heightsRef.current[index] || props.estimatedItemHeight;
  };

  var options = methods.searchResults();

  _react.default.useEffect(function () {
    if (!listRef.current) return;
    if (state.cursor >= 0) listRef.current.scrollToItem(state.cursor);
  }, [state.cursor]);

  var _React$useState = _react.default.useState(props.dropdownHeight),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      maxHeight = _React$useState2[0],
      setMaxHeight = _React$useState2[1];

  _react.default.useLayoutEffect(function () {
    if (!listInnerRef.current) return;
    var bounds = listInnerRef.current.getBoundingClientRect();
    var height = bounds.height < props.dropdownHeight ? bounds.height : props.dropdownHeight;
    if (height !== maxHeight) setMaxHeight(height);
  }, [props.dropdownHeight, maxHeight, options]);

  var itemKey = function itemKey(index) {
    if (props.create && state.search && index === 0) return '{new-item}';
    return '' + options[index][props.valueField] + options[index][props.labelField];
  }; // To prevent input element losing focus, block mousedown event


  var innerEl = function innerEl(props) {
    return /*#__PURE__*/_react.default.createElement("div", _extends({
      ref: listInnerRef,
      onMouseDown: function onMouseDown(e) {
        return e.preventDefault();
      }
    }, props));
  };

  return options.length === 0 ? props.noDataRenderer({
    props: props,
    state: state,
    methods: methods
  }) : /*#__PURE__*/_react.default.createElement(_reactWindow.VariableSizeList, {
    ref: listRef,
    height: maxHeight,
    width: "auto",
    itemCount: options.length,
    itemSize: getItemHeight,
    estimatedItemSize: props.estimatedItemHeight,
    itemKey: itemKey //innerRef={listInnerRef}
    ,
    innerElementType: innerEl
  }, function (_ref3) {
    var index = _ref3.index,
        style = _ref3.style;
    return /*#__PURE__*/_react.default.createElement(ItemWrapper, {
      style: style,
      item: options[index],
      index: index,
      setHeight: function setHeight(height) {
        return setItemHeight(index, height);
      },
      props: props,
      methods: methods,
      state: state
    });
  });
}

Dropdown.propTypes = {
  props: _propTypes.default.object.isRequired,
  state: _propTypes.default.object.isRequired,
  methods: _propTypes.default.object.isRequired
};
var _default = Dropdown;
exports.default = _default;