import { IGraphVertex } from "../genericgraph/GraphTypes"

export default class Vertex implements IGraphVertex {
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

	withChroma(chroma: number): Vertex {
		const result = new Vertex(`${this.name}`, this.displayProps);
		result.chroma = chroma;
		return result;
	}

	deepCopy(): IGraphVertex {
		const result = new Vertex(`${this.name}`, this.displayProps)
		result.chroma = this.chroma;
		result.weight = this.weight;
		return result;
	}

	get identifier(): string {
		return this.id
	}

	toString(): string {
		return this.name
	}
}