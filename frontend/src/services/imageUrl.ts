function getImageURL(suit: string, rank: string) {
  return new URL(`../assets/images/cards/${suit}_${rank}.png`, import.meta.url)
    .href;
}

export { getImageURL };
