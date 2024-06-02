import { Graph } from "../genericgraph/Graph";
import { IGraphStorage } from "../genericgraph/GraphStorageInterfaces";
import { GraphVertexID, IGraphVertex } from "../genericgraph/GraphTypes";
import LocalGraphStorage from "../graphstorage/LocalGraphStorage";
import { hsv as convert_hsv, rgb as convert_rgb } from "color-convert"

export type GreedyVertexChromaResult = {
	graph: Graph<LocalGraphStorage>;
	chromaUsed: number;
	order: GraphVertexID[];
};

function fillVertexOrder<S extends IGraphStorage>(
	graph: Graph<S>,
	vertexOrder: IGraphVertex[]) {
	const outVertexOrder = [...vertexOrder.map(v => v.deepCopy())];

	for (let i = outVertexOrder.length; i < graph.storage.vertices.length; i++) {
		const unusedVertex = graph.storage.vertices.find(v => !outVertexOrder.some(w => v.identifier == w.identifier));

		if (unusedVertex == null)
			break;

		outVertexOrder.push(unusedVertex);
	}

	return outVertexOrder;
}

function fillVisualizationColor(
	result: GreedyVertexChromaResult
): void {
	const colors = Array(result.chromaUsed).fill("").map((_, i) => {
		return `rgb(${convert_hsv.rgb([Math.round(i / result.chromaUsed * 360), 100, 100]).join(",")}`
	});

	for (const vtx of result.graph.vertices) {
		if (vtx.chroma != 0) {
			vtx.displayProps = { color: colors[vtx.chroma - 1] }
		}
	}
}

export default function* GreedyVertexChroma<S extends IGraphStorage>(
	graph: Graph<S>,
	vertexOrder: IGraphVertex[] = []
): IterableIterator<GreedyVertexChromaResult> {
	const order = fillVertexOrder(graph, vertexOrder);

	const result = {
		graph: new Graph(new LocalGraphStorage()),
		chromaUsed: 1,
		order: order.map(vtx => vtx.identifier)
	};

	result.graph.cloneFrom(graph);

	const id = `${order[0].identifier}`;
	result.graph.getVertexByID(id)!.chroma = 1;

	for (let i = 1; i < order.length; i++) {
		const vertexID = `${order[i].identifier}`;
		const vertexInNewGraph = result.graph.getVertexByID(vertexID)!;

		let c = 1;
		let cFound = false;
		while (c <= result.chromaUsed) {
			const neighbors = result.graph.getNeighbors(vertexID);

			if (!neighbors.some(v => v.chroma == c)) {
				cFound = true;
				break;
			}

			c++;
		}

		if (!cFound) {
			result.chromaUsed++;
		}

		vertexInNewGraph.chroma = c;

		fillVisualizationColor(result);

		yield result;
	}
}
