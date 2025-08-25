// Utility functions for working with arrays

/**
 * Returns the first element of an array, or throws if the array is empty.
 */
export function first<T>(arr: T[]): T {
  if (arr.length === 0) throw new Error("Array is empty");
  return arr[0]!;
}

/**
 * Returns the element at the given index, or throws if out of bounds.
 */
export function atIndex<T>(arr: T[], index: number): T {
  if (index < 0 || index >= arr.length) throw new Error("Index out of bounds");
  return arr[index]!;
}
