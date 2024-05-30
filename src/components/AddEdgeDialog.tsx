import { ChangeEvent, useMemo, useState } from "react";
import { GenericGraphEdge, GenericGraphVertex } from "@/graph/GenericGraph";
import GraphError from "@/graph/GraphError";
import { iterateFindFirst } from "@/graph/FunctionalIterable";
import Edge from "@/graph/Edge";

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

	const onVertexChange = (selection_id: number, event: ChangeEvent<HTMLSelectElement>) => {
		setSelection(
			selection_id == 0
				? [event.target.value, selection[1]]
				: [selection[0], event.target.value]
		)
	}

	return <div className="flex flex-col justify-start p-1 border-black border rounded">
		<div className="flex flex-row justify-stretch">
			<select value={selection[0]} onChange={v => onVertexChange(0, v)}>
				<option value="null">select edge</option>
				{
					vertices.map(v =>
						<option key={v.identifier} value={v.identifier}>{v.toString()}</option>
					)
				}
			</select>
			<select value={selection[1]} onChange={v => onVertexChange(1, v)}>
				<option value="null">select edge</option>
				{
					vertices.map(v =>
						<option key={v.identifier} value={v.identifier}>{v.toString()}</option>
					)
				}
			</select>
			<button onClick={onAdd}>Add edge</button>
		</div>
		<span className="inline-block text-red-700" hidden={isErrorHidden}>{error}</span>
	</div>
};

export default AddEdgeDialog;