import { Graph } from "@/logic/genericgraph/GenericGraph";
import { IGraphStorage } from "@/logic/genericgraph/GraphStorageInterfaces";
import { useMemo, useRef, useEffect } from "react";

import { Network } from "vis-network";
import { DataSet } from "vis-data";

type GraphVisProps<S extends IGraphStorage> = {
	graph: Graph<S>;
}

const GraphVis = <S extends IGraphStorage>(props: React.PropsWithChildren<GraphVisProps<S>>) => {
	const visNetworkNodes = useMemo(
		() => {
			return new DataSet(
				props.graph.vertices.map(
					vtx => ({ id: vtx.identifier, label: vtx.toString(), ...vtx.displayProps })
				)
			);
		},
		[props.graph.vertices]
	);

	const visNetworkEdges = useMemo(
		() => {
			if (props.graph.props.directed) {
				return new DataSet(
					props.graph.edges.flatMap(
						([_, edges]) => edges.map(
							edge => ({
								id: edge.identifier,
								from: edge.vertices[0].identifier,
								to: edge.vertices[1].identifier,
								arrows: { to: true },
								...edge.displayProps
							})
						)
					)
				)
			}
			else {
				const edges = props.graph.edges.flatMap(
					([_, edges]) => edges.map(
						edge => ({
							id: edge.identifier,
							from: edge.vertices[0].identifier,
							to: edge.vertices[1].identifier
						})
					)
				)

				// ew
				let filteredEdges = edges;
				for (const edge of filteredEdges) {
					const twinIdx = filteredEdges.findIndex(v => v.from == edge.to && v.to == edge.from);
					if (twinIdx != -1) {
						filteredEdges.splice(twinIdx, 1);
					}
				}

				return new DataSet(filteredEdges);
			}
		},
		[props.graph.edges, props.graph.props.directed]
	);

	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (ref.current) {
			const network = new Network(ref.current, { nodes: visNetworkNodes, edges: visNetworkEdges }, {
				physics: {
					enabled: true
				},
				layout: {
					randomSeed: 1717089317933
				}
			})
			network.on("selectNode", (v) => {
				console.log(v);
			})
			network.moveTo({ scale: 0.5 });
			return () => network.destroy();
		}
	}, [ref, visNetworkNodes, visNetworkEdges]);

	return <div ref={ref} className="w-full h-full">
	</div>;
};

export default GraphVis;