"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _ColumnResizer = _interopRequireDefault(require("./ColumnResizer"));

var _excluded = ["headerRenderer", "width", "flexGrow", "flexShrink", "key"];

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

//const HeaderCell = styled.div`
//	display: flex;
//`;
var HeaderCellContent = _styled.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n\theight: 100%;\n\twidth: calc(100% - 12px)\n"])));

var HeaderAnchor = _styled.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n\tposition: relative;\n"])));

var HeaderContainer = _styled.default.div(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n\toverflow: hidden;\n"])));

var HeaderRow = _styled.default.div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n\tdisplay: flex;\n\theight: 100%;\n"])));

function HeaderCell(_ref) {
  var anchorEl = _ref.anchorEl,
      column = _ref.column,
      fixed = _ref.fixed,
      adjustColumnWidth = _ref.adjustColumnWidth,
      defaultHeaderCellRenderer = _ref.defaultHeaderCellRenderer;

  var headerRenderer = column.headerRenderer,
      width = column.width,
      flexGrow = column.flexGrow,
      flexShrink = column.flexShrink,
      dataKey = column.key,
      colProps = _objectWithoutProperties(column, _excluded);

  var style = {
    display: 'flex',
    flexBasis: width,
    flexGrow: fixed ? 0 : flexGrow,
    flexShrink: fixed ? 0 : flexShrink,
    overflow: 'hidden' // necessary so that the content does not affect size

  };
  var renderer = headerRenderer || defaultHeaderCellRenderer;

  var props = _objectSpread({
    anchorEl: anchorEl,
    dataKey: dataKey,
    column: column
  }, colProps);

  var onDrag = function onDrag(event, _ref2) {
    var deltaX = _ref2.deltaX;
    return adjustColumnWidth(dataKey, deltaX);
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "AppTable__headerCell",
    style: style
  }, /*#__PURE__*/_react.default.createElement(HeaderCellContent, null, renderer(props)), /*#__PURE__*/_react.default.createElement(_ColumnResizer.default, {
    onDrag: onDrag
  }));
}
/**
 * TableHeader component for AppTable
 *
 * HeaderAnchor provides an attachment point (outside the 'overflow: hidden') for dropdown overlays
 * HeaderContainer is the viewport for HeaderRow; same width as the data table row
 * HeaderRow is the full header and may exceed the viewport width; scolled by the data table horizontal scroll bar
 * A HeaderCell is present for each column and contains the header cell content and column resizer
 */


var TableHeader = /*#__PURE__*/_react.default.forwardRef(function (_ref3, ref) {
  var className = _ref3.className,
      outerStyle = _ref3.outerStyle,
      innerStyle = _ref3.innerStyle,
      fixed = _ref3.fixed,
      columns = _ref3.columns,
      adjustColumnWidth = _ref3.adjustColumnWidth,
      defaultHeaderCellRenderer = _ref3.defaultHeaderCellRenderer;

  var anchorRef = _react.default.useRef(null);

  var _React$useState = _react.default.useState(null),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      cells = _React$useState2[0],
      setCells = _React$useState2[1];

  _react.default.useEffect(function () {
    // After mount, update header cells: the anchor ref is now available
    var cells = columns.map(function (column) {
      return /*#__PURE__*/_react.default.createElement(HeaderCell, {
        key: column.key,
        anchorEl: anchorRef.current,
        column: column,
        fixed: fixed,
        adjustColumnWidth: adjustColumnWidth,
        defaultHeaderCellRenderer: defaultHeaderCellRenderer
      });
    });
    /*{
    const {headerRenderer, width, flexGrow, flexShrink, key: dataKey, ...colProps} = column;
    const style = {
    	flexBasis: width,
    	flexGrow: fixed? 0: flexGrow,
    	flexShrink: fixed? 0: flexShrink,
    	overflow: 'hidden'	// necessary so that the content does not affect size
    };
    const renderer = headerRenderer || defaultHeaderCellRenderer;
    const props = {anchorEl: anchorRef.current, dataKey, column, ...colProps};
    return (
    	<HeaderCell
    		key={dataKey}
    		className='AppTable__headerCell'
    		style={style}
    	>
    		<HeaderCellContent>
    			{renderer(props)}
    		</HeaderCellContent>
    		<ColumnResizer
    			onDrag={(event, {deltaX}) => setColumnWidth(dataKey, deltaX)}
    		/>
    	</HeaderCell>
    )
    });*/

    setCells(cells);
  }, [columns, fixed, defaultHeaderCellRenderer, adjustColumnWidth]);

  var classNames = [className, 'AppTable__headerRow'].join(' ');
  return /*#__PURE__*/_react.default.createElement(HeaderAnchor, {
    ref: anchorRef
  }, /*#__PURE__*/_react.default.createElement(HeaderContainer, {
    ref: ref,
    className: "AppTable__headerContainer",
    style: outerStyle
  }, /*#__PURE__*/_react.default.createElement(HeaderRow, {
    className: classNames,
    style: innerStyle
  }, cells)));
});

TableHeader.propTypes = {
  className: _propTypes.default.string,
  outerStyle: _propTypes.default.object,
  innerStyle: _propTypes.default.object,
  fixed: _propTypes.default.bool,
  columns: _propTypes.default.array.isRequired,
  setColumnWidth: _propTypes.default.func.isRequired,
  defaultHeaderCellRenderer: _propTypes.default.func
};
var _default = TableHeader;
exports.default = _default;