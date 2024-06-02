import { Graph } from "../genericgraph/Graph";
import { IGraphStorage } from "../genericgraph/GraphStorageInterfaces";
import { GraphEdgeFactory, GraphVertexID } from "../genericgraph/GraphTypes";
import LocalGraphStorage from "../graphstorage/LocalGraphStorage";
import CountGraphComponents from "./GraphComponents";

export type HamiltonResult = "cycle" | "path" | "unknown";

export function HamiltonCycleViaDirac<S extends IGraphStorage>(graph: Graph<S>) {
	const degrees = graph.edges.map(([_, edges]) => edges.length);

	if (degrees.map(v => v > graph.numVertices / 2).reduce((a, b) => a && b, true)) {
		return true;
	}

	return false;
}

export function HamiltonCycleViaOre<S extends IGraphStorage>(graph: Graph<S>, edgeFactory: GraphEdgeFactory) {
	const invertedGraph = new Graph(new LocalGraphStorage());

	invertedGraph.cloneFrom(graph);
	invertedGraph.invert(edgeFactory);

	for (const [_vtxID, edges] of graph.edges) {
		const baseVertexDegree = edges.length;

		for (const edge of edges) {
			const outVertexDegree = graph.getOutgoingEdges(edge.vertices[1].identifier).length;

			if (baseVertexDegree + outVertexDegree < graph.numVertices) {
				return false;
			}
		}
	}

	return true;
}

export function HamiltonViaSpecificPermutation<S extends IGraphStorage>(
	graph: Graph<S>,
	permutation: GraphVertexID[]
): HamiltonResult {
	const localGraph = new Graph(new LocalGraphStorage());

	localGraph.cloneFrom(graph)

	for (const vtxID of permutation) {
		localGraph.removeVertexByID(vtxID)
	}

	const numComponents = CountGraphComponents(localGraph);

	if (numComponents <= permutation.length)
		return "cycle"
	else if (numComponents <= permutation.length + 1)
		return "path"

	return "unknown"
}

export function HamiltonViaDegreePermutation<S extends IGraphStorage>(graph: Graph<S>): HamiltonResult {
	const verticesSortedByDegree = graph.edges.toSorted(([_vtx1, edges1], [_vtx2, edges2]) => edges1.length - edges2.length).map(v => v[0]);

	for (let i = 1; i < verticesSortedByDegree.length - 1; i++) {
		const hamiltonViaPermutation = HamiltonViaSpecificPermutation(graph, verticesSortedByDegree.slice(0, i))

		if (hamiltonViaPermutation != "unknown")
			return hamiltonViaPermutation;
	}

	return "unknown";
}

export default function Hamilton<S extends IGraphStorage>(graph: Graph<S>, edgeFactory: GraphEdgeFactory): HamiltonResult {
	if (HamiltonCycleViaDirac(graph)) {
		return "cycle";
	}

	if (HamiltonCycleViaOre(graph, edgeFactory)) {
		return "cycle";
	}

	return HamiltonViaDegreePermutation(graph);
}