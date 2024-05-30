import Vertex from "@/graph/Vertex";
import { useMemo, useState } from "react";
import PersistentInput from "./PersistentInput";
import { iterateFindFirst } from "@/graph/FunctionalIterable";
import { GenericGraphVertex } from "@/graph/GenericGraph";

type AddVertexDialogProps = {
	vertices: IterableIterator<GenericGraphVertex>;
	num_vertices: number;
	addVertex: (v: Vertex) => any;
};

const AddVertexDialog: React.FC<AddVertexDialogProps> = ({ vertices, num_vertices, addVertex }) => {
	const [vertexName, setVertexName] = useState("");
	const [error, setError] = useState<string | null>(null);

	const isErrorHidden = useMemo(() => error == null, [error]);

	const onAdd = () => {
		if (vertexName == "") {
			setError("Vertex name is empty.");
			return;
		}

		if (iterateFindFirst(vertices, v => v.identifier == vertexName) != null) {
			setError("Vertex with this name already exists.");
			return;
		}

		addVertex(new Vertex(vertexName));
		setVertexName("");
		setError("");
	};

	const onAutoName = () => {
		setVertexName(`v${num_vertices + 1}`);
	};

	return <div className="flex flex-col justify-start">
		<div className="flex flex-row justify-stretch">
			<PersistentInput
				input={vertexName} setInput={setVertexName}
				placeholder="vertex name" />
			<button onClick={onAutoName}>Auto-name</button>
			<button onClick={onAdd}>Add vertex</button>
		</div>
		<span className="inline-block text-red-700" hidden={isErrorHidden}>{error}</span>
	</div>
};

export default AddVertexDialog;