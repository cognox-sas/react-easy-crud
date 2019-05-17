const graphqlRequests = {
  async getList(client, query, accessData) {
    const response = await client.query({ query });
    return response.data[accessData];
  },
  async getByKey(client, query, accessData, params) {
    const response = await client.query({
      query,
      variables: params,
    });
    return response.data[accessData];
  },
  async upsert(client, mutation, accessData, params, config) {
    const response = await client.mutate({
      mutation,
      variables: params,
      refetchQueries: config.refetchQueries,
    });
    return response[accessData];
  },
  async create(client, mutation, accessData, params, config) {
    const response = await client.mutate({
      mutation,
      variables: params,
      refetchQueries: config.refetchQueries,
    });
    return response[accessData];
  },
  async update(client, mutation, accessData, params, config) {
    const response = await client.mutate({
      mutation,
      variables: params,
      refetchQueries: config.refetchQueries,
    });
    return response[accessData];
  },
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
