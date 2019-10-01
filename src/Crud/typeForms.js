import React from 'react';
import {
  Input,
  InputNumber,
  Switch,
  Radio,
  DatePicker,
  Select,
  Button,
  Icon,
  Upload,
  Cascader,
} from 'antd';

import { RichText } from './components/types';

const getForm = (field, getFieldDecorator) => {
  const globalOptions = {
    initialValue: field.value || field.initialValue || undefined,
  };

  const filter = (inputValue, path) =>
    path.some(
      option => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
  switch (field.type) {
    case 'date': {
      return getFieldDecorator(field.key, {
        ...globalOptions,
        rules: field.rules,
      })(
        <DatePicker
          disabled={field.disabled || false}
          {...field.Context}
          {...field.props}
        />
      );
    }
    case 'number': {
      return getFieldDecorator(field.key, {
        ...globalOptions,
        rules: field.rules,
      })(<InputNumber disabled={field.disabled || false} {...field.props} />);
    }
    case 'bool': {
      return getFieldDecorator(field.key, {
        ...globalOptions,
        rules: field.rules,
        valuePropName: 'checked',
        initialValue: Object.hasOwnProperty.call(field, 'value')
          ? field.value
          : Object.hasOwnProperty.call(field, 'initialValue')
          ? field.initialValue
          : false,
      })(<Switch disabled={field.disabled || false} {...field.props} />);
    }
    case 'radio': {
      return getFieldDecorator(field.key, {
        ...globalOptions,
        rules: field.rules,
      })(
        <Radio.Group disabled={field.disabled || false} {...field.props}>
          {Object.keys(field.options).map(keyOption => (
            <Radio key={keyOption} value={keyOption}>
              {field.options[keyOption]}
            </Radio>
          ))}
        </Radio.Group>
      );
    }
    case 'select': {
      return getFieldDecorator(field.key, {
        ...globalOptions,
        rules: field.rules,
      })(
        <Select
          disabled={field.disabled || false}
          mode={field.mode || false}
          allowClear
          {...field.props}
        >
          {Object.keys(field.options).map(keyOption => (
            <Select.Option key={keyOption} value={keyOption}>
              {field.options[keyOption]}
            </Select.Option>
          ))}
        </Select>
      );
    }
    case 'password': {
      return getFieldDecorator(field.key, {
        ...globalOptions,
        rules: field.rules,
      })(
        <Input.Password disabled={field.disabled || false} {...field.props} />
      );
    }
    case 'textarea': {
      return getFieldDecorator(field.key, {
        ...globalOptions,
        rules: field.rules,
      })(
        <Input.TextArea disabled={field.disabled || false} {...field.props} />
      );
    }
    case 'rich': {
      return getFieldDecorator(field.key, {
        ...globalOptions,
        rules: field.rules,
      })(
        <RichText
          typeFormat={field.typeFormat}
          convertToRaw={field.convertToRaw}
          convertToDraft={field.convertToDraft}
        />
      );
    }
    case 'file': {
      return getFieldDecorator(field.key, {
        ...globalOptions,
        rules: field.rules,
      })(
        <Upload {...field.props}>
          {!field.props.multiple &&
          field.props.fileList &&
          field.props.fileList.length >= 1 ? null : (
            <Button>
              <Icon type="upload" /> {field.textUpload}
            </Button>
          )}
        </Upload>
      );
    }
    case 'cascader': {
      return getFieldDecorator(field.key, {
        ...globalOptions,
        rules: field.rules,
      })(
        <Cascader
          disabled={field.disabled || false}
          fieldNames={{ label: 'name', value: 'id', children: 'subcategories' }}
          options={Object.keys(field.options || {}).map(
            keyOption => field.options[keyOption]
          )}
          defaultValue={field.value}
          showSearch={{ filter }}
          placeholder={field.placeholder || ''}
        />
      );
    }
    default:
    case 'string': {
      return getFieldDecorator(field.key, {
        ...globalOptions,
        rules: field.rules,
      })(<Input disabled={field.disabled || false} {...field.props} />);
    }
  }
};

export default getForm;
