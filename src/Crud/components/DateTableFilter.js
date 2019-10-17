import React from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col, DatePicker } from 'antd';

const SearchTableFilter = ({
  selectedKeys,
  setSelectedKeys,
  confirm,
  clearFilters,
  translation,
}) => (
  <Row gutter={8} className="custom-search-filter">
    <Col span={24} style={{ paddingBottom: 8 }}>
      <DatePicker.RangePicker
        format="YYYY-MM-DD"
        value={selectedKeys}
        onChange={dates => setSelectedKeys(dates || [])}
        onOk={() => confirm()}
      />
    </Col>
    <Col span={12} className="custom-align-right">
      <Button htmlType="button" type="primary" ghost onClick={() => confirm()}>
        {translation ? translation('Ok') : 'Ok'}
      </Button>
    </Col>
    <Col span={12}>
      <Button htmlType="button" onClick={() => clearFilters()}>
        {translation ? translation('Reset') : 'Reset'}
      </Button>
    </Col>
  </Row>
);

SearchTableFilter.propTypes = {
  selectedKeys: PropTypes.array,
  setSelectedKeys: PropTypes.func,
  confirm: PropTypes.func,
  clearFilters: PropTypes.func,
  translation: PropTypes.func,
};

SearchTableFilter.defaultProps = {
  translation: t => t,
};

export default SearchTableFilter;
