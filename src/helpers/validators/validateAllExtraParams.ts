import { ExtraParamError } from "../../exceptions";

export function validateAllExtraParams<T extends object>(param: T): void {
  const allowedKeys = new Set(Object.keys(param) as Array<keyof T>);

  for (const key in param) {
    if (!allowedKeys.has(key as keyof T)) {
      throw new ExtraParamError(String(key));
    }
  }
}
