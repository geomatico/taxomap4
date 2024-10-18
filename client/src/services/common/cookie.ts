const get = (key: string): string | undefined => {
  const cookie = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith(`${key}=`))
    ?.split('=');
  return cookie && cookie.length === 2 ? decodeURIComponent(cookie[1]) : undefined;
};

const remove = (name: string): void => {
  document.cookie = `${name}=;max-age=0;samesite=strict;path=/;secure`;
};

const set = (key: string, value: string, expirationDate?: Date): void => {
  let cookie = encodeURIComponent(value);
  if (expirationDate !== undefined) {
    cookie += `;expires=${expirationDate.toUTCString()}`;
  }
  cookie += ';samesite=strict;path=/;secure';
  document.cookie = `${key}=${cookie}`;
};

export default {
  get,
  set,
  remove
};
