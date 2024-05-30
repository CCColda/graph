import Image from "next/image";
import { Inter } from "next/font/google";
import GraphVis from "@/components/GraphVis";
import { GenericGraph, GenericGraphVertex, GenericGraphEdge, GraphVertexID, GraphError } from "@/graph/GenericGraph";
import Vertex from "@/graph/Vertex";
import Edge from "@/graph/Edge";

const inter = Inter({ subsets: ["latin"] });





export default function Home() {
  const graph = new GenericGraph<Vertex>()

  graph.addVertex(new Vertex("a"));
  graph.addVertex(new Vertex("b"));
  graph.addVertex(new Vertex("c"));
  graph.addVertex(new Vertex("d"));

  try {
    graph.addEdge(new Edge(
      graph.getVertexByIdentifier("a")!,
      graph.getVertexByIdentifier("b")!));

    graph.addEdge(new Edge(
      graph.getVertexByIdentifier("b")!,
      graph.getVertexByIdentifier("c")!));

    graph.addEdge(new Edge(
      graph.getVertexByIdentifier("c")!,
      graph.getVertexByIdentifier("d")!));

    graph.addEdge(new Edge(
      graph.getVertexByIdentifier("d")!,
      graph.getVertexByIdentifier("b")!));
  }
  catch (error) {
    debugger;
    console.error(`Error occured: ${error}`);
  }
  finally {
    console.debug(graph);
  }


  return (
    <main className="w-full h-full flex flex-row justify-start align-stretch">
      <div className="flex flex-col justify-center">
        <div className="flex flex-row justify-start">
          <input type="text" placeholder="vertex name"></input>
          <button>Add vertex</button>
        </div>
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
