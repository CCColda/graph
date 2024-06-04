import BFS, { BFSResult } from "@/logic/algorithm/BFS";
import GraphVis from "./GraphVis";
import ReactiveGraphStorage from "@/logic/graphstorage/ReactiveGraphStorage";
import { AlgorithmVisProps } from "./AlgorithmVis";
import { Graph } from "@/logic/genericgraph/Graph";
import { iterateMap, iterateReduce } from "@/logic/iterable/FunctionalIterable";

export type BFSVisProps = AlgorithmVisProps<typeof BFS<ReactiveGraphStorage>>

const BFSVis: React.FC<BFSVisProps> = ({ algorithm }) => {
	return <div className="w-full h-full flex flex-col align-start justify-stretch">
		<span className="text-xl text-center">BFS Algorithm {algorithm.value?.full ? "(full)" : ""}</span>
		<GraphVis graph={algorithm.graph} />
		<div className="flex flex-col align-start justify-stretch">
			<table>
				<tbody>
					<tr>
						<td>Vertices</td>
						{algorithm.graph.vertices.map(v =>
							<td key={v.identifier}>{v.identifier}</td>
						)}
					</tr>
					<tr>
						<td>Distance</td>
						{algorithm.graph.vertices.map(v =>
							<td key={v.identifier}>{algorithm.value?.distance.get(v.identifier) ?? "∞"}</td>
						)}
					</tr>
					<tr>
						<td>Previous</td>
						{algorithm.graph.vertices.map(v =>
							<td key={v.identifier}>{algorithm.value?.previous.get(v.identifier) ?? "*"}</td>
						)}
					</tr>
				</tbody>
			</table>
			<span>Longest path: {algorithm.value ? iterateReduce(algorithm.value.distance.values(), ((a, b) => a > b ? a : b), 0) : "?"}</span>
			<span>Components: {algorithm.value ? algorithm.graph.vertices.filter(v => !algorithm.value!.previous.has(v.identifier)).length : "?"}</span>
			<div className="flex flex-row align-middle justify-center">
				<button onClick={_ => algorithm.stepToEnd()} hidden={algorithm.done}>Step to end</button>
				<button onClick={_ => algorithm.step()} hidden={algorithm.done}>Step</button>
				<button onClick={_ => algorithm.finish()}>Close</button>
			</div>
		</div>
	</div>
};

export default BFSVis;