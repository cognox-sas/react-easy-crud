import { gql } from 'apollo-boost';

const country = {
  keyName: 'id',
  getList: {
    accessData: 'faqs',
    query: gql`
      query Faqs {
        faqs {
          id
          question
          answer
        }
      }
    `,
  },
  getByKey: {
    accessData: 'faq',
    query: gql`
      query Faq($id: ID!) {
        faq(id: $id) {
          id
          question
          answer
        }
      }
    `,
  },
  upsert: {
    accessData: 'upsertFaq',
    query: gql`
      mutation UpsertFaq($id: ID, $question: String!, $answer: String!) {
        upsertFaq(id: $id, question: $question, answer: $answer) {
          message
          status
          result
        }
      }
    `,
  },
  delete: {
    accessData: 'deleteFaq',
    query: gql`
      mutation DeleteFaq($id: ID!) {
        deleteFaq(id: $id) {
          message
          status
          result
        }
      }
    `,
  },
  fields: [
    {
      title: 'Question',
      key: 'question',
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
      title: 'Answer',
      key: 'answer',
      sorter: true,
      filter: true,
      type: 'textarea',
      rules: [
        { required: true, message: 'Is required!' },
        { type: 'string', message: 'Should be string!' },
        { max: 300, message: 'Max 300 characters!' },
      ],
    },
  ],
};

export default country;
