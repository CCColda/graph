import { useState } from "react";
import { Graph } from "../genericgraph/Graph";
import LocalGraphStorage from "../graphstorage/LocalGraphStorage";
import ReactiveGraphStorage from "../graphstorage/ReactiveGraphStorage";
import useReactiveGraphStorage from "../graphstorage/useReactiveGraphStorage";
import { IGraphStorage } from "../genericgraph/GraphStorageInterfaces";

type GetArgs<T> = T extends (...args: infer R) => any ? R : never;
export type GetIterableReturnType<T> = T extends (...args: any[]) => IterableIterator<infer R> ? R : never;

export type UseGraphAlgorithmResult<
	T extends { graph: Graph<LocalGraphStorage> },
	S extends IGraphStorage,
	Alg extends (...args: any[]) => IterableIterator<T>
> = {
	graph: Graph<S>;
	value: GetIterableReturnType<Alg> | null;
	done: boolean;
	run: (...args: GetArgs<Alg>) => void;
	step: () => void;
	stepToEnd: () => void;
	finish: () => void;
};

const useGraphAlgorithm = <
	T extends { graph: Graph<LocalGraphStorage> },
	S extends IGraphStorage,
	Alg extends (...args: any[]) => IterableIterator<T>
>(
	algorithm: Alg,
	outGraph: Graph<S>
): UseGraphAlgorithmResult<T, S, Alg> => {

	const [iterable, setIterable] = useState<IterableIterator<T> | null>(null)
	const [{ value, done }, setValueAndDone] = useState<{ value: GetIterableReturnType<Alg> | null, done: boolean }>(
		{
			value: null,
			done: true
		});

	return {
		graph: outGraph,
		done,
		value,
		run(...args: GetArgs<Alg>) {
			const localIterable = algorithm(...args)

			const next = localIterable.next();

			setIterable(localIterable)

			if (!next.done) {
				outGraph.cloneFrom(next.value.graph);
			}

			setValueAndDone(({ value: oldValue }) => ({
				value: (!next.done && !!next.value ? next.value : oldValue) as GetIterableReturnType<Alg> | null,
				done: !!next.done
			}))
		},
		step() {
			if (iterable != null && !done) {
				const next = iterable.next();

				if (!next.done) {
					outGraph.cloneFrom(next.value.graph);
				}

				setValueAndDone(({ value: oldValue }) => ({
					value: (!next.done && !!next.value ? next.value : oldValue) as GetIterableReturnType<Alg> | null,
					done: !!next.done
				}))

			}
		},
		stepToEnd() {
			if (iterable != null && !done) {
				let result = iterable.next();
				let prevValue: GetIterableReturnType<Alg> = value!;

				while (!result.done) {
					prevValue = result.value as GetIterableReturnType<Alg>;
					result = iterable.next()
				}

				outGraph.cloneFrom(prevValue.graph);

				setValueAndDone({
					value: prevValue,
					done: true
				})
			}
		},
		finish() {
			if (iterable != null && iterable.return != undefined) {
				iterable.return()
			}

			setIterable(null)
			outGraph.clear()

			setValueAndDone({
				value: null,
				done: true
			})
		}
	}
};

export default useGraphAlgorithm;