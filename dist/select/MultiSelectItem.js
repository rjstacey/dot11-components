"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Clear = function Clear(props) {
  return /*#__PURE__*/_react.default.createElement("div", props);
};

var MultiSelectItem = function MultiSelectItem(_ref) {
  var item = _ref.item,
      props = _ref.props,
      state = _ref.state,
      methods = _ref.methods;

  var remove = function remove(event) {
    event.stopPropagation();
    methods.removeItem(item);
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    role: "listitem",
    direction: props.direction,
    className: "dropdown-select-multi-item"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "dropdown-select-multi-item-label"
  }, item[props.labelField]), !props.readOnly && /*#__PURE__*/_react.default.createElement(Clear, {
    className: "dropdown-select-multi-item-remove",
    onClick: remove
  }));
};

MultiSelectItem.propTypes = {
  item: _propTypes.default.object.isRequired,
  props: _propTypes.default.object.isRequired,
  state: _propTypes.default.object.isRequired,
  methods: _propTypes.default.object.isRequired
};
var _default = MultiSelectItem;
exports.default = _default;