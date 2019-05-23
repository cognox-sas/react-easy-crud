const restRequests = {
  async getList(client, url) {
    const response = await client.get(url);
    return response.data;
  },
  async getByKey(client, url, accessData, params) {
    const response = await client.get(url, params);
    return response.data;
  },
  async upsert(client, url, accessData, params, config) {
    const response = await client[config.method || 'post'](url, params);
    return response.data;
  },
  async create(client, url, accessData, params, config) {
    const response = await client[config.method || 'post'](url, params);
    return response.data;
  },
  async update(client, url, accessData, params, config) {
    const response = await client[config.method || 'put'](url, params);
    return response.data;
  },
  async delete(client, url, accessData, params, config) {
    const response = await client[config.method || 'delete'](url, params);
    return response.data;
  },
  async getForField(client, url, accessData, params, config) {
    const method = config.method || 'get';
    const response = await client[method](
      url,
      method === 'get' ? { params } : params
    );
    return response.data;
  },
};

export default restRequests;
