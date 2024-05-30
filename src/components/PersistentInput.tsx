type PersistentInputProps = {
	input: string;
	setInput: React.Dispatch<React.SetStateAction<string>>;
	placeholder?: string;
};

const PersistentInput: React.FC<PersistentInputProps> = ({ input, setInput, placeholder }) =>
	<input defaultValue={input} onChange={v => setInput(v.target.value)} placeholder={placeholder} />

export default PersistentInput;