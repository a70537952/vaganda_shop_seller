import update from 'immutability-helper';

export interface Fields {
  [key: string]: {
    value?: any;
    is_valid?: boolean;
    feedback?: string;
    validationField?: string;
    isCheckEmpty?: boolean;
    emptyMessage?: string;
    disabled?: boolean;
  };
}

let parseFields = (fields: any): Fields => {
  let obj: Fields = {};
  fields.forEach((field: any) => {
    obj = { ...obj, ...parseField(field) };
  });

  return obj;
};

let parseField = (field: any): Fields => {
  let obj: Fields = {};
  if (typeof field === 'object') {
    obj[field.field] = {
      value: field.value !== undefined ? field.value : '',
      is_valid: field.is_valid !== undefined ? field.is_valid : true,
      feedback: field.feedback !== undefined ? field.feedback : '',
      validationField:
        field.validationField !== undefined
          ? field.validationField
          : field.field,
      isCheckEmpty:
        field.isCheckEmpty !== undefined ? field.isCheckEmpty : false,
      emptyMessage: field.emptyMessage !== undefined ? field.emptyMessage : '',
      disabled: field.disabled !== undefined ? field.disabled : false
    };
  } else {
    obj[field] = {
      value: '',
      is_valid: true,
      feedback: '',
      validationField: field,
      isCheckEmpty: false,
      emptyMessage: '',
      disabled: false
    };
  }
  return obj;
};

let resetFields = (fields: any) => {
  let obj = {};
  fields.forEach((field: any) => {
    obj = { ...obj, ...resetField(field) };
  });

  return obj;
};

let resetField = (field: any) => {
  let obj = {};

  if (typeof field === 'object') {
    if (field.value instanceof Set) {
      field.value = new Set();
    }
    (obj as any)[field.field] = {
      value: { $set: field.value !== undefined ? field.value : '' },
      is_valid: { $set: field.is_valid !== undefined ? field.is_valid : true },
      feedback: { $set: field.feedback !== undefined ? field.feedback : '' },
      disabled: { $set: field.disabled !== undefined ? field.disabled : false }
    };
  } else {
    (obj as any)[field] = {
      value: { $set: '' },
      is_valid: { $set: true },
      feedback: { $set: '' },
      disabled: { $set: false }
    };
  }

  return obj;
};

export default {
  parseField: parseField,
  generateFieldsState: (fieldsConfig: any): Fields => {
    let fields: Fields = parseFields(fieldsConfig);
    Object.keys(fields).forEach(key => {
      delete fields[key].validationField;
      delete fields[key].isCheckEmpty;
      delete fields[key].emptyMessage;
    });
    return fields;
  },
  generateResetFieldsState: (fields: any) => {
    return resetFields(fields);
  },
  generateResetFieldsStateHook: (fields: any, state: any) => {
    return update(state, resetFields(fields));
  },
  resetFieldsIsValid: (fields: any) => {
    fields = parseFields(fields);
    let obj = {};
    Object.keys(fields).forEach(field => {
      (obj as any)[field] = {
        feedback: { $set: '' },
        is_valid: { $set: true }
      };
    });

    return obj;
  },
  resetFieldsIsValidHook: (fields: any, state: any) => {
    fields = parseFields(fields);
    let obj = {};
    Object.keys(fields).forEach(field => {
      (obj as any)[field] = {
        feedback: { $set: '' },
        is_valid: { $set: true }
      };
    });

    return update(state, obj);
  },
  validationErrorHandler: (fields: any, error: any) => {
    fields = parseFields(fields);
    let errorStateObj = {};
    let isValid = true;
    if (error) {
      let validationError = error.graphQLErrors[0].extensions.validation;

      Object.keys(fields).forEach(field => {
        let fieldError = validationError[fields[field].validationField];
        if (fieldError && fieldError[0]) {
          isValid = false;
          (errorStateObj as any)[field] = {
            feedback: { $set: fieldError[0] },
            is_valid: { $set: false }
          };
        } else {
          (errorStateObj as any)[field] = {
            feedback: { $set: '' },
            is_valid: { $set: true }
          };
        }
      });
    }

    return { errorStateObj: errorStateObj, isValid: isValid };
  },
  validationErrorHandlerHook: (fields: any, error: any, state: any) => {
    fields = parseFields(fields);
    let errorStateObj = {};
    let isValid = true;
    if (error) {
      let validationError = error.graphQLErrors[0].extensions.validation;

      Object.keys(fields).forEach(field => {
        let fieldError = validationError[fields[field].validationField];
        if (fieldError && fieldError[0]) {
          isValid = false;
          (errorStateObj as any)[field] = {
            feedback: { $set: fieldError[0] },
            is_valid: { $set: false }
          };
        } else {
          (errorStateObj as any)[field] = {
            feedback: { $set: '' },
            is_valid: { $set: true }
          };
        }
      });
    }

    return { state: update(state, errorStateObj), isValid: isValid };
  },
  generateFieldsEmptyError: (fields: any, stateForm: any) => {
    fields = parseFields(fields);
    let errorStateObj = {};
    let isValid = true;

    Object.keys(fields).forEach(field => {
      let fieldObj = fields[field];
      let isEmpty = false;
      if (fieldObj.isCheckEmpty) {
        if (fieldObj.dataType) {
          let dataType = fieldObj.dataType;
        } else {
          if (String(stateForm[field].value).trim() === '') {
            isEmpty = true;
            isValid = false;
            (errorStateObj as any)[field] = {
              feedback: { $set: fieldObj.emptyMessage },
              is_valid: { $set: false }
            };
          }
        }
      }

      if (!isEmpty) {
        (errorStateObj as any)[field] = {
          feedback: { $set: '' },
          is_valid: { $set: true }
        };
      }
    });

    return { errorStateObj: errorStateObj, isValid: isValid };
  },
  generateFieldsEmptyErrorHook: (fields: any, stateForm: any) => {
    fields = parseFields(fields);
    let errorStateObj = {};
    let isValid = true;

    Object.keys(fields).forEach(field => {
      let fieldObj = fields[field];
      let isEmpty = false;
      if (fieldObj.isCheckEmpty) {
        if (fieldObj.dataType) {
          let dataType = fieldObj.dataType;
        } else {
          if (String(stateForm[field].value).trim() === '') {
            isEmpty = true;
            isValid = false;
            (errorStateObj as any)[field] = {
              feedback: { $set: fieldObj.emptyMessage },
              is_valid: { $set: false }
            };
          }
        }
      }

      if (!isEmpty) {
        (errorStateObj as any)[field] = {
          feedback: { $set: '' },
          is_valid: { $set: true }
        };
      }
    });

    return { state: update(stateForm, errorStateObj), isValid };
  },
  getValidationErrorByField: (field: any, error: any) => {
    if (error) {
      let validationError = error.graphQLErrors[0].extensions.validation;
      if (validationError[field] && validationError[field][0]) {
        return validationError[field][0];
      }
    }
    return '';
  },
  getAllValidationErrorMessage: (error: any) => {
    let validationError = error.graphQLErrors[0].extensions.validation;
    return Object.keys(validationError).map(key => validationError[key][0]);
  },
  isExtraOptionsValid: (array = []) => {
    let valid = true;
    array.forEach(option => {
      let keys = Object.keys(option);
      keys.forEach(key => {
        if (option[key] === '') {
          valid = false;
        }
      });
    });

    return valid;
  }
};
