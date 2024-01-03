interface FData {
    [k: string]: JSONValue
}
type Rule<T> = {
    key: keyof T
    message: string
} & (
    { type: 'required' } |
    { type: 'pattern', regex: RegExp } |
    { type: 'noEqual', value: JSONValue }
)
type Rules<T> = Rule<T>[]
export type { FData, Rule, Rules }

export const validate = <T extends FData>(formData: T, rules: Rules<T>) => {
    type Errors = {
        [k in keyof T]?: string[]
    }
    const errors: Errors = {}
    rules.forEach(rule => {
        const { key, type, message } = rule
        const value = formData[key]
        switch (type) {
            case 'required':
                if (isEmpty(value)) {
                    errors[key] = errors[key] ?? []
                    errors[key]?.push(message)
                }
                break;
            case 'pattern':
                if (!isEmpty(value) && !rule.regex.test(value!.toString())) {
                    errors[key] = errors[key] ?? []
                    errors[key]?.push(message)
                }
                break;
            case 'noEqual':
                if (!isEmpty(value) && value === rule.value) {
                    errors[key] = errors[key] ?? []
                    errors[key]?.push(message)
                }
                break;
            default:
                return
        }
    })
    return errors
}

function isEmpty(value: JSONValue) {
    return value === null || value === undefined || value === ''
}

export function hasError(errors: Record<string, string[]>) {
    let result = false
    for (let key in errors) {
        if (errors[key]?.length > 0) {
            result = true
        }
    }
    return result
}