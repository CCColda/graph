import Edge from "./Edge";
import { GenericGraph, GenericGraphStorage, GenericGraphVertex, GraphVertexID } from "./GenericGraph";
import LocalGraphStorage from "./LocalGraphStorage";
import Vertex from "./Vertex";

type BFSResult = {
	distance: Map<GraphVertexID, number>;
	previous: Map<GraphVertexID, GraphVertexID>;
	graph: GenericGraph<LocalGraphStorage>;
};

export default function* BFS<S extends GenericGraphStorage>(
	graph: GenericGraph<S>, startingVertex: GenericGraphVertex): IterableIterator<BFSResult> {

	const result: BFSResult = {
		distance: new Map<GraphVertexID, number>(),
		previous: new Map<GraphVertexID, GraphVertexID>(),
		graph: new GenericGraph(new LocalGraphStorage())
	};

	result.distance.set(startingVertex.identifier, 0);

	const activeVertices = [startingVertex];

	result.graph.addVertex(new Vertex(startingVertex.identifier));

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
					result.graph.getVertexByIdentifier(activeVertex.identifier)!,
					result.graph.getVertexByIdentifier(outgoing.identifier)!));

			}
		}

		yield result;
	}

}