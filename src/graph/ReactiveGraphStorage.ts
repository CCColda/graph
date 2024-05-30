import { GenericGraphEdge, GenericGraphStorage, GenericGraphVertex, GraphVertexID } from "./GenericGraph";
import NotImplementedError from "./NotImplementedError";

export type ReactiveVertices = GenericGraphVertex[]

export type ReactiveEdgeList = [GraphVertexID, GenericGraphEdge[]];
export type ReactiveEdges = ReactiveEdgeList[]

type ReactiveDispatch<T> = React.Dispatch<React.SetStateAction<T>>;
type ReactiveVerticesDispatch = ReactiveDispatch<ReactiveVertices>;
type ReactiveEdgesDispatch = ReactiveDispatch<ReactiveEdges>;

export default class ReactiveGraphStorage
	implements GenericGraphStorage {

	private rVertices: ReactiveVertices
	private rSetVertices: ReactiveVerticesDispatch

	private rEdges: ReactiveEdges
	private rSetEdges: ReactiveEdgesDispatch

	constructor(
		vertices: ReactiveVertices,
		setVertices: ReactiveVerticesDispatch,
		edges: ReactiveEdges,
		setEdges: ReactiveEdgesDispatch
	) {
		this.rVertices = vertices
		this.rEdges = edges

		this.rSetVertices = setVertices
		this.rSetEdges = setEdges
	}

	addVertex(vertex: GenericGraphVertex): void {
		this.rSetVertices(old => [...old.map(v => v.deepCopy()), vertex.deepCopy()])
	}

	addEdge(edge: GenericGraphEdge): void {
		this.rSetEdges(old => {
			const vtx1 = edge.vertices[0].identifier;
			const copyAndAddEdgeIfNeeded = (v: ReactiveEdgeList): ReactiveEdgeList => {
				return v[0] == vtx1
					? ([v[0], [...v[1].map(w => w.deepCopy()), edge]])
					: ([v[0], v[1].map(w => w.deepCopy())])
			};

			return [...old.map(v => copyAndAddEdgeIfNeeded(v))]
		});
	}

	removeEdge(edge: GenericGraphEdge): void {
		throw new NotImplementedError()
	}

	removeVertex(vertex: GenericGraphVertex): void {
		throw new NotImplementedError()
	}

	setEmptyEdgesFor(vertex: GenericGraphVertex): void {
		this.rSetEdges(old => {
			const vtx1 = vertex.identifier;
			const copyAndSetEmptyIfNeeded = (v: ReactiveEdgeList): ReactiveEdgeList => {
				return v[0] == vtx1
					? ([v[0], []])
					: ([v[0], v[1].map(w => w.deepCopy())])
			};

			return [...old.map(v => copyAndSetEmptyIfNeeded(v))]
		});
	}

	set(vertices: GenericGraphVertex[], edges: [GraphVertexID, GenericGraphEdge[]][]): void {
		this.rSetVertices(vertices);
		this.rSetEdges(edges);
	}

	get vertices(): Set<GenericGraphVertex> {
		return new Set(this.rVertices);
	}

	get edges(): Map<GraphVertexID, GenericGraphEdge[]> {
		return new Map(this.rEdges);
	}

	get verticesAsList(): GenericGraphVertex[] {
		return this.rVertices
	}

	get edgesAsList(): [GraphVertexID, GenericGraphEdge[]][] {
		return this.edgesAsList
	}

	migrateFrom(storage: GenericGraphStorage): void {
		this.set(storage.verticesAsList, storage.edgesAsList)
	}
}