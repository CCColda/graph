import { GenericGraph, GenericGraphEdge, GenericGraphProperties, GenericGraphStorage, GenericGraphVertex, GraphVertexID } from "../genericgraph/GenericGraph";
import NotImplementedError from "../graph/NotImplementedError";

export default class LocalGraphStorage
	implements GenericGraphStorage {

	vertices = new Set<GenericGraphVertex>()
	edges = new Map<GraphVertexID, GenericGraphEdge[]>()
	props = GenericGraph.SIMPLE_GRAPH

	get edgesAsList(): [GraphVertexID, GenericGraphEdge[]][] {
		return Array.from(this.edges.entries());
	}

	get verticesAsList(): GenericGraphVertex[] {
		return Array.from(this.vertices.values())
	}

	addVertex(vertex: GenericGraphVertex): void {
		this.vertices.add(vertex)
	}

	addEdge(edge: GenericGraphEdge): void {
		this.edges.get(edge.vertices[0].identifier)!.push(edge)
	}

	removeEdge(edge: GenericGraphEdge): void {
		throw new NotImplementedError()
	}

	removeVertex(vertex: GenericGraphVertex): void {
		throw new NotImplementedError()
	}

	setEmptyEdgesFor(vertex: GenericGraphVertex): void {
		this.edges.set(vertex.identifier, []);
	}

	set(vertices: GenericGraphVertex[], edges: [GraphVertexID, GenericGraphEdge[]][]): void {
		this.vertices = new Set([...vertices.map(v => v.deepCopy())]);
		this.edges = new Map(edges.map(([id, v]) => ([`${id}`, v.map(w => w.deepCopy())])));
	}

	migrateFrom(storage: GenericGraphStorage): void {
		this.set(storage.verticesAsList, storage.edgesAsList)
	}

	setProps(props: GenericGraphProperties): void {
		this.props = { ...props };
	}
}