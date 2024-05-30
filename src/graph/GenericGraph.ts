import { iterateFindFirst, iterateMap, iterateReduce } from "./FunctionalIterable";
import GraphError from "./GraphError";

export type GraphVertexID = string;
export type GraphEdgeID = string;

export interface GenericGraphVertex {
	toString(): string;

	deepCopy(): GenericGraphVertex

	get identifier(): GraphVertexID;
	get weight(): number;

	get chroma(): number;
	set chroma(chroma: number);
}

export interface GenericGraphEdge {
	toString(): string;

	deepCopy(): GenericGraphEdge

	get identifier(): GraphEdgeID;
	get weight(): number;
	get vertices(): [GenericGraphVertex, GenericGraphVertex];
	get flipped(): GenericGraphEdge;

	get flow_capacity(): number;

	get flow(): number;
	set flow(flow: number);

	get chroma(): number;
	set chroma(chroma: number);
}

export interface GenericGraphStorage {
	readonly vertices: Set<GenericGraphVertex>;
	readonly verticesAsList: GenericGraphVertex[];
	readonly edges: Map<GraphVertexID, GenericGraphEdge[]>;
	readonly edgesAsList: [GraphVertexID, GenericGraphEdge[]][]

	addVertex(vertex: GenericGraphVertex): void
	addEdge(edge: GenericGraphEdge): void
	setEmptyEdgesFor(vertex: GenericGraphVertex): void
	removeVertex(vertex: GenericGraphVertex): void
	removeEdge(edge: GenericGraphEdge): void

	migrateFrom(storage: GenericGraphStorage): void

	set(vertices: GenericGraphVertex[], edges: [GraphVertexID, GenericGraphEdge[]][]): void
}

export type GenericGraphProperties = {
	directed: boolean;
	allowMultipleEdges: boolean;
	allowLoops: boolean;
}

export class GenericGraph<S extends GenericGraphStorage> {
	public storage: S
	public readonly props: GenericGraphProperties;

	public static readonly SIMPLE_GRAPH: GenericGraphProperties = Object.freeze({
		allowLoops: false,
		allowMultipleEdges: false,
		directed: false,
	});

	constructor(storage: S, props: GenericGraphProperties = GenericGraph.SIMPLE_GRAPH) {
		this.storage = storage;
		this.props = Object.freeze({ ...props });
	}

	get edges() { return this.storage.edges; }
	get vertices() { return this.storage.vertices; }

	get numVertices() { return this.vertices.size; }
	get numEdges() {
		return iterateReduce(
			iterateMap(this.edges.values(), v => v.length),
			(a, b) => a + b,
			0
		);
	}

	addVertex(vtx: GenericGraphVertex) {
		if (!this.vertices.has(vtx)) {
			this.storage.addVertex(vtx);
			this.storage.setEmptyEdgesFor(vtx);
		}
	}

	addEdge(edge: GenericGraphEdge) {
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

			this.storage.addEdge(edge)
		}
		else {
			throw new GraphError(`Cannot add ${edge}; the graph doesn't have some of its points [${vtx1.identifier} or ${vtx2.identifier}]`);
		}
	}

	hasDirectedEdge(edge: GenericGraphEdge) {
		const [vtx1, vtx2] = edge.vertices;
		if (this.vertices.has(vtx1) && this.vertices.has(vtx2)) {
			return this.edges.get(vtx1.identifier)?.some(v => v.identifier == edge.identifier);
		}

		return false;
	}

	hasEdge(edge: GenericGraphEdge) {
		return this.props.directed ? this.hasDirectedEdge(edge) : this.hasDirectedEdge(edge) || this.hasDirectedEdge(edge.flipped);
	}

	getVertexByIdentifier(id: GraphVertexID) {
		console.log("Searching vertex by id: " + id);
		console.log(Array.from(this.storage.vertices.values()));
		return iterateFindFirst(this.vertices.values(), v => v.identifier == id);
	}
};