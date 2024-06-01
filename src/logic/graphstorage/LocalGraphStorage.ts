import { SIMPLE_GRAPH } from "../genericgraph/GraphProperties";
import { IGraphStorage, GraphVertexList, GraphEdgeList, GraphEdgeSet, IBaseGraphStorage } from "../genericgraph/GraphStorageInterfaces";
import { IGraphVertex, IGraphEdge, GraphVertexID, GraphProperties } from "../genericgraph/GraphTypes";
import NotImplementedError from "../graph/NotImplementedError";
import ReadonlyGraphStorage from "./ReadonlyGraphStorage";

export default class LocalGraphStorage
	extends ReadonlyGraphStorage
	implements IGraphStorage {

	vertices: GraphVertexList = []
	edges: GraphEdgeList = []
	props = SIMPLE_GRAPH

	get verticesAsSet() { return new Set(this.vertices); }
	get edgesAsMap() { return new Map(this.edges); }

	constructor() {
		super()
	}

	addVertex(vertex: IGraphVertex): void {
		this.vertices.push(vertex)
	}

	addEdge(edge: IGraphEdge): void {
		this.edges.find(([vtxID]) => vtxID == edge.vertices[0].identifier)![1].push(edge)
	}

	setEmptyEdgesFor(vertex: IGraphVertex): void {
		const edgeSet: GraphEdgeSet | undefined = this.edges.find(([vtxID]) => vtxID == vertex.identifier);
		if (edgeSet != undefined) {
			edgeSet[1] = [];
		}
		else {
			this.edges.push([`${vertex.identifier}`, []]);
		}
	}

	removeEdge(edge: IGraphEdge): void {
		throw new NotImplementedError()
	}

	removeVertex(vertex: IGraphVertex): void {
		throw new NotImplementedError()
	}

	setVertices(vertices: GraphVertexList): void {
		this.vertices = vertices
	}

	setEdges(edges: GraphEdgeList): void {
		this.edges = edges
	}

	set(vertices: IGraphVertex[], edges: [GraphVertexID, IGraphEdge[]][]): void {
		this.setVertices(vertices)
		this.setEdges(edges)
	}

	setProps(props: GraphProperties): void {
		this.props = { ...props };
	}
}