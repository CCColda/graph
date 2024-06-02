import { HamiltonCircuitViaDirac, HamiltonCircuitViaOre, HamiltonResult, HamiltonViaDegreePermutation } from "@/logic/algorithm/Hamilton";
import IsGraphProper from "@/logic/algorithm/IsGraphProper";
import { Graph } from "@/logic/genericgraph/Graph";
import { GraphEdgeFactory, IGraphVertex } from "@/logic/genericgraph/GraphTypes";
import Edge from "@/logic/graph/Edge";
import ReactiveGraphStorage from "@/logic/graphstorage/ReactiveGraphStorage";
import { useEffect, useMemo, useState } from "react";

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

	const hasEulerCircuit = useMemo(() =>
		degrees.map(v => v.deg % 2).filter(v => v != 0).length == 0,
		[degrees]);

	const hasEulerWalk = useMemo(() =>
		hasEulerCircuit || degrees.map(v => v.deg % 2).filter(v => v == 1).length == 2,
		[degrees, hasEulerCircuit])

	const [isProper, setIsProper] = useState<boolean | null>(null);
	const [hamiltonDirac, setHamiltonDirac] = useState<boolean | null>(null);
	const [hamiltonOre, setHamiltonOre] = useState<boolean | null>(null);
	const [hamiltonPerm, setHamiltonPerm] = useState<HamiltonResult | null>(null);
	const hamilton = useMemo(
		() => hamiltonDirac || hamiltonOre ? "circuit" : (hamiltonPerm ?? "unknown"),
		[hamiltonDirac, hamiltonOre, hamiltonPerm]);

	const edgeFactory: GraphEdgeFactory = (v1, v2) => new Edge(v1, v2)

	const checkProper = () => {
		setIsProper(IsGraphProper(graph));
	}

	const checkHamiltonDirac = () => {
		setHamiltonDirac(HamiltonCircuitViaDirac(graph));
	}


	const checkHamiltonOre = () => {
		setHamiltonOre(HamiltonCircuitViaOre(graph, edgeFactory));
	}

	const checkHamiltonPerm = () => {
		setHamiltonPerm(HamiltonViaDegreePermutation(graph));
	}

	useEffect(() => {
		setIsProper(null)
		setHamiltonDirac(null)
		setHamiltonOre(null)
		setHamiltonPerm(null)
	}, [graph])

	return <div className="flex flex-col justify-start align-baseline overflow-y-auto overflow-x-hidden">
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
					<td>{sumDegrees / 2 <= graph.numVertices - 1 ? "yes" : "no"}</td>
				</tr>
				<tr>
					<td>{`m ≥ n - 1 (may be proper)`}</td>
					<td>{sumDegrees / 2 >= graph.numVertices - 1 ? "yes" : "no"}</td>
				</tr>
				<tr>
					<td>{`m = n - 1 (may be tree)`}</td>
					<td>{sumDegrees / 2 == graph.numVertices - 1 ? "yes" : "no"}</td>
				</tr>
				<tr>
					<td>Proper graph</td>
					<td>
						{
							isProper == null
								?
								<button onClick={_ => checkProper()}>Check</button>
								:
								<span>{isProper ? "yes" : "no"}</span>
						}
					</td>
				</tr>
				<tr>
					<td>Has Euler-walk (if proper)</td>
					<td>{hasEulerWalk ? "yes" : "no"}</td>
				</tr>
				<tr>
					<td>Has Euler-cycle (if proper)</td>
					<td>{hasEulerCircuit ? "yes" : "no"}</td>
				</tr>
				<tr>
					<td>Has Hamilton-path</td>
					<td>{hamilton}</td>
				</tr>
				<tr>
					<td>Has Hamilton-cycle (via Dirac)</td>
					<td>
						{
							hamiltonDirac == null
								?
								<button onClick={_ => checkHamiltonDirac()}>Check</button>
								:
								<span>{hamiltonDirac ? "yes" : "no"}</span>
						}
					</td>
				</tr>
				<tr>
					<td>Has Hamilton-cycle (via Ore)</td>
					<td>
						{
							hamiltonOre == null
								?
								<button onClick={_ => checkHamiltonOre()}>Check</button>
								:
								<span>{hamiltonOre ? "yes" : "no"}</span>
						}
					</td>
				</tr>
				<tr>
					<td>Has Hamilton (via Permutations)</td>
					<td>
						{
							hamiltonPerm == null
								?
								<button onClick={_ => checkHamiltonPerm()}>Check</button>
								:
								<span>{hamiltonPerm}</span>
						}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
};

export default GraphInfoDialog;