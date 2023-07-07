export type Slot = {
  id: string;
  opening: string;
  closing: string;
};

export type OpeningTime = {
  id: string;
  day: string;
  isClosed?: boolean;
  slots?: Slot[];
};
