import { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { ReactEasyCrudContext } from '../Context';
import * as requests from './request';

const validateDependency = async (
  field,
  allValues,
  keys = Object.keys(allValues),
  getForField
) => {
  if (
    field.dependencies &&
    field.dependencies.fields.filter(dependency => keys.includes(dependency))
      .length > 0
  ) {
    const dependencyFields = {};
    Object.keys(allValues).forEach(key => {
      if (field.dependencies.fields.indexOf(key) >= 0) {
        dependencyFields[key] = allValues[key];
      }
    });
    return (
      field.dependencies &&
      field.dependencies.onChange(dependencyFields, field, getForField)
    );
  }
};

const setValueByType = (data, field, keyName) => {
  const fieldData =
    typeof data === 'object' &&
    Object.hasOwnProperty.call(data, [
      (field.configOptions && field.configOptions.keyName) || keyName,
    ])
      ? data[(field.configOptions && field.configOptions.keyName) || keyName]
      : data;
  switch (field.type) {
    case 'date': {
      return moment(fieldData);
    }
    case 'number':
      return fieldData;
    case 'radio':
    case 'bool': {
      return fieldData || false;
    }
    case 'select': {
      if (field.mode === 'multiple') {
        return (
          (fieldData &&
            fieldData.map(
              item =>
                item[
                  (field.configOptions && field.configOptions.keyName) ||
                    keyName
                ]
            )) ||
          []
        );
      }
      return (fieldData && fieldData.toString()) || '';
    }
    case 'cascader': {
      return [
        data[field.keyParent][
          (field.configOptions && field.configOptions.keyName) || keyName
        ],
        data[(field.configOptions && field.configOptions.keyName) || keyName],
      ];
    }
    case 'rich':
      return fieldData || ' ';
    default: {
      return (fieldData && fieldData.toString()) || null;
    }
  }
};

const setOptionsForField = (promises, responses, field, valuesFields) => {
  let options = {};

  if (
    field.dependencies &&
    valuesFields[field.key] &&
    Object.keys(valuesFields[field.key].options || {}).length > 0
  ) {
    options =
      (valuesFields[field.key] && valuesFields[field.key].options) || {};
  } else if (
    promises.keys[field.key] >= 0 &&
    (responses[promises.keys[field.key]] && field.type !== 'cascader')
  ) {
    options =
      responses[promises.keys[field.key]].data[
        field.configOptions.accessData
      ].reduce(
        (items, item) => ({
          ...items,
          ...field.configOptions.map(item),
        }),
        {}
      ) || {};
  } else if (field.type === 'cascader') {
    options = responses[promises.keys[field.key]].data[
      field.configOptions.accessData
    ].filter(item => item[field.keyChildren].length > 0);
  } else {
    options = field.options || {};
  }
  return options;
};

export default function useCrudForm(conf, key) {
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(!!key);
  const [fields, setFields] = useState(
    conf.fields.filter(
      field =>
        !(
          Object.hasOwnProperty.call(field, 'hidden') &&
          field.hidden.includes('form')
        )
    )
  );
  const { client, type } = useContext(ReactEasyCrudContext);

  const getForField = async (request, params, accessData, method) =>
    requests[type].getForField(client, request, accessData, params, { method });

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const valuesFields = {};
        const promises = { all: [], keys: {} };
        let i = 0;
        fields.forEach(field => {
          if (
            field.configOptions &&
            typeof field.configOptions.query === 'object'
          ) {
            const { query } = field.configOptions;
            promises.all.push(client.query({ query }));
            promises.keys[field.key] = i;
            i += 1;
          }
          if (field.type === 'file') {
            field.props.fileList = [];
          }
        });

        const responses = await Promise.all(promises.all);

        if (key) {
          const data = await requests[type].getByKey(
            client,
            conf.getByKey.query ||
              conf.getByKey.url.replace('{keyName}', key || ''),
            conf.getByKey.accessData,
            { [conf.keyName || 'id']: key }
          );

          const valuesByField = await Promise.all(
            fields.map(async field => {
              if (field.type === 'file') {
                const name = data[field.updateKey || field.key];
                if (name !== null) {
                  const fileList = [
                    {
                      uid: `${name}`,
                      name: `${name}`,
                      status: `done`,
                      url: field.resolvePath(name),
                    },
                  ];
                  field.props.fileList = fileList;
                }
              }
              if (data[field.updateKey || field.key]) {
                const propsFromDependency = await validateDependency(
                  field,
                  data,
                  Object.keys(data),
                  getForField
                );
                return {
                  key: field.key,
                  ...propsFromDependency,
                  value: setValueByType(
                    data[field.updateKey || field.key],
                    field,
                    conf.keyName
                  ),
                };
              }
            })
          );
          valuesByField.forEach(vbf => {
            valuesFields[vbf.key] = vbf;
          });
          setLoadingForm(false);
        } else {
          fields.forEach(field => {
            valuesFields[field.key] = {
              ...validateDependency(field, {}, [], getForField),
              value: setValueByType(field.initialValue || undefined, field),
            };
          });
        }

        setFields(
          fields.map(field => {
            const options = setOptionsForField(
              promises,
              responses,
              field,
              valuesFields
            );
            return {
              ...field,
              ...(valuesFields[field.key] || {}),
              options,
            };
          })
        );
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
    init();
    // eslint-disable-next-line
  }, [key]);

  const onSubmit = (values, callback = () => {}) => {
    setLoading(true);
    const isUpdating =
      !(key === null || key === undefined) && type === 'graphql'
        ? {
            query: conf.getByKey.query,
            variables: { [conf.keyName || 'id']: key || undefined },
          }
        : undefined;

    let ACTION = 'upsert';
    if (!Object.hasOwnProperty.call(conf, 'upsert')) {
      if (
        !(key === null || key === undefined) &&
        Object.hasOwnProperty.call(conf, 'update')
      ) {
        ACTION = 'update';
      } else if (!key && Object.hasOwnProperty.call(conf, 'create')) {
        ACTION = 'create';
      }
    }

    requests[type][ACTION](
      client,
      conf[ACTION].query || conf[ACTION].url.replace('{keyName}', key || ''),
      conf[ACTION].accessData || null,
      { ...values, [conf.keyName || 'id']: key || undefined },
      {
        method: conf[ACTION].method,
        refetchQueries: [
          { query: conf.getList.query || null },
          isUpdating,
        ].filter(Boolean),
      }
    )
      .then(response => {
        setLoading(false);
        callback(response);
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
  };

  const onValuesChanged = async (props, changedValues, allValues) => {
    const keys = Object.keys(changedValues);

    setFields(
      await Promise.all(
        fields.map(async field => {
          if (field.type === 'file' && keys[0] === field.key) {
            const info = changedValues[keys[0]];
            let filesL = [...info.fileList];
            filesL = filesL.slice(-2);
            filesL = filesL.map(file => {
              if (file.response) {
                file.url = file.response.url;
              }
              return file;
            });
            field.props.fileList = filesL;
          }

          if (
            !(
              field.dependencies &&
              field.dependencies.fields.filter(dependency =>
                keys.includes(dependency)
              ).length > 0
            )
          ) {
            return {
              ...field,
              value: allValues[field.key],
            };
          }

          const propsFromDependency = await validateDependency(
            field,
            allValues,
            keys,
            getForField
          );
          if (propsFromDependency && propsFromDependency.value) {
            props.form.setFieldsValue({
              [field.key]: propsFromDependency.value,
            });
          }
          return {
            ...field,
            value: allValues[field.key],
            ...propsFromDependency,
          };
        })
      )
    );
  };

  return { fields, onSubmit, loading, onValuesChanged, loadingForm };
}
