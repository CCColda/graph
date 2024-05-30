import { GenericGraphVertex } from "./GenericGraph"

export default class Vertex implements GenericGraphVertex {
	private readonly id: string
	public readonly name: string
	public chroma: number = 0
	public weight: number = 0
	public displayProps: object

	constructor(name: string, displayProps: object = {}) {
		this.name = name
		this.id = name
		this.displayProps = displayProps
	}

	deepCopy(): GenericGraphVertex {
		return new Vertex(`${this.name}`, this.displayProps)
	}

	get identifier(): string {
		return this.id
	}

	toString(): string {
		return this.name
	}
}