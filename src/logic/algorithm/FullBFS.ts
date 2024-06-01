import { Graph } from "../genericgraph/GenericGraph";
import { IGraphStorage } from "../genericgraph/GraphStorageInterfaces";
import { GraphVertexID } from "../genericgraph/GraphTypes";
import LocalGraphStorage from "../graphstorage/LocalGraphStorage";
import { iterateForEach } from "../iterable/FunctionalIterable";
import BFS, { BFSResult } from "./BFS";

export default function* FullBFS<S extends IGraphStorage>(
	graph: Graph<S>
): IterableIterator<BFSResult> {
	const result: BFSResult = {
		distance: new Map<GraphVertexID, number>(),
		previous: new Map<GraphVertexID, GraphVertexID>(),
		graph: new Graph(new LocalGraphStorage())
	};

	const mergeMaps = <K, V>(to: Map<K, V>, from: Map<K, V>) =>
		iterateForEach(from.entries(), ([k, v]) => to.set(k, v));

	let undiscoveredPoint = graph.storage.vertices.find(v => !result.distance.has(v.identifier));

	while (undiscoveredPoint) {
		let iterable = BFS(graph, undiscoveredPoint)

		let bfsResult = iterable.next()
		while (!bfsResult.done) {
			mergeMaps(result.distance, bfsResult.value.distance);
			mergeMaps(result.previous, bfsResult.value.previous);
			result.graph.mergeFrom(bfsResult.value.graph);

			bfsResult = iterable.next();

			yield result;
		}

		undiscoveredPoint = graph.storage.vertices.find(v => !result.distance.has(v.identifier));
	}
}