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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function TableViewSelector(_ref) {
  var dataSet = _ref.dataSet;
  var dispatch = (0, _reactRedux.useDispatch)();

  var selectInfo = _react.default.useCallback(function (state) {
    return {
      currentView: (0, _appTableData.selectCurrentView)(state, dataSet),
      allViews: (0, _appTableData.selectViews)(state, dataSet)
    };
  }, [dataSet]);

  var _useSelector = (0, _reactRedux.useSelector)(selectInfo),
      currentView = _useSelector.currentView,
      allViews = _useSelector.allViews;

  return allViews.map(function (v) {
    return /*#__PURE__*/_react.default.createElement(_form.Button, {
      key: v,
      isActive: currentView === v,
      onClick: function onClick() {
        return dispatch((0, _appTableData.setTableView)(dataSet, v));
      }
    }, v);
  });
}

TableViewSelector.propTypes = {
  dataSet: _propTypes.default.string.isRequired
};
var _default = TableViewSelector;
exports.default = _default;