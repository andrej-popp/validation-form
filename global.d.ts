type Optional<T> = T | null;

/**
 * for literal unions
 * @example Sub<'Y' | 'X', 'X'> // === 'Y'
 */
type Sub<O extends string, D extends string> = { [K in O]: (Record<D, never> & Record<string, K>)[K] }[O];

/**
 * Discard props from first type by keys in second type
 *
 * @example Omit<{a: number, b: string}, {a: number}> // === {b: string}
 */
type Discard<O, D> = Omit<O, keyof D>;

/**
 * Merge two types
 *
 * @example Merge<{a: number, b: string}, {b: number}> // === {a: number, b: number}
 */
type Merge<O, D> = Discard<O, D> & D;

/**
 * Select props from first type by keys in second type
 *
 * @example Merge<{a: number, b: string}, {b: number}> // === {b: string}
 */
type Intersect<O, D> = Discard<O, Discard<O, D>>;
