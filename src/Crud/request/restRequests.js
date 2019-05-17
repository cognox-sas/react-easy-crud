const restRequests = {
  async getList(client, url) {
    const response = await client.get(url);
    return response.data;
  },
  getByKey() {},
  post() {},
  async delete(client, url, accessData, params) {
    const response = await client.post(url, params);
    return response.data;
  },
};

export default restRequests;
