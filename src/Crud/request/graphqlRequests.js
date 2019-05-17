const graphqlRequests = {
  async getList(client, query, accessData) {
    const response = await client.query({ query });
    return response.data[accessData];
  },
  getByKey() {},
  post() {},
  async delete(client, mutation, accessData, params, config) {
    const response = await client.mutate({
      mutation,
      variables: params,
      refetchQueries: config.refetchQueries,
    });
    return response.data[accessData];
  },
};

export default graphqlRequests;
