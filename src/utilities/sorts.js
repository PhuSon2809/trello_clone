/**
 * Order an array of objects based on another array order
 * ---
 * if sort function
 * 1. return a value < 0
 *    -> a will come before b
 * 2. return a value > 0
 *    -> a will come after b
 * 3. return 0
 *    -> a and b will stay unchanged
 * ---
 * Function map là một function trả về 1 cái array
 */

export const mapOrder = (array, order, key) => {
  array.sort((a, b) => order.indexOf(a[key]) - order.indexOf(b[key]));
  return array;
};
