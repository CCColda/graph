import { IReadonlyGraphStorage, GraphVertexList, GraphEdgeList } from "../genericgraph/GraphStorageInterfaces"
import { GraphProperties, IGraphVertex, GraphVertexID, IGraphEdge, GraphEdgeID } from "../genericgraph/GraphTypes"

export default abstract class ReadonlyGraphStorage
	implements IReadonlyGraphStorage {

	abstract get vertices(): GraphVertexList
	abstract get edges(): GraphEdgeList
	abstract get props(): GraphProperties

	get verticesAsSet() { return new Set<IGraphVertex>(this.vertices) }
	get edgesAsMap() { return new Map<GraphVertexID, IGraphEdge[]>(this.edges) }

	getVertexByID(id: GraphVertexID): IGraphVertex | null {
		return this.vertices.find(vtx => vtx.identifier == id) ?? null
	}

	getOutgoingEdgesByID(id: GraphVertexID): IGraphEdge[] | null {
		return this.edges.find(([vtxID]) => vtxID == id)?.[1] ?? null
	}

	getEdgeByID(id: GraphEdgeID): IGraphEdge | null {
		for (const [_vtxID, edgeList] of this.edges) {
			const edge: IGraphEdge | undefined = edgeList.find(edge => edge.identifier == id)

			if (edge) {
				return edge;
			}
		}

		return null;
	}
}