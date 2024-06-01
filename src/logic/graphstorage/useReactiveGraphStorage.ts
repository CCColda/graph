import { useState } from "react";
import { GraphProperties } from "../genericgraph/GraphTypes";
import ReactiveGraphStorage from "./ReactiveGraphStorage";
import { GraphEdgeList, GraphVertexList } from "../genericgraph/GraphStorageInterfaces";
import { SIMPLE_GRAPH } from "../genericgraph/GraphProperties";

const useReactiveGraphStorage = () => {
	const [vertices, setVertices] = useState<GraphVertexList>([])
	const [edges, setEdges] = useState<GraphEdgeList>([]);
	const [props, setProps] = useState<GraphProperties>(SIMPLE_GRAPH);

	return new ReactiveGraphStorage(
		vertices, setVertices,
		edges, setEdges,
		props, setProps);
};

export default useReactiveGraphStorage;