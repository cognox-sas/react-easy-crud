import React, { useMemo, useState, useEffect, useContext } from 'react';
import { Icon } from 'antd';
import { ReactEasyCrudContext } from '../Context';
import { sortNumber, sortString, sortBool } from './sorters';
import SearchTableFilter from './components/SearchTableFilter';
import DateTableFilter from './components/DateTableFilter';
import * as requests from './request';

const typeSorter = {
  string: sortString,
  number: sortNumber,
  bool: sortBool,
};

const resolveRender = field => {
  if ((field.type === 'radio' || field.type === 'select') && !field.render) {
    field.render = (text, record) =>
      field.columnKey ? record[field.columnKey] : field.options[text] || text;
  } else if (field.type === 'bool' && !field.render) {
    field.render = (text, record) =>
      record[field.key] ? field.options.true : field.options.false;
  } else {
    field.render = field.columnKey
      ? (text, record) => record[field.columnKey] || text
      : field.render;
  }
  return field.render;
};

const FilterIcon = filtered => (
  <Icon
    type="search"
    style={{
      color: filtered ? 'white' : 'black',
      background: filtered ? '#1890ff' : undefined,
    }}
  />
);

const resolveValueFor = (field, record, defaultValue = '') =>
  typeof field.getValue === 'function'
    ? field.getValue(record) || defaultValue
    : record[field.columnKey || field.key] || defaultValue;

const resolveFilter = (field, translation) => {
  if (field.filter === true) {
    switch (field.filterType || field.type) {
      case 'date':
      case 'number':
      case 'select':
      case 'textarea':
      case 'string': {
        return {
          filterDropdown: function FilterDrop(props) {
            return field.type === 'date' ? (
              <DateTableFilter {...props} translation={translation} />
            ) : (
              <SearchTableFilter {...props} translation={translation} />
            );
          },
          filterIcon: FilterIcon,
          onFilter: (value, record) => {
            const valueForFilter = resolveValueFor(field, record);
            return valueForFilter
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase());
          },
        };
      }
      case 'checkbox':
      case 'radio': {
        const keysOptions = Object.keys(field.options);
        return {
          filters: keysOptions.map(value => ({
            value,
            text: field.options[value],
          })),
          filterMultiple: keysOptions.length > 2,
          onFilter: (value, record) =>
            resolveValueFor(field, record).indexOf(value) === 0,
        };
      }
      case 'bool': {
        const keysOptions = Object.keys(field.options);
        return {
          filters: keysOptions.map(value => ({
            value,
            text: field.options[value],
          })),
          filterMultiple: false,
          onFilter: (value, record) =>
            resolveValueFor(field, record, false).toString() === value,
        };
      }
      default: {
        return {};
      }
    }
  }
  return undefined;
};

export const fieldsToColumns = (fields, translation) =>
  fields
    .filter(
      field =>
        !(
          Object.hasOwnProperty.call(field, 'hidden') &&
          field.hidden.includes('column')
        )
    )
    .map(field => ({
      title: field.title || '',
      key: field.key,
      dataIndex: field.key,
      sorter:
        field.sorter !== true
          ? false
          : typeSorter[field.type]
          ? typeSorter[field.type](field.key, field.getValue)
          : typeSorter.string(field.key, field.getValue),
      render: resolveRender(field),
      ...(field.columnStyle || {}),
      ...(resolveFilter(field, translation) || {}),
    }));

export default function useCrudList(conf, translation) {
  const { client, type } = useContext(ReactEasyCrudContext);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const columns = useMemo(() => fieldsToColumns(conf.fields, translation), [
    conf.fields,
    translation,
  ]);

  useEffect(() => {
    setLoading(true);
    const subscribed =
      type === 'graphql'
        ? client.watchQuery({ query: conf.getList.query }).subscribe({
            next({ data }) {
              setDataSource(data[conf.getList.accessData] || []);
            },
          })
        : { _cleanup: () => {} };

    requests[type]
      .getList(
        client,
        conf.getList.query || conf.getList.url,
        conf.getList.accessData || null
      )
      .then(response => {
        setLoading(false);
        setDataSource(response);
      })
      .catch(e => {
        setLoading(false);
        console.log(e);
      });

    return () => subscribed._cleanup && subscribed._cleanup();
  }, [client, conf.getList, type]);

  const onDelete = (key, callback = () => {}) => {
    setLoading(true);
    const queries = [{ query: conf.getList.query || null }];
    if (conf.getQueriesUpdate && conf.getQueriesUpdate.length > 0) {
      conf.getQueriesUpdate.forEach(item =>
        queries.push({
          query: item.query || null,
        })
      );
    }
    requests[type]
      .delete(
        client,
        conf.delete.query || conf.delete.url.replace('{keyName}', key || ''),
        conf.delete.accessData || null,
        { [conf.keyName || 'id']: key },
        {
          refetchQueries: queries,
          method: conf.delete.method || undefined,
        }
      )
      .then(response => {
        if (response) {
          console.log('ok');
        }
        setLoading(false);
        // Only Rest because GraphQl controller this with refetchQueries
        if (type === 'rest') {
          setDataSource(dataSource.filter(d => d[conf.keyName] !== key));
        }
        callback(response);
      })
      .catch(e => {
        setLoading(false);
        console.log(e);
      });
  };

  return { columns, dataSource, onDelete, loading };
}
