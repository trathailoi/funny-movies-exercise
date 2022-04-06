import { FormItemRule } from 'naive-ui'

export const rules = {
  email: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('Please enter your email')
      } else if (!/.+@.+\..+/i.test(value)) {
        return new Error('Please enter a valid email')
      }
      return true
    },
    message: 'Please enter your email!',
    trigger: ['input', 'blur']
  },
  password: [
    {
      required: true,
      message: 'Please enter a valid password',
      validator: (rule: FormItemRule, value: string): boolean => Boolean(value && value.length >= 8 && /(?=.*[A-Z])/.test(value) && /(?=.*\d)/.test(value))
    }
  ]
}
