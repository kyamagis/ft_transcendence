const calcMedian = (x: number) => {
  return Math.floor(x / 2) + (x % 2) - 1
}

export default calcMedian