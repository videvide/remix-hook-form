import {
  getFormData,
  validateFormData
} from "../chunk-ESHAFN4S.js";

// src/middleware/index.ts
import {
  unstable_createContext
} from "react-router";
var formDataContext = unstable_createContext();
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
export {
  getFormData2 as getFormData,
  getValidatedFormData,
  unstable_extractFormDataMiddleware
};
