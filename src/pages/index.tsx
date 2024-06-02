import Page from "@/components/Page";
import { Graph } from "@/logic/genericgraph/GenericGraph";
import Edge from "@/logic/graph/Edge";
import Vertex from "@/logic/graph/Vertex";
import LocalGraphStorage from "@/logic/graphstorage/LocalGraphStorage";

export default function Home() {
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

  return <Page startingGraph={localGraph} />
}