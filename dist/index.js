import {
  createFormData,
  generateFormData,
  getFormDataFromSearchParams,
  getValidatedFormData,
  parseFormData,
  validateFormData
} from "./chunk-ESHAFN4S.js";

// src/hook/index.tsx
import React, {
  useEffect,
  useMemo,
  useState
} from "react";
import {
  FormProvider,
  get,
  useForm,
  useFormContext
} from "react-hook-form";
import {
  useActionData,
  useHref,
  useNavigation,
  useSubmit
} from "react-router";
var useRemixForm = ({
  submitHandlers,
  submitConfig,
  submitData,
  fetcher,
  stringifyAllValues = true,
  ...formProps
}) => {
  var _a, _b;
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);
  const basename = useHref("/");
  const actionSubmit = useSubmit();
  const actionData = useActionData();
  const submit = (_a = fetcher == null ? void 0 : fetcher.submit) != null ? _a : actionSubmit;
  const data = (_b = fetcher == null ? void 0 : fetcher.data) != null ? _b : actionData;
  const methods = useForm({ ...formProps, errors: data == null ? void 0 : data.errors });
  const navigation = useNavigation();
  const isSubmittingForm = useMemo(
    () => Boolean(
      navigation.state !== "idle" && navigation.formData !== void 0 || (fetcher == null ? void 0 : fetcher.state) !== "idle" && (fetcher == null ? void 0 : fetcher.formData) !== void 0
    ),
    [navigation.state, navigation.formData, fetcher == null ? void 0 : fetcher.state, fetcher == null ? void 0 : fetcher.formData]
  );
  const [isSubmittingNetwork, setIsSubmittingNetwork] = useState(false);
  useEffect(() => {
    if (!isSubmittingForm) {
      setIsSubmittingNetwork(false);
    }
  }, [isSubmittingForm]);
  const onSubmit = useMemo(
    () => (data2, e, formEncType, formMethod, formAction) => {
      var _a2, _b2, _c, _d;
      setIsSubmittingNetwork(true);
      setIsSubmittedSuccessfully(true);
      const encType = (_a2 = submitConfig == null ? void 0 : submitConfig.encType) != null ? _a2 : formEncType;
      const method = (_c = (_b2 = submitConfig == null ? void 0 : submitConfig.method) != null ? _b2 : formMethod) != null ? _c : "post";
      const action = (_d = submitConfig == null ? void 0 : submitConfig.action) != null ? _d : formAction;
      const submitPayload = { ...data2, ...submitData };
      const formData = encType === "application/json" ? submitPayload : createFormData(submitPayload, stringifyAllValues);
      submit(formData, {
        ...submitConfig,
        method,
        encType,
        action
      });
    },
    [submit, submitConfig, submitData, stringifyAllValues]
  );
  const onInvalid = useMemo(() => () => {
  }, []);
  const formState = useMemo(
    () => ({
      get isDirty() {
        return methods.formState.isDirty;
      },
      get isLoading() {
        return methods.formState.isLoading;
      },
      get isSubmitted() {
        return methods.formState.isSubmitted;
      },
      get isSubmitSuccessful() {
        return isSubmittedSuccessfully || methods.formState.isSubmitSuccessful;
      },
      get isSubmitting() {
        return isSubmittingNetwork || methods.formState.isSubmitting;
      },
      get isValidating() {
        return methods.formState.isValidating;
      },
      get isValid() {
        return methods.formState.isValid;
      },
      get disabled() {
        return methods.formState.disabled;
      },
      get submitCount() {
        return methods.formState.submitCount;
      },
      get defaultValues() {
        return methods.formState.defaultValues;
      },
      get dirtyFields() {
        return methods.formState.dirtyFields;
      },
      get touchedFields() {
        return methods.formState.touchedFields;
      },
      get validatingFields() {
        return methods.formState.validatingFields;
      },
      get errors() {
        return methods.formState.errors;
      }
    }),
    [methods.formState, isSubmittedSuccessfully, isSubmittingNetwork]
  );
  const reset = useMemo(
    () => (values, options) => {
      setIsSubmittedSuccessfully(false);
      methods.reset(values, options);
    },
    [methods.reset]
  );
  const register = useMemo(
    () => (name, options) => {
      var _a2;
      const defaultValue = (_a2 = get(data == null ? void 0 : data.defaultValues, name)) != null ? _a2 : get(methods.formState.defaultValues, name);
      return {
        ...methods.register(name, options),
        ...!(options == null ? void 0 : options.disableProgressiveEnhancement) && {
          defaultValue: typeof defaultValue === "string" ? defaultValue : void 0,
          defaultChecked: typeof defaultValue === "boolean" ? defaultValue : void 0
        }
      };
    },
    [methods.register, data == null ? void 0 : data.defaultValues, methods.formState.defaultValues]
  );
  const handleSubmit = useMemo(
    () => (e) => {
      var _a2, _b2, _c, _d, _e;
      const encType = (_a2 = e == null ? void 0 : e.currentTarget) == null ? void 0 : _a2.enctype;
      const method = (_b2 = e == null ? void 0 : e.currentTarget) == null ? void 0 : _b2.method;
      const action = (_c = e == null ? void 0 : e.currentTarget) == null ? void 0 : _c.action.replace(
        `${window.location.origin}${basename === "/" ? "" : basename}`,
        ""
      );
      const onValidHandler = (_d = submitHandlers == null ? void 0 : submitHandlers.onValid) != null ? _d : onSubmit;
      const onInvalidHandler = (_e = submitHandlers == null ? void 0 : submitHandlers.onInvalid) != null ? _e : onInvalid;
      return methods.handleSubmit(
        (data2, e2) => onValidHandler(data2, e2, encType, method, action),
        onInvalidHandler
      )(e);
    },
    [methods.handleSubmit, submitHandlers, onSubmit, onInvalid, basename]
  );
  const hookReturn = useMemo(
    () => ({
      ...methods,
      handleSubmit,
      reset,
      register,
      formState
    }),
    [methods, handleSubmit, reset, register, formState]
  );
  return hookReturn;
};
var RemixFormProvider = ({
  children,
  ...props
}) => {
  return /* @__PURE__ */ React.createElement(FormProvider, { ...props }, children);
};
var useRemixFormContext = () => {
  const methods = useFormContext();
  return {
    ...methods,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    handleSubmit: methods.handleSubmit
  };
};
export {
  RemixFormProvider,
  createFormData,
  generateFormData,
  getFormDataFromSearchParams,
  getValidatedFormData,
  parseFormData,
  useRemixForm,
  useRemixFormContext,
  validateFormData
};
