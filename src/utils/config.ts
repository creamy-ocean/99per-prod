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
    projectId: required("VITE_APP_FIREBASE_PROJECT_ID"),
    storageBucket: required("VITE_APP_FIREBASE_STORAGE_BUCKET"),
  },
};
