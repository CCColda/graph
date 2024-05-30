import { iterateFindFirst, iterateMap, iterateReduce } from "./FunctionalIterable";

export type GraphVertexID = string;
export type GraphEdgeID = string;

export interface GenericGraphVertex {
	toString(): string;
	get identifier(): GraphVertexID;
	get weight(): number;

	get chroma(): number;
	set chroma(chroma: number);
}

export interface GenericGraphEdge<V> {
	toString(): string;

	get identifier(): GraphEdgeID;
	get weight(): number;
	get vertices(): [V, V];
	get flipped(): GenericGraphEdge<V>;

	get flow_capacity(): number;

	get flow(): number;
	set flow(flow: number);

	get chroma(): number;
	set chroma(chroma: number);
}

export type GenericGraphProperties = {
	directed: boolean;
	allowMultipleEdges: boolean;
	allowLoops: boolean;
}

export class GraphError extends Error {
	constructor(msg: string, cause?: any) {
		super(msg, { cause })
	}
};

export class GenericGraph<V extends GenericGraphVertex> {
	public vertices = new Set<V>();
	public edges = new Map<GraphVertexID, GenericGraphEdge<V>[]>();
	public readonly props: GenericGraphProperties;

	public static readonly SIMPLE_GRAPH: GenericGraphProperties = Object.freeze({
		allowLoops: false,
		allowMultipleEdges: false,
		directed: false,
	});

	constructor(props: GenericGraphProperties = GenericGraph.SIMPLE_GRAPH) {
		this.props = Object.freeze({ ...props });
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

	addEdge(edge: GenericGraphEdge<V>) {
		const [vtx1, vtx2] = edge.vertices;
		if (this.vertices.has(vtx1) && this.vertices.has(vtx2)) {
			if (!this.props.allowMultipleEdges) {
				if (this.props.directed && this.hasEdge(edge)) {
					throw new GraphError(`Cannot add ${edge}; the graph is directed and doesn't allow multiple edges.`);
				}
				else if (!this.props.directed && this.hasDirectedEdge(edge)) {
					throw new GraphError(`Cannot add ${edge}; the graph doesn't allow multiple edges.`);
				}
			}

			this.edges.get(vtx1.identifier)!.push(edge);
		}
		else {
			throw new GraphError(`Cannot add ${edge}; the graph doesn't have some of its points [${vtx1.identifier} or ${vtx2.identifier}]`);
		}
	}

	hasDirectedEdge(edge: GenericGraphEdge<V>) {
		const [vtx1, vtx2] = edge.vertices;
		if (this.vertices.has(vtx1) && this.vertices.has(vtx2)) {
			return this.edges.get(vtx1.identifier)?.some(v => v.identifier == edge.identifier);
		}

		return false;
	}

	hasEdge(edge: GenericGraphEdge<V>) {
		return this.props.directed ? this.hasDirectedEdge(edge) : this.hasDirectedEdge(edge) || this.hasDirectedEdge(edge.flipped);
	}

	getVertexByIdentifier(id: GraphVertexID) {
		return iterateFindFirst(this.vertices.values(), v => v.identifier == id);
	}
};