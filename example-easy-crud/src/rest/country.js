const country = {
  keyName: 'numericCode',
  getList: {
    url: '/all',
  },
  delete: {
    url: '/delete',
  },
  fields: [
    {
      title: 'Nombre',
      key: 'name',
      sorter: true,
      filter: true,
      type: 'string',
      rules: [
        { required: true, message: 'Is required!' },
        { type: 'string', message: 'Should be string!' },
        { max: 100, message: 'Max 100 characters!' },
      ],
    },
    {
      title: 'COD Alpha',
      key: 'alpha3Code',
      sorter: true,
      filter: true,
      type: 'string',
      rules: [
        { required: true, message: 'Is required!' },
        { type: 'string', message: 'Should be string!' },
        { max: 3, message: 'Max 3 characters!' },
      ],
    },
  ],
};

export default country;
