export type Item = {
  ladder: number;
  id: number;
  value: string;
  rating: number;
};

const items: Item[] = [];

export const createItem = (item: Item) => {
  items.push(item);
  return item;
};

export const getItem = (id: number) => items.find((item) => item.id === id);

export const getRandomItem = (ladder: number) => {
  const pool = items.filter((i) => i.ladder === ladder);
  return pool[Math.floor(Math.random() * pool.length)];
};

export const deleteItem = (id: number) => {
  const idx = items.findIndex((item) => item.id === id);
  if (idx >= 0) items.splice(idx, 1);
};

export const getTop = (ladder: number, after: number, length: number) =>
  items.filter((i) => i.ladder === ladder).sort((a, b) => b.rating - a.rating)
    .slice(after, after + length);

export const getId = () =>
  items.reduce((maxId, ladder) => maxId > ladder.id ? maxId : ladder.id, 0) +
  1;
