const eraseFromArray = (array: number[], number) => {
  const indexToRemove = array.indexOf(number)
  if (indexToRemove !== -1) {
    array.splice(indexToRemove, 1)
  }
}

export default eraseFromArray
