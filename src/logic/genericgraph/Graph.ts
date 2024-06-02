import GraphError from "./GraphError";
import { GraphEdgeList, GraphEdgeSet, GraphVertexList, IGraphStorage } from "./GraphStorageInterfaces";
import { GraphProperties, IGraphVertex, IGraphEdge, GraphEdgeFactory, GraphVertexID, GraphEdgeID } from "./GraphTypes";

export class Graph<S extends IGraphStorage> {
	public storage: S

	constructor(storage: S) {
		this.storage = storage;
	}

	get edges() { return this.storage.edges; }
	get vertices() { return this.storage.vertices; }

	get numVertices() { return this.storage.vertices.length; }
	get numEdges() {
		return this.storage.edges.map(([_, edges]) => edges.length).reduce((a, b) => a + b, 0);
	}

	get props() { return this.storage.props; }
	set props(props: GraphProperties) { this.storage.setProps(props); }

	hasVertex(vtx: IGraphVertex) {
		return this.storage.getVertexByID(vtx.identifier) != null;
	}

	addVertex(vtx: IGraphVertex) {
		if (!this.hasVertex(vtx)) {
			this.storage.addVertex(vtx);
			this.storage.setEmptyEdgesFor(vtx);
		}
		else {
			throw new GraphError(`Cannot add ${vtx}: a vertex with this name already exists.`);
		}
	}

	addEdge(edge: IGraphEdge) {
		const [vtx1, vtx2] = edge.vertices;
		if (this.hasVertex(vtx1) && this.hasVertex(vtx2)) {
			if (!this.props.allowMultipleEdges) {
				if (this.props.directed && this.hasDirectedEdge(edge)) {
					throw new GraphError(`Cannot add ${edge}; the graph is directed and doesn't allow multiple edges.`);
				}
				else if (!this.props.directed && this.hasEdge(edge)) {
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

	removeVertexByID(vtx: GraphVertexID) {
		if (this.getVertexByID(vtx) != null)
			this.storage.removeVertexByID(vtx)
	}

	invert(edgeFactory: GraphEdgeFactory) {
		const newEdgeList = this.storage.edges.map(([vtxID, edges]) => {
			let edgeList: IGraphEdge[] = [];
			const vtx = this.getVertexByID(vtxID)!;

			for (const vertex of this.storage.vertices) {
				if (vertex.identifier != vtxID && !edges.some(({ vertices: [_, outVtx] }) => outVtx.identifier == vertex.identifier)) {
					edgeList.push(edgeFactory(vtx.deepCopy(), vertex.deepCopy()));
				}
			}

			return [`${vtxID}`, edgeList] as [GraphVertexID, IGraphEdge[]];
		});

		this.storage.set(
			this.storage.vertices.map(v => v.deepCopy()),
			newEdgeList
		);
	}

	private static deepCopyVertices(vertices: GraphVertexList) {
		return vertices.map(vtx => vtx.deepCopy());
	}

	private static deepCopyAndMatchEdges(vertices: GraphVertexList, edges: GraphEdgeList): GraphEdgeList {
		return edges.map(
			([vtxID, edges]) => [
				`${vtxID}`, edges.map(edge => {
					const deepCopiedEdge = edge.deepCopy()
					deepCopiedEdge.vertices[1] = vertices.find(vtx => vtx.identifier == edge.vertices[1].identifier)!
					return deepCopiedEdge
				})
			] as GraphEdgeSet
		)
	}

	clear() {
		this.storage.set([], []);
	}

	cloneFrom<S2 extends IGraphStorage>(graph: Graph<S2>) {
		const deepCopiedVertices = Graph.deepCopyVertices(graph.vertices);
		const deepCopiedMatchedEdges = Graph.deepCopyAndMatchEdges(deepCopiedVertices, graph.edges);

		this.storage.setVertices(deepCopiedVertices)
		this.storage.setEdges(deepCopiedMatchedEdges)
	}

	mergeFromUnchecked<S2 extends IGraphStorage>(graph: Graph<S2>) {
		const deepCopiedVertices = [...this.storage.vertices, ...Graph.deepCopyVertices(graph.storage.vertices)];
		const deepCopiedEdges = [...this.storage.edges, ...Graph.deepCopyAndMatchEdges(deepCopiedVertices, graph.storage.edges)];

		this.storage.setVertices(deepCopiedVertices);
		this.storage.setEdges(deepCopiedEdges);
	}

	mergeFrom<S2 extends IGraphStorage>(graph: Graph<S2>) {
		const newVertices = [
			...this.storage.vertices,
			...Graph.deepCopyVertices(graph.storage.vertices.filter(
				v => !this.storage.vertices.some(
					w => w.identifier == v.identifier
				)
			))
		];

		const newEdges = [
			...this.storage.edges,
			...Graph.deepCopyAndMatchEdges(
				newVertices,
				graph.storage.edges.filter(
					([graphVtx, graphVtxEdges]) => !this.getOutgoingEdges(graphVtx).some(
						v => graphVtxEdges.some(
							w => v.identifier == w.identifier ||
								v.vertices[0].identifier == w.vertices[0].identifier ||
								v.vertices[1].identifier == w.vertices[1].identifier))
				))
		];

		this.storage.set(
			newVertices,
			newEdges
		);
	}

	hasDirectedEdge(edge: IGraphEdge) {
		const [vtx1, vtx2] = edge.vertices;
		if (this.hasVertex(vtx1) && this.hasVertex(vtx2)) {
			return this.getOutgoingEdges(vtx1.identifier)?.some(e => e.vertices[1].identifier == vtx2.identifier) ?? false;
		}

		return false;
	}

	hasEdge(edge: IGraphEdge) {
		return this.props.directed ? this.hasDirectedEdge(edge) : (this.hasDirectedEdge(edge) || this.hasDirectedEdge(edge.flipped));
	}

	getVertexByID(id: GraphVertexID) {
		return this.storage.getVertexByID(id)
	}

	getEdgeByID(id: GraphEdgeID) {
		return this.storage.getEdgeByID(id)
	}

	getOutgoingEdges(id: GraphVertexID) {
		return this.storage.getOutgoingEdgesByID(id) ?? [];
	}

	getNeighbors(id: GraphVertexID) {
		return this.getOutgoingEdges(id).map(edge => edge.vertices[1]);
	}
};