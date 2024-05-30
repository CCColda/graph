import { GenericGraphProperties } from "@/graph/GenericGraph"

export type GraphPropDialogProps = {
	props: GenericGraphProperties;
	setProps: (new_props: GenericGraphProperties) => void
}

type GraphPropToggleProps = {
	propName: keyof GenericGraphProperties,
	propLabel: string,
	props: GenericGraphProperties;
	setProps: (new_props: GenericGraphProperties) => void
};

const GraphPropToggle: React.FC<GraphPropToggleProps> = ({ propName, propLabel, props, setProps }) => {
	return <div className="flex flex-row align-baseline justify-stretch">
		<input id={propName} type="checkbox" checked={props[propName]} onChange={v => setProps({ ...props, [propName]: v.target.checked })} />
		<label htmlFor={propName}>{propLabel}</label>
	</div>
};

const GraphPropDialog: React.FC<GraphPropDialogProps> = ({ props, setProps }) => {
	return <div className="flex flex-col align-baseline justify-stretch">
		<GraphPropToggle propName="allowLoops" propLabel="Allow loops" props={props} setProps={setProps} />
		<GraphPropToggle propName="allowMultipleEdges" propLabel="Allow multiple edges" props={props} setProps={setProps} />
		<GraphPropToggle propName="directed" propLabel="Insert directed edges" props={props} setProps={setProps} />
	</div>
};

export default GraphPropDialog;