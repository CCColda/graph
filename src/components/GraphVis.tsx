import { iterateMap } from "@/graph/FunctionalIterable";
import { GenericGraph, GenericGraphStorage, GenericGraphVertex } from "@/graph/GenericGraph";
import { useEffect, useMemo, useRef } from "react";

import { Network } from "vis-network";
import { DataSet } from "vis-data";

import styles from "@/components/GraphVis.module.css";

type GraphVisProps<S extends GenericGraphStorage> = {
	graph: GenericGraph<S>;
}

const GraphVis = <S extends GenericGraphStorage>(props: React.PropsWithChildren<GraphVisProps<S>>) => {
	const visNetworkNodes = useMemo(
		() => {
			return new DataSet(Array.from(
				iterateMap(
					props.graph.vertices.values(),
					v => ({ id: v.identifier, label: v.toString() })
				)
			));
		},
		[props.graph.vertices]
	);

	const visNetworkEdges = useMemo(
		() => {
			if (props.graph.props.directed) {
				return new DataSet(Array.from(
					iterateMap(
						props.graph.edges.entries(),
						v => Array.from(
							iterateMap(
								v[1].values(),
								w => ({
									id: w.identifier,
									from: w.vertices[0].identifier,
									to: w.vertices[1].identifier,
									arrows: { to: true }
								})
							)
						)
					)
				).flat());
			}
			else {
				const edges = Array.from(
					iterateMap(
						props.graph.edges.entries(),
						v => Array.from(
							iterateMap(
								v[1].values(),
								w => ({
									id: w.identifier,
									from: w.vertices[0].identifier,
									to: w.vertices[1].identifier,
									arrows: { to: true, from: true }
								})
							)
						)
					)
				).flat();

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
		[props.graph.vertices, props.graph.edges]
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
	}, [ref.current, visNetworkNodes, visNetworkEdges]);

	return <div ref={ref} className={styles.graphvis}>
	</div>;
};

export default GraphVis;