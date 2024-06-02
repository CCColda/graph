import { Graph } from "../genericgraph/Graph";
import { Graph as DOTGraph } from "dotparser"
import LocalGraphStorage from "../graphstorage/LocalGraphStorage";
import Edge from "../graph/Edge";
import Vertex from "../graph/Vertex";

export default function DecodeDOT(representation: DOTGraph[]): Graph<LocalGraphStorage> {
	const dotGraph = representation[0].children;
	const localGraph = new Graph(new LocalGraphStorage())

	for (const stmt of dotGraph) {
		if (stmt.type == "node_stmt") {
			localGraph.addVertex(new Vertex(`${stmt.node_id.id}`));
		}
		else if (stmt.type == "edge_stmt") {
			for (let i = 1; i < stmt.edge_list.length; i++) {
				localGraph.addEdge(new Edge(
					localGraph.getVertexByID(`${stmt.edge_list[i - 1].id}`)!,
					localGraph.getVertexByID(`${stmt.edge_list[i].id}`)!
				))
			}
		}
	}

	return localGraph;
}