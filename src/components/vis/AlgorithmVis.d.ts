import LocalGraphStorage from "@/logic/graphstorage/LocalGraphStorage";
import { Graph } from "@/logic/genericgraph/Graph";
import { GetIterableReturnType, UseGraphAlgorithmResult } from "@/logic/algorithm/useGraphAlgorithm";
import { IGraphStorage } from "@/logic/genericgraph/GraphStorageInterfaces";
import ReactiveGraphStorage from "@/logic/graphstorage/ReactiveGraphStorage";

export type AlgorithmVisProps<
	Alg extends (...args: any[]) => IterableIterator<{ graph: Graph<LocalGraphStorage> }>
> = {
	algorithm: UseGraphAlgorithmResult<GetIterableReturnType<Alg>, ReactiveGraphStorage, Alg>
};