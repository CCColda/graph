import Page from "@/components/Page";
import { Graph } from "@/logic/genericgraph/Graph";
import Edge from "@/logic/graph/Edge";
import Vertex from "@/logic/graph/Vertex";
import LocalGraphStorage from "@/logic/graphstorage/LocalGraphStorage";

export default function Example5() {
	const localGraph = new Graph(new LocalGraphStorage());

	for (let i = 1; i <= 100; i++) {
		localGraph.addVertex(new Vertex(`${i}`));
	}

	for (let i = 1; i <= 49; i++) {
		const vtx1 = localGraph.getVertexByID(`${i}`)!;

		for (let j = i * 2 + 1; j <= 100; j++) {
			const vtx2 = localGraph.getVertexByID(`${j}`)!

			localGraph.addEdge(new Edge(vtx1, vtx2))
		}
	}

	return <Page startingGraph={localGraph} />
}