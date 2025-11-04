import { randomFolderImage } from "../pages/dashboard/assets";

export function getRandomGif() {
  const min = 0;
  const max = randomFolderImage.length - 1;
  const index = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomFolderImage[index];
}
