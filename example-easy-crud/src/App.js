import React from 'react';
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
  const listProps = useCrudList(countryConfig);
  const formProps = useCrudForm(countryConfig);
  return (
    <Layout>
      <Content style={{ padding: 50 }}>
        <h1>With GraphQL</h1>
        <h2>Form</h2>
        {/* <Form {...formProps} /> */}
        <h2>List</h2>
        <List
          title={<h3>Countries</h3>}
          rowKey={countryConfig.keyName}
          {...listProps}
        />
      </Content>
    </Layout>
  );
};

const RootRest = () => {
  const listProps = useCrudList(countryConfigRest);
  const formProps = useCrudForm(countryConfigRest);
  return (
    <Layout>
      <Content style={{ padding: 50 }}>
        <h1>With Rest</h1>
        <h2>Form</h2>
        {/* <Form {...formProps} /> */}
        <h2>List</h2>
        <List
          title={<h3>Countries</h3>}
          rowKey={countryConfigRest.keyName}
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
