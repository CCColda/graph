import { Inter } from "next/font/google";
import GraphVis from "@/components/GraphVis";
import { GenericGraph } from "@/graph/GenericGraph";
import Vertex from "@/graph/Vertex";
import Edge from "@/graph/Edge";
import AddVertexDialog from "@/components/AddVertexDialog";
import { useEffect, useState } from "react";
import useReactiveGraphStorage from "@/graph/useReactiveGraphStorage";
import LocalGraphStorage from "@/graph/LocalGraphStorage";
import AddEdgeDialog, { EdgeSelection } from "@/components/AddEdgeDialog";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const storage = useReactiveGraphStorage();

  const graph = new GenericGraph(storage);

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
          <select>
            <option>Vertex 1</option>
          </select>
          <select>
            <option>Vertex 2</option>
          </select>
          <button>Add edge</button>
        </div>
        <div className="flex flex-row justify-start">
          <input type="checkbox" id="directional" />
          <label htmlFor="directional">Directional</label>
        </div>
        <div className="flex flex-row justify-start">
          <input type="checkbox" id="muledge" />
          <label htmlFor="muledge">Multiple edges</label>
        </div>
        <div className="flex flex-row justify-start">
          <input type="checkbox" id="loop" />
          <label htmlFor="loop">Loops</label>
        </div>
        <div className="flex flex-row justify-start">
          <button>Run BFS</button>
        </div>
      </div>
      <GraphVis graph={graph}></GraphVis>
    </main>
  );
}

