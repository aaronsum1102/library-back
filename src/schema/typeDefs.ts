import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  type Product {
    id: Int
    name: String
    price: Int
  }

  type Query {
    products: [Product]
  }
`;

export default typeDefs;
