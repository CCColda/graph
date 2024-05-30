import { useState } from "react";
import ReactiveGraphStorage, { ReactiveEdges, ReactiveVertices } from "./ReactiveGraphStorage";
import { GenericGraph, GenericGraphProperties } from "./GenericGraph";

const useReactiveGraphStorage = () => {
	const [vertices, setVertices] = useState<ReactiveVertices>([])
	const [edges, setEdges] = useState<ReactiveEdges>([]);
	const [props, setProps] = useState<GenericGraphProperties>(GenericGraph.SIMPLE_GRAPH);

	return new ReactiveGraphStorage(
		vertices, setVertices,
		edges, setEdges,
		props, setProps);
};

export default useReactiveGraphStorage;