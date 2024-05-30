/**
 * @brief Gives the Promise + non-Promise variant of a function
 * @example MaybePromise<(x: number, y: string | number) => Date> =
 * 	((x: number, y: string | number) => Date) | ((x: number, y: string | number) => Promise<Date>)
 * @author COlda
 */
type MaybePromise<T extends (...args: any) => any> = T | (T extends (...args: infer A) => infer R ? (...args: A) => Promise<R> : never);