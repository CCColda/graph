import GraphVis from "./GraphVis";
import ReactiveGraphStorage from "@/logic/graphstorage/ReactiveGraphStorage";
import { GreedyVertexChromaResult } from "@/logic/algorithm/GreedyVertexChroma";
import { Graph } from "@/logic/genericgraph/GenericGraph";
import { AlgorithmVisProps } from "./AlgorithmVis";

export type GVCVisProps = AlgorithmVisProps<{
	gvcResult: Omit<GreedyVertexChromaResult, "graph"> | null;
	graph: Graph<ReactiveGraphStorage>;
}>;

const GVCVis: React.FC<GVCVisProps> = ({ gvcResult, graph, close, step, canStep }) => {
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
						<td>Order</td>
						{graph.vertices.map(v =>
							<td key={v.identifier}>{(gvcResult?.order.findIndex(id => v.identifier == id) ?? -1) + 1}</td>
						)}
					</tr>
					<tr>
						<td>Chroma</td>
						{graph.vertices.map(v =>
							<td key={v.identifier}>{v.chroma == 0 ? "*" : v.chroma}</td>
						)}
					</tr>
				</tbody>
			</table>
			<span className="text-center">Chroma total: {gvcResult?.chromaUsed ?? "?"}</span>
			<div className="flex flex-row align-middle justify-center" hidden={!canStep}>
				<button onClick={_ => step()}>Step</button>
				<button onClick={_ => close()}>Close</button>
			</div>
		</div>
	</div>
};

export default GVCVis;