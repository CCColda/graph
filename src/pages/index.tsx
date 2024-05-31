import { Inter } from "next/font/google";
import GraphVis from "@/components/GraphVis";
import { GenericGraph, GenericGraphVertex } from "@/logic/genericgraph/GenericGraph";
import Vertex from "@/logic/graph/Vertex";
import Edge from "@/logic/graph/Edge";
import AddVertexDialog from "@/components/dialog/AddVertexDialog";
import { useEffect, useState } from "react";
import useReactiveGraphStorage from "@/logic/graphstorage/useReactiveGraphStorage";
import LocalGraphStorage from "@/logic/graphstorage/LocalGraphStorage";
import AddEdgeDialog, { EdgeSelection } from "@/components/dialog/AddEdgeDialog";
import BFS, { BFSResult } from "@/logic/algorithm/BFS";
import BFSVis from "@/components/BFSVis";
import GraphGuard from "@/components/GraphGuard";
import RunBFSDialog from "@/components/dialog/RunBFSDialog";
import FullBFS from "@/logic/algorithm/FullBFS";
import GraphPropDialog from "@/components/dialog/GraphPropDialog";

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

    graph.cloneFrom(localGraph);
  }, []);

  const [bfsIterable, setBfsIterable] = useState<IterableIterator<BFSResult> | null>(null);
  const [bfsDone, setBfsDone] = useState(false);
  const [bfsResult, setBfsResult] = useState<BFSResult | null>(null);;

  const runBfs = (startVertex: GenericGraphVertex) => {
    const iterable = BFS(graph, startVertex);

    const next = iterable.next();

    bfsGraph.cloneFrom(next.value.graph);
    setBfsIterable(iterable);
    setBfsResult(next.value);
    setBfsDone(!!next.done);
  }

  const runFullBfs = () => {
    const iterable = FullBFS(graph);

    const next = iterable.next();

    bfsGraph.cloneFrom(next.value.graph);
    setBfsIterable(iterable);
    setBfsResult(next.value);
    setBfsDone(!!next.done);
  }

  const stepBfs = () => {
    if (bfsIterable != null && !bfsDone) {
      const next = bfsIterable.next();

      setBfsDone(!!next.done);
      if (!next.done) {
        bfsGraph.cloneFrom(next.value.graph);
        setBfsResult(next.value);
      }
    }
  }

  const [edgeSelection, setEdgeSelection] = useState<EdgeSelection>(["null", "null"]);

  return (
    <main className="w-full h-full flex flex-row justify-start align-stretch">
      <div className="flex flex-col justify-center">
        <span className="text-center text-xl mb-5">Controls</span>
        <AddVertexDialog
          vertices={graph.storage.verticesAsList}
          num_vertices={graph.vertices.size}
          addVertex={v => graph.addVertex(v)} />
        <AddEdgeDialog
          vertices={graph.storage.verticesAsList}
          selection={edgeSelection}
          setSelection={setEdgeSelection}
          addEdge={v => graph.addEdge(v)} />
        <RunBFSDialog
          vertices={graph.storage.verticesAsList}
          runBfs={runBfs}
        />
        <div className="flex flex-row justify-start">
          <button onClick={_ => runFullBfs()}>Full BFS</button>
        </div>
        <div className="flex flex-row justify-start">
          <button onClick={_ => graph.invert((v1, v2) => new Edge(v1, v2))}>Invert</button>
        </div>
        <GraphPropDialog props={graph.props} setProps={new_props => graph.storage.setProps(new_props)} />
      </div>
      <GraphVis graph={graph} />
      <GraphGuard graph={bfsGraph}>
        <BFSVis graph={bfsGraph} bfsResult={bfsResult!} step={stepBfs} canStep={!bfsDone} />
      </GraphGuard>
    </main>
  );
}

