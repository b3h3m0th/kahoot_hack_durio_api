export const sleep: (time: number) => Promise<NodeJS.Timeout> = (
  time: number
) => new Promise((resolve) => setTimeout(resolve, time));
