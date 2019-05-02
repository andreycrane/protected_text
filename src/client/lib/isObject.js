// @flow

// eslint-disable-next-line flowtype/no-weak-types
export default function isObject(o: any): boolean %checks {
  return o === Object(o);
}
