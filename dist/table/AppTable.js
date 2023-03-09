"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _reactWindow = require("react-window");

var _reactVirtualizedAutoSizer = _interopRequireDefault(require("react-virtualized-auto-sizer"));

var _AppTableRow = _interopRequireDefault(require("./AppTableRow"));

var _AppTableHeader = _interopRequireDefault(require("./AppTableHeader"));

var _TableColumnHeader = _interopRequireDefault(require("./TableColumnHeader"));

var _lib = require("../lib");

var _appTableData = require("../store/appTableData");

var _excluded = ["width", "height", "gutterSize", "estimatedRowHeight", "measureRowHeight", "dataSet"];

var _templateObject, _templateObject2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var scrollbarSize = (0, _lib.getScrollbarSize)();

var Table = _styled.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n\tposition: relative;\n\tdisplay: flex;\n\tflex-direction: column-reverse;\n\talign-items: center;\n\t& * {\n\t\tbox-sizing: border-box;\n\t}\n\t:focus {\n\t\toutline: none;\n\t}\n\t.AppTable__headerRow,\n\t.AppTable__dataRow {\n\t\tdisplay: flex;\n\t\tflex-direction: row;\n\t\tflex-wrap: nowrap;\n\t\talign-items: stretch;\n\t\toverflow: hidden;\n\t}\n\t.AppTable__headerContainer {\n\n\t}\n\t.AppTable__headerRow {\n\t\tbackground-color: #efefef;\n\t}\n\t.AppTable__dataRow {\n\t\t/*padding: 5px 0;*/\n\t}\n\t.AppTable__dataRow-even {\n\t\tbackground-color: #fafafa;\n\t}\n\t.AppTable__dataRow-odd {\n\t\tbackground-color: #f6f6f6;\n\t}\n\t.AppTable__dataRow-selected {\n\t\tbackground-color: #b9b9f7;\n\t}\n\t.AppTable__headerCell {\n\t}\n\t.AppTable__dataCell {\n\t\tpadding-right: 10px;\n\t}\n"])));

var NoGrid = _styled.default.div(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\tfont-size: 1em;\n\tcolor: #bdbdbd;\n"])));
/*
 * Key down handler for Grid (when focused)
 */


var useKeyDown = function useKeyDown(dataSet, selected, ids, dispatch, gridRef) {
  return _react.default.useCallback(function (event) {
    var selectAndScroll = function selectAndScroll(i) {
      dispatch((0, _appTableData.setSelected)(dataSet, [ids[i]]));
      if (gridRef) gridRef.scrollToItem({
        rowIndex: i
      });
    }; // Ctrl-A selects all


    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      dispatch((0, _appTableData.setSelected)(dataSet, ids));
      event.preventDefault();
    } else if (event.key === 'Home') {
      if (ids.length) selectAndScroll(0);
    } else if (event.key === 'End') {
      if (ids.length) selectAndScroll(ids.length - 1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      if (selected.length === 0) {
        if (ids.length > 0) selectAndScroll(0);
        return;
      }

      var id = selected[0];
      var i = ids.indexOf(id);

      if (i === -1) {
        if (ids.length > 0) selectAndScroll(0);
        return;
      }

      if (event.key === 'ArrowUp') {
        if (i === 0) i = ids.length - 1;else i = i - 1;
      } else {
        // Down arrow
        if (i === ids.length - 1) i = 0;else i = i + 1;
      }

      selectAndScroll(i);
    }
  }, [dataSet, selected, ids, dispatch, gridRef]);
};

var useRowClick = function useRowClick(dataSet, selected, ids, dispatch) {
  return _react.default.useCallback(function (_ref) {
    var event = _ref.event,
        rowIndex = _ref.rowIndex;
    var newSelected = selected.slice();
    var id = ids[rowIndex];

    if (event.shiftKey) {
      // Shift + click => include all between last and current
      if (newSelected.length === 0) {
        newSelected.push(id);
      } else {
        var id_last = newSelected[newSelected.length - 1];
        var i_last = ids.indexOf(id_last);
        var i_selected = ids.indexOf(id);

        if (i_last >= 0 && i_selected >= 0) {
          if (i_last > i_selected) {
            for (var i = i_selected; i < i_last; i++) {
              newSelected.push(ids[i]);
            }
          } else {
            for (var _i = i_last + 1; _i <= i_selected; _i++) {
              newSelected.push(ids[_i]);
            }
          }
        }
      }
    } else if (event.ctrlKey || event.metaKey) {
      // Control + click => add or remove
      if (newSelected.includes(id)) newSelected = newSelected.filter(function (s) {
        return s !== id;
      });else newSelected.push(id);
    } else {
      newSelected = [id];
    }

    dispatch((0, _appTableData.setSelected)(dataSet, newSelected));
  }, [dataSet, selected, ids, dispatch]);
};

function AppTableSized(_ref2) {
  var width = _ref2.width,
      height = _ref2.height,
      gutterSize = _ref2.gutterSize,
      estimatedRowHeight = _ref2.estimatedRowHeight,
      measureRowHeight = _ref2.measureRowHeight,
      dataSet = _ref2.dataSet,
      props = _objectWithoutProperties(_ref2, _excluded);

  var gridRef = _react.default.useRef();

  var headerRef = _react.default.useRef();

  var dispatch = (0, _reactRedux.useDispatch)();

  var gridSizing = _react.default.useRef({
    resetIndex: 0,
    rowHeights: []
  });

  var onRowUpdate = _react.default.useMemo(function () {
    return (0, _lib.debounce)(function () {
      var gs = gridSizing.current;
      if (gridRef.current) gridRef.current.resetAfterRowIndex(gs.resetIndex, true);
      gs.resetIndex = gs.rowHeights.length;
    }, 0);
  }, []);

  var onRowHeightChange = _react.default.useCallback(function (rowIndex, height) {
    var gs = gridSizing.current;
    if (gs.resetIndex > rowIndex) gs.resetIndex = rowIndex;
    gs.rowHeights[rowIndex] = height;
    onRowUpdate();
  }, [onRowUpdate]);

  var getRowHeight = _react.default.useCallback(function (rowIndex) {
    return (gridSizing.current.rowHeights[rowIndex] || estimatedRowHeight) + gutterSize;
  }, [estimatedRowHeight, gutterSize]);

  var _React$useMemo = _react.default.useMemo(function () {
    var defaultTablesConfig = props.defaultTablesConfig;

    if (!defaultTablesConfig) {
      var config = {
        fixed: props.fixed || false,
        columns: {}
      };

      var _iterator = _createForOfIteratorHelper(props.columns),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var col = _step.value;
          config.columns[col.key] = {
            unselectable: true,
            shown: true,
            width: col.width || 100
          };
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      defaultTablesConfig = {
        default: config
      };
    } else {
      defaultTablesConfig = _objectSpread({}, defaultTablesConfig);

      for (var _i2 = 0, _Object$entries = Object.entries(defaultTablesConfig); _i2 < _Object$entries.length; _i2++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
            view = _Object$entries$_i[0],
            _config = _Object$entries$_i[1];

        if (typeof _config.fixed !== 'boolean') {
          _config.fixed = !!props.fixed || false;
        }

        if (_typeof(_config.columns) !== 'object') {
          console.warn("defaultTablesConfig['".concat(view, "'] does not include columns object"));
          _config.columns = {};
        }

        var _iterator2 = _createForOfIteratorHelper(props.columns),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _col = _step2.value;

            if (!_config.columns.hasOwnProperty(_col.key)) {
              console.warn("defaultTablesConfig['".concat(view, "'] does not include column with key '").concat(_col.key, "'"));
              _config.columns[_col.key] = {
                unselectable: true,
                shown: true,
                width: _col.width || 100
              };
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    }

    var defaultTableView = Object.keys(defaultTablesConfig)[0];
    return {
      defaultTablesConfig: defaultTablesConfig,
      defaultTableView: defaultTableView
    };
  }, [props.defaultTablesConfig, props.columns, props.fixed]),
      defaultTablesConfig = _React$useMemo.defaultTablesConfig,
      defaultTableView = _React$useMemo.defaultTableView;

  _react.default.useEffect(function () {
    dispatch((0, _appTableData.setDefaultTablesConfig)(dataSet, defaultTableView, defaultTablesConfig));
  }, [dispatch, dataSet, defaultTableView, defaultTablesConfig]);

  var selectInfo = _react.default.useCallback(function (state) {
    var _state$dataSet = state[dataSet],
        selected = _state$dataSet.selected,
        expanded = _state$dataSet.expanded,
        loading = _state$dataSet.loading;
    var _state$dataSet$ui = state[dataSet].ui,
        tablesConfig = _state$dataSet$ui.tablesConfig,
        tableView = _state$dataSet$ui.tableView;
    return {
      selected: selected,
      expanded: expanded,
      loading: loading,
      ids: (0, _appTableData.selectSortedFilteredIds)(state, dataSet),
      entities: (0, _appTableData.selectEntities)(state, dataSet),
      getField: (0, _appTableData.selectGetField)(state, dataSet),
      tablesConfig: tablesConfig,
      tableView: tableView
    };
  }, [dataSet]);

  var _useSelector = (0, _reactRedux.useSelector)(selectInfo),
      selected = _useSelector.selected,
      expanded = _useSelector.expanded,
      loading = _useSelector.loading,
      ids = _useSelector.ids,
      entities = _useSelector.entities,
      getField = _useSelector.getField,
      tablesConfig = _useSelector.tablesConfig,
      tableView = _useSelector.tableView;

  var tableConfig = tablesConfig[tableView] || defaultTablesConfig[defaultTableView];

  var adjustColumnWidth = _react.default.useCallback(function (key, deltaX) {
    dispatch((0, _appTableData.adjustTableColumnWidth)(dataSet, tableView, key, deltaX)); //dispatch(setTableColumnWidth(dataSet, tableView, key, width));

    if (gridRef.current) gridRef.current.resetAfterColumnIndex(0, true);
  }, [dispatch, dataSet, tableView]); // Sync the table header scroll position with that of the table body


  var onScroll = function onScroll(_ref3) {
    var scrollLeft = _ref3.scrollLeft,
        scrollTop = _ref3.scrollTop;
    if (headerRef.current) headerRef.current.scrollLeft = scrollLeft;
  };

  var onKeyDown = useKeyDown(dataSet, selected, ids, dispatch, gridRef.current);
  var onRowClick = useRowClick(dataSet, selected, ids, dispatch);
  var fixed = tableConfig.fixed;

  var _React$useMemo2 = _react.default.useMemo(function () {
    var columns = props.columns.map(function (col) {
      return _objectSpread(_objectSpread({}, col), tableConfig.columns[col.key]);
    }).filter(function (col) {
      return col.shown;
    });
    var totalWidth = columns.reduce(function (totalWidth, col) {
      return totalWidth = totalWidth + col.width;
    }, 0);
    return {
      columns: columns,
      totalWidth: totalWidth
    };
  }, [props.columns, tableConfig.columns]),
      columns = _React$useMemo2.columns,
      totalWidth = _React$useMemo2.totalWidth; // If width is not given, then size to content


  if (!width) width = totalWidth + scrollbarSize; // If the container size changes, then re-render rows

  _react.default.useEffect(function () {
    if (gridRef.current) gridRef.current.resetAfterColumnIndex(0, true);
  }, [width, height, fixed]); // Package the context data


  var tableData = _react.default.useMemo(function () {
    return {
      gutterSize: gutterSize,
      entities: entities,
      ids: ids,
      selected: selected,
      expanded: expanded,
      fixed: fixed,
      columns: columns,
      getRowData: props.rowGetter,
      getField: getField,
      estimatedRowHeight: estimatedRowHeight,
      measureRowHeight: measureRowHeight,
      onRowHeightChange: onRowHeightChange,
      onRowClick: onRowClick
    };
  }, [props.rowGetter, gutterSize, entities, ids, selected, expanded, fixed, columns, getField, estimatedRowHeight, measureRowHeight, onRowHeightChange, onRowClick]); // put header after body and reverse the display order via css to prevent header's shadow being covered by body


  return /*#__PURE__*/_react.default.createElement(Table, {
    role: "table",
    style: {
      height: height,
      width: width
    },
    onKeyDown: onKeyDown,
    tabIndex: 0
  }, ids.length ? /*#__PURE__*/_react.default.createElement(_reactWindow.VariableSizeGrid, {
    ref: gridRef,
    height: height - props.headerHeight,
    width: width,
    columnCount: 1,
    columnWidth: function columnWidth() {
      return fixed ? totalWidth : width - scrollbarSize;
    },
    rowCount: ids.length,
    estimatedRowHeight: estimatedRowHeight,
    rowHeight: getRowHeight,
    onScroll: onScroll,
    itemData: tableData
  }, _AppTableRow.default) : /*#__PURE__*/_react.default.createElement(NoGrid, {
    style: {
      height: height - props.headerHeight,
      width: width
    }
  }, loading ? 'Loading...' : 'Empty'), /*#__PURE__*/_react.default.createElement(_AppTableHeader.default, {
    ref: headerRef,
    outerStyle: {
      width: width,
      height: props.headerHeight,
      paddingRight: scrollbarSize
    },
    innerStyle: {
      width: fixed ? totalWidth + scrollbarSize : '100%'
    },
    fixed: fixed,
    columns: columns,
    adjustColumnWidth: adjustColumnWidth,
    defaultHeaderCellRenderer: function defaultHeaderCellRenderer(p) {
      return /*#__PURE__*/_react.default.createElement(_TableColumnHeader.default, _extends({
        dataSet: dataSet
      }, p));
    }
  }));
}
/*
 * AppTable
 */


function AppTable(props) {
  return /*#__PURE__*/_react.default.createElement(_reactVirtualizedAutoSizer.default, {
    disableWidth: props.fitWidth,
    style: {
      maxWidth: '100vw'
    }
  }, function (_ref4) {
    var height = _ref4.height,
        width = _ref4.width;
    return /*#__PURE__*/_react.default.createElement(AppTableSized, _extends({
      height: height,
      width: width
    }, props));
  });
}

AppTable.propTypes = {
  fitWidth: _propTypes.default.bool,
  fixed: _propTypes.default.bool,
  columns: _propTypes.default.array.isRequired,
  dataSet: _propTypes.default.string.isRequired,
  rowGetter: _propTypes.default.func,
  headerHeight: _propTypes.default.number.isRequired,
  estimatedRowHeight: _propTypes.default.number.isRequired,
  measureRowHeight: _propTypes.default.bool,
  defaultTablesConfig: _propTypes.default.object,
  gutterSize: _propTypes.default.number
};
AppTable.defaultProps = {
  gutterSize: 5,
  measureRowHeight: false
};

var _default = /*#__PURE__*/_react.default.memo(AppTable);

exports.default = _default;