import { GenericGraphVertex } from "@/logic/genericgraph/GenericGraph";
import React from "react";

export type VertexSelectorProps = {
	vertices: GenericGraphVertex[];
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