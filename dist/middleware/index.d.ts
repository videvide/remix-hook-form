import * as react_hook_form from 'react-hook-form';
import { FieldValues, Resolver } from 'react-hook-form';
import { unstable_MiddlewareFunction, unstable_RouterContextProvider } from 'react-router';

declare function unstable_extractFormDataMiddleware({ preserveStringified, }?: {
    preserveStringified?: boolean | undefined;
}): unstable_MiddlewareFunction;
declare const getFormData: (context: unstable_RouterContextProvider) => unknown;
declare const getValidatedFormData: <TFieldValues extends FieldValues, TContext = any, TTransformedValues = TFieldValues>(context: unstable_RouterContextProvider, resolver: Resolver<TFieldValues, TContext, TTransformedValues>) => Promise<{
    receivedValues: unknown;
    errors: react_hook_form.FieldErrors<TFieldValues>;
    data: undefined;
} | {
    receivedValues: unknown;
    errors: undefined;
    data: TTransformedValues;
}>;

export { getFormData, getValidatedFormData, unstable_extractFormDataMiddleware };
