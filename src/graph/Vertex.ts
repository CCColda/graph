import { GenericGraphVertex } from "./GenericGraph"

export default class Vertex implements GenericGraphVertex {
	private id: string
	private name: string
	public chroma: number = 0
	public weight: number = 0

	constructor(name: string) {
		this.name = name
		this.id = name
	}

	get identifier(): string {
		return this.id
	}

	toString(): string {
		return this.name
	}
}