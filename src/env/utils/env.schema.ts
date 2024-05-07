import * as joi from 'joi';

export const ENV_VALIDATION_SCHEMA = joi.object({
  DB_USERNAME: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_HOST: joi.string().required(),
  DB_PORT: joi.number().required(),
  DB_DATABASE: joi.string().required(),
  DB_URL: joi.string().required(),
});
