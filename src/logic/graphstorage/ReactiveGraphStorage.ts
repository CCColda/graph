import { GraphVertexList, GraphEdgeList, IGraphStorage, GraphEdgeSet, IBaseGraphStorage } from "../genericgraph/GraphStorageInterfaces";
import { GraphProperties, IGraphVertex, IGraphEdge, GraphVertexID, GraphEdgeID } from "../genericgraph/GraphTypes";
import NotImplementedError from "../graph/NotImplementedError";
import ReadonlyGraphStorage from "./ReadonlyGraphStorage";

type ReactiveDispatch<T> = React.Dispatch<React.SetStateAction<T>>;
type ReactiveVerticesDispatch = ReactiveDispatch<GraphVertexList>;
type ReactiveEdgesDispatch = ReactiveDispatch<GraphEdgeList>;
type ReactiveGraphPropertiesDispatch = ReactiveDispatch<GraphProperties>;

export default class ReactiveGraphStorage
	extends ReadonlyGraphStorage
	implements IGraphStorage {

	private rVertices: GraphVertexList
	private rSetVertices: ReactiveVerticesDispatch

	private rEdges: GraphEdgeList
	private rSetEdges: ReactiveEdgesDispatch

	private rProps: GraphProperties
	private rSetProps: ReactiveGraphPropertiesDispatch

	get vertices() { return this.rVertices; }
	get edges() { return this.rEdges; }

	get props() { return this.rProps; }

	constructor(
		vertices: GraphVertexList,
		setVertices: ReactiveVerticesDispatch,
		edges: GraphEdgeList,
		setEdges: ReactiveEdgesDispatch,
		props: GraphProperties,
		setProps: ReactiveGraphPropertiesDispatch
	) {
		super()

		this.rVertices = vertices
		this.rEdges = edges

		this.rSetVertices = setVertices
		this.rSetEdges = setEdges

		this.rProps = props
		this.rSetProps = setProps
	}

	addVertex(vertex: IGraphVertex): void {
		this.rSetVertices(old => [...old.map(v => v.deepCopy()), vertex.deepCopy()])
	}

	addEdge(edge: IGraphEdge): void {
		this.rSetEdges(old => {
			const vtx1 = edge.vertices[0].identifier;
			const copyAndAddEdgeIfNeeded = ([vtxID, edges]: GraphEdgeSet): GraphEdgeSet => {
				return vtxID == vtx1
					? ([`${vtxID}`, [...edges.map(v => v.deepCopy()), edge]])
					: ([`${vtxID}`, edges.map(v => v.deepCopy())])
			};

			const newEdges = [...old.map(copyAndAddEdgeIfNeeded)]

			return newEdges
		});
	}

	setEmptyEdgesFor(vertex: IGraphVertex): void {
		this.rSetEdges(old => {
			const vtxID = vertex.identifier;

			if (old.some(([oldVtxID]) => oldVtxID == vtxID)) {
				const copyAndSetEmptyIfNeeded = ([edgeVtxID, edges]: GraphEdgeSet): GraphEdgeSet => {
					return edgeVtxID == vtxID
						? ([`${edgeVtxID}`, []])
						: ([`${edgeVtxID}`, edges.map(v => v.deepCopy())])
				};

				return [...old.map(copyAndSetEmptyIfNeeded)]
			}
			else {
				return [
					...old.map(([vtxID, edges]) => ([`${vtxID}`, edges.map(w => w.deepCopy())])),
					[`${vtxID}`, []]
				] as [GraphVertexID, IGraphEdge[]][];
			}
		});
	}

	removeVertexByID(vertex: GraphVertexID): void {
		const newVertices = this.vertices.filter(v => v.identifier != vertex)
		const newEdges = this.edges
			.filter(([v]) => v != vertex)
			.map(([v, edges]) => [
				v, edges.filter(w => w.vertices[1].identifier != vertex)
			] as GraphEdgeSet)

		this.set(newVertices, newEdges)
	}

	removeEdgeByID(edge: GraphEdgeID): void {
		throw new NotImplementedError()
	}

	setVertices(vertices: IGraphVertex[]): void {
		this.rSetVertices(vertices)
	}

	setEdges(edges: [GraphVertexID, IGraphEdge[]][]): void {
		this.rSetEdges(edges)
	}

	set(vertices: IGraphVertex[], edges: [GraphVertexID, IGraphEdge[]][]): void {
		this.setVertices(vertices)
		this.setEdges(edges)
	}

	setProps(props: GraphProperties): void {
		this.rSetProps({ ...props })
	}
}