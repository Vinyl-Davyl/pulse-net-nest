export interface AppConfig {
  port: number;
  jwtSecret: string;
  jwtExpiresIn: string;
  databaseUrl: string;
  imagekitPrivateKey: string;
  imagekitPublicKey: string;
  imagekitUrl: string;
}

export default (): AppConfig => {
  const jwtSecret: string = process.env.JWT_SECRET ?? '';
  if (jwtSecret.length < 32) {
    throw new Error(
      'JWT_SECRET must be at least 32 characters. Copy .env.example to .env and set JWT_SECRET.',
    );
  }

  const databaseUrl: string = process.env.DATABASE_URL ?? '';
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is required. Copy .env.example to .env and set DATABASE_URL.',
    );
  }

  const imagekitPrivateKey: string = process.env.IMAGEKIT_PRIVATE_KEY ?? '';
  const imagekitPublicKey: string = process.env.IMAGEKIT_PUBLIC_KEY ?? '';
  const imagekitUrl: string = process.env.IMAGEKIT_URL ?? '';
  if (!imagekitPrivateKey || !imagekitPublicKey || !imagekitUrl) {
    throw new Error(
      'IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY, and IMAGEKIT_URL are required in .env',
    );
  }

  return {
    port: Number(process.env.PORT ?? 3010),
    jwtSecret,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '3600s',
    databaseUrl,
    imagekitPrivateKey,
    imagekitPublicKey,
    imagekitUrl,
  };
};
