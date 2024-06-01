import { GraphProperties } from "./GraphTypes";

export const SIMPLE_GRAPH: Readonly<GraphProperties> = Object.freeze({
	allowLoops: false,
	allowMultipleEdges: false,
	directed: false,
});