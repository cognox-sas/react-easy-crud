import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form as FormAntd, Button, Row, Col } from 'antd';
import getForm from './typeForms';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
};

const Form = ({
  title,
  fields,
  onSubmit,
  loading,
  form,
  onCancel,
  translation,
}) => {
  const { getFieldDecorator } = form;

  const onSubmitForm = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        onSubmit(values);
      }
    });
  };

  return (
    <Fragment>
      {title}
      <FormAntd onSubmit={onSubmitForm} layout="horizontal">
        {fields.map(field => (
          <FormAntd.Item
            key={field.key}
            label={field.title}
            {...formItemLayout}
          >
            {getForm(field, getFieldDecorator)}
          </FormAntd.Item>
        ))}
        <Row gutter={8}>
          <Col
            sm={{ span: 3, offset: 3 }}
            xs={{ span: 24 }}
            className="custom-align-right"
          >
            <Button
              size="large"
              className="custom-full-width"
              onClick={onCancel}
            >
              {translation('Cancel')}
            </Button>
          </Col>
          <Col sm={{ span: 3 }} xs={{ span: 24 }}>
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              loading={loading}
              className="custom-full-width"
            >
              {translation('Save')}
            </Button>
          </Col>
        </Row>
      </FormAntd>
    </Fragment>
  );
};

Form.propTypes = {
  title: PropTypes.any,
  fields: PropTypes.array.isRequired,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  form: PropTypes.object,
  onCancel: PropTypes.func,
  translation: PropTypes.func,
};

Form.defaultProps = {
  loading: false,
  translation: t => t,
};

export default FormAntd.create({
  onValuesChange(props, changedValues, allValues) {
    props.onValuesChanged(props, changedValues, allValues);
  },
})(Form);
