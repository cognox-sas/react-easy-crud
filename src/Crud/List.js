import React, { Fragment } from 'react';
import { Table, Button, Row, Col, Tooltip, Popconfirm } from 'antd';
import PropTypes from 'prop-types';

const List = ({
  title,
  columns,
  dataSource,
  addButtons,
  addActions,
  translation,
  ...rest
}) => {
  const columnsWithMore = [...columns];
  if (addActions && addActions.length > 0) {
    columnsWithMore.push({
      title: translation('Actions'),
      key: '',
      align: 'right',
      width: 45 * ((addActions && addActions.length) || 0),
      render: (value, record) =>
        addActions &&
        addActions.map(action => (
          <Tooltip key={action.icon} title={action.text}>
            {' '}
            {action.confirm ? (
              <Popconfirm
                title={action.confirm}
                placement="bottomRight"
                onConfirm={() => action.onClick(record)}
              >
                <Button
                  type={action.type || 'ghost'}
                  shape="circle"
                  icon={action.icon}
                />
              </Popconfirm>
            ) : (
              <Button
                type={action.type || 'ghost'}
                shape="circle"
                icon={action.icon}
                onClick={() => action.onClick(record)}
              />
            )}
          </Tooltip>
        )),
    });
  }

  return (
    <Fragment>
      <Row type="flex" align="middle" justify="space-between">
        <Col>{title}</Col>
        <Col>
          {addButtons &&
            addButtons.map((buttonProps, index) => (
              <Fragment key={index}>
                <Button size="large" type="primary" {...buttonProps}>
                  {buttonProps.text}
                </Button>{' '}
              </Fragment>
            ))}
        </Col>
      </Row>
      <Table
        scroll={{ x: true }}
        columns={columnsWithMore}
        dataSource={dataSource}
        className="custom-table"
        {...rest}
      />
    </Fragment>
  );
};

List.propTypes = {
  title: PropTypes.any,
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array,
  addButtons: PropTypes.array,
  addActions: PropTypes.array,
  translation: PropTypes.func,
};

List.defaultProps = {
  dataSource: [],
  translation: t => t,
};

export default List;
