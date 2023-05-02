import { Config } from './config.interface';

export const environment: Config = {
  production: true,
  apiEndpoints: {
    product: 'https://9msmg8kzl2.execute-api.eu-west-1.amazonaws.com/prod',
    order: 'https://sykd2fzv36.execute-api.eu-west-1.amazonaws.com/prod/',
    import: 'https://rfs2hfd6uj.execute-api.eu-west-1.amazonaws.com/prod',
    bff: 'https://.execute-api.eu-west-1.amazonaws.com/dev',
    cart: 'https://sykd2fzv36.execute-api.eu-west-1.amazonaws.com/prod/',
    auth: 'https://sykd2fzv36.execute-api.eu-west-1.amazonaws.com/prod/',
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
