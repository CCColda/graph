import { useState } from "react";
import ReactiveGraphStorage, { ReactiveEdges, ReactiveVertices } from "./ReactiveGraphStorage";

const useReactiveGraphStorage = () => {
	const [vertices, setVertices] = useState<ReactiveVertices>([])
	const [edges, setEdges] = useState<ReactiveEdges>([]);

	return new ReactiveGraphStorage(vertices, setVertices, edges, setEdges);
};

export default useReactiveGraphStorage;