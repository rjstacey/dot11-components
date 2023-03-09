"use strict";

var _ = require(".");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var obj1 = {
  v1: 'aa',
  v2: 'bb'
};
var obj2 = {
  v1: 'aa',
  v2: 'bb'
}; // different instance, same value

var obj3 = {
  v1: 'aa',
  v2: 'BB'
}; // different content

var obj4 = {
  v1: 'aa',
  v3: 'cc'
}; // different shape

var array1 = [1, 2];
var array2 = [1, 2]; // different instance, same content

var array3 = [1, 3]; // different content

var array4 = [1, 2, 3]; // different length

var date1 = new Date(2011, 2, 1);
var date2 = new Date(2011, 2, 1); // different instance, same value

var date3 = new Date(2011, 2, 2); // different value

var orig = {
  v1: 'a',
  o1: obj1,
  o2: obj1,
  o3: obj1,
  a1: array1,
  a2: array1,
  a3: array1,
  d1: date1,
  d2: date1,
  d3: date1,
  oo1: {
    o1: obj1,
    o2: obj1,
    o3: obj1
  },
  oo2: {
    a1: array1,
    a2: array1,
    a3: array1
  },
  oo3: {
    d1: date1,
    d2: date1,
    d3: date1
  }
};
var mod = {
  v1: 'a',
  o1: obj1,
  // same instance
  o2: obj2,
  // different instance, same content
  o3: obj3,
  // different content
  a1: array1,
  // same instance
  a2: array2,
  // different instance, same content
  a3: array3,
  // different content
  d1: date1,
  // same instance
  d2: date2,
  // different instance, same value
  d3: date3,
  // different value
  oo1: {
    o1: obj1,
    o2: obj2,
    o3: obj3
  },
  oo2: {
    a1: array1,
    a2: array2,
    a3: array3
  },
  oo3: {
    d1: date1,
    d2: date2,
    d3: date3
  }
};
var shallowDiff_result = {
  o2: mod.o2,
  o3: mod.o3,
  a2: mod.a2,
  a3: mod.a3,
  d2: mod.d2,
  d3: mod.d3,
  oo1: mod.oo1,
  oo2: mod.oo2,
  oo3: mod.oo3
};
var deepDiff_result = {
  o3: {
    v2: 'BB'
  },
  a3: [undefined, 3],
  d3: date3,
  oo1: {
    o3: {
      v2: 'BB'
    }
  },
  oo2: {
    a3: [undefined, 3]
  },
  oo3: {
    d3: date3
  }
};
test('shallowDiff', function () {
  expect((0, _.shallowDiff)(orig, mod)).toStrictEqual(shallowDiff_result);
});
test('deepDiff', function () {
  expect((0, _.deepDiff)(orig, mod)).toStrictEqual(deepDiff_result);
});
var o1 = {
  v1: 'a',
  d1: date1,
  o1: obj1,
  a1: array1,
  a2: array1,
  v7: {
    aa: 'aa',
    bb: 'bb',
    o1: obj1
  }
};
var o2 = {
  o1: obj3,
  a1: array3,
  a2: array4,
  v7: {
    bb: 'b2',
    cc: 'cc',
    o1: obj3
  }
};

var m = _objectSpread(_objectSpread(_objectSpread({}, o1), o2), {}, {
  o1: _objectSpread(_objectSpread({}, obj1), obj3),
  a1: array3,
  a2: array4,
  v7: _objectSpread(_objectSpread({}, o1.v7), o2.v7)
});

test('deepMerge', function () {
  expect((0, _.deepMerge)(o1, o2)).toStrictEqual(m);
});
var oo1 = {
  sameValue: 'a',
  diffValue: 'b',
  sameDate: date1,
  diffDate: date1,
  sameArray1: [1, 2],
  sameArray2: [obj1, obj1],
  sameArrayDiffObj: [obj1, obj1],
  diffArrayLen: [1, 2],
  diffArrayContent1: array1,
  diffArrayContent2: array1,
  diffArrayContent3: [1, obj1],
  obj: {
    sameValue: 'aa',
    diffValue: 'bb'
  },
  extra1: 'aa'
};
var oo2 = {
  sameValue: 'a',
  diffValue: 'B',
  sameDate: date2,
  diffDate: date3,
  sameArray1: [1, 2],
  sameArray2: [obj1, obj2],
  sameArrayDiffObj: [obj1, obj3],
  diffArrayLen: [1, 2, 3],
  diffArrayContent1: [1, 3],
  diffArrayContent2: [2, 1],
  diffArrayContent3: [1, 2],
  obj: {
    sameValue: 'aa',
    diffValue: 'BB'
  },
  extra2: 'bb'
};
var mm = {
  sameValue: 'a',
  diffValue: _.MULTIPLE,
  sameDate: date1,
  diffDate: _.MULTIPLE,
  sameArray1: [1, 2],
  sameArray2: [obj1, obj2],
  sameArrayDiffObj: [obj1, {
    v1: 'aa',
    v2: _.MULTIPLE
  }],
  diffArrayLen: _.MULTIPLE,
  diffArrayContent1: _.MULTIPLE,
  diffArrayContent2: _.MULTIPLE,
  diffArrayContent3: _.MULTIPLE,
  obj: {
    sameValue: 'aa',
    diffValue: _.MULTIPLE
  },
  extra1: 'aa',
  extra2: 'bb'
};
test('deepMergeTagMultiple 1', function () {
  var result = (0, _.deepMergeTagMultiple)({}, oo2);
  expect(result).toStrictEqual(oo2);
});
test('deepMergeTagMultiple 2', function () {
  var result = (0, _.deepMergeTagMultiple)(oo2, {});
  expect(result).toStrictEqual(oo2);
});
test('deepMergeTagMultiple 2', function () {
  var result = (0, _.deepMergeTagMultiple)(oo1, oo2);
  expect(result).toStrictEqual(mm);
  expect((0, _.isMultiple)(result.sameValue)).toEqual(false);
  expect((0, _.isMultiple)(result.diffValue)).toEqual(true);
});