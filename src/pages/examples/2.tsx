import Page from "@/components/Page";
import { Graph } from "@/logic/genericgraph/Graph";
import Edge from "@/logic/graph/Edge";
import Vertex from "@/logic/graph/Vertex";
import LocalGraphStorage from "@/logic/graphstorage/LocalGraphStorage";
import parse from "dotparser";

const DOT = `
strict graph G {
    a
    b
    c
    d
    e
    f
    g
    h
    
    a -- c
    a -- d
    a -- f
    
    b -- e
    b -- g
    b -- h
    
    c -- f
    c -- e
    
    d -- e
    d -- f
    
    e -- g
    e -- h
    
    g -- h
}
`;

export default function Example1() {
	const localGraph = new Graph(new LocalGraphStorage());

	const dotGraph = parse(DOT)[0].children;

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

	return <Page startingGraph={localGraph} />
}