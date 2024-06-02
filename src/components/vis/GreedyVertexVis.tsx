import GraphVis from "./GraphVis";
import ReactiveGraphStorage from "@/logic/graphstorage/ReactiveGraphStorage";
import GreedyVertexChroma from "@/logic/algorithm/GreedyVertexChroma";
import { AlgorithmVisProps } from "./AlgorithmVis";

export type GVCVisProps = AlgorithmVisProps<typeof GreedyVertexChroma<ReactiveGraphStorage>>;

const GVCVis: React.FC<GVCVisProps> = ({ algorithm }) => {
	return <div className="w-full h-full flex flex-col align-start justify-stretch">
		<span className="text-xl text-center">Greedy Vertex Chroma Algorithm</span>
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
						<td>Order</td>
						{algorithm.graph.vertices.map(v =>
							<td key={v.identifier}>{(algorithm.value?.order.findIndex(id => v.identifier == id) ?? -1) + 1}</td>
						)}
					</tr>
					<tr>
						<td>Chroma</td>
						{algorithm.graph.vertices.map(v =>
							<td key={v.identifier}>{v.chroma == 0 ? "*" : v.chroma}</td>
						)}
					</tr>
				</tbody>
			</table>
			<span className="text-center">Chroma total: χ(GVC) = {algorithm.value?.chromaUsed ?? "?"} {algorithm.done ? `⇒ χ ≤ ${algorithm.value?.chromaUsed ?? "?"}` : "(unfinished)"}</span>
			<div className="flex flex-row align-middle justify-center">
				<button onClick={_ => algorithm.step()} hidden={algorithm.done}>Step</button>
				<button onClick={_ => algorithm.finish()}>Close</button>
			</div>
		</div>
	</div>
};

export default GVCVis;