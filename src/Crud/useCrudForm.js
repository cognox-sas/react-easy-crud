import { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { ReactEasyCrudContext } from '../Context';
import * as requests from './request';

const validateDependency = (
  field,
  allValues,
  keys = Object.keys(allValues)
) => {
  if (
    field.dependencies &&
    field.dependencies.fields.filter(dependency => keys.includes(dependency))
      .length > 0
  ) {
    if (
      (field.dependencies.fields || keys).reduce(
        (allHaveValues, current) => allHaveValues && !!allValues[current],
        true
      )
    ) {
      return field.dependencies && field.dependencies.onChange();
    }
  }
};

const setValueByType = (data, field) => {
  const fieldData =
    typeof data === 'object' && Object.hasOwnProperty.call(data, 'id')
      ? data.id
      : data;

  switch (field.type) {
    case 'date': {
      return moment(fieldData);
    }
    case 'number':
    case 'radio':
    case 'bool': {
      return fieldData;
    }
    case 'cascader': {
      return [data[field.keyParent].id, data.id];
    }
    case 'rich':
      return fieldData || ' ';
    default: {
      return fieldData.toString();
    }
  }
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
          fields.forEach(field => {
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
              valuesFields[field.key] = {
                ...validateDependency(field, data),
                value: setValueByType(
                  data[field.updateKey || field.key],
                  field
                ),
              };
            }
          });
          setLoadingForm(false);
        } else {
          fields.forEach(field => {
            valuesFields[field.key] = {
              ...validateDependency(field, {}),
              value: undefined,
            };
          });
        }

        setFields(
          fields.map(field => {
            let options =
              promises.keys[field.key] >= 0
                ? (responses[promises.keys[field.key]] &&
                    field.type !== 'cascader' &&
                    responses[promises.keys[field.key]].data[
                      field.configOptions.accessData
                    ].reduce(
                      (items, item) => ({
                        ...items,
                        ...field.configOptions.map(item),
                      }),
                      {}
                    )) ||
                  {}
                : field.options || {};
            if (field.type === 'cascader') {
              options = responses[promises.keys[field.key]].data[
                field.configOptions.accessData
              ].filter(item => item[field.keyChildren].length > 0);
            }
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

  const onValuesChanged = (props, changedValues, allValues) => {
    const keys = Object.keys(changedValues);
    setFields(
      fields.map(field => {
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
        return {
          ...field,
          ...validateDependency(field, allValues, keys),
          value: allValues[field.key],
        };
      })
    );
  };

  return { fields, onSubmit, loading, onValuesChanged, loadingForm };
}
