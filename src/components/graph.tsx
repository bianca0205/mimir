import { ForceGraph2D } from 'react-force-graph';
import { useReadCypher } from 'use-neo4j';
import { useEffect, useMemo, useRef } from 'react';

const Graph = () => {

    // useEffect(() => {
    //     const fg = graphRef.current;
    //     fg.d3Force('link').distance(link => )
    // }, [])

    const graphRef = useRef<any>();

    const query: string = "MATCH (m)-[r]->(n) RETURN m,n LIMIT 500";
    // const params = { name: "Thriller" }
    const { loading, records, error } = useReadCypher(query, {})

    let result: React.ReactNode;

    console.log(records)

    useEffect(() => {
        graphRef.current!.d3Force('link').distance()
    }, [])

    const data = useMemo(() => {

        let nodes: { id: string, label: string }[] = [];
        let links: { source: string, target: string }[] = []

        if (loading) {
            result = (<p>Loading...</p>)
        }

        else if (records) {
            links = records.map(r => {
                const firstNode = r.get('m');
                const firstNodeLabel = firstNode.labels[0];
                let firstNodeName = ""
                if (firstNodeLabel === 'Genre' || firstNodeLabel === 'Person' || firstNodeLabel === 'Actor' || firstNodeLabel === 'Director' || firstNodeLabel === 'User') {
                    firstNodeName = firstNode.properties.name;
                }
                else {
                    firstNodeName = firstNode.properties.title
                }
                const secondNode = r.get('n');
                const secondNodeLabel = secondNode.labels[0];
                let secondNodeName = ""
                if (secondNodeLabel === 'Genre' || secondNodeLabel === 'Person' || secondNodeLabel === 'Actor' || secondNodeLabel === 'Director' || secondNodeLabel === 'User') {
                    secondNodeName = secondNode.properties.name;
                }
                else {
                    secondNodeName = secondNode.properties.title
                }

                if (!nodes.find(node => node.id === firstNodeName)) {
                    nodes.push({ id: firstNodeName, label: firstNodeLabel })
                }
                if (!nodes.find(node => node.id === secondNodeName)) {
                    nodes.push({ id: secondNodeName, label: secondNodeLabel })
                }
                return { source: firstNodeName, target: secondNodeName }
            })
        }

        else {
            console.log(error)
        }
        console.log({ nodes, links })
        return { nodes, links }
    }, [records])


    result = (
        <ForceGraph2D
            ref={graphRef}
            graphData={data}
            nodeLabel={node => {
                return node.name;
            }}
            nodeAutoColorBy="label"
            nodeCanvasObjectMode={() => 'after'}
            nodeRelSize={6}
            height={800}
            width={1400}
            backgroundColor='lightgray'
            nodeCanvasObject={(node, ctx, globalScale) => {
                const label = node.id;
                const fontSize = 12 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'black'; //node.color;
                ctx.fillText(label, node.x!, node.y! - 10);
            }}
        />
    )


    return (
        <div style={{ width: '100%' }}>
            <div>Graph</div>
            {result && result}
        </div>
    );
}

export default Graph;