import Page from "@/components/Page";
import { Graph } from "@/logic/genericgraph/Graph";
import Edge from "@/logic/graph/Edge";
import Vertex from "@/logic/graph/Vertex";
import LocalGraphStorage from "@/logic/graphstorage/LocalGraphStorage";

export default function Example3() {
	const localGraph = new Graph(new LocalGraphStorage());

	const chessBoard = Array(5).fill(Array(3).fill(null));

	for (let x = 0; x < 5; x++) {
		for (let y = 0; y < 3; y++) {
			const vtx = new Vertex(`x${x}y${y}`);
			chessBoard[x][y] = vtx;
			localGraph.addVertex(vtx);
		}
	}

	const quarter = [[-1, -2], [-2, -1]] as [number, number][]
	const multipliers = [[1, 1], [-1, 1], [1, -1], [-1, -1]]
	const possibleSteps = Array<[number, number][]>(4)
		.fill(quarter)
		.flatMap((v, i) =>
			v.map(w => [
				w[0] * multipliers[i][0],
				w[1] * multipliers[i][1]
			] as [number, number]));

	for (let x = 0; x < 5; x++) {
		for (let y = 0; y < 3; y++) {
			for (const possibleStep of possibleSteps) {
				try {
					localGraph.addEdge(new Edge(
						localGraph.getVertexByID(`x${x}y${y}`)!,
						localGraph.getVertexByID(`x${x + possibleStep[0]}y${y + possibleStep[1]}`)!
					))
				}
				catch { }
			}
		}
	}

	return <Page startingGraph={localGraph} />
}