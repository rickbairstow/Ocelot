import { computed, inject, ref, useAttrs, watchEffect } from 'vue'
import type { AriaAttributes, InjectionKey } from 'vue'

export interface FormFieldContext {
    readonly inputId: string
    readonly describedBy: string | undefined
    readonly hasError: boolean
    readonly required: boolean
    readonly grouped: boolean
    setInputId: (id: string) => void
}

/** Shared native-control wiring; validation rules remain with the consumer. */
export function useFormControl<T extends HTMLElement = HTMLInputElement>(
    props: { id?: string; invalid?: boolean; required?: boolean },
    fallbackId: string,
    independentId = false
) {
    const formField = useFormField()
    const attrs = useAttrs()
    const element = ref<T | null>(null)
    const inheritedId = formField?.inputId
    const effectiveId = computed(() => props.id ?? (!independentId && !formField?.grouped ? inheritedId : undefined) ?? fallbackId)
    const isInvalid = computed(() => props.invalid || formField?.hasError || false)
    const isRequired = computed(() => props.required || (!independentId && !formField?.grouped && formField?.required) || false)

    watchEffect(() => {
        if (!independentId && !formField?.grouped) formField?.setInputId(props.id ?? inheritedId ?? fallbackId)
    })

    const controlAttrs = () => ({
        ...attrs,
        'aria-describedby': [attrs['aria-describedby'], formField?.describedBy].filter(Boolean).join(' ') || undefined,
        'aria-invalid': isInvalid.value ? 'true' : attrs['aria-invalid'] as AriaAttributes['aria-invalid']
    })
    const focus = () => element.value?.focus()

    return { formField, effectiveId, isInvalid, isRequired, controlAttrs, element, focus }
}

export const FormFieldKey: InjectionKey<FormFieldContext> = Symbol('FormField')

export function useFormField(): FormFieldContext | null {
    return inject(FormFieldKey, null)
}
