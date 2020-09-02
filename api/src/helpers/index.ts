function epochSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

export default {
  epochSeconds,
};
