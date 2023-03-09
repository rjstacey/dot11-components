"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IdFilter = IdFilter;
exports.IdSelector = IdSelector;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _styled = _interopRequireDefault(require("@emotion/styled"));

var _draftJs = require("draft-js");

require("draft-js/dist/Draft.css");

var _icons = require("../icons");

var _lib = require("../lib");

var _appTableData = require("../store/appTableData");

var _excluded = ["dataSet", "dataKey"],
    _excluded2 = ["dataSet", "dataKey"];

var _templateObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Container = _styled.default.div(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n\tdisplay: flex;\n\tflex-direction: row;\n\talign-items: center;\n\tjustify-content: space-between;\n\t.DraftEditor-root {\n\t\twidth: 100%;\n\t\tcursor: text;\n\t}\n\t:hover {\n\t\tborder-color: #0074D9\n\t}\n"])));

var idRegex = /[^\s,]+/g; // /\d+\.\d+|\d+/g

function IdList(_ref) {
  var style = _ref.style,
      className = _ref.className,
      ids = _ref.ids,
      isValid = _ref.isValid,
      isNumber = _ref.isNumber,
      onChange = _ref.onChange,
      focusOnMount = _ref.focusOnMount,
      close = _ref.close;

  var editorRef = _react.default.useRef();

  var _React$useState = _react.default.useState(initState),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      editorState = _React$useState2[0],
      setEditorState = _React$useState2[1];
  /*React.useEffect(() => {
  	// Close the dropdown if the user scrolls
  	// (we don't track position changes during scrolling)
  	window.addEventListener('scroll', close, true);
  	return () => window.removeEventListener('scroll', close);
  }, [close])*/


  _react.default.useEffect(function () {
    if (!editorState.getSelection().hasFocus) {
      var state = _draftJs.EditorState.push(editorState, _draftJs.ContentState.createFromText(ids.join(', ')), 'remove-range');

      state = _draftJs.EditorState.moveSelectionToEnd(state);
      setEditorState(state);
    }
  }, [ids]);

  function initState() {
    var decorator = new _draftJs.CompositeDecorator([{
      strategy: findInvalidIds,
      component: function component(props) {
        return /*#__PURE__*/_react.default.createElement("span", {
          style: {
            color: "red"
          }
        }, props.children);
      }
    }]);

    var state = _draftJs.EditorState.createWithContent(_draftJs.ContentState.createFromText(ids.join(', ')), decorator);

    if (focusOnMount) state = _draftJs.EditorState.moveFocusToEnd(state);
    return state;
  }

  function findInvalidIds(contentBlock, callback, contentState) {
    var text = contentBlock.getText();
    var matchArr, start;

    while ((matchArr = idRegex.exec(text)) !== null) {
      start = matchArr.index;
      var id = isNumber ? (0, _lib.parseNumber)(matchArr[0]) : matchArr[0];
      if (!isValid(id)) callback(start, start + matchArr[0].length);
    }
  }

  function clear(e) {
    e.stopPropagation(); // don't take focus from editor
    //setEditorState(EditorState.push(editorState, ContentState.createFromText('')))

    /*let contentState = editorState.getCurrentContent();
    const firstBlock = contentState.getFirstBlock();
    const lastBlock = contentState.getLastBlock();
    const allSelected = new SelectionState({
    	anchorKey: firstBlock.getKey(),
    	anchorOffset: 0,
    	focusKey: lastBlock.getKey(),
    	focusOffset: lastBlock.getLength(),
    	hasFocus: true
    });
    contentState = Modifier.removeRange(contentState, allSelected, 'backward');
    const state = EditorState.push(editorState, contentState, 'remove-range');
    setEditorState(state);*/

    onChange([]);
  }

  function emitChange(state) {
    var s = state.getCurrentContent().getPlainText();
    var updatedIds = s.match(idRegex) || [];
    if (isNumber) updatedIds = updatedIds.map(function (id) {
      return (0, _lib.parseNumber)(id);
    });
    if (updatedIds.join() !== ids.join()) onChange(updatedIds);
  }
  /*function handleKeyCommand(command) {
  	if (command === 'enter') {
  		// Perform a request to save your contents, set
  		// a new `editorState`, etc.
  		return 'handled';
  	}
  	return 'not-handled';
  }*/


  return /*#__PURE__*/_react.default.createElement(Container, {
    style: style,
    className: className,
    onClick: function onClick(e) {
      return editorRef.current.focus();
    }
  }, /*#__PURE__*/_react.default.createElement(_draftJs.Editor, {
    ref: editorRef,
    editorState: editorState,
    onChange: setEditorState,
    handleReturn: function handleReturn() {
      return emitChange(editorState) || 'handled';
    } // return 'handled' to prevent default handler
    ,
    onBlur: function onBlur() {
      return emitChange(editorState);
    },
    placeholder: 'Enter list...'
  }), editorState.getCurrentContent().hasText() && /*#__PURE__*/_react.default.createElement(_icons.ActionIcon, {
    type: "clear",
    onClick: clear
  }));
}

function IdFilter(_ref2) {
  var dataSet = _ref2.dataSet,
      dataKey = _ref2.dataKey,
      props = _objectWithoutProperties(_ref2, _excluded);

  if (!dataKey) dataKey = 'id';
  var dispatch = (0, _reactRedux.useDispatch)();

  var selectInfo = _react.default.useCallback(function (state) {
    var ids = (0, _appTableData.selectIds)(state, dataSet);
    var entities = (0, _appTableData.selectEntities)(state, dataSet);
    var filters = (0, _appTableData.selectFilters)(state, dataSet);
    var getField = (0, _appTableData.selectGetField)(state, dataSet);
    return {
      values: filters[dataKey].comps.map(function (v) {
        return v.value;
      }) || [],
      isNumber: ids.length && typeof getField(entities[ids[0]], dataKey) === 'number',
      ids: ids,
      entities: entities,
      getField: getField
    };
  }, [dataSet, dataKey]);

  var _useSelector = (0, _reactRedux.useSelector)(selectInfo),
      values = _useSelector.values,
      isNumber = _useSelector.isNumber,
      ids = _useSelector.ids,
      entities = _useSelector.entities,
      getField = _useSelector.getField;

  var isValid = _react.default.useCallback(function (value) {
    return ids.findIndex(function (id) {
      return getField(entities[id], dataKey) === value;
    }) !== -1;
  }, [ids, entities, dataKey, getField]);

  var onChange = _react.default.useCallback(function (values) {
    var comps = values.map(function (value) {
      return {
        value: value,
        filterType: _appTableData.FilterType.EXACT
      };
    });
    dispatch((0, _appTableData.setFilter)(dataSet, dataKey, comps));
  }, [dispatch, dataSet, dataKey]);

  return /*#__PURE__*/_react.default.createElement(IdList, _extends({
    ids: values,
    onChange: onChange,
    isValid: isValid,
    isNumber: isNumber
  }, props));
}

IdFilter.propTypes = {
  dataSet: _propTypes.default.string.isRequired,
  dataKey: _propTypes.default.string
};

function IdSelector(_ref3) {
  var dataSet = _ref3.dataSet,
      dataKey = _ref3.dataKey,
      props = _objectWithoutProperties(_ref3, _excluded2);

  if (!dataKey) dataKey = 'id';
  var dispatch = (0, _reactRedux.useDispatch)();

  var selectInfo = _react.default.useCallback(function (state) {
    var ids = (0, _appTableData.selectIds)(state, dataSet);
    var entities = (0, _appTableData.selectEntities)(state, dataSet);
    var selected = state[dataSet].selected;
    var getField = (0, _appTableData.selectGetField)(state, dataSet);
    return {
      values: selected.map(function (id) {
        return getField(entities[id], dataKey);
      }),
      isNumber: ids.length && typeof getField(entities[ids[0]], dataKey) === 'number',
      ids: ids,
      entities: entities,
      getField: getField
    };
  }, [dataSet, dataKey]);

  var _useSelector2 = (0, _reactRedux.useSelector)(selectInfo),
      values = _useSelector2.values,
      isNumber = _useSelector2.isNumber,
      ids = _useSelector2.ids,
      entities = _useSelector2.entities,
      getField = _useSelector2.getField;

  var isValid = _react.default.useCallback(function (value) {
    return ids.findIndex(function (id) {
      return getField(entities[id], dataKey) === value;
    }) !== -1;
  }, [ids, entities, dataKey, getField]);

  var onChange = _react.default.useCallback(function (values) {
    var selected = values.reduce(function (selected, value) {
      var i = ids.findIndex(function (id) {
        return getField(entities[id], dataKey) === value;
      });
      if (i !== -1) selected.push(ids[i]);
      return selected;
    }, []);
    dispatch((0, _appTableData.setSelected)(dataSet, selected));
  }, [dispatch, dataSet, dataKey, ids, entities, getField]);

  return /*#__PURE__*/_react.default.createElement(IdList, _extends({
    ids: values,
    onChange: onChange,
    isValid: isValid,
    isNumber: isNumber
  }, props));
}

IdSelector.propTypes = {
  dataSet: _propTypes.default.string.isRequired,
  dataKey: _propTypes.default.string
};