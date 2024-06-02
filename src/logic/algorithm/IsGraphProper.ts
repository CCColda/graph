import { Graph } from "../genericgraph/Graph";
import { IGraphStorage } from "../genericgraph/GraphStorageInterfaces";
import { iterateGetLast } from "../iterable/FunctionalIterable";
import BFS from "./BFS";

export default function IsGraphProper<S extends IGraphStorage>(graph: Graph<S>) {
	const bfsFinalResult = iterateGetLast(BFS(graph, graph.vertices[0]))

	return bfsFinalResult?.graph.numVertices == graph.numVertices;
}