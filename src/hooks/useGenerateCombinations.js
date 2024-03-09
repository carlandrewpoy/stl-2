function swap(arr, i, j) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

function generatePermutations(arr, start, result) {
  if (start === arr.length - 1) {
    result.push(arr.join(""))
    return
  }

  for (let i = start; i < arr.length; i++) {
    swap(arr, start, i)
    generatePermutations(arr, start + 1, result)
    swap(arr, start, i)
  }
}

export default function generateCombinations(number) {
  const numString = number.toString()
  const digits = numString.split("")
  const uniqueCombinations = []

  generatePermutations(digits, 0, uniqueCombinations)

  // Filter out duplicates using a Set
  const combinationsSet = new Set(uniqueCombinations)
  const combinations = Array.from(combinationsSet)

  return combinations
}
