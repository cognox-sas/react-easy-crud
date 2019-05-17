const country = {
  keyName: 'id',
  getList: {
    url: '/employees',
  },
  getByKey: {
    url: '/employee/{keyName}',
  },
  create: {
    url: '/create',
  },
  update: {
    url: '/update/{keyName}',
    method: 'put',
  },
  delete: {
    url: '/delete/{keyName}',
  },
  fields: [
    {
      title: 'Nombre',
      key: 'name',
      columnKey: 'employee_name',
      updateKey: 'employee_name',
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
      title: 'Salary',
      key: 'salary',
      columnKey: 'employee_salary',
      updateKey: 'employee_salary',
      sorter: true,
      filter: true,
      type: 'string',
      rules: [
        { required: true, message: 'Is required!' },
        { type: 'string', message: 'Should be string!' },
        { max: 3, message: 'Max 3 characters!' },
      ],
    },
    {
      title: 'Age',
      key: 'age',
      columnKey: 'employee_age',
      updateKey: 'employee_age',
      sorter: true,
      filter: true,
      type: 'number',
      rules: [{ required: true, message: 'Is required!' }],
    },
  ],
};

export default country;
