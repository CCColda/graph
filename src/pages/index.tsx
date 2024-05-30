import { Inter } from "next/font/google";
import GraphVis from "@/components/GraphVis";
import { GenericGraph } from "@/graph/GenericGraph";
import Vertex from "@/graph/Vertex";
import Edge from "@/graph/Edge";
import AddVertexDialog from "@/components/AddVertexDialog";
import { useEffect, useMemo, useState } from "react";
import useReactiveGraphStorage from "@/graph/useReactiveGraphStorage";
import LocalGraphStorage from "@/graph/LocalGraphStorage";
import AddEdgeDialog, { EdgeSelection } from "@/components/AddEdgeDialog";
import VertexSelector from "@/components/VertexSelector";
import BFS from "@/graph/BFS";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const storage = useReactiveGraphStorage();
  const graph = new GenericGraph(storage);

  const bfsStorage = useReactiveGraphStorage();
  const bfsGraph = new GenericGraph(bfsStorage);

  useEffect(() => {
    const localGraph = new GenericGraph(new LocalGraphStorage());

    localGraph.addVertex(new Vertex("a"));
    localGraph.addVertex(new Vertex("b"));
    localGraph.addVertex(new Vertex("c"));
    localGraph.addVertex(new Vertex("d"));
    localGraph.addVertex(new Vertex("e"));

    try {
      localGraph.addEdge(new Edge(
        localGraph.getVertexByIdentifier("a")!,
        localGraph.getVertexByIdentifier("b")!));

      localGraph.addEdge(new Edge(
        localGraph.getVertexByIdentifier("b")!,
        localGraph.getVertexByIdentifier("c")!));

      localGraph.addEdge(new Edge(
        localGraph.getVertexByIdentifier("c")!,
        localGraph.getVertexByIdentifier("d")!));

      localGraph.addEdge(new Edge(
        localGraph.getVertexByIdentifier("d")!,
        localGraph.getVertexByIdentifier("b")!));
    }
    catch (error) {
      debugger;
      console.error(`Error occured: ${error}`);
    }
    finally {
      console.debug(localGraph);
    }

    graph.storage.migrateFrom(localGraph.storage);
  }, []);

  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const runBfs = async () => {
    let iterable = BFS(graph, graph.getVertexByIdentifier(bfsStartVertex)!);
    let result = iterable.next();

    while (!result.done) {
      console.debug(result.value.distance);
      console.debug(result.value.previous);
      bfsGraph.storage.migrateFrom(result.value.graph.storage);

      await wait(5000);

      result = iterable.next();
    }
  };

  const bfsHidden = useMemo(() => bfsGraph.storage.verticesAsList.length == 0, [bfsGraph]);
  const [bfsStartVertex, setBfsStartVertex] = useState("null");

  const [edgeSelection, setEdgeSelection] = useState<EdgeSelection>([null, null]);

  return (
    <main className="w-full h-full flex flex-row justify-start align-stretch">
      <div className="flex flex-col justify-center">
        <AddVertexDialog
          vertices={graph.storage.verticesAsList}
          num_vertices={graph.vertices.size}
          addVertex={v => graph.addVertex(v)} />
        <AddEdgeDialog
          vertices={graph.storage.verticesAsList}
          selection={edgeSelection}
          setSelection={setEdgeSelection}
          addEdge={v => graph.addEdge(v)} />
        <div className="flex flex-row justify-start">
          <VertexSelector vertices={graph.storage.verticesAsList} value={bfsStartVertex} setValue={setBfsStartVertex} />
          <button onClick={_ => runBfs()}>Run BFS</button>
        </div>
      </div>
      <GraphVis graph={graph} />
      <div className="w-full h-full" hidden={bfsHidden}>
        <GraphVis graph={bfsGraph} />
      </div>
    </main>
  );
}

