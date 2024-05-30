import { GenericGraph } from "@/graph/GenericGraph";
import ReactiveGraphStorage from "@/graph/ReactiveGraphStorage";
import { useEffect, useState } from "react";

export type GraphGuardProps = React.PropsWithChildren<{
	graph: GenericGraph<ReactiveGraphStorage>;
}>;

const GraphGuard: React.FC<GraphGuardProps> = (props) => {
	const [shown, setShown] = useState(false);

	useEffect(() => {
		if (props.graph.storage.verticesAsList.length != 0) {
			setShown(true);
		}
	}, [props.graph]);

	return <>
		{
			shown && props.children
		}
	</>
};

export default GraphGuard;