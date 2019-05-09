// @flow
export const URL_REGEX = /^[a-zA-Z0-9_-]+$/;

export default function isValidUrl(url: string): boolean {
  if (typeof url !== 'string') {
    return false;
  }

  return URL_REGEX.test(url);
}
