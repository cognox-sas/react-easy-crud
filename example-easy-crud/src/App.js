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
import countryConfig from './graphql/country';

const { Content } = Layout;

const Root = () => {
  const listProps = useCrudList(countryConfig);
  const formProps = useCrudForm(countryConfig);
  return (
    <Layout>
      <Content style={{ padding: 50 }}>
        <h1>GraphQl Testing</h1>
        <h2>Form</h2>
        <Form {...formProps} />
        <h2>List</h2>
        <List title="Countries" rowKey={countryConfig.keyName} {...listProps} />
      </Content>
    </Layout>
  );
};

function App() {
  return (
    <ProviderEasyCrud client={client}>
      <Root />
    </ProviderEasyCrud>
  );
}
export default App;
