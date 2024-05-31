import { GenericGraph } from "@/logic/genericgraph/GenericGraph";
import ReactiveGraphStorage from "@/logic/graphstorage/ReactiveGraphStorage";
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