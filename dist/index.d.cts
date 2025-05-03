import * as react_hook_form from 'react-hook-form';
import { FieldValues, Resolver, FieldErrors, UseFormProps, SubmitHandler, SubmitErrorHandler, DefaultValues, KeepStateOptions, Path, RegisterOptions, FormState, UseFormReturn, UseFormHandleSubmit } from 'react-hook-form';
import React, { FormEvent, ReactNode } from 'react';
import { SubmitFunction, FetcherWithComponents } from 'react-router';

/**
 * Generates an output object from the given form data, where the keys in the output object retain
 * the structure of the keys in the form data. Keys containing integer indexes are treated as arrays.
 */
declare const generateFormData: (formData: FormData | URLSearchParams, preserveStringified?: boolean) => Record<any, any>;
declare const getFormDataFromSearchParams: <T extends FieldValues>(request: Pick<Request, "url">, preserveStringified?: boolean) => T;
type ReturnData<TFieldValues extends FieldValues, TTransformedValues = TFieldValues> = {
    data: TTransformedValues;
    errors: undefined;
    receivedValues: Partial<TFieldValues>;
} | {
    data: undefined;
    errors: FieldErrors<TFieldValues>;
    receivedValues: Partial<TFieldValues>;
};
/**
 * Parses the data from an HTTP request and validates it against a schema. Works in both loaders and actions, in loaders it extracts the data from the search params.
 * In actions it extracts it from request formData.
 *
 * @returns A Promise that resolves to an object containing the validated data or any errors that occurred during validation.
 */
declare const getValidatedFormData: <TFieldValues extends FieldValues, TContext = any, TTransformedValues = TFieldValues>(request: Request | FormData, resolver: Resolver<TFieldValues, TContext, TTransformedValues>, preserveStringified?: boolean) => Promise<ReturnData<TFieldValues, TTransformedValues>>;
/**
 * Helper method used in actions to validate the form data parsed from the frontend using zod and return a json error if validation fails.
 * @param data Data to validate
 * @param resolver Schema to validate and cast the data with
 * @returns Returns the validated data if successful, otherwise returns the error object
 */
declare const validateFormData: <TFieldValues extends FieldValues, TContext, TTransformedValues = TFieldValues>(data: any, resolver: Resolver<TFieldValues, TContext, TTransformedValues>) => Promise<{
    errors: FieldErrors<TFieldValues>;
    data: undefined;
} | {
    errors: undefined;
    data: TTransformedValues;
}>;
/**
  Creates a new instance of FormData with the specified data and key.
  @template T - The type of the data parameter. It can be any type of FieldValues.
  @param {T} data - The data to be added to the FormData. It can be either an object of type FieldValues.
  @param {boolean} stringifyAll - Should the form data be stringified or not (default: true) eg: {a: '"string"', b: "1"} vs {a: "string", b: "1"}
  @returns {FormData} - The FormData object with the data added to it.
*/
declare const createFormData: <T extends FieldValues>(data: T, stringifyAll?: boolean) => FormData;
/**
Parses the specified Request object's FormData to retrieve the data associated with the specified key.
Or parses the specified FormData to retrieve the data
  */
declare const parseFormData: <T extends unknown>(request: Request | FormData, preserveStringified?: boolean) => Promise<T>;

type SubmitFunctionOptions = Parameters<SubmitFunction>[1];
interface UseRemixFormOptions<TFieldValues extends FieldValues, TContext = any, TTransformedValues = TFieldValues> extends UseFormProps<TFieldValues, TContext, TTransformedValues> {
    submitHandlers?: {
        onValid?: SubmitHandler<TTransformedValues>;
        onInvalid?: SubmitErrorHandler<TFieldValues>;
    };
    submitConfig?: SubmitFunctionOptions;
    submitData?: FieldValues;
    fetcher?: FetcherWithComponents<unknown>;
    /**
     * If true, all values will be stringified before being sent to the server, otherwise everything but strings will be stringified (default: true)
     */
    stringifyAllValues?: boolean;
}
declare const useRemixForm: <TFieldValues extends FieldValues, TContext = any, TTransformedValues = TFieldValues>({ submitHandlers, submitConfig, submitData, fetcher, stringifyAllValues, ...formProps }: UseRemixFormOptions<TFieldValues, TContext, TTransformedValues>) => {
    handleSubmit: (e?: FormEvent<HTMLFormElement>) => Promise<void>;
    reset: (values?: TFieldValues | DefaultValues<TFieldValues> | undefined, options?: KeepStateOptions) => void;
    register: (name: Path<TFieldValues>, options?: RegisterOptions<TFieldValues> & {
        disableProgressiveEnhancement?: boolean;
    }) => {
        defaultValue?: string | undefined;
        defaultChecked?: boolean | undefined;
        onChange: react_hook_form.ChangeHandler;
        onBlur: react_hook_form.ChangeHandler;
        ref: react_hook_form.RefCallBack;
        name: Path<TFieldValues>;
        min?: string | number;
        max?: string | number;
        maxLength?: number;
        minLength?: number;
        pattern?: string;
        required?: boolean;
        disabled?: boolean;
    };
    formState: FormState<TFieldValues>;
    watch: react_hook_form.UseFormWatch<TFieldValues>;
    getValues: react_hook_form.UseFormGetValues<TFieldValues>;
    getFieldState: react_hook_form.UseFormGetFieldState<TFieldValues>;
    setError: react_hook_form.UseFormSetError<TFieldValues>;
    clearErrors: react_hook_form.UseFormClearErrors<TFieldValues>;
    setValue: react_hook_form.UseFormSetValue<TFieldValues>;
    trigger: react_hook_form.UseFormTrigger<TFieldValues>;
    resetField: react_hook_form.UseFormResetField<TFieldValues>;
    unregister: react_hook_form.UseFormUnregister<TFieldValues>;
    control: react_hook_form.Control<TFieldValues, TContext, TTransformedValues>;
    setFocus: react_hook_form.UseFormSetFocus<TFieldValues>;
    subscribe: react_hook_form.UseFromSubscribe<TFieldValues>;
};
type UseRemixFormReturn<TFieldValues extends FieldValues = FieldValues, TContext = any, TTransformedValues = TFieldValues> = UseFormReturn<TFieldValues, TContext, TTransformedValues> & {
    handleSubmit: ReturnType<typeof useRemixForm>["handleSubmit"];
    reset: ReturnType<typeof useRemixForm>["reset"];
    register: ReturnType<typeof useRemixForm>["register"];
};
interface RemixFormProviderProps<TFieldValues extends FieldValues = FieldValues, TContext = any, TTransformedValues = TFieldValues> extends Omit<UseFormReturn<TFieldValues, TContext, TTransformedValues>, "handleSubmit" | "reset"> {
    children: ReactNode;
    handleSubmit: any;
    register: any;
    reset: any;
}
declare const RemixFormProvider: <TFieldValues extends FieldValues = FieldValues, TContext = any, TTransformedValues = TFieldValues>({ children, ...props }: RemixFormProviderProps<TFieldValues, TContext, TTransformedValues>) => React.JSX.Element;
declare const useRemixFormContext: <TFieldValues extends FieldValues, TContext = any, TTransformedValues = TFieldValues>() => {
    handleSubmit: ReturnType<UseFormHandleSubmit<TFieldValues, TTransformedValues>>;
    watch: react_hook_form.UseFormWatch<TFieldValues>;
    getValues: react_hook_form.UseFormGetValues<TFieldValues>;
    getFieldState: react_hook_form.UseFormGetFieldState<TFieldValues>;
    setError: react_hook_form.UseFormSetError<TFieldValues>;
    clearErrors: react_hook_form.UseFormClearErrors<TFieldValues>;
    setValue: react_hook_form.UseFormSetValue<TFieldValues>;
    trigger: react_hook_form.UseFormTrigger<TFieldValues>;
    formState: FormState<TFieldValues>;
    resetField: react_hook_form.UseFormResetField<TFieldValues>;
    reset: react_hook_form.UseFormReset<TFieldValues>;
    unregister: react_hook_form.UseFormUnregister<TFieldValues>;
    control: react_hook_form.Control<TFieldValues, TContext, TTransformedValues>;
    register: react_hook_form.UseFormRegister<TFieldValues>;
    setFocus: react_hook_form.UseFormSetFocus<TFieldValues>;
    subscribe: react_hook_form.UseFromSubscribe<TFieldValues>;
};

export { RemixFormProvider, type SubmitFunctionOptions, type UseRemixFormOptions, type UseRemixFormReturn, createFormData, generateFormData, getFormDataFromSearchParams, getValidatedFormData, parseFormData, useRemixForm, useRemixFormContext, validateFormData };
