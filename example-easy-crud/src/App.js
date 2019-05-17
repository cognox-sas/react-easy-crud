import React, { useState } from 'react';
import { Layout } from 'antd';
import {
  ProviderEasyCrud,
  useCrudList,
  List,
  useCrudForm,
  Form,
} from 'react-easy-crud';
import client from './graphql/client';
import axiosClient from './rest/axiosIntance';
import countryConfig from './graphql/country';
import countryConfigRest from './rest/country';

const { Content } = Layout;

const RootGraphQL = () => {
  const [updatingKey, setUpdatingKey] = useState(null);
  const listProps = useCrudList(countryConfig);
  const formProps = useCrudForm(countryConfig, updatingKey);
  return (
    <Layout>
      <Content style={{ padding: 50 }}>
        <h1>With GraphQL</h1>
        <h2>Form</h2>
        <h2>
          Form{' '}
          {!(updatingKey === null || updatingKey === undefined)
            ? `Updating: ${updatingKey}`
            : 'New'}
        </h2>
        {(updatingKey !== null || updatingKey !== undefined) &&
        formProps.loading === true ? (
          'Loading...'
        ) : (
          <Form {...formProps} onCancel={() => setUpdatingKey(null)} />
        )}
        <h2>List</h2>
        <List
          title={<h3>Countries</h3>}
          rowKey={countryConfig.keyName}
          addActions={[
            {
              text: 'Edit',
              icon: 'edit',
              type: 'primary',
              onClick: record => setUpdatingKey(record[countryConfig.keyName]),
            },
            {
              text: 'Delete',
              icon: 'delete',
              type: 'danger',
              confirm: 'Are you sure?',
              onClick: record =>
                listProps.onDelete(record[countryConfig.keyName]),
            },
          ]}
          {...listProps}
        />
      </Content>
    </Layout>
  );
};

const RootRest = () => {
  const [updatingKey, setUpdatingKey] = useState(null);
  const listProps = useCrudList(countryConfigRest);
  const formProps = useCrudForm(countryConfigRest, updatingKey);
  return (
    <Layout>
      <Content style={{ padding: 50 }}>
        <h1>With Rest</h1>
        <h2>
          Form{' '}
          {!(updatingKey === null || updatingKey === undefined)
            ? `Updating: ${updatingKey}`
            : 'New'}
        </h2>
        {(updatingKey !== null || updatingKey !== undefined) &&
        formProps.loading === true ? (
          'Loading...'
        ) : (
          <Form {...formProps} onCancel={() => setUpdatingKey(null)} />
        )}
        <h2>List</h2>
        <List
          title={<h3>Countries</h3>}
          rowKey={countryConfigRest.keyName}
          addActions={[
            {
              text: 'Edit',
              icon: 'edit',
              type: 'primary',
              onClick: record =>
                setUpdatingKey(record[countryConfigRest.keyName]),
            },
            {
              text: 'Delete',
              icon: 'delete',
              type: 'danger',
              confirm: 'Are you sure?',
              onClick: record =>
                listProps.onDelete(record[countryConfigRest.keyName]),
            },
          ]}
          {...listProps}
        />
      </Content>
    </Layout>
  );
};

function App() {
  return (
    <>
      <ProviderEasyCrud type="graphql" client={client}>
        <RootGraphQL />
      </ProviderEasyCrud>
      <ProviderEasyCrud type="rest" client={axiosClient}>
        <RootRest />
      </ProviderEasyCrud>
    </>
  );
}
export default App;
