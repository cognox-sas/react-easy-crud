import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { ReactEasyCrudContext } from '../Context';

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
      debugger;
      return [data[field.keyParent].id, data.id];
    }
    default: {
      return fieldData.toString();
    }
  }
};

export default function useCrudForm(conf, key) {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(
    conf.fields.filter(
      field =>
        !(
          Object.hasOwnProperty.call(field, 'hidden') &&
          field.hidden.includes('form')
        )
    )
  );
  const { client } = useContext(ReactEasyCrudContext);

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
          const { data } = await client.query({
            query: conf.getByKey.query,
            variables: {
              [conf.keyName || 'id']: key,
            },
          });
          fields.forEach(field => {
            if (field.type === 'file') {
              const name = data[conf.getByKey.accessData][field.key];
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
            if (data[conf.getByKey.accessData][field.key]) {
              valuesFields[field.key] = {
                ...validateDependency(field, data[conf.getByKey.accessData]),
                value: setValueByType(
                  data[conf.getByKey.accessData][field.key],
                  field
                ),
              };
            }
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

  const onSubmit = values => {
    setLoading(true);
    const isUpdating =
      key > 0
        ? {
            query: conf.getByKey.query,
            variables: { [conf.keyName || 'id']: key || undefined },
          }
        : undefined;

    client
      .mutate({
        mutation: conf.post.query,
        variables: { ...values, [conf.keyName || 'id']: key || undefined },
        refetchQueries: [{ query: conf.getList.query }, isUpdating].filter(
          Boolean
        ),
      })
      .then(response => {
        console.log('onSubmitHook', response);
        setLoading(false);
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

  return { fields, onSubmit, loading, onValuesChanged };
}
