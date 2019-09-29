import React, { useState } from "react";
import update from "immutability-helper";
import { GraphQLError } from "graphql";

declare class ApolloError extends Error {
  message: string;
  graphQLErrors: ReadonlyArray<GraphQLError>;
  networkError: Error | null;
  extraInfo: any;
}


interface UseForm {
  disable: Record<FieldsKey, boolean>;
  error: Record<FieldsKey, string>;
  value: Record<FieldsKey, any>;
  setError: (field: FieldsKey, newError: string) => void;
  setValue: (field: FieldsKey, newValue: string) => void;
  setDisable: (field: FieldsKey | '', newDisable?: boolean) => void;
  validate: (field?: FieldsKey) => boolean;
  isValid: boolean;
  resetError: () => void;
  resetValue: () => void;
  checkApolloError: (error: ApolloError) => void;
}

interface Fields {
  [key: string] : {
    emptyMessage?: string,
    value: unknown,
    validationField?: string,
    disabled?: boolean
  }
}


type FieldsKey = keyof Fields;

function useForm(fields: Fields): UseForm {
  const [error, setError] = useState<Record<keyof Fields , string>>({});

  let initialValue: Record<keyof Fields, unknown> = {};
  Object.keys(fields).forEach(field => {
    initialValue[field] = fields[field].value;
  });
  const [value, setValue] = useState<Record<keyof Fields, any>>(initialValue);
  const [disable, setDisable] = useState<Record<keyof Fields, boolean>>({});

  function setNewError(field:keyof Fields, newError: string) {
    setError(error => update(error, {
        [field]: { $set: newError }
      })
    );
  }

  function setNewDisable(field:keyof Fields | '', newDisable?: boolean) {
    if(field) {
      setDisable(disable => update(disable, {
          [field]: { $set: Boolean(newDisable)}
        })
      );
    } else {
      let newDisableData: Record<keyof Fields, boolean> = {};
      Object.keys(fields).forEach(field => {
          newDisableData[field] = Boolean(newDisable);
      });

      setDisable(newDisableData);
    }
  }

  function setNewValue(field:keyof Fields, newValue: unknown) {
    setValue(value => update(value, {
        [field]: { $set: newValue }
      })
    );
  }

  function validate(field?:keyof Fields) {
    let isValid = true;
    if(field) {
      let emptyMessage = fields[field].emptyMessage;
      if(emptyMessage && String(value[field]).trim() === '') {
        setNewError(field, emptyMessage);
        isValid = false;
      } else {
        setNewError(field, '');
      }
    } else {
      Object.keys(fields).forEach(field => {
        if(String(value[field]).trim() === '') {
          let emptyMessage = fields[field].emptyMessage;
          if(emptyMessage) {
            setNewError(field, emptyMessage);
            isValid = false;
          }
        } else {
          setNewError(field, '');
        }
      })
    }
    return isValid;
  }

  function checkApolloError(error: ApolloError) {
    if(error.graphQLErrors && error.graphQLErrors.length && error.graphQLErrors[0].extensions) {
      let validationError = error.graphQLErrors[0].extensions.validation;

      Object.keys(fields).forEach(field => {
        let validationField = fields[field].validationField || field;
        let fieldError = validationError[validationField];
        if (fieldError && fieldError[0]) {
          setNewError(field, fieldError[0]);
        } else {
          setNewError(field, '');
        }
      });
    }
  }

  function resetError() {
    setError({})
  }

  function resetValue() {
    setValue(initialValue)
    resetError();
  }

  return {
    disable,
    value,
    error,
    setError: setNewError,
    setValue: setNewValue,
    setDisable: setNewDisable,
    validate,
    isValid: !Object.values(error).join(''),
    resetError,
    resetValue,
    checkApolloError
  };
};

export default useForm;
