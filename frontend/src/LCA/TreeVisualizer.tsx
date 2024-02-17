import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { TreeNode, deserialize } from './LCA';

const TreeVisualizer = (data:{ tree:string, p:string, q:string}) => {
  const d3Container = useRef(null);
  const [error, setError] = useState(''); // State to track errors

  const drawTree = (root:TreeNode) => {
    const margin = { top: 20, right: 90, bottom: 30, left: 90 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    
    d3.select(d3Container.current).selectAll('*').remove(); // Clear the SVG on re-render

    // Set up the SVG with the proper width and height
    const svg = d3.select(d3Container.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
    // Create the tree layout
    const treeLayout = d3.tree().size([height, width]);
  
    // Convert the tree data to a hierarchy
    const rootHierarchy = d3.hierarchy(root, (d) => [d.leftChild, d.rightChild].filter((child): child is TreeNode => child !== null));
  
    // Assuming treeLayout is already defined and configured correctly
    const treeData = treeLayout(rootHierarchy as d3.HierarchyNode<unknown>);

    // Correcting the path generator function usage
    const linkGenerator = d3.linkVertical()
      .x(d => d[0])
      .y(d => d[1]);

    // Add links between nodes
    const links = svg.selectAll('.link')
      .data(treeData.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', d => linkGenerator({
        source: [d.source.y, d.source.x], // Convert the source to an array [y, x]
        target: [d.target.y, d.target.x]  // Convert the target to an array [y, x]
      }))
      .attr('fill', 'none')
      .attr('stroke', '#555')
      .attr('stroke-width', '1.5px');
    
    // Add nodes
    const node = svg.selectAll('.node')
      .data(treeData.descendants())
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.y}, ${d.x})`);
  
    // Add circles for each node
    node.append('circle')
      .attr('r', 10)
      .style('fill', (d) =>
      {
        if((d.data as any).isLCA) return 'green';
        return (d.data as any).isPorQ ? 'red' : 'steelblue'
      }).style('stroke', (d)=>{
        if((d.data as any).isLCA && (d.data as any).isPorQ) return 'red';
        return 'steelblue'
      });
  
    // Add labels for each node
    node.append('text')
      .attr('dy', '.35em')
      .attr('x', (d) => d.children ? -13 : 13)
      .style('text-anchor', (d) => d.children ? 'end' : 'start')
      .text((d) => (d.data as any).val);
  };
  

  useEffect(() => {
    setError('')
    if (data && data.p !== '' && data.q !== '' && data.tree !== '') {

        if(isNaN(parseInt(data.p)) || isNaN(parseInt(data.q))){
          setError('Invalid input for p or q'); 
          return;
        }
        // wait 100ms to allow the DOM to update
        setTimeout(() => {
          const root = deserialize(data.tree,parseInt(data.p),parseInt(data.q));
          if(!root) 
          {
            setError('Invalid tree data');
            return;
          }
          drawTree(root);
        }, 100);
    }
  }, [data]);

  return (
    <div>
      {error!=='' ? (
        <div>{error}</div>
      ) : (
        <svg ref={d3Container} />
      )}
    </div>
  );
};

export default TreeVisualizer;
