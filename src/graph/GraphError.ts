export default class GraphError extends Error {
	constructor(msg: string, cause?: any) {
		super(msg, { cause })
	}
};