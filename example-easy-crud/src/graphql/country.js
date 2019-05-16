import { gql } from 'apollo-boost';

const country = {
  keyName: 'code',
  getList: {
    accessData: 'countries',
    query: gql`
      query Countries {
        countries {
          code
          name
          currency
        }
      }
    `,
  },
  delete: {
    accessData: 'deleteCountry',
    query: gql`
      mutation DeleteCountry($id: ID!) {
        deleteCountry(id: $id) {
          code
          name
          currency
        }
      }
    `,
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
      title: 'Moneda',
      key: 'currency',
      sorter: true,
      filter: true,
      type: 'string',
      rules: [
        { required: true, message: 'Is required!' },
        { type: 'string', message: 'Should be string!' },
        { max: 100, message: 'Max 100 characters!' },
      ],
    },
  ],
};

export default country;
