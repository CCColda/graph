import { iterateFindFirst, iterateMap, iterateReduce } from "./FunctionalIterable";

export type GraphVertexID = string;
export type GraphEdgeID = string;

export interface GraphVertex {
	toString(): string;
	get identifier(): GraphVertexID;
	get weight(): number;

	get chroma(): number;
	set chroma(chroma: number);
}

export interface GraphEdge<V> {
	toString(): string;

	get identifier(): GraphEdgeID;
	get weight(): number;
	get vertices(): [V, V];
	get flipped(): GraphEdge<V>;

	get flow_capacity(): number;

	get flow(): number;
	set flow(flow: number);

	get chroma(): number;
	set chroma(chroma: number);
}

export type GraphProperties = {
	directed: boolean;
	allowMultipleEdges: boolean;
	allowLoops: boolean;
}

export class Graph<V extends GraphVertex> {
	public vertices = new Set<V>();
	public edges = new Map<GraphVertexID, GraphEdge<V>[]>();
	public props: GraphProperties;

	public static SIMPLE_GRAPH: GraphProperties = {
		allowLoops: false,
		allowMultipleEdges: false,
		directed: false
	}

	constructor(props: GraphProperties = Graph.SIMPLE_GRAPH) {
		this.props = { ...props };
	}

	get numVertices() { return this.vertices.size; }
	get numEdges() {
		return iterateReduce(
			iterateMap(this.edges.values(), v => v.length),
			(a, b) => a + b,
			0
		);
	}

	addVertex(vtx: V) {
		if (!this.vertices.has(vtx)) {
			this.vertices.add(vtx);
			this.edges.set(vtx.identifier, []);
		}
	}

	addEdge(edge: GraphEdge<V>) {
		const [vtx1, vtx2] = edge.vertices;
		if (this.vertices.has(vtx1) && this.vertices.has(vtx2)) {
			this.edges.get(vtx1.identifier)!.push(edge);

			if (!this.props.directed) {
				this.edges.get(vtx2.identifier)!.push(edge.flipped);
			}
		}
	}

	hasDirectedEdge(edge: GraphEdge<V>) {
		const [vtx1, vtx2] = edge.vertices;
		if (this.vertices.has(vtx1) && this.vertices.has(vtx2)) {
			return this.edges.get(vtx1.identifier)?.some(v => v.identifier == edge.identifier);
		}

		return false;
	}

	hasEdge(edge: GraphEdge<V>) {
		return this.props.directed ? this.hasDirectedEdge(edge) : this.hasDirectedEdge(edge) || this.hasDirectedEdge(edge.flipped);
	}

	getVertexByIdentifier(id: GraphVertexID) {
		return iterateFindFirst(this.vertices.values(), v => v.identifier == id);
	}

};