
// Database configuration service - can be modified to change database settings

export interface DatabaseConfig {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  options: Record<string, any>;
}

export const databaseConfig: DatabaseConfig = {
  name: 'HCR', // Health Care RapidCare database name
  host: 'localhost',
  port: 27017,
  username: 'rapidcare_user',
  password: 'rapidcare_password',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin',
  }
};

// This configuration can be modified if database details change
export const getDatabaseUrl = (): string => {
  const { username, password, host, port, name } = databaseConfig;
  if (username && password) {
    return `mongodb://${username}:${password}@${host}:${port}/${name}`;
  }
  return `mongodb://${host}:${port}/${name}`;
};

export const getCollections = () => {
  return {
    admin: `${databaseConfig.name}.Admin`,
    doctor: `${databaseConfig.name}.Doctor`,
    hospital: `${databaseConfig.name}.Hospital`,
    user: `${databaseConfig.name}.Users`,
    otp: `${databaseConfig.name}.OTP`,
    consultation: `${databaseConfig.name}.Consultations`,
    admission: `${databaseConfig.name}.Admissions`,
  };
};
