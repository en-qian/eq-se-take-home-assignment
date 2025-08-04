export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      CHOKIDAR_USEPOLLING: boolean;
      GENERATE_SOURCEMAP: boolean;

      REACT_APP_ENV: string;

      REACT_APP_SECRET_KEY: string;
      REACT_APP_API_URL: string;

      REACT_APP_AES_KEY: string;
      REACT_APP_AES_IV: string;
    }
  }
}
