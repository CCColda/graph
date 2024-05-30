import { useMemo, useState } from "react";
import { GenericGraphEdge, GenericGraphVertex } from "@/graph/GenericGraph";
import GraphError from "@/graph/GraphError";
import Edge from "@/graph/Edge";
import VertexSelector from "./VertexSelector";

export type EdgeSelection = [string, string];

type AddEdgeDialogProps = {
	vertices: GenericGraphVertex[];
	selection: EdgeSelection;
	setSelection: React.Dispatch<React.SetStateAction<EdgeSelection>>;
	addEdge: (edge: GenericGraphEdge) => any;
};

const AddEdgeDialog: React.FC<AddEdgeDialogProps> = ({ vertices, selection, setSelection, addEdge }) => {
	const [error, setError] = useState<string | null>(null);
	const isErrorHidden = useMemo(() => error == null, [error]);

	const onAdd = () => {
		if (selection.some(v => v == "null")) {
			setError("Both vertices must be selected.");
			return;
		}

		const firstPoint = vertices.find(v => v.identifier == selection[0]);
		const secondPoint = vertices.find(v => v.identifier == selection[1]);

		if (firstPoint == null || secondPoint == null) {
			setError("One of the vertices isn't valid.");
			return;
		}

		try {
			addEdge(new Edge(firstPoint, secondPoint));
			setError("");
			setSelection(["null", "null"]);
		}
		catch (error) {
			if (error instanceof GraphError) {
				setError(error.message);
			}
		}
	};

	const onVertexChange = (selection_id: number, new_selection: string) => {
		setSelection(
			selection_id == 0
				? [new_selection, selection[1]]
				: [selection[0], new_selection]
		)
	}

	return <div className="flex flex-col justify-start p-1 border-black border rounded">
		<div className="flex flex-row justify-stretch">
			<VertexSelector vertices={vertices} value={selection[0]} setValue={v => onVertexChange(0, v)} />
			<VertexSelector vertices={vertices} value={selection[1]} setValue={v => onVertexChange(1, v)} />
			<button onClick={onAdd}>Add edge</button>
		</div>
		<span className="inline-block text-red-700" hidden={isErrorHidden}>{error}</span>
	</div>
};

export default AddEdgeDialog;