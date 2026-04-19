import { inject } from 'vue'
import type { InjectionKey } from 'vue'

export interface FormFieldContext {
    readonly inputId: string
    readonly describedBy: string | undefined
    readonly hasError: boolean
}

export const FormFieldKey: InjectionKey<FormFieldContext> = Symbol('FormField')

export function useFormField(): FormFieldContext | null {
    return inject(FormFieldKey, null)
}
