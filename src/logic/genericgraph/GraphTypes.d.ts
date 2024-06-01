export type GraphVertexID = string
export type GraphEdgeID = string

export interface IGraphVertex {
	toString(): string

	deepCopy(): IGraphVertex

	get identifier(): GraphVertexID
	get weight(): number

	get chroma(): number
	set chroma(chroma: number)

	get displayProps(): object
	set displayProps(displayProps: object)
}

export interface IGraphEdge {
	toString(): string

	deepCopy(): IGraphEdge

	get identifier(): GraphEdgeID
	get weight(): number
	get vertices(): [IGraphVertex, IGraphVertex]
	get flipped(): IGraphEdge

	get flow_capacity(): number

	get flow(): number
	set flow(flow: number)

	get chroma(): number
	set chroma(chroma: number)

	get displayProps(): object
}

export type GraphEdgeFactory = (vtx1: IGraphVertex, vtx2: IGraphVertex) => IGraphEdge

export type GraphProperties = {
	directed: boolean
	allowMultipleEdges: boolean
	allowLoops: boolean
}

