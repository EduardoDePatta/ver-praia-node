import { ExtraParamError } from "../../exceptions"

export function validateExtraParams<T>(param: T, keys: Array<keyof T>): void {
  const allowedKeys = new Set(keys)  

  for (const key in param) {
    if (!allowedKeys.has(key as keyof T)) {
      throw new ExtraParamError(String(key))
    }
  }
}
