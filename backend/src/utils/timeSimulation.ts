let offsetMs = 0;

export const addOffset = (ms: number) => {
  offsetMs += ms;
};

export const getNow = () => new Date(Date.now() + offsetMs);

export const getOffsetHours = () => Math.round(offsetMs / 3600000);
