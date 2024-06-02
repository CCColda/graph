'use client'

import GraphGuard from "@/components/GraphGuard";
import Page from "@/components/Page";
import DecodeDOT from "@/logic/dot/DecodeDot";
import { ParseDOT } from "@/logic/dot/StringifyDOT";
import { Graph } from "@/logic/genericgraph/Graph";
import useReactiveGraphStorage from "@/logic/graphstorage/useReactiveGraphStorage";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";

export default function DOTPage() {
	const [graphReady, setGraphReady] = useState(false)
	const searchParams = useSearchParams();

	const graphStorage = useReactiveGraphStorage()
	const graph = new Graph(graphStorage);

	useEffect(() => {
		const dotDataType = searchParams.get("type");

		if (dotDataType && !graphReady) {
			console.log(dotDataType)
			console.log(searchParams.toString())

			const parsedDot = ParseDOT(
				dotDataType == "huffman" ? {
					type: "huffman",
					dht: searchParams.get("dht") ?? "",
					dh: searchParams.get("dh") ?? ""
				} : {
					type: "plain",
					d: searchParams.get("d") ?? ""
				}
			);

			const decodedGraph = DecodeDOT(parsedDot)
			console.log(decodedGraph)

			graph.cloneFrom(decodedGraph)
			setGraphReady(true)
		}

	}, [searchParams, graphReady, graph])

	return <GraphGuard graph={graph}>
		<Page startingGraph={graph} />
	</GraphGuard>
}