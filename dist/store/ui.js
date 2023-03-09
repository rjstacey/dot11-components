"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upsertTableColumns = exports.toggleTableFixed = exports.setTableView = exports.setTableColumnWidth = exports.setTableColumnUnselectable = exports.setTableColumnShown = exports.setProperty = exports.setPanelWidth = exports.setPanelIsSplit = exports.setDefaultTablesConfig = exports.selectViews = exports.selectCurrentView = exports.selectCurrentTableConfig = exports.selectCurrentPanelConfig = exports.createUiSubslice = exports.adjustTableColumnWidth = exports.adjustPanelWidth = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultTableView = 'default';
var defaultTableConfig = {
  fixed: false,
  columns: {}
};
var defaultPanelConfig = {
  width: 0.5,
  isSplit: false
};
var name = 'ui';

var createUiSubslice = function createUiSubslice(dataSet) {
  return {
    name: name,
    initialState: {
      ui: {
        tableView: defaultTableView,
        tablesConfig: _defineProperty({}, defaultTableView, defaultTableConfig),
        panelsConfig: _defineProperty({}, defaultTableView, defaultPanelConfig)
      }
    },
    reducers: {
      setProperty: function setProperty(state, action) {
        var ui = state[name];
        var _action$payload = action.payload,
            property = _action$payload.property,
            value = _action$payload.value;
        ui[property] = value;
      },
      setUiProperties: function setUiProperties(state, action) {
        state[name] = _objectSpread(_objectSpread({}, state[name]), action.payload);
      },
      setTableView: function setTableView(state, action) {
        var ui = state[name];
        var tableView = action.payload.tableView;
        ui.tableView = tableView;
      },
      setDefaultTablesConfig: function setDefaultTablesConfig(state, action) {
        var ui = state[name];
        var tablesConfig = action.payload.tablesConfig; // Remove table views with no default config

        for (var _i = 0, _Object$keys = Object.keys(ui.tablesConfig); _i < _Object$keys.length; _i++) {
          var tableView = _Object$keys[_i];

          if (!tablesConfig[tableView]) {
            delete ui.tablesConfig[tableView];
            delete ui.panelsConfig[tableView];
          }
        } // Add default config if config not already present


        for (var _i2 = 0, _Object$entries = Object.entries(tablesConfig); _i2 < _Object$entries.length; _i2++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
              _tableView = _Object$entries$_i[0],
              tableConfig = _Object$entries$_i[1];

          if (!ui.tablesConfig[_tableView]) {
            ui.tablesConfig[_tableView] = tableConfig;
          } else {
            var existingTableConfig = ui.tablesConfig[_tableView]; // Remove columns that no longer exist

            for (var _i3 = 0, _Object$keys2 = Object.keys(existingTableConfig.columns); _i3 < _Object$keys2.length; _i3++) {
              var colKey = _Object$keys2[_i3];
              if (!tableConfig.columns[colKey]) delete existingTableConfig.columns[colKey];
            } // Add columns that aren't currently present


            for (var _i4 = 0, _Object$keys3 = Object.keys(tableConfig.columns); _i4 < _Object$keys3.length; _i4++) {
              var _colKey = _Object$keys3[_i4];
              if (!existingTableConfig.columns[_colKey]) existingTableConfig.columns[_colKey] = tableConfig.columns[_colKey];
            }
          }

          if (!ui.panelsConfig[_tableView]) ui.panelsConfig[_tableView] = defaultPanelConfig;
        } // Set current table view if not set or points to removed config


        if (!ui.tableView || !ui.tablesConfig[state.tableView]) {
          var _tableView2 = action.payload.tableView;
          if (_tableView2) ui.tableView = _tableView2;else ui.tableView = Object.keys(ui.tablesConfig)[0];
        }
      },
      upsertTableColumns: function upsertTableColumns(state, action) {
        var ui = state[name];
        var _action$payload2 = action.payload,
            tableView = _action$payload2.tableView,
            columns = _action$payload2.columns;
        if (tableView === undefined) tableView = ui.tableView;
        var tableConfig = ui.tablesConfig[tableView];
        if (tableConfig === undefined) tableConfig = defaultTableConfig;

        for (var _i5 = 0, _Object$entries2 = Object.entries(columns); _i5 < _Object$entries2.length; _i5++) {
          var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i5], 2),
              key = _Object$entries2$_i[0],
              column = _Object$entries2$_i[1];

          if (tableConfig.columns[key] === undefined) tableConfig.columns[key] = {};
          tableConfig.columns[key] = _objectSpread(_objectSpread({}, tableConfig.columns[key]), column);
        }
      },
      adjustTableColumnWidth: function adjustTableColumnWidth(state, action) {
        var ui = state[name];
        var _action$payload3 = action.payload,
            tableView = _action$payload3.tableView,
            key = _action$payload3.key,
            delta = _action$payload3.delta;
        if (!tableView) tableView = ui.tableView;
        var tableConfig = ui.tablesConfig[tableView];
        var column = tableConfig.columns[key];
        column.width = Math.max(0, column.width + delta);
      },
      setTableColumnWidth: function setTableColumnWidth(state, action) {
        var ui = state[name];
        var _action$payload4 = action.payload,
            tableView = _action$payload4.tableView,
            key = _action$payload4.key,
            width = _action$payload4.width;
        if (!tableView) tableView = ui.tableView;
        var tableConfig = ui.tablesConfig[tableView];
        var column = tableConfig.columns[key];
        column.width = Math.max(0, width);
      },
      toggleTableFixed: function toggleTableFixed(state, action) {
        var ui = state[name];
        var tableView = action.payload.tableView;
        if (tableView === undefined) tableView = ui.tableView;
        var tableConfig = ui.tablesConfig[tableView];
        if (tableConfig === undefined) tableConfig = defaultTableConfig;
        tableConfig.fixed = !ui.tablesConfig[tableView].fixed;
        ui.tablesConfig[tableView] = tableConfig;
      },
      adjustPanelWidth: function adjustPanelWidth(state, action) {
        var ui = state[name];
        var _action$payload5 = action.payload,
            tableView = _action$payload5.tableView,
            delta = _action$payload5.delta;
        if (!tableView) tableView = ui.tableView;
        var panelConfig = ui.panelsConfig[tableView];
        panelConfig.width += delta;
      },
      setPanelWidth: function setPanelWidth(state, action) {
        var ui = state[name];
        var _action$payload6 = action.payload,
            tableView = _action$payload6.tableView,
            width = _action$payload6.width;
        if (!tableView) tableView = ui.tableView;
        var panelConfig = ui.panelsConfig[tableView];
        panelConfig.width = width;
      },
      setPanelIsSplit: function setPanelIsSplit(state, action) {
        var ui = state[name];
        var _action$payload7 = action.payload,
            tableView = _action$payload7.tableView,
            isSplit = _action$payload7.isSplit;
        if (!tableView) tableView = ui.tableView;
        var panelConfig = ui.panelsConfig[tableView];
        panelConfig.isSplit = isSplit;
      }
    }
  };
};
/*
 * Selectors
 */


exports.createUiSubslice = createUiSubslice;

var selectCurrentView = function selectCurrentView(state, dataSet) {
  return state[dataSet].ui.tableView;
};

exports.selectCurrentView = selectCurrentView;

var selectCurrentPanelConfig = function selectCurrentPanelConfig(state, dataSet) {
  var _state$dataSet$ui = state[dataSet].ui,
      tableView = _state$dataSet$ui.tableView,
      panelsConfig = _state$dataSet$ui.panelsConfig;

  if (panelsConfig) {
    var panelConfig = panelsConfig[tableView];
    if (panelConfig) return panelConfig;
  }

  return defaultPanelConfig;
};

exports.selectCurrentPanelConfig = selectCurrentPanelConfig;

var selectCurrentTableConfig = function selectCurrentTableConfig(state, dataSet) {
  var _state$dataSet$ui2 = state[dataSet].ui,
      tableView = _state$dataSet$ui2.tableView,
      tablesConfig = _state$dataSet$ui2.tablesConfig;

  if (tablesConfig) {
    var tableConfig = tablesConfig[tableView];
    if (tableConfig) return tableConfig;
  }

  return defaultTableConfig;
};

exports.selectCurrentTableConfig = selectCurrentTableConfig;

var selectViews = function selectViews(state, dataSet) {
  return Object.keys(state[dataSet].ui.tablesConfig);
};
/* Actions */


exports.selectViews = selectViews;

var setDefaultTablesConfig = function setDefaultTablesConfig(dataSet, tableView, tablesConfig) {
  return {
    type: dataSet + '/setDefaultTablesConfig',
    payload: {
      tableView: tableView,
      tablesConfig: tablesConfig
    }
  };
};

exports.setDefaultTablesConfig = setDefaultTablesConfig;

var setTableView = function setTableView(dataSet, tableView) {
  return {
    type: dataSet + '/setTableView',
    payload: {
      tableView: tableView
    }
  };
};

exports.setTableView = setTableView;

var toggleTableFixed = function toggleTableFixed(dataSet, tableView) {
  return {
    type: dataSet + '/toggleTableFixed',
    payload: {
      tableView: tableView
    }
  };
};

exports.toggleTableFixed = toggleTableFixed;

var upsertTableColumns = function upsertTableColumns(dataSet, tableView, columns) {
  return {
    type: dataSet + '/upsertTableColumns',
    payload: {
      tableView: tableView,
      columns: columns
    }
  };
};

exports.upsertTableColumns = upsertTableColumns;

var adjustTableColumnWidth = function adjustTableColumnWidth(dataSet, tableView, key, delta) {
  return {
    type: dataSet + '/adjustTableColumnWidth',
    payload: {
      tableView: tableView,
      key: key,
      delta: delta
    }
  };
};

exports.adjustTableColumnWidth = adjustTableColumnWidth;

var setTableColumnWidth = function setTableColumnWidth(dataSet, tableView, key, width) {
  return {
    type: dataSet + '/setTableColumnWidth',
    payload: {
      tableView: tableView,
      key: key,
      width: width
    }
  };
};

exports.setTableColumnWidth = setTableColumnWidth;

var setTableColumnShown = function setTableColumnShown(dataSet, tableView, key, shown) {
  return {
    type: dataSet + '/upsertTableColumns',
    payload: {
      tableView: tableView,
      columns: _defineProperty({}, key, {
        shown: shown
      })
    }
  };
};

exports.setTableColumnShown = setTableColumnShown;

var setTableColumnUnselectable = function setTableColumnUnselectable(dataSet, tableView, key, unselectable) {
  return {
    type: dataSet + '/upsertTableColumns',
    payload: {
      tableView: tableView,
      columns: _defineProperty({}, key, {
        unselectable: unselectable
      })
    }
  };
};

exports.setTableColumnUnselectable = setTableColumnUnselectable;

var adjustPanelWidth = function adjustPanelWidth(dataSet, tableView, delta) {
  return {
    type: dataSet + '/adjustPanelWidth',
    payload: {
      tableView: tableView,
      delta: delta
    }
  };
};

exports.adjustPanelWidth = adjustPanelWidth;

var setPanelWidth = function setPanelWidth(dataSet, tableView, width) {
  return {
    type: dataSet + '/setPanelWidth',
    payload: {
      tableView: tableView,
      width: width
    }
  };
};

exports.setPanelWidth = setPanelWidth;

var setPanelIsSplit = function setPanelIsSplit(dataSet, tableView, isSplit) {
  return {
    type: dataSet + '/setPanelIsSplit',
    payload: {
      tableView: tableView,
      isSplit: isSplit
    }
  };
};

exports.setPanelIsSplit = setPanelIsSplit;

var setProperty = function setProperty(dataSet, property, value) {
  return {
    type: dataSet + '/setProperty',
    payload: {
      property: property,
      value: value
    }
  };
};

exports.setProperty = setProperty;