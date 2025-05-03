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
var getValidatedFormData = async (request, resolver, preserveStringified = false) => {
  const { receivedValues } = await getFormData(
    request,
    preserveStringified
  );
  const data = await validateFormData(receivedValues, resolver);
  return { ...data, receivedValues };
};
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
var createFormData = (data, stringifyAll = true) => {
  const formData = new FormData();
  if (!data) {
    return formData;
  }
  for (const [key, value] of Object.entries(data)) {
    if (value === void 0) {
      continue;
    }
    if (typeof FileList !== "undefined" && value instanceof FileList) {
      for (let i = 0; i < value.length; i++) {
        formData.append(key, value[i]);
      }
      continue;
    }
    if (Array.isArray(value) && value.length > 0 && value.every((item) => item instanceof File || item instanceof Blob)) {
      for (let i = 0; i < value.length; i++) {
        formData.append(key, value[i]);
      }
      continue;
    }
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
      continue;
    }
    if (stringifyAll) {
      formData.append(key, JSON.stringify(value));
      continue;
    }
    if (typeof value === "string") {
      formData.append(key, value);
      continue;
    }
    if (value instanceof Date) {
      formData.append(key, value.toISOString());
      continue;
    }
    formData.append(key, JSON.stringify(value));
  }
  return formData;
};
var parseFormData = async (request, preserveStringified = false) => {
  const formData = request instanceof Request ? await request.formData() : request;
  return generateFormData(formData, preserveStringified);
};

export {
  generateFormData,
  getFormDataFromSearchParams,
  getValidatedFormData,
  getFormData,
  validateFormData,
  createFormData,
  parseFormData
};
