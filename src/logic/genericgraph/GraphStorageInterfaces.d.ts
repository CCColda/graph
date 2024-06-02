import { IGraphVertex, IGraphEdge } from "./GraphTypes";

export type GraphVertexList = IGraphVertex[]
export type GraphEdgeSet = [GraphVertexID, IGraphEdge[]];
export type GraphEdgeList = GraphEdgeSet[];

export interface IBaseGraphStorage {
	readonly vertices: GraphVertexList
	readonly edges: GraphEdgeList
	readonly props: GraphProperties
}

export interface IReadonlyGraphStorage
	extends IBaseGraphStorage {

	readonly verticesAsSet: Set<IGraphVertex>
	readonly edgesAsMap: Map<GraphVertexID, IGraphEdge[]>

	getVertexByID(id: GraphVertexID): IGraphVertex | null
	getOutgoingEdgesByID(id: GraphVertexID): IGraphEdge[] | null

	getEdgeByID(id: GraphEdgeID): IGraphEdge | null
}

export interface IGraphStorage
	extends IBaseGraphStorage, IReadonlyGraphStorage {

	addVertex(vertex: IGraphVertex): void
	addEdge(edge: IGraphEdge): void
	setEmptyEdgesFor(vertex: IGraphVertex): void
	removeVertexByID(vertexID: GraphVertexID): void
	removeEdgeByID(edgeID: GraphEdgeID): void

	setVertices(vertices: GraphVertexList): void
	setEdges(edges: GraphEdgeList): void

	set(vertices: GraphVertexList, edges: GraphEdgeList): void
	setProps(props: GraphProperties): void
}
