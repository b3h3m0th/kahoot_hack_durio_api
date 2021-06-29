export const sleep: (time: number) => Promise<unknown> = (time: number) =>
  new Promise((resolve, reject) => setTimeout(resolve, time));
