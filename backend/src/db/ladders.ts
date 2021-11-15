export type Ladder = {
  id: number;
  name: string;
  type: "image";
  created: Date;
  votes: number;
};

const ladders: Ladder[] = [];

export const listLadders = () =>
  ladders.sort((a, b) => b.votes - a.votes).slice(0, 10);

export const createLadder = (ladder: Ladder) => {
  ladders.push(ladder);
  return ladder;
};

export const getLadder = (id: number) =>
  ladders.find((ladder) => ladder.id === id);

export const getId = () =>
  ladders.reduce((maxId, ladder) => maxId > ladder.id ? maxId : ladder.id, 0) +
  1;
