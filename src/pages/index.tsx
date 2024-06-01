import BFSVis from "@/components/vis/BFSVis";
import GraphGuard from "@/components/GraphGuard";
import GraphVis from "@/components/vis/GraphVis";
import GVCVis from "@/components/vis/GreedyVertexVis";
import AddEdgeDialog, { EdgeSelection } from "@/components/dialog/AddEdgeDialog";
import AddVertexDialog from "@/components/dialog/AddVertexDialog";
import GraphPropDialog from "@/components/dialog/GraphPropDialog";
import RunBFSDialog from "@/components/dialog/RunBFSDialog";
import BFS, { BFSResult } from "@/logic/algorithm/BFS";
import FullBFS from "@/logic/algorithm/FullBFS";
import GreedyVertexChroma, { GreedyVertexChromaResult } from "@/logic/algorithm/GreedyVertexChroma";
import { Graph } from "@/logic/genericgraph/GenericGraph";
import { IGraphVertex } from "@/logic/genericgraph/GraphTypes";
import Edge from "@/logic/graph/Edge";
import Vertex from "@/logic/graph/Vertex";
import LocalGraphStorage from "@/logic/graphstorage/LocalGraphStorage";
import useReactiveGraphStorage from "@/logic/graphstorage/useReactiveGraphStorage";
import { useEffect, useState } from "react";
import useGraphAlgorithm from "@/logic/algorithm/useGraphAlgorithm";
import ReactiveGraphStorage from "@/logic/graphstorage/ReactiveGraphStorage";
import ConditionGuard from "@/components/ConditionGuard";

export default function Home() {
  const storage = useReactiveGraphStorage();
  const graph = new Graph(storage);

  const [edgeSelection, setEdgeSelection] = useState<EdgeSelection>(["null", "null"]);

  const bfsStorage = useReactiveGraphStorage();
  const bfsGraph = new Graph(bfsStorage);
  const bfsAlg = useGraphAlgorithm(BFS<ReactiveGraphStorage>, bfsGraph);
  const fullBfsAlg = useGraphAlgorithm(FullBFS<ReactiveGraphStorage>, bfsGraph);

  const gvcStorage = useReactiveGraphStorage();
  const gvcGraph = new Graph(gvcStorage);
  const gvcAlg = useGraphAlgorithm(GreedyVertexChroma<ReactiveGraphStorage>, gvcGraph);

  useEffect(() => {
    const localGraph = new Graph(new LocalGraphStorage());

    localGraph.addVertex(new Vertex("a"));
    localGraph.addVertex(new Vertex("b"));
    localGraph.addVertex(new Vertex("c"));
    localGraph.addVertex(new Vertex("d"));
    localGraph.addVertex(new Vertex("e"));

    try {
      localGraph.addEdge(new Edge(
        localGraph.getVertexByID("a")!,
        localGraph.getVertexByID("b")!));

      localGraph.addEdge(new Edge(
        localGraph.getVertexByID("b")!,
        localGraph.getVertexByID("c")!));

      localGraph.addEdge(new Edge(
        localGraph.getVertexByID("c")!,
        localGraph.getVertexByID("d")!));

      localGraph.addEdge(new Edge(
        localGraph.getVertexByID("d")!,
        localGraph.getVertexByID("b")!));
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

  return (
    <main className="w-full h-full flex flex-row justify-start align-stretch">
      <div className="flex flex-col justify-center">
        <span className="text-center text-xl mb-5">Controls</span>
        <AddVertexDialog
          vertices={graph.storage.vertices}
          num_vertices={graph.numVertices}
          addVertex={v => graph.addVertex(v)} />
        <AddEdgeDialog
          vertices={graph.storage.vertices}
          selection={edgeSelection}
          setSelection={setEdgeSelection}
          addEdge={v => graph.addEdge(v)} />
        <RunBFSDialog
          vertices={graph.storage.vertices}
          runBfs={startingVertex => { fullBfsAlg.finish(); bfsAlg.run(graph, startingVertex) }}
        />
        <div className="flex flex-row justify-start">
          <button onClick={_ => { bfsAlg.finish(); fullBfsAlg.run(graph) }}>Full BFS</button>
        </div>
        <div className="flex flex-row justify-start">
          <button onClick={_ => { gvcAlg.run(graph) }}>Greedy Vertex Chroma</button>
        </div>
        <div className="flex flex-row justify-start">
          <button onClick={_ => graph.invert((v1, v2) => new Edge(v1, v2))}>Invert</button>
        </div>
        <GraphPropDialog props={graph.props} setProps={new_props => graph.storage.setProps(new_props)} />
      </div>
      <GraphVis graph={graph} />
      <GraphGuard graph={bfsGraph}>
        <BFSVis
          graph={bfsGraph}
          bfsResult={!bfsAlg.done ? bfsAlg.value : fullBfsAlg.value}
          step={!bfsAlg.done ? () => bfsAlg.step() : () => fullBfsAlg.step()}
          canStep={!bfsAlg.done || !fullBfsAlg.done}
          close={!bfsAlg.done ? () => bfsAlg.finish() : () => fullBfsAlg.finish()} />
      </GraphGuard>
      <GraphGuard graph={gvcGraph}>
        <GVCVis
          graph={gvcGraph}
          gvcResult={gvcAlg.value}
          step={() => gvcAlg.step()}
          canStep={!gvcAlg.done}
          close={() => gvcAlg.finish()} />
      </GraphGuard>
    </main >
  );
}

