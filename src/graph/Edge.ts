import { GenericGraphEdge } from "./GenericGraph"
import Vertex from "./Vertex"

export default class Edge implements GenericGraphEdge<Vertex> {
	private static id: number = 0
	private id: string

	public vertices: [Vertex, Vertex]
	public chroma: number = 0
	public flow: number = 0
	public flow_capacity = 0
	public weight: number = 0

	constructor(v1: Vertex, v2: Vertex) {
		this.vertices = [v1, v2]
		this.id = `e${Edge.id}`

		Edge.id++
	}

	get flipped(): GenericGraphEdge<Vertex> {
		return new Edge(this.vertices[1], this.vertices[0])
	}

	get identifier(): string {
		return this.id
	}

	toString(): string {
		return this.vertices.map(v => v.identifier).join(" -> ")
	}
}