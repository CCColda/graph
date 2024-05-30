import { iterateMap } from "@/graph/FunctionalIterable";
import { GenericGraph, GenericGraphVertex } from "@/graph/GenericGraph";
import { useEffect, useMemo, useRef } from "react";

import { Network } from "vis-network";
import { DataSet } from "vis-data";

import styles from "@/components/GraphVis.module.css";

type GraphVisProps<V extends GenericGraphVertex> = {
	graph: GenericGraph<V>
}

const GraphVis = <V extends GenericGraphVertex>(props: React.PropsWithChildren<GraphVisProps<V>>) => {
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
			return new DataSet(Array.from(
				iterateMap(
					props.graph.edges.entries(),
					v => Array.from(
						iterateMap(
							v[1].values(),
							w => ({ id: w.identifier, from: w.vertices[0].identifier, to: w.vertices[1].identifier })
						)
					)
				)
			).flat());
		},
		[props.graph.vertices, props.graph.edges]
	);

	const options = {
		physics: {
			enabled: true
		}
	};

	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (ref.current) {
			const network = new Network(ref.current, { nodes: visNetworkNodes, edges: visNetworkEdges }, options)
			network.moveTo({ scale: 0.5 });
			return () => network.destroy();
		}
	}, [ref.current, visNetworkNodes, visNetworkEdges]);

	return <div ref={ref} className={styles.graphvis}>
	</div>;
};

export default GraphVis;