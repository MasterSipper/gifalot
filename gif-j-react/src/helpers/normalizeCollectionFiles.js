const DEFAULT_SLIDE_DURATION = 5000;

export const normalizeCollectionFiles = (collection, files) => {
  const ranks = Array.isArray(collection?.ranks)
    ? collection.ranks.map((rank) => Number(rank)).filter(Boolean)
    : [];

  const fallbackDuration =
    collection?.timePerSlide && collection.timePerSlide > 0
      ? collection.timePerSlide
      : DEFAULT_SLIDE_DURATION;

  const withDefaults = (file) => ({
    ...file,
    timePerSlide: file.timePerSlide ?? fallbackDuration,
    transitionType: file.transitionType ?? collection?.transitionType,
  });

  if (ranks.length > 0) {
    const ranked = ranks.reduce((acc, id) => {
      const match = files.find((file) => file.id === id);
      if (match) {
        acc.push(withDefaults(match));
      }
      return acc;
    }, []);

    if (ranked.length >= files.length) {
      return ranked;
    }
  }

  return [...files]
    .sort((a, b) => a.id - b.id)
    .map((file) => withDefaults(file));
};









