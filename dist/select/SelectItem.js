"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SelectItem = function SelectItem(_ref) {
  var item = _ref.item,
      props = _ref.props,
      state = _ref.state,
      methods = _ref.methods;
  return /*#__PURE__*/_react.default.createElement("span", {
    className: "dropdown-select-single-item"
  }, item[props.labelField]);
};

var _default = SelectItem;
exports.default = _default;