export function codeEval(code: string, scope: any) {
  const scopeKeys = Object.keys(scope);
  const scopeValues = Object.values(scope);

  const functionWithScope = new Function(...scopeKeys, code);

  const evaluatedFunction = functionWithScope(...scopeValues);

  return evaluatedFunction;
}
