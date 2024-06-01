import { IGraphEdge, IGraphVertex } from "../genericgraph/GraphTypes"

export default class Edge implements IGraphEdge {
	private static id: number = 0
	private id: string

	public vertices: [IGraphVertex, IGraphVertex]
	public chroma: number = 0
	public flow: number = 0
	public flow_capacity = 0
	public weight: number = 0
	public displayProps: object

	constructor(v1: IGraphVertex, v2: IGraphVertex, id?: string, displayProps: object = {}) {
		this.vertices = [v1, v2]
		this.displayProps = displayProps

		if (id) {
			this.id = id;
		}
		else {
			this.id = `e${Edge.id}`

			Edge.id++
		}
	}

	deepCopy(): IGraphEdge {
		return new Edge(this.vertices[0].deepCopy(), this.vertices[1].deepCopy(), `${this.id}`);
	}

	get flipped(): IGraphEdge {
		return new Edge(this.vertices[1], this.vertices[0])
	}

	get identifier(): string {
		return this.id
	}

	toString(): string {
		return this.vertices.map(v => v.identifier).join(" → ")
	}
}