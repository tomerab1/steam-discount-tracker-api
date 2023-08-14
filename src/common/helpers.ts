export const objectAssignExact = (target: any, source: any) => {
  Object.getOwnPropertyNames(target).forEach((name) => {
    target[name] = source[name];
  });

  return target;
};

export const epochToSeconds = () => {
  return Math.floor(Date.now() / 1000);
};
