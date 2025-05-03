"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/middleware/index.ts
var middleware_exports = {};
__export(middleware_exports, {
  getFormData: () => getFormData2,
  getValidatedFormData: () => getValidatedFormData,
  unstable_extractFormDataMiddleware: () => unstable_extractFormDataMiddleware
});
module.exports = __toCommonJS(middleware_exports);
var import_react_router = require("react-router");

// src/utilities/index.ts
var tryParseJSON = (value) => {
  if (value instanceof File || value instanceof Blob) {
    return value;
  }
  try {
    const json = JSON.parse(value);
    return json;
  } catch (e) {
    return value;
  }
};
var generateFormData = (formData, preserveStringified = false) => {
  const keyCount = {};
  for (const [key] of formData.entries()) {
    keyCount[key] = (keyCount[key] || 0) + 1;
  }
  const outputObject = {};
  for (const [key, value] of formData.entries()) {
    const data = preserveStringified ? value : tryParseJSON(value);
    if (key.split(".").length === 1) {
      const isArray = keyCount[key] > 1;
      if (isArray) {
        if (!outputObject[key]) {
          outputObject[key] = [];
        }
        outputObject[key].push(data);
      } else {
        outputObject[key] = data;
      }
    } else {
      const keyParts = key.split(".");
      let currentObject = outputObject;
      for (let i = 0; i < keyParts.length - 1; i++) {
        const keyPart = keyParts[i];
        if (!currentObject[keyPart]) {
          currentObject[keyPart] = /^\d+$/.test(keyParts[i + 1]) ? [] : {};
        }
        currentObject = currentObject[keyPart];
      }
      const lastKeyPart = keyParts[keyParts.length - 1];
      const lastKeyPartIsArray = /\[\d*\]$|\[\]$/.test(lastKeyPart);
      if (lastKeyPartIsArray) {
        const key2 = lastKeyPart.replace(/\[\d*\]$|\[\]$/, "");
        if (!currentObject[key2]) {
          currentObject[key2] = [];
        }
        currentObject[key2].push(data);
      }
      if (!lastKeyPartIsArray) {
        if (/^\d+$/.test(lastKeyPart)) {
          currentObject.push(data);
        } else {
          currentObject[lastKeyPart] = data;
        }
      }
    }
  }
  return outputObject;
};
var getFormDataFromSearchParams = (request, preserveStringified = false) => {
  const searchParams = new URL(request.url).searchParams;
  return generateFormData(searchParams, preserveStringified);
};
var isGet = (request) => request.method === "GET" || request.method === "get";
var getFormData = async (request, preserveStringified = false) => {
  const receivedValues = "url" in request && isGet(request) ? getFormDataFromSearchParams(request, preserveStringified) : await parseFormData(request, preserveStringified);
  return { receivedValues };
};
var validateFormData = async (data, resolver) => {
  const dataToValidate = data instanceof FormData ? Object.fromEntries(data) : data;
  const { errors, values } = await resolver(dataToValidate, {}, {
    shouldUseNativeValidation: false,
    fields: {}
  });
  if (Object.keys(errors).length > 0) {
    return { errors, data: void 0 };
  }
  return { errors: void 0, data: values };
};
var parseFormData = async (request, preserveStringified = false) => {
  const formData = request instanceof Request ? await request.formData() : request;
  return generateFormData(formData, preserveStringified);
};

// src/middleware/index.ts
var formDataContext = (0, import_react_router.unstable_createContext)();
function unstable_extractFormDataMiddleware({
  preserveStringified = false
} = {}) {
  return async function extractFormDataMiddleware({ request, context }, next) {
    const cloneRequest = request.clone();
    const { receivedValues: formData } = await getFormData(
      cloneRequest,
      preserveStringified
    );
    context.set(formDataContext, formData);
    return next();
  };
}
var getFormData2 = (context) => context.get(formDataContext);
var getValidatedFormData = async (context, resolver) => {
  const formData = context.get(formDataContext);
  const data = await validateFormData(formData, resolver);
  return { ...data, receivedValues: formData };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getFormData,
  getValidatedFormData,
  unstable_extractFormDataMiddleware
});
