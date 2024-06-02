import { Graph } from "../genericgraph/Graph";
import { IGraphStorage } from "../genericgraph/GraphStorageInterfaces";
import { iterateGetLast } from "../iterable/FunctionalIterable";
import FullBFS from "./FullBFS";

export default function CountGraphComponents<S extends IGraphStorage>(graph: Graph<S>): number {
	const fullBfsResult = iterateGetLast(FullBFS(graph));

	if (!fullBfsResult)
		return 0;

	return fullBfsResult.graph.vertices.filter(v => !fullBfsResult.previous.has(v.identifier)).length;
}