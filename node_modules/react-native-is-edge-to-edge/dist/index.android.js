'use strict';

var reactNative = require('react-native');

// src/index.android.ts
var warnings = /* @__PURE__ */ new Set();
var isEdgeToEdge = () => reactNative.TurboModuleRegistry.get("RNEdgeToEdge") != null;
var controlEdgeToEdgeValues = (values) => {
  if (__DEV__ && isEdgeToEdge()) {
    const entries = Object.entries(values).filter(
      ([, value]) => typeof value !== "undefined"
    );
    const stableKey = entries.join(" ");
    if (entries.length < 1 || warnings.has(stableKey)) {
      return;
    }
    warnings.add(stableKey);
    const isPlural = entries.length > 1;
    const lastIndex = entries.length - 1;
    const list = entries.reduce(
      (acc, [name], index) => index === 0 ? name : acc + (index === lastIndex ? " and " : ", ") + name,
      ""
    );
    console.warn(
      `${list} ${isPlural ? "values are" : "value is"} ignored when using react-native-edge-to-edge`
    );
  }
};

exports.controlEdgeToEdgeValues = controlEdgeToEdgeValues;
exports.isEdgeToEdge = isEdgeToEdge;
//# sourceMappingURL=index.android.js.map
//# sourceMappingURL=index.android.js.map