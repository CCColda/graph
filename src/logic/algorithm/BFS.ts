import { Graph } from "../genericgraph/Graph";
import { IGraphStorage } from "../genericgraph/GraphStorageInterfaces";
import { GraphVertexID, IGraphVertex } from "../genericgraph/GraphTypes";
import Edge from "../graph/Edge";
import Vertex from "../graph/Vertex";
import LocalGraphStorage from "../graphstorage/LocalGraphStorage";

export type BFSResult = {
	distance: Map<GraphVertexID, number>;
	previous: Map<GraphVertexID, GraphVertexID>;
	graph: Graph<LocalGraphStorage>;
	full: boolean;
};

export default function* BFS<S extends IGraphStorage>(
	graph: Graph<S>, startingVertex: IGraphVertex): IterableIterator<BFSResult> {

	const result: BFSResult = {
		distance: new Map<GraphVertexID, number>(),
		previous: new Map<GraphVertexID, GraphVertexID>(),
		graph: new Graph(new LocalGraphStorage()),
		full: false
	};

	result.distance.set(startingVertex.identifier, 0);

	const activeVertices = [startingVertex];

	result.graph.addVertex(new Vertex(startingVertex.identifier, { color: "red" }));

	while (activeVertices.length != 0) {
		const activeVertex = activeVertices[0];
		const activeVertexDistance = result.distance.get(activeVertex.identifier) ?? 0;

		activeVertices.splice(0, 1);

		for (const outgoing of graph.getNeighbors(activeVertex.identifier)) {
			if (!result.distance.has(outgoing.identifier)) {
				activeVertices.push(outgoing);

				result.previous.set(outgoing.identifier, activeVertex.identifier);
				result.distance.set(outgoing.identifier, activeVertexDistance + 1);

				result.graph.addVertex(new Vertex(outgoing.identifier));

				result.graph.addEdge(new Edge(
					result.graph.getVertexByID(activeVertex.identifier)!,
					result.graph.getVertexByID(outgoing.identifier)!));

			}
		}

		yield result;
	}
	return;
}