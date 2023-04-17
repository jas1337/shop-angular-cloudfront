import { Config } from './config.interface';

export const environment: Config = {
  production: true,
  apiEndpoints: {
    product: 'https://9msmg8kzl2.execute-api.eu-west-1.amazonaws.com/prod',
    order: 'https://9ozte23at2.execute-api.eu-west-1.amazonaws.com/prod',
    import: 'https://rfs2hfd6uj.execute-api.eu-west-1.amazonaws.com/prod',
    bff: 'https://.execute-api.eu-west-1.amazonaws.com/dev',
    cart: 'https://9ozte23at2.execute-api.eu-west-1.amazonaws.com/prod',
    auth: 'https://9ozte23at2.execute-api.eu-west-1.amazonaws.com/prod',
  },
  apiEndpointsEnabled: {
    product: true,
    order: true,
    import: true,
    bff: false,
    cart: true,
    auth: true,
  },
};
