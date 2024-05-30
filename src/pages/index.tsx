import Image from "next/image";
import { Inter } from "next/font/google";
import GraphVis from "@/components/GraphVis";
import { Graph, GraphVertex, GraphEdge, GraphVertexID } from "@/graph/Graph";

const inter = Inter({ subsets: ["latin"] });

class Vertex implements GraphVertex {
  private name: string
  public chroma: number = 0
  public weight: number = 0

  constructor(name: string) {
    this.name = name
  }

  get identifier(): string {
    return this.name
  }

  toString(): string {
    return this.name
  }
}

class Edge implements GraphEdge<Vertex> {
  public vertices: [Vertex, Vertex]
  public chroma: number = 0
  public flow: number = 0
  public flow_capacity = 0
  public weight: number = 0

  constructor(v1: Vertex, v2: Vertex) {
    this.vertices = [v1, v2]
  }

  get flipped(): GraphEdge<Vertex> {
    return new Edge(this.vertices[1], this.vertices[0])
  }

  get identifier(): string {
    return this.vertices.map(v => v.identifier).join(":")
  }

  toString(): string {
    return this.vertices.map(v => v.identifier).join(" -> ")
  }
}

export default function Home() {
  const graph = new Graph<Vertex>()

  graph.addVertex(new Vertex("a"));
  graph.addVertex(new Vertex("b"));
  graph.addVertex(new Vertex("c"));
  graph.addVertex(new Vertex("d"));

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
