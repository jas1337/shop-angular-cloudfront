import { Config } from './config.interface';

export const environment: Config = {
  production: true,
  apiEndpoints: {
    product: 'https://9msmg8kzl2.execute-api.eu-west-1.amazonaws.com/prod',
    order: 'https://.execute-api.eu-west-1.amazonaws.com/dev',
    import: 'https://rfs2hfd6uj.execute-api.eu-west-1.amazonaws.com/prod',
    bff: 'https://.execute-api.eu-west-1.amazonaws.com/dev',
    cart: 'https://.execute-api.eu-west-1.amazonaws.com/dev',
  },
  apiEndpointsEnabled: {
    product: true,
    order: false,
    import: true,
    bff: false,
    cart: false,
  },
};
