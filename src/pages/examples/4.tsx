import Page from "@/components/Page";
import { Graph } from "@/logic/genericgraph/Graph";
import Edge from "@/logic/graph/Edge";
import Vertex from "@/logic/graph/Vertex";
import LocalGraphStorage from "@/logic/graphstorage/LocalGraphStorage";

export default function Example4() {
	const localGraph = new Graph(new LocalGraphStorage());
	const exp = 5;
	const numVertices = Math.pow(2, exp) - 1;

	for (let i = 0; i < numVertices; i++) {
		localGraph.addVertex(new Vertex(`${i.toString(0b10)}`));
	}

	for (let i = 0; i < numVertices; i++) {
		const id1 = i.toString(0b10);
		const vtx1 = localGraph.getVertexByID(id1)!

		for (let j = 0; j < exp; j++) {
			const id2 = (i ^ (1 << j)).toString(0b10);

			const vtx2 = localGraph.getVertexByID(id2)!

			try {
				localGraph.addEdge(new Edge(vtx1, vtx2))
			} catch { }
		}
	}

	return <Page startingGraph={localGraph} />
}