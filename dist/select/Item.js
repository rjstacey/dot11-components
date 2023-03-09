"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Item(_ref) {
  var style = _ref.style,
      className = _ref.className,
      index = _ref.index,
      item = _ref.item,
      props = _ref.props,
      state = _ref.state,
      methods = _ref.methods;
  var isSelected = methods.isSelected(item);
  var isDisabled = methods.isDisabled(item);
  var isActive = state.cursor === index;
  var isNew = props.create && state.search && index === 0;
  var cn = "dropdown-select-item";
  if (isNew) cn += " dropdown-select-item-new";
  if (isActive) cn += " dropdown-select-item-active";
  if (isSelected) cn += " dropdown-select-item-selected";
  if (isDisabled) cn += " dropdown-select-item-disabled";
  if (className) cn += ' ' + className;
  var addItem = isDisabled ? undefined : isNew ? function () {
    return methods.addSearchItem();
  } : function () {
    return methods.addItem(item);
  };
  var label = item[props.labelField];
  return /*#__PURE__*/_react.default.createElement("div", {
    style: style,
    className: className,
    role: "option",
    "aria-selected": isSelected,
    "aria-disabled": isDisabled,
    "aria-label": label,
    onClick: addItem,
    color: props.color
  }, isNew ? "Add \"".concat(label, "\"") : label);
}

Item.propTypes = {
  index: _propTypes.default.number.isRequired,
  item: _propTypes.default.object.isRequired,
  props: _propTypes.default.object.isRequired,
  state: _propTypes.default.object.isRequired,
  methods: _propTypes.default.object.isRequired
};
var _default = Item;
exports.default = _default;