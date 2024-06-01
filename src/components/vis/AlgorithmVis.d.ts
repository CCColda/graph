export type AlgorithmVisProps<T extends object> = T & {
	step(): void;
	close(): void;
	canStep: boolean;
};