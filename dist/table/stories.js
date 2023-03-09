"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports._SplitPanel = exports.SplitTable = exports.NoDefaultTable = exports.FixedCenteredTable = void 0;

var _loremIpsum = require("lorem-ipsum");

var _react = _interopRequireDefault(require("react"));

var _toolkit = require("@reduxjs/toolkit");

var _reduxLogger = require("redux-logger");

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var _reactRedux = require("react-redux");

var _lib = require("../lib");

var _icons = require("../icons");

var _form = require("../form");

var _appTableData = require("../store/appTableData");

var _ = require(".");

var _combineReducers;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*
 * Slice 2 maps an id to a name
 */
var fields2 = {
  id: {
    label: 'id'
  },
  Name: {
    label: 'Name'
  }
};
var slice2 = (0, _appTableData.createAppTableDataSlice)({
  name: 'names',
  fields: fields2,
  initialState: {}
}); //console.log('done slice2')

var statusOptions = [{
  value: 0,
  label: 'Good'
}, {
  value: 1,
  label: 'Bad'
}, {
  value: 2,
  label: 'Ugly'
}];

var renderStatus = function renderStatus(v) {
  var o = statusOptions.find(function (o) {
    return o.value === v;
  });
  return o ? o.label : v;
};

var fields = {
  id: {
    label: 'ID',
    isId: true,
    sortType: _appTableData.SortType.NUMERIC
  },
  Name: {
    label: 'Name'
  },
  Date: {
    label: 'Date',
    dataRenderer: _lib.displayDate,
    sortType: _appTableData.SortType.DATE
  },
  Text: {
    label: 'Text'
  },
  Number: {
    label: 'Number',
    sortType: _appTableData.SortType.NUMERIC
  },
  Status: {
    label: 'Status',
    dataRenderer: renderStatus,
    options: statusOptions,
    sortType: _appTableData.SortType.NUMERIC,
    dontSort: true,
    dontFilter: true
  },
  Derived: {
    label: 'Derived'
  }
};
var dataSet = 'data';

var selectField = function selectField(data, dataKey) {
  if (dataKey === 'Derived') return data.Status + '-es';
  return data[dataKey];
};
/* A selector that returns the entities with name_id mapped to Name */


var selectEntities = (0, _toolkit.createSelector)(function (state) {
  return state['names'].entities;
}, function (state) {
  return state[dataSet].entities;
}, function (nameEntities, entities) {
  var transformedEntities = {};

  for (var _i = 0, _Object$entries = Object.entries(entities); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        id = _Object$entries$_i[0],
        entity = _Object$entries$_i[1];

    var nameEntity = nameEntities[entity.name_id];
    var Name = nameEntity ? nameEntity.Name : '';
    transformedEntities[id] = _objectSpread(_objectSpread({}, entity), {}, {
      Name: Name
    });
  }

  return transformedEntities;
});
var slice = (0, _appTableData.createAppTableDataSlice)({
  name: dataSet,
  fields: fields,
  initialState: {},
  selectField: selectField,
  selectEntities: selectEntities
}); //console.log('done slice')

var store = (0, _toolkit.configureStore)({
  reducer: (0, _toolkit.combineReducers)((_combineReducers = {}, _defineProperty(_combineReducers, slice2.name, slice2.reducer), _defineProperty(_combineReducers, slice.name, slice.reducer), _combineReducers)),
  middleware: [_reduxThunk.default, (0, _reduxLogger.createLogger)({
    collapsed: true
  })],
  devTools: true
}); //console.log('done store')

var tableColumns = [{
  key: '__ctrl__',
  width: 48,
  flexGrow: 0,
  flexShrink: 0
}, _objectSpread(_objectSpread({
  key: 'id'
}, fields.id), {}, {
  width: 80,
  flexGrow: 1,
  flexShrink: 1,
  dropdownWidth: 200,
  headerRenderer: function headerRenderer(p) {
    return /*#__PURE__*/_react.default.createElement(_.TableColumnHeader, _extends({
      dataSet: dataSet,
      customFilterElement: /*#__PURE__*/_react.default.createElement(_.IdFilter, {
        dataSet: dataSet,
        dataKey: "id"
      })
    }, p));
  }
}), _objectSpread(_objectSpread({
  key: 'Name'
}, fields.Name), {}, {
  width: 80,
  flexGrow: 1,
  flexShrink: 1,
  dropdownWidth: 200
}), _objectSpread(_objectSpread({
  key: 'Date'
}, fields.Date), {}, {
  width: 200,
  flexGrow: 1,
  flexShrink: 1
}), _objectSpread(_objectSpread({
  key: 'Text'
}, fields.Text), {}, {
  width: 200,
  flexGrow: 1,
  flexShrink: 1
}), _objectSpread(_objectSpread({
  key: 'Number'
}, fields.Number), {}, {
  width: 200,
  flexGrow: 1,
  flexShrink: 1
}), _objectSpread(_objectSpread({
  key: 'Status'
}, fields.Status), {}, {
  width: 200,
  flexGrow: 1,
  flexShrink: 1
}), _objectSpread(_objectSpread({
  key: 'Derived'
}, fields.Derived), {}, {
  width: 200
}), {
  key: 'Actions',
  label: 'Actions',
  width: 200
}];

var randomDate = function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

var randomStatus = function randomStatus() {
  return Math.round(Math.random() * (statusOptions.length - 1));
};

var lorem = new _loremIpsum.LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});
var MaxNames = 4;

var genData = function genData(n) {
  return new Array(n).fill(true).map(function (r, i) {
    return {
      id: i,
      name_id: Math.floor(Math.random() * MaxNames),
      Date: randomDate(new Date(2010, 0, 1), new Date()).toISOString(),
      Number: Math.round(Math.random() * 5),
      Text: lorem.generateSentences(3),
      Status: randomStatus()
    };
  });
};

var genData2 = function genData2() {
  return new Array(MaxNames).fill(true).map(function (r, i) {
    return {
      id: i,
      Name: Math.random().toString(36).slice(2)
    };
  });
};

var loadData = function loadData() {
  var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
  return function (dispatch, getState) {
    var data2 = genData2();
    dispatch(slice2.actions.getSuccess(data2));
    var _slice$actions = slice.actions,
        getPending = _slice$actions.getPending,
        getSuccess = _slice$actions.getSuccess;
    dispatch(getPending());
    var data = genData(n);
    setTimeout(function () {
      return dispatch(getSuccess(data));
    }, 1000);
  };
};

var removeRow = slice.actions.removeOne;
var defaultTablesConfig = {
  '1': {
    fixed: false,
    columns: {
      __ctrl__: {
        unselectable: true,
        shown: true,
        width: 48
      },
      id: {
        shown: true,
        width: 80
      },
      Name: {
        shown: true,
        width: 200
      },
      Text: {
        shown: true,
        width: 200
      },
      Date: {
        shown: true,
        width: 200
      },
      Number: {
        shown: true,
        width: 200
      },
      Status: {
        shown: true,
        width: 200
      },
      Derived: {
        shown: true,
        width: 200
      },
      Actions: {
        shown: true,
        width: 200
      }
    }
  },
  '2': {
    fixed: false,
    columns: {
      __ctrl__: {
        unselectable: true,
        shown: true,
        width: 48
      },
      id: {
        shown: true,
        width: 80
      },
      Name: {
        unselectable: true,
        shown: false,
        width: 200
      },
      Text: {
        shown: true,
        width: 200
      },
      Date: {
        shown: true,
        width: 200
      },
      Number: {
        shown: true,
        width: 200
      },
      Status: {
        shown: true,
        width: 200
      },
      Derived: {
        shown: true,
        width: 200
      },
      Actions: {
        shown: true,
        width: 200
      }
    }
  }
};

var LoaderButton = function LoaderButton(_ref) {
  var numberOfRows = _ref.numberOfRows;
  var dispatch = (0, _reactRedux.useDispatch)();
  return /*#__PURE__*/_react.default.createElement(_form.Button, {
    onClick: function onClick() {
      return dispatch(loadData(numberOfRows));
    }
  }, "Load ", numberOfRows);
};

function tableColumnsWithControl(expandable, dispatch) {
  var columns = tableColumns.slice();
  var headerRenderer, cellRenderer;

  if (expandable) {
    headerRenderer = function headerRenderer(p) {
      return /*#__PURE__*/_react.default.createElement(_.SelectExpandHeader, _extends({
        dataSet: dataSet,
        customSelectorElement: /*#__PURE__*/_react.default.createElement(_.IdSelector, {
          style: {
            width: '200px'
          },
          dataSet: dataSet,
          dataKey: 'id',
          focusOnMount: true
        })
      }, p));
    };

    cellRenderer = function cellRenderer(p) {
      return /*#__PURE__*/_react.default.createElement(_.SelectExpandCell, _extends({
        dataSet: dataSet
      }, p));
    };
  } else {
    headerRenderer = function headerRenderer(p) {
      return /*#__PURE__*/_react.default.createElement(_.SelectHeader, _extends({
        dataSet: dataSet,
        customSelectorElement: /*#__PURE__*/_react.default.createElement(_.IdSelector, {
          style: {
            width: '200px'
          },
          dataSet: dataSet,
          dataKey: 'id',
          focusOnMount: true
        })
      }, p));
    };

    cellRenderer = function cellRenderer(p) {
      return /*#__PURE__*/_react.default.createElement(_.SelectCell, _extends({
        dataSet: dataSet
      }, p));
    };
  }

  columns[0] = _objectSpread(_objectSpread({}, columns[0]), {}, {
    headerRenderer: headerRenderer,
    cellRenderer: cellRenderer
  });

  cellRenderer = function cellRenderer(_ref2) {
    var rowData = _ref2.rowData;
    return /*#__PURE__*/_react.default.createElement(_icons.ActionIcon, {
      type: "delete",
      onClick: function onClick(e) {
        e.stopPropagation();
        dispatch(removeRow(rowData.id));
      }
    });
  };

  columns[columns.length - 1] = _objectSpread(_objectSpread({}, columns[columns.length - 1]), {}, {
    cellRenderer: cellRenderer
  });
  return columns;
}

var _SplitPanel = function _SplitPanel(_ref3) {
  var expandable = _ref3.expandable,
      numberOfRows = _ref3.numberOfRows;
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '80vh'
    }
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_.SplitPanelButton, {
    dataSet: dataSet
  })), /*#__PURE__*/_react.default.createElement(_.SplitPanel, {
    dataSet: dataSet
  }, /*#__PURE__*/_react.default.createElement(_.Panel, null, /*#__PURE__*/_react.default.createElement("span", null, "Something here...")), /*#__PURE__*/_react.default.createElement(_.Panel, null, /*#__PURE__*/_react.default.createElement("span", null, "And something here..."))));
};

exports._SplitPanel = _SplitPanel;

var SplitTable = function SplitTable(_ref4) {
  var expandable = _ref4.expandable,
      numberOfRows = _ref4.numberOfRows;
  var dispatch = (0, _reactRedux.useDispatch)();

  var columns = _react.default.useMemo(function () {
    return tableColumnsWithControl(expandable, dispatch);
  }, [expandable, dispatch]);

  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '80vh'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/_react.default.createElement(LoaderButton, {
    numberOfRows: numberOfRows
  }), /*#__PURE__*/_react.default.createElement(_.SplitTableButtonGroup, {
    dataSet: dataSet,
    columns: columns
  })), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/_react.default.createElement(_.ShowFilters, {
    dataSet: dataSet,
    fields: fields
  }), /*#__PURE__*/_react.default.createElement(_.GlobalFilter, {
    dataSet: dataSet
  })), /*#__PURE__*/_react.default.createElement(_.SplitPanel, {
    dataSet: dataSet
  }, /*#__PURE__*/_react.default.createElement(_.Panel, null, /*#__PURE__*/_react.default.createElement(_.AppTable, {
    defaultTablesConfig: defaultTablesConfig,
    columns: columns,
    headerHeight: 46,
    estimatedRowHeight: 56,
    dataSet: dataSet
  })), /*#__PURE__*/_react.default.createElement(_.Panel, null, /*#__PURE__*/_react.default.createElement("span", null, "Something here..."))));
};

exports.SplitTable = SplitTable;

var NoDefaultTable = function NoDefaultTable(_ref5) {
  var fixed = _ref5.fixed,
      expandable = _ref5.expandable,
      numberOfRows = _ref5.numberOfRows;
  var dispatch = (0, _reactRedux.useDispatch)();

  var columns = _react.default.useMemo(function () {
    return tableColumnsWithControl(expandable, dispatch);
  }, [expandable, dispatch]);

  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '80vh'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/_react.default.createElement(LoaderButton, {
    numberOfRows: numberOfRows
  })), /*#__PURE__*/_react.default.createElement(_.ShowFilters, {
    dataSet: dataSet,
    fields: fields
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      flex: 1,
      width: '100%'
    }
  }, /*#__PURE__*/_react.default.createElement(_.AppTable, {
    fixed: fixed,
    columns: columns,
    headerHeight: 46,
    estimatedRowHeight: 56,
    dataSet: dataSet
  })));
};

exports.NoDefaultTable = NoDefaultTable;

var FixedCenteredTable = function FixedCenteredTable(_ref6) {
  var expandable = _ref6.expandable,
      numberOfRows = _ref6.numberOfRows;
  var dispatch = (0, _reactRedux.useDispatch)();

  var columns = _react.default.useMemo(function () {
    return tableColumnsWithControl(expandable, dispatch);
  }, [expandable, dispatch]);

  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '80vh'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/_react.default.createElement(LoaderButton, {
    numberOfRows: numberOfRows
  })), /*#__PURE__*/_react.default.createElement(_.ShowFilters, {
    dataSet: dataSet,
    fields: fields
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/_react.default.createElement(_.AppTable, {
    fitWidth: true,
    fixed: true,
    columns: columns //defaultTablesConfig={{'fixed': {}}}
    ,
    headerHeight: 46,
    estimatedRowHeight: 56,
    dataSet: dataSet
  })));
};

exports.FixedCenteredTable = FixedCenteredTable;
var story = {
  title: 'Table',
  component: _.AppTable,
  args: {
    expandable: false,
    numberOfRows: 5
  },
  decorators: [function (Story) {
    return /*#__PURE__*/_react.default.createElement(_reactRedux.Provider, {
      store: store
    }, /*#__PURE__*/_react.default.createElement(Story, null));
  }]
};
var _default = story;
exports.default = _default;