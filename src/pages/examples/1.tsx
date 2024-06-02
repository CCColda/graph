import Page from "@/components/Page";
import { Graph } from "@/logic/genericgraph/Graph";
import Edge from "@/logic/graph/Edge";
import Vertex from "@/logic/graph/Vertex";
import LocalGraphStorage from "@/logic/graphstorage/LocalGraphStorage";

export default function Example1() {
	const localGraph = new Graph(new LocalGraphStorage());
	const numVertices = 20;

	for (let i = 1; i <= numVertices; i++) {
		localGraph.addVertex(new Vertex(`v${i}`));
	}

	for (let i = 1; i <= numVertices / 2; i++) {
		for (let j = i * 2; j <= numVertices; j++) {
			localGraph.addEdge(new Edge(
				localGraph.getVertexByID(`v${i}`)!,
				localGraph.getVertexByID(`v${j}`)!
			));
		}
	}

	return <Page startingGraph={localGraph} />
}