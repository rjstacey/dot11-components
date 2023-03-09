"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactWindow = require("react-window");

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _excluded = ["headerRenderer", "cellRenderer", "dataRenderer", "width", "flexGrow", "flexShrink", "key"],
    _excluded2 = ["entities", "ids", "selected", "expanded", "measureRowHeight", "getRowData", "onRowClick"];

var _templateObject, _templateObject2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var OuterRow = _styled.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n\toverflow: hidden;\n\tbox-sizing: border-box;\n"])));

var InnerRow = _styled.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n\tdisplay: flex;\n\tposition: relative;\n\tbox-sizing: unset;\n\twidth: 100%;\n\theight: fit-content;\n"])));
/**
 * TableRow component for AppTable
 */


function PureTableRow(_ref) {
  var style = _ref.style,
      gutterSize = _ref.gutterSize,
      rowIndex = _ref.rowIndex,
      rowId = _ref.rowId,
      rowData = _ref.rowData,
      isSelected = _ref.isSelected,
      isExpanded = _ref.isExpanded,
      fixed = _ref.fixed,
      columns = _ref.columns,
      getField = _ref.getField,
      estimatedRowHeight = _ref.estimatedRowHeight,
      onRowHeightChange = _ref.onRowHeightChange,
      onClick = _ref.onClick;

  var rowRef = _react.default.useRef();

  _react.default.useEffect(function () {
    //if (!rowRef.current)
    //	return;
    var height = isExpanded ? rowRef.current.getBoundingClientRect().height : estimatedRowHeight;
    if (style.height !== height) onRowHeightChange(rowIndex, height);
  }, [rowIndex, isExpanded, estimatedRowHeight, columns, fixed, onRowHeightChange, style.height, style.width]);

  var cells = _react.default.useMemo(function () {
    return columns.map(function (column) {
      var headerRenderer = column.headerRenderer,
          cellRenderer = column.cellRenderer,
          dataRenderer = column.dataRenderer,
          width = column.width,
          flexGrow = column.flexGrow,
          flexShrink = column.flexShrink,
          dataKey = column.key,
          colProps = _objectWithoutProperties(column, _excluded);

      var style = {
        flexBasis: width,
        flexGrow: fixed ? 0 : flexGrow,
        flexShrink: fixed ? 0 : flexShrink,
        overflow: 'hidden' // necessary to ensure that the content does not affect width

      };

      var getCellData = function getCellData(_ref2) {
        var rowData = _ref2.rowData,
            dataKey = _ref2.dataKey;
        return rowData.hasOwnProperty(dataKey) ? rowData[dataKey] : getField(rowData, dataKey);
      };

      var renderer = cellRenderer || (dataRenderer ? function (props) {
        return dataRenderer(getCellData(props));
      } : function (props) {
        return getCellData(props);
      });

      var props = _objectSpread({
        rowIndex: rowIndex,
        rowId: rowId,
        rowData: rowData,
        dataKey: dataKey
      }, colProps);

      return /*#__PURE__*/_react.default.createElement("div", {
        key: dataKey,
        className: "AppTable__dataCell",
        style: style
      }, renderer(props));
    });
  }, [columns, fixed, rowIndex, rowId, rowData, getField]); // Add appropriate row classNames


  var classNames = ['AppTable__dataRow'];
  classNames.push(rowIndex % 2 === 0 ? 'AppTable__dataRow-even' : 'AppTable__dataRow-odd');
  if (isSelected) classNames.push('AppTable__dataRow-selected');
  return /*#__PURE__*/_react.default.createElement(OuterRow, {
    style: _objectSpread(_objectSpread({}, style), {}, {
      top: style.top + gutterSize,
      height: style.height - gutterSize
    }) // Adjust style for gutter
    ,
    className: classNames.join(' '),
    onClick: onClick
  }, /*#__PURE__*/_react.default.createElement(InnerRow, {
    ref: rowRef
  }, cells));
}

PureTableRow.propTypes = {
  style: _propTypes.default.object.isRequired,
  rowIndex: _propTypes.default.number.isRequired,
  rowId: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]).isRequired,
  rowData: _propTypes.default.object.isRequired,
  isSelected: _propTypes.default.bool.isRequired,
  isExpanded: _propTypes.default.bool.isRequired,
  fixed: _propTypes.default.bool.isRequired,
  columns: _propTypes.default.array.isRequired,
  getField: _propTypes.default.func.isRequired,
  estimatedRowHeight: _propTypes.default.number.isRequired,
  onRowHeightChange: _propTypes.default.func.isRequired,
  onClick: _propTypes.default.func
}; // Memoize so that a row is only re-rendered if the row specific data changes

var TableRow = /*#__PURE__*/_react.default.memo(PureTableRow, _reactWindow.areEqual);

function AppTableRow(_ref3) {
  var rowIndex = _ref3.rowIndex,
      style = _ref3.style,
      data = _ref3.data;

  // Extract context from data prop and isolate the row specific data
  var entities = data.entities,
      ids = data.ids,
      selected = data.selected,
      expanded = data.expanded,
      measureRowHeight = data.measureRowHeight,
      getRowData = data.getRowData,
      onRowClick = data.onRowClick,
      otherProps = _objectWithoutProperties(data, _excluded2);

  var rowId = ids[rowIndex];
  var rowData = getRowData ? getRowData({
    rowIndex: rowIndex,
    rowId: rowId,
    ids: ids,
    entities: entities
  }) : entities[rowId];
  var isSelected = selected && selected.includes(rowId);
  var isExpanded = measureRowHeight || expanded && expanded.includes(rowId);

  var onClick = _react.default.useMemo(function () {
    return onRowClick ? function (event) {
      return onRowClick({
        event: event,
        rowIndex: rowIndex
      });
    } : undefined;
  }, [onRowClick, rowIndex]);

  return /*#__PURE__*/_react.default.createElement(TableRow, _extends({
    key: rowId,
    style: style,
    rowIndex: rowIndex,
    rowId: rowId,
    rowData: rowData,
    isSelected: isSelected,
    isExpanded: isExpanded,
    onClick: onClick
  }, otherProps));
}

var _default = AppTableRow;
exports.default = _default;