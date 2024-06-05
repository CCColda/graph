import Page from "@/components/Page";
import { Graph } from "@/logic/genericgraph/Graph";
import Edge from "@/logic/graph/Edge";
import Vertex from "@/logic/graph/Vertex";
import LocalGraphStorage from "@/logic/graphstorage/LocalGraphStorage";

export default function Example6() {
	const localGraph = new Graph(new LocalGraphStorage());

	for (let i = 10; i <= 49; i++) {
		localGraph.addVertex(new Vertex(`${i}`));
	}

	for (let i = 10; i <= 49; i++) {
		const vtx1 = localGraph.getVertexByID(`${i}`)!;

		for (let j = 10; j <= 49; j++) {
			if (!Array.from(i.toString(10)).some(v => j.toString(10).includes(v))) {
				const vtx2 = localGraph.getVertexByID(`${j}`)!

				try {
					localGraph.addEdge(new Edge(vtx1, vtx2))
				}
				catch { }
			}
		}
	}

	return <Page startingGraph={localGraph} />
}