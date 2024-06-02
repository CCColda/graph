import { Graph as DOTGraph } from "dotparser";
import { Huffman } from "huffman-ts";

export type StringifyDOTResult = {
	type: "plain",
	d: string
} | {
	type: "huffman",
	dht: string,
	dh: string
};

export function StringifyDOT(
	dotData: DOTGraph[], compressionThreshold: number = 1000
): StringifyDOTResult {
	const dotDataString = JSON.stringify(dotData);

	if (dotDataString.length > compressionThreshold) {
		const huffman = Huffman.treeFromText(dotDataString);
		const encoded = huffman.encode(dotDataString);

		const huffmanTreeBase64 = Buffer.from(JSON.stringify(huffman.encodeTree()), "binary").toString("base64");
		const encodedBase64 = Buffer.from(encoded, "binary").toString("base64")

		return {
			type: "huffman",
			dht: encodeURIComponent(huffmanTreeBase64),
			dh: encodeURIComponent(encodedBase64)
		}
	}
	else {
		return {
			type: "plain",
			d: encodeURIComponent(Buffer.from(dotDataString, "binary").toString("base64"))
		}
	}
}

export function ParseDOT(stringified: StringifyDOTResult): DOTGraph[] {
	console.log(stringified);
	if (stringified.type == "huffman") {
		const huffmanTreeBinary = Buffer.from(
			decodeURIComponent(stringified.dht), "base64"
		).toString("binary");

		const huffmanTreeJSON = JSON.parse(huffmanTreeBinary);

		const huffmanBinary = Buffer.from(
			decodeURIComponent(stringified.dh), "base64"
		).toString("binary");

		const huffmanDecoded = Huffman.decodeTree(huffmanTreeJSON).decode(huffmanBinary);

		return JSON.parse(huffmanDecoded) as DOTGraph[]
	}
	else if (stringified.type == "plain") {
		const decodedText = Buffer.from(
			decodeURIComponent(stringified.d), "base64"
		).toString("binary")

		return JSON.parse(decodedText) as DOTGraph[]
	}
	else {
		throw new Error("Invalid stringified DOT type.")
	}
}

export function StringifiedDOTToSearchParams(stringified: StringifyDOTResult) {
	return Object.entries(stringified).map(([k, v]) => `${k}=${v}`).join("&")
}