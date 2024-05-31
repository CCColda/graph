import { GenericGraphEdge, GenericGraphVertex } from "../genericgraph/GenericGraph"

export default class Edge implements GenericGraphEdge {
	private static id: number = 0
	private id: string

	public vertices: [GenericGraphVertex, GenericGraphVertex]
	public chroma: number = 0
	public flow: number = 0
	public flow_capacity = 0
	public weight: number = 0
	public displayProps: object

	constructor(v1: GenericGraphVertex, v2: GenericGraphVertex, id?: string, displayProps: object = {}) {
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

	deepCopy(): GenericGraphEdge {
		return new Edge(this.vertices[0].deepCopy(), this.vertices[1].deepCopy(), `${this.id}`);
	}

	get flipped(): GenericGraphEdge {
		return new Edge(this.vertices[1], this.vertices[0])
	}

	get identifier(): string {
		return this.id
	}

	toString(): string {
		return this.vertices.map(v => v.identifier).join(" → ")
	}
}