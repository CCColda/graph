import { BFSResult } from "@/graph/BFS";
import { GenericGraph, GenericGraphStorage } from "@/graph/GenericGraph";
import GraphVis from "./GraphVis";
import useReactiveGraphStorage from "@/graph/useReactiveGraphStorage";
import ReactiveGraphStorage from "@/graph/ReactiveGraphStorage";

export type BFSVisProps = {
	bfsResult: Omit<BFSResult, "graph">;
	graph: GenericGraph<ReactiveGraphStorage>;
	step: () => void;
	canStep: boolean;
}

const BFSVis: React.FC<BFSVisProps> = ({ bfsResult, graph, step, canStep }) => {
	return <div className="w-full h-full flex flex-col align-start justify-stretch">
		<GraphVis graph={graph} />
		<div className="flex flex-col align-start justify-stretch">
			<table>
				<tbody>
					<tr>
						<td>Vertices</td>
						{graph.storage.verticesAsList.map(v =>
							<td key={v.identifier}>{v.identifier}</td>
						)}
					</tr>
					<tr>
						<td>Distance</td>
						{graph.storage.verticesAsList.map(v =>
							<td key={v.identifier}>{bfsResult.distance.get(v.identifier) ?? "∞"}</td>
						)}
					</tr>
					<tr>
						<td>Previous</td>
						{graph.storage.verticesAsList.map(v =>
							<td key={v.identifier}>{bfsResult.previous.get(v.identifier) ?? "*"}</td>
						)}
					</tr>
				</tbody>
			</table>
			<div className="flex flex-row align-middle justify-center" hidden={!canStep}>
				<button onClick={_ => step()}>Step</button>
			</div>
		</div>
	</div>
};

export default BFSVis;