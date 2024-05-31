import { iterateFindFirst, iterateMap, iterateReduce } from "../iterable/FunctionalIterable";
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

	get displayProps(): object
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

	get displayProps(): object
}

export type GenericGraphProperties = {
	directed: boolean;
	allowMultipleEdges: boolean;
	allowLoops: boolean;
}

export interface GenericGraphStorage {
	readonly vertices: Set<GenericGraphVertex>;
	readonly verticesAsList: GenericGraphVertex[];
	readonly edges: Map<GraphVertexID, GenericGraphEdge[]>;
	readonly edgesAsList: [GraphVertexID, GenericGraphEdge[]][]
	readonly props: GenericGraphProperties

	addVertex(vertex: GenericGraphVertex): void
	addEdge(edge: GenericGraphEdge): void
	setEmptyEdgesFor(vertex: GenericGraphVertex): void
	removeVertex(vertex: GenericGraphVertex): void
	removeEdge(edge: GenericGraphEdge): void

	migrateFrom(storage: GenericGraphStorage): void

	set(vertices: GenericGraphVertex[], edges: [GraphVertexID, GenericGraphEdge[]][]): void
	setProps(props: GenericGraphProperties): void
}

export class GenericGraph<S extends GenericGraphStorage> {
	public storage: S

	public static readonly SIMPLE_GRAPH: GenericGraphProperties = Object.freeze({
		allowLoops: false,
		allowMultipleEdges: false,
		directed: false,
	});

	constructor(storage: S) {
		this.storage = storage;
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

	get props() { return this.storage.props; }
	set props(props: GenericGraphProperties) { this.storage.setProps(props); }

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
			if (!this.props.allowLoops && vtx1.identifier == vtx2.identifier) {
				throw new GraphError(`Cannot add ${edge}; the graph does not allow loops.`);
			}

			this.storage.addEdge(edge)
			if (!this.props.directed) {
				this.storage.addEdge(edge.flipped);
			}
		}
		else {
			throw new GraphError(`Cannot add ${edge}; the graph doesn't have some of its points [${vtx1.identifier} or ${vtx2.identifier}]`);
		}
	}

	invert(edgeFactory: (vtx1: GenericGraphVertex, vtx2: GenericGraphVertex) => GenericGraphEdge) {
		const newEdgeList = this.storage.edgesAsList.map(([vtxID, e]) => {
			let edgeList: GenericGraphEdge[] = [];
			const vtx = this.getVertexByIdentifier(vtxID)!;

			for (const vertex of this.storage.verticesAsList) {
				if (vertex.identifier != vtxID && !e.some(v => v.vertices[1].identifier == vertex.identifier)) {
					edgeList.push(edgeFactory(vtx, vertex));
				}
			}

			return [vtxID, edgeList] as [GraphVertexID, GenericGraphEdge[]];
		});

		this.storage.set(
			this.storage.verticesAsList.map(v => v.deepCopy()),
			newEdgeList
		);
	}

	cloneFrom<S2 extends GenericGraphStorage>(graph: GenericGraph<S2>) {
		this.storage.migrateFrom(graph.storage);
	}

	mergeFromUnchecked<S2 extends GenericGraphStorage>(graph: GenericGraph<S2>) {
		this.storage.set(
			[...this.storage.verticesAsList, ...graph.storage.verticesAsList],
			[...this.storage.edgesAsList, ...graph.storage.edgesAsList]
		);
	}

	mergeFrom<S2 extends GenericGraphStorage>(graph: GenericGraph<S2>) {
		const newVertices = [
			...this.storage.verticesAsList.map(v => v.deepCopy()),
			...graph.storage.verticesAsList.filter(
				v => !this.storage.verticesAsList.some(
					w => w.identifier == v.identifier
				)
			)
		];

		const newEdges = [
			...this.storage.edgesAsList.map(([vtx, edges]) => [`${vtx}`, edges.map(w => w.deepCopy())]),
			...graph.storage.edgesAsList.filter(
				([graphVtx, graphVtxEdges]) => !this.getOutgoingEdges(graphVtx).some(
					v => graphVtxEdges.some(
						w => v.identifier == w.identifier ||
							v.vertices[0].identifier == w.vertices[0].identifier ||
							v.vertices[1].identifier == w.vertices[1].identifier))
			)
		] as [GraphVertexID, GenericGraphEdge[]][];

		this.storage.set(
			newVertices,
			newEdges
		);
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
		return iterateFindFirst(this.vertices.values(), v => v.identifier == id);
	}

	getEdgeByIdentifier(id: GraphEdgeID) {
		const iterable = this.edges.values();

		let result = iterable.next();

		while (!result.done) {
			const edge = result.value.find(v => v.identifier == id);

			if (edge != null)
				return edge;

			iterable.next();
		}

		return null;
	}

	getOutgoingEdges(id: GraphVertexID) {
		return this.edges.get(id) ?? [];
	}

	getNeighbors(id: GraphVertexID) {
		return this.getOutgoingEdges(id).map(v => v.vertices[1]);
	}
};