export interface CorsRules {
  origin: string[];
  credentials?: boolean;
  headers?: string[];
  methods?: string[];
}

const DEFAULT_RULES: CorsRules = {
  origin: [],
  headers: ['Content-Type', 'Authorization'],
  methods: ['OPTIONS', 'GET', 'POST'],
  credentials: true
};

const DEFAULT_ORIGIN = 'https://library-front.vercel.app';

export const defineCORSHeaders = (origin = '', rules = DEFAULT_RULES): Record<string, string> => {
  let headers = {};

  rules = Object.assign({}, DEFAULT_RULES, rules);

  if (origin) {
    const whitelistedOrigin = rules.origin.find(
      (whitelistedOrigin) =>
        whitelistedOrigin.includes(origin) || origin.includes(whitelistedOrigin)
    );

    headers = {
      'Access-Control-Allow-Origin': whitelistedOrigin ? origin : DEFAULT_ORIGIN,
      'Access-Control-Allow-Credentials': Boolean(rules.credentials),
      'Access-Control-Allow-Headers': rules.headers.join(','),
      'Access-Control-Allow-Methods': rules.methods.join(',')
    };
  }

  return headers;
};
