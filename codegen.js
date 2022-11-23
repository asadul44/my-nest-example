/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

// const {
//   HASURA_GRAPHQL_API_ENDPOINT: endpoint,
//   HASURA_GRAPHQL_ADMIN_SECRET: secret,
// } = process.env;

const COMMON_SCALAR_MAPPING = {
  uuid: 'string',
  date: 'string',
  jsonb: 'Record<string, any>',
  timestamptz: 'string',
  timestamp: 'string',
  citext: 'string',
  numeric: 'number',
};

const codeGenConfig = {
  generates: {
    'src/sdk/sdk.ts': {
      documents: ['src/**/*.service.ts'],
      schema: [
        {
          ['http://localhost:8080/v1/graphql']: {
            headers: {
              'x-hasura-admin-secret':
                'FD92hRPHYH7tw7RpCbl93TokRibBnDJOqI6smi5okVkWE7teUNzeh3OfoE9MI2cy',
            },
          },
        },
      ],
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
      config: {
        gqlImport: 'graphql-request#gql',
        avoidOptionals: {
          object: true,
          field: true,
          inputValue: false,
        },
        scalars: COMMON_SCALAR_MAPPING,
      },
    },
  },
};

module.exports = codeGenConfig;

// module.exports = {
//   schema: [
//     {
//       'http://localhost:8080/v1/graphql': {
//         headers: {
//           'x-hasura-admin-secret':
//             'FD92hRPHYH7tw7RpCbl93TokRibBnDJOqI6smi5okVkWE7teUNzeh3OfoE9MI2cy',
//         },
//       },
//     },
//   ],
//   documents: ['./src/**/*.tsx', './src/**/*.ts'],
//   overwrite: true,
//   generates: {
//     './src/generated/graphql.tsx': {
//       plugins: [
//         'typescript',
//         'typescript-operations',
//         'typescript-react-apollo',
//       ],
//       config: {
//         skipTypename: false,
//         withHooks: true,
//         withHOC: false,
//         withComponent: false,
//       },
//     },
//     './graphql.schema.json': {
//       plugins: ['introspection'],
//     },
//   },
// };
