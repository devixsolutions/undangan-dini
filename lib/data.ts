import weddingData from '../data.json';

export type WeddingData = typeof weddingData;

export function getWeddingData(): WeddingData {
  return weddingData;
}

