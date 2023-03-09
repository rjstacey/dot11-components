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

var _icons = require("../icons");

var _form = require("../form");

var _dropdown = _interopRequireDefault(require("../dropdown"));

var _appTableData = require("../store/appTableData");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var StyledCustomContainer = _styled.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n\tmargin: 10px 10px 0;\n\tline-height: 30px;\n\tpadding-left: 20px;\n\tborder: 1px solid #ccc;\n\tborder-radius: 3px;\n\t:focus {\n\t\toutline: none;\n\t\tborder: 1px solid deepskyblue;\n\t}\n"])));

var StyledInput = (0, _styled.default)(_form.Input)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n\tmargin: 5px 10px;\n\tpadding: 10px;\n"])));
var StyledList = (0, _styled.default)(_reactWindow.FixedSizeList)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n\tmin-height: 35px;\n\tmax-height: 250px;\n\tborder: 1px solid #ccc;\n\tborder-radius: 3px;\n\tmargin: 10px;\n"])));

var Item = _styled.default.div(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n\tdisplay: flex;\n\talign-items: center;\n\t", "\n\t", "\n\t& > div {\n\t\tmargin: 5px 5px;\n\t\t", "\n\t\toverflow: hidden;\n\t\twhite-space: nowrap;\n\t\ttext-overflow: ellipsis;\n\t}\n"])), function (_ref) {
  var disabled = _ref.disabled;
  return disabled && 'text-decoration: line-through;';
}, function (_ref2) {
  var isSelected = _ref2.isSelected;
  return isSelected ? 'background: #0074d9;' : ':hover{background: #ccc;}';
}, function (_ref3) {
  var isSelected = _ref3.isSelected;
  return isSelected && 'color: #fff;';
});

var Row = _styled.default.div(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n\tmargin: 5px 10px;\n\tdisplay: flex;\n\tjustify-content: space-between;\n\talign-items: center;\n"])));

function Sort(_ref4) {
  var dataSet = _ref4.dataSet,
      dataKey = _ref4.dataKey;

  var _useSelector = (0, _reactRedux.useSelector)(function (state) {
    return state[dataSet].sorts.settings[dataKey];
  }),
      direction = _useSelector.direction,
      type = _useSelector.type;

  var dispatch = (0, _reactRedux.useDispatch)();

  var setSort = _react.default.useCallback(function (direction) {
    return dispatch((0, _appTableData.sortSet)(dataSet, dataKey, direction));
  }, [dispatch, dataSet, dataKey]);

  return /*#__PURE__*/_react.default.createElement(Row, null, /*#__PURE__*/_react.default.createElement("label", null, "Sort:"), /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_form.Button, {
    onClick: function onClick(e) {
      return setSort(direction === _appTableData.SortDirection.ASC ? _appTableData.SortDirection.NONE : _appTableData.SortDirection.ASC);
    },
    isActive: direction === _appTableData.SortDirection.ASC
  }, /*#__PURE__*/_react.default.createElement(_icons.Icon, {
    type: "sort",
    direction: _appTableData.SortDirection.ASC,
    isAlpha: type !== _appTableData.SortType.NUMERIC
  })), /*#__PURE__*/_react.default.createElement(_form.Button, {
    onClick: function onClick(e) {
      return setSort(direction === _appTableData.SortDirection.DESC ? _appTableData.SortDirection.NONE : _appTableData.SortDirection.DESC);
    },
    isActive: direction === _appTableData.SortDirection.DESC
  }, /*#__PURE__*/_react.default.createElement(_icons.Icon, {
    type: "sort",
    direction: _appTableData.SortDirection.DESC,
    isAlpha: type !== _appTableData.SortType.NUMERIC
  }))));
}

function Filter(_ref5) {
  var dataSet = _ref5.dataSet,
      dataKey = _ref5.dataKey,
      dataRenderer = _ref5.dataRenderer,
      customFilterElement = _ref5.customFilterElement,
      isId = _ref5.isId;

  var _React$useState = _react.default.useState(''),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      search = _React$useState2[0],
      setSearch = _React$useState2[1];

  var inputRef = _react.default.useRef();

  var dispatch = (0, _reactRedux.useDispatch)();

  var selectInfo = _react.default.useCallback(function (state) {
    return {
      sort: (0, _appTableData.selectSort)(state, dataSet, dataKey),
      filter: (0, _appTableData.selectFilter)(state, dataSet, dataKey),
      selected: (0, _appTableData.selectSelected)(state, dataSet),
      entities: (0, _appTableData.selectEntities)(state, dataSet),
      getField: (0, _appTableData.selectGetField)(state, dataSet)
    };
  }, [dataSet, dataKey]);

  var _useSelector2 = (0, _reactRedux.useSelector)(selectInfo),
      sort = _useSelector2.sort,
      filter = _useSelector2.filter,
      selected = _useSelector2.selected,
      entities = _useSelector2.entities,
      getField = _useSelector2.getField;

  var selectValues = _react.default.useCallback(function (state) {
    var filter = (0, _appTableData.selectFilter)(state, dataSet, dataKey);
    var ids = (0, _appTableData.selectIds)(state, dataSet);
    if (filter.comps.length === 0) ids = (0, _appTableData.selectFilteredIds)(state, dataSet);
    var getField = (0, _appTableData.selectGetField)(state, dataSet);
    var entities = (0, _appTableData.selectEntities)(state, dataSet);
    return _toConsumableArray(new Set(ids.map(function (id) {
      return getField(entities[id], dataKey);
    })));
  }, [dataSet, dataKey]);

  var values = (0, _reactRedux.useSelector)(selectValues);

  var filterSelected = _react.default.useCallback(function () {
    var comps = selected.map(function (id) {
      return {
        value: getField(entities[id], dataKey),
        filterType: _appTableData.FilterType.EXACT
      };
    });
    dispatch((0, _appTableData.setFilter)(dataSet, dataKey, comps));
  }, [dispatch, dataSet, dataKey, selected, entities, getField]);

  var isFilterSelected = _react.default.useMemo(function () {
    var list = selected.map(function (id) {
      return getField(entities[id], dataKey);
    });
    return filter.comps.map(function (comp) {
      return comp.value;
    }).join() === list.join();
  }, [filter, dataKey, selected, entities, getField]);

  var options = _react.default.useMemo(function () {
    if (filter.options) return filter.options;

    var renderLabel = function renderLabel(v) {
      var s = dataRenderer ? dataRenderer(v) : v;
      if (s === '') s = '(Blank)';
      return s;
    };

    return values.map(function (v) {
      return {
        value: v,
        label: renderLabel(v)
      };
    });
  }, [values, dataRenderer, filter]);

  var searchItems = filter.comps.filter(function (comp) {
    return comp.filterType !== _appTableData.FilterType.EXACT;
  }).map(function (comp) {
    return {
      value: comp.value,
      label: (comp.filterType === _appTableData.FilterType.REGEX ? 'Regex: ' : 'Contains: ') + comp.value,
      type: comp.filterType
    };
  });
  var exactItems = options.map(function (o) {
    return _objectSpread(_objectSpread({}, o), {}, {
      type: _appTableData.FilterType.EXACT
    });
  });

  if (search) {
    var regexp;
    var parts = search.split('/');

    if (search[0] === '/' && parts.length > 2) {
      // User is entering a regex in the form /pattern/flags.
      // If the regex doesn't validate then ignore it
      try {
        regexp = new RegExp(parts[1], parts[2]);
      } catch (err) {}

      if (regexp) {
        exactItems = exactItems.filter(function (item) {
          return regexp.test(item.label);
        });
        var item = {
          label: 'Regex: ' + regexp.toString(),
          value: search,
          type: _appTableData.FilterType.REGEX
        };
        searchItems.unshift(item);
      }
    } else {
      regexp = new RegExp(search, 'i');
      exactItems = exactItems.filter(function (item) {
        return regexp.test(item.label);
      });
      var _item = {
        label: 'Contains: ' + search,
        value: search,
        type: _appTableData.FilterType.CONTAINS
      };
      searchItems.unshift(_item);
    }
  }

  if (sort) exactItems = (0, _appTableData.sortOptions)(sort, exactItems); // "Contains:" and "Regex:" items at the top of the list

  var items = searchItems.concat(exactItems);

  _react.default.useEffect(function () {
    if (search === '//') inputRef.current.setSelectionRange(1, 1);
  }, [search]);

  var isItemSelected = _react.default.useCallback(function (item) {
    return filter.comps.find(function (comp) {
      return comp.value === item.value && comp.filterType === item.type;
    }) !== undefined;
  }, [filter]);

  var toggleItemSelected = _react.default.useCallback(function (item) {
    setSearch('');
    if (isItemSelected(item)) dispatch((0, _appTableData.removeFilter)(dataSet, dataKey, item.value, item.type));else dispatch((0, _appTableData.addFilter)(dataSet, dataKey, item.value, item.type));
  }, [setSearch, isItemSelected, dispatch, dataSet, dataKey]);

  var onInputKey = _react.default.useCallback(function (e) {
    if (e.key === 'Enter' && e.target.value) toggleItemSelected(items[0]);

    if (e.key === '/' && !e.target.value) {
      // If search is empty and / is pressed, then add // to search
      // and position the cursor between the slashes (through useEffect on search change)
      e.preventDefault();
      setSearch('//');
    }
  }, [setSearch, toggleItemSelected, items]);

  var itemHeight = 35;
  var listHeight = Math.min(items.length * itemHeight, 200);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(Row, null, /*#__PURE__*/_react.default.createElement("label", null, "Filter:"), /*#__PURE__*/_react.default.createElement(_form.Button, {
    onClick: filterSelected,
    disabled: selected.length === 0,
    isActive: isFilterSelected
  }, "Selected"), /*#__PURE__*/_react.default.createElement(_form.Button, {
    onClick: function onClick() {
      return dispatch((0, _appTableData.setFilter)(dataSet, dataKey, []));
    },
    isActive: filter.comps.length === 0
  }, "Clear")), customFilterElement && /*#__PURE__*/_react.default.createElement(StyledCustomContainer, null, customFilterElement), /*#__PURE__*/_react.default.createElement(StyledInput, {
    type: "search",
    value: search,
    ref: inputRef,
    onChange: function onChange(e) {
      return setSearch(e.target.value);
    },
    onKeyDown: onInputKey,
    placeholder: "Search..."
  }), /*#__PURE__*/_react.default.createElement(StyledList, {
    height: listHeight,
    itemCount: items.length,
    itemSize: itemHeight,
    width: "auto"
  }, function (_ref6) {
    var index = _ref6.index,
        style = _ref6.style;
    var item = items[index];
    var isSelected = isItemSelected(item);
    return /*#__PURE__*/_react.default.createElement(Item, {
      key: item.value,
      style: style,
      isSelected: isSelected,
      onClick: function onClick() {
        return toggleItemSelected(item);
      }
    }, /*#__PURE__*/_react.default.createElement(_form.Checkbox, {
      checked: isSelected,
      readOnly: true
    }), /*#__PURE__*/_react.default.createElement("div", null, item.label));
  }));
}

Filter.propTypes = {
  dataSet: _propTypes.default.string.isRequired,
  dataKey: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]).isRequired,
  sort: _propTypes.default.object,
  entities: _propTypes.default.object,
  dataRenderer: _propTypes.default.func,
  customFilterElement: _propTypes.default.element,
  isId: _propTypes.default.bool
};

var Header = _styled.default.div(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n\tdisplay: flex;\n\talign-items: center;\n\tflex-wrap: wrap;\n\tuser-select: none;\n\twidth: 100%;\n\toverflow: hidden;\n\tbox-sizing: border-box;\n\tmargin-right: 5px;\n\t:hover {color: tomato}\n\t& .handle {\n\t\tposition: absolute;\n\t\tright: 0;\n\t\tbackground: inherit;\n\t\tdisplay: flex;\n\t\tflex-wrap: nowrap;\n\t\talign-items: center;\n\t}\n"])));

var Label = _styled.default.label(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n\tfont-weight: bold;\n"])));

function TableColumnHeader(_ref7) {
  var className = _ref7.className,
      style = _ref7.style,
      dataSet = _ref7.dataSet,
      label = _ref7.label,
      dataKey = _ref7.dataKey,
      dataRenderer = _ref7.dataRenderer,
      dropdownWidth = _ref7.dropdownWidth,
      anchorEl = _ref7.anchorEl,
      customFilterElement = _ref7.customFilterElement,
      isId = _ref7.isId;

  var selectInfo = _react.default.useCallback(function (state) {
    var sorts = (0, _appTableData.selectSorts)(state, dataSet);
    var filter = (0, _appTableData.selectFilter)(state, dataSet, dataKey);
    return {
      sort: sorts.settings[dataKey],
      isSorted: sorts.by.includes(dataKey),
      filter: filter,
      isFiltered: filter && filter.comps.length > 0
    };
  }, [dataSet, dataKey]);

  var _useSelector3 = (0, _reactRedux.useSelector)(selectInfo),
      sort = _useSelector3.sort,
      isSorted = _useSelector3.isSorted,
      filter = _useSelector3.filter,
      isFiltered = _useSelector3.isFiltered;

  if (!sort && !filter) return /*#__PURE__*/_react.default.createElement(Header, null, /*#__PURE__*/_react.default.createElement(Label, null, label));

  var selectRenderer = function selectRenderer(_ref8) {
    var isOpen = _ref8.isOpen,
        open = _ref8.open,
        close = _ref8.close;
    return /*#__PURE__*/_react.default.createElement(Header, {
      onClick: isOpen ? close : open
    }, /*#__PURE__*/_react.default.createElement(Label, null, label), /*#__PURE__*/_react.default.createElement("div", {
      className: "handle"
    }, isFiltered && /*#__PURE__*/_react.default.createElement(_icons.Icon, {
      type: "filter",
      style: {
        opacity: 0.2
      }
    }), isSorted && /*#__PURE__*/_react.default.createElement(_icons.Icon, {
      type: "sort",
      style: {
        opacity: 0.2,
        paddingRight: 4
      },
      direction: sort.direction,
      isAlpha: sort.type !== _appTableData.SortType.NUMERIC
    }), /*#__PURE__*/_react.default.createElement(_icons.Icon, {
      type: "handle",
      isOpen: isOpen
    })));
  };

  var dropdownRenderer = function dropdownRenderer() {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, sort && /*#__PURE__*/_react.default.createElement(Sort, {
      dataSet: dataSet,
      dataKey: dataKey
    }), filter && /*#__PURE__*/_react.default.createElement(Filter, {
      dataSet: dataSet,
      dataKey: dataKey,
      dataRenderer: dataRenderer,
      customFilterElement: customFilterElement,
      isId: isId
    }));
  };

  if (!anchorEl) return null;
  return /*#__PURE__*/_react.default.createElement(_dropdown.default, {
    className: className,
    style: style,
    selectRenderer: selectRenderer,
    dropdownRenderer: dropdownRenderer,
    portal: anchorEl //anchorEl={anchorEl}

  });
}

TableColumnHeader.propTypes = {
  dataSet: _propTypes.default.string.isRequired,
  // Identifies the dataset in the store
  dataKey: _propTypes.default.string.isRequired,
  // Identifies the data element in the row object
  label: _propTypes.default.string.isRequired,
  // Column label
  dropdownWidth: _propTypes.default.number,
  dataRenderer: _propTypes.default.func,
  // Optional function to render the data element
  anchorEl: _propTypes.default.oneOfType([_propTypes.default.element, _propTypes.default.object]),
  customFilterElement: _propTypes.default.element,
  // Custom filter element for dropdown
  isId: _propTypes.default.bool // Identifies the data table ID column; enables "filter selected"

};
var _default = TableColumnHeader;
exports.default = _default;