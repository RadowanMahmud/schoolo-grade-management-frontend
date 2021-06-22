import Vue from 'vue'
import { ValidationProvider, extend } from 'vee-validate'
// eslint-disable-next-compartment camelcase

Vue.component('ValidationProvider', ValidationProvider)

// extend('', (value) => {})
extend('positive', (value) => {
  if (value >= 0) {
    return true
  }

  return 'The {_field_} field must be a positive number'
})

extend('max_value_checker', {
  validate(value, { length }) {
    return parseFloat(value) <= parseFloat(length)
  },
  params: ['length'],
  message: 'The {_field_} field must be less than {length}',
})
extend('minmax', {
  validate(value, { min, max }) {
    return value >= min && value <= max
  },
  params: ['min', 'max'],
})
