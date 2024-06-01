import { BFSResult } from "@/logic/algorithm/BFS";
import GraphVis from "./GraphVis";
import ReactiveGraphStorage from "@/logic/graphstorage/ReactiveGraphStorage";
import { AlgorithmVisProps } from "./AlgorithmVis";
import { Graph } from "@/logic/genericgraph/GenericGraph";

export type BFSVisProps = AlgorithmVisProps<{
	bfsResult: Omit<BFSResult, "graph"> | null;
	graph: Graph<ReactiveGraphStorage>;
}>

const BFSVis: React.FC<BFSVisProps> = ({ bfsResult, graph, close, step, canStep }) => {
	return <div className="w-full h-full flex flex-col align-start justify-stretch">
		<GraphVis graph={graph} />
		<div className="flex flex-col align-start justify-stretch">
			<table>
				<tbody>
					<tr>
						<td>Vertices</td>
						{graph.vertices.map(v =>
							<td key={v.identifier}>{v.identifier}</td>
						)}
					</tr>
					<tr>
						<td>Distance</td>
						{graph.vertices.map(v =>
							<td key={v.identifier}>{bfsResult?.distance.get(v.identifier) ?? "∞"}</td>
						)}
					</tr>
					<tr>
						<td>Previous</td>
						{graph.storage.vertices.map(v =>
							<td key={v.identifier}>{bfsResult?.previous.get(v.identifier) ?? "*"}</td>
						)}
					</tr>
				</tbody>
			</table>
			<div className="flex flex-row align-middle justify-center" hidden={!canStep}>
				<button onClick={_ => step()}>Step</button>
				<button onClick={_ => close()}>Close</button>
			</div>
		</div>
	</div>
};

export default BFSVis;