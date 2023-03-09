"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Input(_ref) {
  var inputRef = _ref.inputRef,
      props = _ref.props,
      state = _ref.state,
      methods = _ref.methods;
  return /*#__PURE__*/_react.default.createElement("input", {
    ref: inputRef,
    tabIndex: "-1",
    className: "dropdown-select-input",
    style: {
      width: "".concat(state.search.length + 1, "ch")
    },
    value: state.search,
    onChange: function onChange(event) {
      return methods.setSearch(event.target.value);
    }
  });
}

Input.propTypes = {
  inputRef: _propTypes.default.object.isRequired,
  props: _propTypes.default.object.isRequired,
  state: _propTypes.default.object.isRequired,
  methods: _propTypes.default.object.isRequired
};
var _default = Input;
exports.default = _default;