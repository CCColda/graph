import ReactiveGraphStorage from "@/logic/graphstorage/ReactiveGraphStorage";
import ConditionGuard from "./ConditionGuard";
import { Graph } from "@/logic/genericgraph/Graph";

export type GraphGuardProps = React.PropsWithChildren<{
	graph: Graph<ReactiveGraphStorage>;
}>;

const GraphGuard: React.FC<GraphGuardProps> = (props) => {
	return <ConditionGuard conditions={[props.graph.numVertices != 0]}>
		{props.children}
	</ConditionGuard>
};

export default GraphGuard;