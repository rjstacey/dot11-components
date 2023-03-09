"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectHeader = exports.SelectExpandHeader = exports.SelectExpandCell = exports.SelectCell = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _icons = require("../icons");

var _form = require("../form");

var _dropdown = _interopRequireDefault(require("../dropdown"));

var _appTableData = require("../store/appTableData");

var _templateObject, _templateObject2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Selector = _styled.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n\tdisplay: flex;\n\tflex-direction: row;\n\tborder-radius: 3px;\n\talign-items: center;\n\t:hover {color: tomato};\n\t:hover,\n\t:focus-within {\n\t\tbackground-color: #ddd;\n\t}\n"])));

var Container = _styled.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n"])));

function ControlHeader(_ref) {
  var dataSet = _ref.dataSet,
      anchorEl = _ref.anchorEl,
      customSelectorElement = _ref.customSelectorElement,
      showExpanded = _ref.showExpanded;
  var dispatch = (0, _reactRedux.useDispatch)();

  var selectInfo = _react.default.useCallback(function (state) {
    return {
      selected: (0, _appTableData.selectSelected)(state, dataSet),
      expanded: (0, _appTableData.selectExpanded)(state, dataSet),
      shownIds: (0, _appTableData.selectSortedFilteredIds)(state, dataSet)
    };
  }, [dataSet]);

  var _useSelector = (0, _reactRedux.useSelector)(selectInfo),
      selected = _useSelector.selected,
      expanded = _useSelector.expanded,
      shownIds = _useSelector.shownIds;

  var allSelected = _react.default.useMemo(function () {
    return shownIds.length > 0 && // not if list is empty
    shownIds.filter(function (id) {
      return !selected.includes(id);
    }).length === 0;
  }, [shownIds, selected]);

  var isIndeterminate = !allSelected && selected.length;

  var allExpanded = _react.default.useMemo(function () {
    return expanded && shownIds.length > 0 && // not if list is empty
    shownIds.filter(function (id) {
      return !expanded.includes(id);
    }).length === 0;
  }, [shownIds, expanded]);

  var toggleSelect = _react.default.useCallback(function () {
    return dispatch((0, _appTableData.setSelected)(dataSet, selected.length ? [] : shownIds));
  }, [dispatch, dataSet, selected, shownIds]);

  var toggleExpand = _react.default.useCallback(function () {
    return dispatch((0, _appTableData.setExpanded)(dataSet, expanded.length ? [] : shownIds));
  }, [dispatch, dataSet, expanded, shownIds]);

  if (!anchorEl) return null;
  return /*#__PURE__*/_react.default.createElement(Container, null, /*#__PURE__*/_react.default.createElement(Selector, null, /*#__PURE__*/_react.default.createElement(_form.Checkbox, {
    title: allSelected ? "Clear all" : isIndeterminate ? "Clear selected" : "Select all",
    checked: allSelected,
    indeterminate: isIndeterminate,
    onChange: toggleSelect
  }), customSelectorElement && /*#__PURE__*/_react.default.createElement(_dropdown.default, {
    style: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center'
    },
    dropdownAlign: "left",
    portal: anchorEl,
    dropdownRenderer: function dropdownRenderer() {
      return customSelectorElement;
    }
  })), showExpanded && /*#__PURE__*/_react.default.createElement(_icons.ActionIcon, {
    type: "double-expander",
    title: "Expand all",
    open: allExpanded,
    onClick: toggleExpand
  }));
}

ControlHeader.propTypes = {
  dataSet: _propTypes.default.string.isRequired,
  anchorEl: _propTypes.default.oneOfType([_propTypes.default.element, _propTypes.default.object]),
  customSelectorElement: _propTypes.default.element,
  showExpanded: _propTypes.default.bool
};

var SelectExpandHeader = function SelectExpandHeader(props) {
  return /*#__PURE__*/_react.default.createElement(ControlHeader, _extends({
    showExpanded: true
  }, props));
};

exports.SelectExpandHeader = SelectExpandHeader;

var SelectHeader = function SelectHeader(props) {
  return /*#__PURE__*/_react.default.createElement(ControlHeader, props);
};

exports.SelectHeader = SelectHeader;

function ControlCell(_ref2) {
  var dataSet = _ref2.dataSet,
      rowId = _ref2.rowId,
      showExpanded = _ref2.showExpanded;
  var dispatch = (0, _reactRedux.useDispatch)();

  var toggleSelect = _react.default.useCallback(function () {
    return dispatch((0, _appTableData.toggleSelected)(dataSet, [rowId]));
  }, [dispatch, dataSet, rowId]);

  var toggleExpand = _react.default.useCallback(function () {
    return dispatch((0, _appTableData.toggleExpanded)(dataSet, [rowId]));
  }, [dispatch, dataSet, rowId]);

  var selectInfo = _react.default.useCallback(function (state) {
    return {
      selected: (0, _appTableData.selectSelected)(state, dataSet),
      expanded: (0, _appTableData.selectExpanded)(state, dataSet)
    };
  }, [dataSet]);

  var _useSelector2 = (0, _reactRedux.useSelector)(selectInfo),
      selected = _useSelector2.selected,
      expanded = _useSelector2.expanded;

  return /*#__PURE__*/_react.default.createElement(Container, {
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, /*#__PURE__*/_react.default.createElement(_form.Checkbox, {
    title: "Select row",
    checked: selected.includes(rowId),
    onChange: toggleSelect
  }), showExpanded && /*#__PURE__*/_react.default.createElement(_icons.ActionIcon, {
    type: "expander",
    title: "Expand row",
    open: expanded.includes(rowId),
    onClick: toggleExpand
  }));
}

ControlCell.propTypes = {
  dataSet: _propTypes.default.string.isRequired,
  rowId: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]).isRequired,
  showExpanded: _propTypes.default.bool
};

var SelectExpandCell = function SelectExpandCell(props) {
  return /*#__PURE__*/_react.default.createElement(ControlCell, _extends({
    showExpanded: true
  }, props));
};

exports.SelectExpandCell = SelectExpandCell;

var SelectCell = function SelectCell(props) {
  return /*#__PURE__*/_react.default.createElement(ControlCell, props);
};

exports.SelectCell = SelectCell;