import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  DB_HOST: string;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASS: string;

  @IsString()
  DB_NAME: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  // console.log('config', config);

  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  // console.log(validatedConfig);
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length) throw new Error(errors.toString());
  return validatedConfig;
}
