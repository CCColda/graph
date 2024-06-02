import BFS from "@/logic/algorithm/BFS";
import FullBFS from "@/logic/algorithm/FullBFS";
import GreedyVertexChroma from "@/logic/algorithm/GreedyVertexChroma";
import useGraphAlgorithm from "@/logic/algorithm/useGraphAlgorithm";
import { Graph } from "@/logic/genericgraph/GenericGraph";
import Edge from "@/logic/graph/Edge";
import LocalGraphStorage from "@/logic/graphstorage/LocalGraphStorage";
import ReactiveGraphStorage from "@/logic/graphstorage/ReactiveGraphStorage";
import useReactiveGraphStorage from "@/logic/graphstorage/useReactiveGraphStorage";
import { useState, useEffect } from "react";
import GraphGuard from "./GraphGuard";
import AddEdgeDialog, { EdgeSelection } from "./dialog/AddEdgeDialog";
import AddVertexDialog from "./dialog/AddVertexDialog";
import GraphInfoDialog from "./dialog/GraphInfoDialog";
import GraphPropDialog from "./dialog/GraphPropDialog";
import RunBFSDialog from "./dialog/RunBFSDialog";
import BFSVis from "./vis/BFSVis";
import GraphVis from "./vis/GraphVis";
import GVCVis from "./vis/GreedyVertexVis";
import { IGraphStorage } from "@/logic/genericgraph/GraphStorageInterfaces";

export type PageProps<S extends IGraphStorage> = {
	startingGraph: Graph<S>;
};

const Page = <S extends IGraphStorage>({ startingGraph }: PageProps<S>) => {
	const storage = useReactiveGraphStorage();
	const graph = new Graph(storage);

	const [edgeSelection, setEdgeSelection] = useState<EdgeSelection>(["null", "null"]);

	const bfsStorage = useReactiveGraphStorage();
	const bfsGraph = new Graph(bfsStorage);
	const bfsAlg = useGraphAlgorithm(BFS<ReactiveGraphStorage>, bfsGraph);

	const fullBfsStorage = useReactiveGraphStorage();
	const fullBfsGraph = new Graph(fullBfsStorage);
	const fullBfsAlg = useGraphAlgorithm(FullBFS<ReactiveGraphStorage>, fullBfsGraph);

	const gvcStorage = useReactiveGraphStorage();
	const gvcGraph = new Graph(gvcStorage);
	const gvcAlg = useGraphAlgorithm(GreedyVertexChroma<ReactiveGraphStorage>, gvcGraph);

	useEffect(() => {
		graph.cloneFrom(startingGraph);
	}, []);

	return (
		<main className="w-full h-full flex flex-row justify-start align-stretch">
			<div className="flex flex-col justify-center">
				<span className="text-center text-xl mb-5">Controls</span>
				<AddVertexDialog
					vertices={graph.storage.vertices}
					num_vertices={graph.numVertices}
					addVertex={v => graph.addVertex(v)} />
				<AddEdgeDialog
					vertices={graph.storage.vertices}
					selection={edgeSelection}
					setSelection={setEdgeSelection}
					addEdge={v => graph.addEdge(v)} />
				<RunBFSDialog
					vertices={graph.storage.vertices}
					runBfs={startingVertex => { bfsAlg.run(graph, startingVertex) }}
				/>
				<div className="flex flex-row justify-start">
					<button onClick={_ => { fullBfsAlg.run(graph) }}>Full BFS</button>
				</div>
				<div className="flex flex-row justify-start">
					<button onClick={_ => { gvcAlg.run(graph) }}>Greedy Vertex Chroma</button>
				</div>
				<div className="flex flex-row justify-start">
					<button onClick={_ => graph.invert((v1, v2) => new Edge(v1, v2))}>Invert</button>
				</div>
				<GraphPropDialog props={graph.props} setProps={new_props => graph.storage.setProps(new_props)} />
				<GraphInfoDialog graph={graph} />
			</div>
			<GraphVis graph={graph} />
			<GraphGuard graph={bfsGraph}>
				<BFSVis algorithm={bfsAlg} />
			</GraphGuard>
			<GraphGuard graph={fullBfsGraph}>
				<BFSVis algorithm={fullBfsAlg} />
			</GraphGuard>
			<GraphGuard graph={gvcGraph}>
				<GVCVis algorithm={gvcAlg} />
			</GraphGuard>
		</main >
	);
}

export default Page;