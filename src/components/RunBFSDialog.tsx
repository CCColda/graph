import { GenericGraphVertex } from "@/graph/GenericGraph";
import { useMemo, useState } from "react";
import VertexSelector from "./VertexSelector";

export type RunBFSDialogProps = {
	vertices: GenericGraphVertex[];
	runBfs: (vertex: GenericGraphVertex) => any;
};

const RunBFSDialog: React.FC<RunBFSDialogProps> = ({ vertices, runBfs }) => {
	const [bfsStartVertex, setBfsStartVertex] = useState("null");
	const [error, setError] = useState("");

	const isErrorHidden = useMemo(() => error == "", [error]);

	const onRun = () => {
		if (bfsStartVertex == "null") {
			setError("A starting vertex must be selected");
			return;
		}

		const vertex = vertices.find(v => v.identifier == bfsStartVertex);

		if (vertex == null) {
			setError("The selected starting vertex doesn't exist.");
			return;
		}

		runBfs(vertex);
		setError("");
	};

	return <div className="flex flex-col justify-stretch align-baseline">
		<div className="flex flex-row justify-stretch">
			<VertexSelector vertices={vertices} value={bfsStartVertex} setValue={setBfsStartVertex} />
			<button onClick={_ => onRun()}>Run BFS</button>
		</div>
		<span hidden={isErrorHidden} className="inline-block text-red-700">{error}</span>
	</div>
};

export default RunBFSDialog;