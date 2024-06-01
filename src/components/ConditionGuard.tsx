import { useEffect, useState } from "react";

export type ConditionGuardProps = React.PropsWithChildren<{
	conditions: boolean[]
}>;

const ConditionGuard: React.FC<ConditionGuardProps> = (props) => {
	const [shown, setShown] = useState(false);

	useEffect(() => {
		setShown(props.conditions.reduce((a, b) => a && b, true))
	}, [props.conditions]);

	return <>
		{
			shown ?
				props.children
				: null
		}
	</>
};

export default ConditionGuard;