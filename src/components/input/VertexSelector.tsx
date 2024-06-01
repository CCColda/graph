import { IGraphVertex } from "@/logic/genericgraph/GraphTypes";
import React from "react";

export type VertexSelectorProps = {
	vertices: IGraphVertex[];
	value: string;
	setValue: (new_value: string) => any;
};

const VertexSelector: React.FC<VertexSelectorProps> = ({ vertices, value, setValue }) => {
	return <select value={value} onChange={v => setValue(v.target.value)}>
		<option value="null">select vertex</option>
		{
			vertices.map(v =>
				<option key={v.identifier} value={v.identifier}>{v.toString()}</option>
			)
		}
	</select>
}

export default VertexSelector;