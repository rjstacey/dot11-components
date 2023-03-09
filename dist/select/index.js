"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _icons = require("../icons");

var _Dropdown = _interopRequireDefault(require("./Dropdown"));

var _MultiSelectItem = _interopRequireDefault(require("./MultiSelectItem"));

var _SelectItem = _interopRequireDefault(require("./SelectItem"));

var _Input = _interopRequireDefault(require("./Input"));

var _lib = require("../lib");

require("./index.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, catch: function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Content = function Content(props) {
  return /*#__PURE__*/_react.default.createElement("div", _extends({
    className: "dropdown-select-content"
  }, props));
};

var Loading = function Loading(props) {
  return /*#__PURE__*/_react.default.createElement("div", _extends({
    className: "dropdown-select-loading"
  }, props));
};

var Clear = function Clear(props) {
  return /*#__PURE__*/_react.default.createElement("div", _extends({
    className: "dropdown-select-clear-all"
  }, props));
};

var Separator = function Separator(props) {
  return /*#__PURE__*/_react.default.createElement("div", _extends({
    className: "dropdown-select-separator"
  }, props));
};

var DropdownHandle = function DropdownHandle(props) {
  return /*#__PURE__*/_react.default.createElement(_icons.Icon, _extends({
    className: "dropdown-select-handle",
    type: "handle"
  }, props));
};

var Placeholder = function Placeholder(props) {
  return /*#__PURE__*/_react.default.createElement("div", _extends({
    className: "dropdown-select-placeholder"
  }, props));
};

var NoData = function NoData(_ref) {
  var props = _ref.props;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "dropdown-select-no-data"
  }, props.noDataLabel);
};

function defaultContentRenderer(_ref2) {
  var props = _ref2.props,
      state = _ref2.state,
      methods = _ref2.methods;
  var values = props.values;

  if (props.multi) {
    return values.map(function (item) {
      var key = '' + item[props.valueField] + item[props.labelField];
      var el = props.multiSelectItemRenderer({
        item: item,
        props: props,
        state: state,
        methods: methods
      });
      return _objectSpread(_objectSpread({}, el), {}, {
        key: key
      });
    });
  } else if (values.length > 0) {
    var item = values[0];
    return props.selectItemRenderer({
      item: item,
      props: props,
      state: state,
      methods: methods
    });
  }

  return null;
}

var defaultAddItemRenderer = function defaultAddItemRenderer(_ref3) {
  var item = _ref3.item,
      className = _ref3.className,
      props = _ref3.props,
      state = _ref3.state,
      methods = _ref3.methods;
  return /*#__PURE__*/_react.default.createElement("span", {
    className: className
  }, "Add \"".concat(item[props.labelField], "\""));
};

var defaultItemRenderer = function defaultItemRenderer(_ref4) {
  var item = _ref4.item,
      className = _ref4.className,
      props = _ref4.props,
      state = _ref4.state,
      methods = _ref4.methods;
  return /*#__PURE__*/_react.default.createElement("span", {
    className: className
  }, item[props.labelField]);
};

function defaultCreateOption(_ref5) {
  var _ref6;

  var props = _ref5.props,
      state = _ref5.state,
      methods = _ref5.methods;
  return _ref6 = {}, _defineProperty(_ref6, props.valueField, state.search), _defineProperty(_ref6, props.labelField, state.search), _ref6;
}

var Select = /*#__PURE__*/function (_React$Component) {
  _inherits(Select, _React$Component);

  var _super = _createSuper(Select);

  function Select(_props) {
    var _this;

    _classCallCheck(this, Select);

    _this = _super.call(this, _props);

    _defineProperty(_assertThisInitialized(_this), "onOutsideClick", function (event) {
      var _assertThisInitialize = _assertThisInitialized(_this),
          state = _assertThisInitialize.state; // Ignore if not open


      if (!state.isOpen) return;
      var target = event.target; // Ignore click in dropdown

      var dropdownEl = _this.dropdownRef.current;
      if (dropdownEl && (dropdownEl === target || dropdownEl.contains(target))) return; // Ignore click in select

      var selectEl = _this.selectRef.current;
      if (selectEl && (selectEl === target || selectEl.contains(target))) return;

      _this.close();
    });

    _defineProperty(_assertThisInitialized(_this), "onScroll", function () {
      if (_this.props.closeOnScroll) {
        _this.close();

        return;
      }

      _this.updateSelectBounds();
    });

    _defineProperty(_assertThisInitialized(_this), "updateSelectBounds", function () {
      if (!_this.selectRef.current) return;

      var selectBounds = _this.selectRef.current.getBoundingClientRect();

      _this.setState({
        selectBounds: selectBounds
      });
    });

    _defineProperty(_assertThisInitialized(_this), "open", function () {
      var _assertThisInitialize2 = _assertThisInitialized(_this),
          props = _assertThisInitialize2.props,
          state = _assertThisInitialize2.state;

      if (state.isOpen) return;
      window.addEventListener('resize', _this.debouncedUpdateSelectBounds);
      document.addEventListener('scroll', _this.debouncedOnScroll, true);
      document.addEventListener('click', _this.onOutsideClick, true);

      _this.updateSelectBounds();

      var cursor = null;

      if (!props.multi && props.values.length > 0) {
        // Position cursor on selected value
        var item = props.values[0];
        cursor = state.searchResults.findIndex(function (o) {
          return props.valuesEqual(item, o);
        });
        if (cursor < 0) cursor = null;
      }

      _this.setState({
        isOpen: true,
        cursor: cursor
      });

      props.onRequestOpen();
    });

    _defineProperty(_assertThisInitialized(_this), "close", function () {
      var _assertThisInitialize3 = _assertThisInitialized(_this),
          props = _assertThisInitialize3.props,
          state = _assertThisInitialize3.state;

      if (!state.isOpen) return;
      window.removeEventListener('resize', _this.debouncedUpdateSelectBounds);
      document.removeEventListener('scroll', _this.debouncedOnScroll, true);
      document.removeEventListener('click', _this.onOverlayClick, true);

      _this.setState({
        isOpen: false,
        search: props.clearOnBlur ? '' : state.search,
        searchResults: props.options,
        cursor: null
      });

      props.onRequestClose();
    });

    _defineProperty(_assertThisInitialized(_this), "addItem", function (item) {
      var _assertThisInitialize4 = _assertThisInitialized(_this),
          props = _assertThisInitialize4.props;

      var values;

      if (props.multi) {
        values = [].concat(_toConsumableArray(props.values), [item]);
      } else {
        values = [item];

        _this.close();
      }

      props.onChange(values);

      if (props.clearOnSelect) {
        _this.setState({
          search: ''
        }, function () {
          return _this.setState({
            searchResults: _this.searchResults()
          });
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "addSearchItem", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var _assertThisInitialize5, props, state, methods, item;

      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _assertThisInitialize5 = _assertThisInitialized(_this), props = _assertThisInitialize5.props, state = _assertThisInitialize5.state, methods = _assertThisInitialize5.methods;
              _context.next = 3;
              return props.createOption({
                props: props,
                state: state,
                methods: methods
              });

            case 3:
              item = _context.sent;

              _this.addItem(item);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));

    _defineProperty(_assertThisInitialized(_this), "removeItem", function (item) {
      var _assertThisInitialize6 = _assertThisInitialized(_this),
          props = _assertThisInitialize6.props;

      var newValues = props.values.filter(function (valueItem) {
        return !props.valuesEqual(valueItem, item);
      });
      props.onChange(newValues);
    });

    _defineProperty(_assertThisInitialized(_this), "clearAll", function (e) {
      e.stopPropagation();

      _this.props.onChange([]);
    });

    _defineProperty(_assertThisInitialized(_this), "setSearch", function (search) {
      if (search && !_this.state.isOpen) _this.open();

      _this.setState({
        search: search
      }, function () {
        return _this.setState({
          cursor: 0,
          searchResults: _this.searchResults()
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "getInputSize", function () {
      var _assertThisInitialize7 = _assertThisInitialized(_this),
          props = _assertThisInitialize7.props,
          state = _assertThisInitialize7.state;

      if (state.search) return state.search.length;
      if (props.values.length > 0) return props.addPlaceholder.length;
      return props.placeholder.length;
    });

    _defineProperty(_assertThisInitialized(_this), "isSelected", function (item) {
      var _assertThisInitialize8 = _assertThisInitialized(_this),
          props = _assertThisInitialize8.props;

      return !!props.values.find(function (selectedItem) {
        return props.valuesEqual(selectedItem, item);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "isDisabled", function (item) {
      return item.disabled || false;
    });

    _defineProperty(_assertThisInitialized(_this), "sort", function (options) {
      var sortBy = _this.props.sortBy;
      if (!sortBy) return options;
      return options.sort(function (a, b) {
        var a_v = a[sortBy];
        var b_v = b[sortBy];
        if (a_v < b_v) return -1;else if (a_v > b_v) return 1;else return 0;
      });
    });

    _defineProperty(_assertThisInitialized(_this), "filter", function (options) {
      var search = _this.state.search;
      var searchBy = _this.props.searchBy || _this.props.labelField;
      var safeString = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var regexp = new RegExp(safeString, 'i');
      return options.filter(function (item) {
        return Array.isArray(searchBy) ? searchBy.reduce(function (result, searchBy) {
          return result || regexp.test(item[searchBy]);
        }, false) : regexp.test(item[searchBy]);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "searchResults", function () {
      var _assertThisInitialize9 = _assertThisInitialized(_this),
          props = _assertThisInitialize9.props,
          state = _assertThisInitialize9.state,
          methods = _assertThisInitialize9.methods;

      var options = props.options;
      if (!props.keepSelectedInList) options = options.filter(function (item) {
        return methods.isSelected(item);
      });
      options = methods.filter(options, state);
      options = methods.sort(options, state);

      if (props.create && state.search) {
        var _newItem;

        var newItem = (_newItem = {}, _defineProperty(_newItem, props.valueField, state.search), _defineProperty(_newItem, props.labelField, state.search), _newItem);
        options = [newItem].concat(_toConsumableArray(options));
      }

      return options;
    });

    _defineProperty(_assertThisInitialized(_this), "onClick", function (event) {
      var _assertThisInitialize10 = _assertThisInitialized(_this),
          props = _assertThisInitialize10.props,
          state = _assertThisInitialize10.state;

      if (props.readOnly || props.keepOpen) return;
      event.preventDefault();
      if (state.isOpen) _this.close();else _this.open();
    });

    _defineProperty(_assertThisInitialized(_this), "onFocus", function (event) {
      if (_this.inputRef.current && document.activeElement !== _this.inputRef.current) _this.inputRef.current.focus();
    });

    _defineProperty(_assertThisInitialized(_this), "onKeyDown", function (event) {
      var _assertThisInitialize11 = _assertThisInitialized(_this),
          props = _assertThisInitialize11.props,
          state = _assertThisInitialize11.state;

      var escape = event.key === 'Escape';
      var enter = event.key === 'Enter';
      var arrowUp = event.key === 'ArrowUp';
      var arrowDown = event.key === 'ArrowDown';
      var backspace = event.key === 'Backspace';

      if (backspace && props.backspaceDelete && !state.search && props.values.length > 0) {
        var item = props.values[props.values.length - 1];

        _this.removeItem(item);
      }

      if (!state.isOpen) {
        if (arrowDown || enter) {
          _this.open();

          _this.setState({
            cursor: 0
          });
        }

        return; // Not open so nothing more to do
      } // Only get here if open


      if (escape) {
        _this.close();
      }

      if (enter) {
        var _item = state.searchResults[state.cursor];

        if (_item && !_item.disabled) {
          if (!_this.isSelected(_item)) _this.addItem(_item);else _this.removeItem(_item);
        }

        event.preventDefault();
      }

      if (arrowDown || arrowUp) {
        var cursor = state.cursor;
        var wrap = 0;

        var _item2;

        do {
          if (cursor === null) {
            cursor = 0;
          } else {
            if (arrowDown) {
              if (cursor === state.searchResults.length - 1) {
                cursor = 0;
                wrap++;
              } else cursor += 1;
            } else {
              // arrowUp
              if (cursor === 0) {
                cursor = state.searchResults.length - 1;
                wrap++;
              } else cursor -= 1;
            }
          }

          _item2 = state.searchResults[cursor];
        } while (_item2 && _item2.disabled && wrap < 2);

        _this.setState({
          cursor: cursor
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "renderDropdown", function (dropdownProps) {
      var _assertThisInitialize12 = _assertThisInitialized(_this),
          props = _assertThisInitialize12.props,
          state = _assertThisInitialize12.state,
          methods = _assertThisInitialize12.methods;

      var selectBounds = state.selectBounds;
      var style = {
        width: props.dropdownWidth || selectBounds.width
      };
      var className = 'dropdown-select-dropdown';
      if (props.dropdownClassName) className += " ".concat(props.dropdownClassName);

      var dropdownEl = /*#__PURE__*/_react.default.createElement("div", {
        ref: _this.dropdownRef,
        className: className,
        style: style,
        onClick: function onClick(e) {
          return e.stopPropagation();
        } // prevent click propagating to select and closing the dropdown

      }, props.dropdownRenderer({
        props: props,
        state: state,
        methods: methods
      })); // Determine if above or below selector


      var position = props.dropdownPosition;
      var align = props.dropdownAlign;

      if (position === 'auto') {
        var dropdownHeight = selectBounds.bottom + parseInt(props.dropdownHeight, 10) + parseInt(props.dropdownGap, 10);
        if (dropdownHeight > window.innerHeight && dropdownHeight > selectBounds.top) position = 'top';else position = 'bottom';
      }

      if (props.portal) {
        style.position = 'fixed';
        if (align === 'left') style.left = selectBounds.left - 1;else style.right = selectBounds.right - 1;
        if (position === 'bottom') style.top = selectBounds.bottom + props.dropdownGap;else style.bottom = window.innerHeight - selectBounds.top + props.dropdownGap;
        return /*#__PURE__*/_reactDom.default.createPortal(dropdownEl, props.portal);
      } else {
        style.position = 'absolute';
        if (align === 'left') style.left = -1;else style.right = -1;
        if (position === 'bottom') style.top = selectBounds.height + 2 + props.dropdownGap;else style.bottom = selectBounds.height + 2 + props.dropdownGap;
        return dropdownEl;
      }
    });

    _this.state = {
      isOpen: false,
      search: '',
      selectBounds: {},
      cursor: null,
      searchResults: _props.options
    };
    _this.methods = {
      open: _this.open,
      close: _this.close,
      addItem: _this.addItem,
      addSearchItem: _this.addSearchItem,
      removeItem: _this.removeItem,
      setSearch: _this.setSearch,
      getInputSize: _this.getInputSize,
      isSelected: _this.isSelected,
      isDisabled: _this.isDisabled,
      sort: _this.sort,
      filter: _this.filter,
      searchResults: _this.searchResults
    };
    _this.selectRef = /*#__PURE__*/_react.default.createRef();
    _this.inputRef = /*#__PURE__*/_react.default.createRef();
    _this.dropdownRef = /*#__PURE__*/_react.default.createRef();
    _this.debouncedUpdateSelectBounds = (0, _lib.debounce)(_this.updateSelectBounds);
    _this.debouncedOnScroll = (0, _lib.debounce)(_this.onScroll);
    return _this;
  }

  _createClass(Select, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.updateSelectBounds();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var props = this.props,
          state = this.state;

      if (prevProps.options !== props.options || prevProps.keepSelectedInList !== props.keepSelectedInList || prevProps.sortBy !== props.sortBy) {
        this.setState({
          cursor: null,
          searchResults: this.searchResults()
        });
      }

      if (prevProps.multi !== props.multi || prevProps.values !== props.values || prevState.search !== state.search) {
        this.updateSelectBounds();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var props = this.props,
          state = this.state,
          methods = this.methods;
      var cn = 'dropdown-select';
      if (props.readOnly) cn += " dropdown-select-read-only";
      if (props.className) cn += " ".concat(props.className);
      return /*#__PURE__*/_react.default.createElement("div", {
        ref: this.selectRef,
        style: props.style,
        className: cn,
        tabIndex: props.readOnly ? '-1' : '0',
        "aria-label": "Dropdown select",
        "aria-expanded": state.isOpen,
        onClick: this.onClick,
        onKeyDown: this.onKeyDown,
        onFocus: this.onFocus,
        onBlur: props.closeOnBlur ? this.close : undefined,
        direction: props.direction
      }, /*#__PURE__*/_react.default.createElement(Content, {
        style: {
          minWidth: props.placeholder ? "".concat(props.placeholder.length, "ch") : undefined
        }
      }, props.values.length === 0 && !state.search && /*#__PURE__*/_react.default.createElement(Placeholder, null, props.placeholder), props.contentRenderer({
        props: props,
        state: state,
        methods: methods
      }), props.searchable && !props.readOnly && props.inputRenderer({
        inputRef: this.inputRef,
        props: props,
        state: state,
        methods: methods
      })), props.loading && /*#__PURE__*/_react.default.createElement(Loading, null), props.clearable && !props.readOnly && /*#__PURE__*/_react.default.createElement(Clear, {
        onClick: this.clearAll
      }), props.separator && !props.readOnly && /*#__PURE__*/_react.default.createElement(Separator, null), props.handle && !props.readOnly && /*#__PURE__*/_react.default.createElement(DropdownHandle, {
        isOpen: state.isOpen
      }), (state.isOpen || props.keepOpen) && !props.readOnly && this.renderDropdown({
        props: props,
        state: state,
        methods: methods
      }));
    }
  }]);

  return Select;
}(_react.default.Component);

Select.propTypes = {
  values: _propTypes.default.array.isRequired,
  onChange: _propTypes.default.func.isRequired,
  options: _propTypes.default.array.isRequired,
  onRequestClose: _propTypes.default.func,
  onRequestOpen: _propTypes.default.func,
  createOption: _propTypes.default.func,
  placeholder: _propTypes.default.string,
  addPlaceholder: _propTypes.default.string,
  loading: _propTypes.default.bool,
  multi: _propTypes.default.bool,
  create: _propTypes.default.bool,
  clearable: _propTypes.default.bool,
  searchable: _propTypes.default.bool,
  backspaceDelete: _propTypes.default.bool,
  readOnly: _propTypes.default.bool,
  closeOnScroll: _propTypes.default.bool,
  closeOnSelect: _propTypes.default.bool,
  closeOnBlur: _propTypes.default.bool,
  keepOpen: _propTypes.default.bool,
  keepSelectedInList: _propTypes.default.bool,
  autoFocus: _propTypes.default.bool,
  portal: _propTypes.default.object,
  labelField: _propTypes.default.string,
  valueField: _propTypes.default.string,
  searchBy: _propTypes.default.string,
  sortBy: _propTypes.default.string,
  valuesEqual: _propTypes.default.func,
  handle: _propTypes.default.bool,
  separator: _propTypes.default.bool,
  noDataLabel: _propTypes.default.string,
  dropdownGap: _propTypes.default.number,
  dropdownHeight: _propTypes.default.number,
  dropdownPosition: _propTypes.default.oneOf(['auto', 'bottom', 'top']),
  dropdownAlign: _propTypes.default.oneOf(['left', 'right']),
  estimatedItemHeight: _propTypes.default.number,
  style: _propTypes.default.object,
  className: _propTypes.default.string,
  dropdownClassName: _propTypes.default.string,
  contentRenderer: _propTypes.default.func,
  selectItemRenderer: _propTypes.default.func,
  multiSelectItemRenderer: _propTypes.default.func,
  inputRenderer: _propTypes.default.func,
  dropdownRenderer: _propTypes.default.func,
  itemRenderer: _propTypes.default.func,
  noDataRenderer: _propTypes.default.func
};
Select.defaultProps = {
  onRequestOpen: function onRequestOpen() {
    return undefined;
  },
  onRequestClose: function onRequestClose() {
    return undefined;
  },
  createOption: defaultCreateOption,
  placeholder: 'Select...',
  addPlaceholder: '',
  loading: false,
  multi: false,
  create: false,
  clearable: false,
  searchable: true,
  backspaceDelete: true,
  readOnly: false,
  closeOnScroll: false,
  clearOnSelect: true,
  clearOnBlur: true,
  keepOpen: false,
  keepSelectedInList: true,
  autoFocus: false,
  portal: null,
  labelField: 'label',
  valueField: 'value',
  searchBy: null,
  sortBy: null,
  valuesEqual: function valuesEqual(a, b) {
    return a === b;
  },
  handle: true,
  separator: false,
  noDataLabel: 'No data',
  dropdownGap: 5,
  dropdownHeight: 300,
  dropdownPosition: 'bottom',
  dropdownAlign: 'left',
  estimatedItemHeight: 29.6667,

  /* Select children */
  contentRenderer: defaultContentRenderer,

  /* Content children */
  selectItemRenderer: function selectItemRenderer(props) {
    return /*#__PURE__*/_react.default.createElement(_SelectItem.default, props);
  },
  multiSelectItemRenderer: function multiSelectItemRenderer(props) {
    return /*#__PURE__*/_react.default.createElement(_MultiSelectItem.default, props);
  },
  inputRenderer: function inputRenderer(props) {
    return /*#__PURE__*/_react.default.createElement(_Input.default, props);
  },

  /* Dropdown */
  dropdownRenderer: function dropdownRenderer(props) {
    return /*#__PURE__*/_react.default.createElement(_Dropdown.default, props);
  },

  /* Dropdown children */
  addItemRenderer: defaultAddItemRenderer,
  itemRenderer: defaultItemRenderer,
  noDataRenderer: function noDataRenderer(props) {
    return /*#__PURE__*/_react.default.createElement(NoData, props);
  }
};
var _default = Select;
exports.default = _default;