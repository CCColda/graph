import { Graph } from "@/logic/genericgraph/GenericGraph";
import { IGraphVertex } from "@/logic/genericgraph/GraphTypes";
import ReactiveGraphStorage from "@/logic/graphstorage/ReactiveGraphStorage";
import { useMemo } from "react";

const GraphInfoDialog: React.FC<{ graph: Graph<ReactiveGraphStorage> }> = ({ graph }) => {
	const degrees = useMemo(() => graph.vertices
		.map(
			v => ({
				vtx: v,
				deg: graph.getOutgoingEdges(v.identifier).length
			})),
		[graph])

	const greatestDegree = useMemo(() =>
		(degrees as { vtx: IGraphVertex | null, deg: number }[])
			.reduce(
				(a, b) => a.deg > b.deg ? a : b, { vtx: null, deg: 0 }),
		[degrees]
	);

	const sumDegrees = useMemo(() =>
		degrees.map(v => v.deg)
			.reduce((a, b) => a + b, 0),
		[degrees]);

	return <div className="flex flex-col justify-start align-baseline">
		<table className="text-sm border border-black border-separate">
			<thead>
				<tr className="text-base font-semibold">
					<td>Property</td>
					<td>Value</td>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>|V(G)|</td>
					<td rowSpan={2}>{graph.numVertices}</td>
				</tr>
				<tr>
					<td>n</td>
				</tr>
				<tr>
					<td>|E(G)|</td>
					<td rowSpan={2}>{sumDegrees / 2}</td>
				</tr>
				<tr>
					<td>m</td>
				</tr>
				<tr>
					<td>Δ(G)</td>
					<td>{greatestDegree.vtx != null ? greatestDegree.deg : "*"}</td>
				</tr>
				<tr>
					<td>v: d(v) = Δ(G)</td>
					<td>{greatestDegree.vtx != null ? greatestDegree.vtx.toString() : "*"}</td>
				</tr>
				<tr>
					<td>|E⥋(G)|</td>
					<td>{graph.numEdges}</td>
				</tr>
				<tr>
					<td>∑ᵥ d(v)</td>
					<td>{sumDegrees}</td>
				</tr>
				<tr>
					<td>{`m ≤ n - 1 (may be acyclic)`}</td>
					<td>{sumDegrees / 2 <= graph.numVertices - 1 ? "true" : "false"}</td>
				</tr>
				<tr>
					<td>{`m ≥ n - 1 (may be proper)`}</td>
					<td>{sumDegrees / 2 >= graph.numVertices - 1 ? "true" : "false"}</td>
				</tr>
				<tr>
					<td>{`m = n - 1 (may be tree)`}</td>
					<td>{sumDegrees / 2 == graph.numVertices - 1 ? "true" : "false"}</td>
				</tr>
			</tbody>
		</table>
	</div>
};

export default GraphInfoDialog;