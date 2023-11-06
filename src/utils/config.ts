function required(key: string, defaultValue = undefined) {
  const value = import.meta.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`${key}가 정의되지 않았습니다`);
  }
  return value;
}

export const config = {
  firebase: {
    apiKey: required("VITE_APP_FIREBASE_API_KEY"),
    authDomain: required("VITE_APP_FIREBASE_AUTH_DOMAIN"),
    databaseURL: required("VITE_APP_FIREBASE_DATABASE_URL"),
    projectId: required("VITE_APP_FIREBASE_PROJECT_ID"),
  },
};
