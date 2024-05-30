export function iterateHead<T>(
	iterable: IterableIterator<T>,
	n: number
): T[] {
	let index = 0;
	let result = iterable.next();
	let output: T[] = []

	while (!result.done && index < n) {
		output.push(result.value);

		index++;
		result = iterable.next()
	}

	return output;
}

export function* iterateMap<T, R>(
	iterable: IterableIterator<T>,
	transform: (value: T, index: number) => R
): IterableIterator<R> {
	let index = 0;
	let result = iterable.next();

	while (!result.done) {
		yield transform(result.value, index);

		index++;
		result = iterable.next();
	}
}

export function iterateReduce<T>(
	iterable: IterableIterator<T>,
	reducer: (previous: T, current: T, index: number) => T,
	first?: T
): T | null {
	let index = 0;
	let previous: T | null = null

	if (first == undefined) {
		let firstTwo = iterateHead(iterable, 2);

		if (firstTwo.length == 1) {
			return firstTwo[0];
		}
		else if (firstTwo.length == 0) {
			return null;
		}

		previous = reducer(firstTwo[0], firstTwo[1], 0);
		index += 2;
	}
	else {
		previous = first;
	}

	let result = iterable.next();

	while (!result.done) {
		previous = reducer(previous, result.value, index);
		index++;
		result = iterable.next();
	}

	return previous;
}

export function iterateFindFirst<T>(
	iterable: IterableIterator<T>,
	predicate: (v: T, idx: number) => boolean
): T | null {
	let result = iterable.next();
	let index = 0;

	while (!result.done) {
		if (predicate(result.value, index)) {
			return result.value;
		}

		index++;
		result = iterable.next();
	}

	return null;
}