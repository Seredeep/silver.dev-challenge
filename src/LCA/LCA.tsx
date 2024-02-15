import React, { useState } from 'react';

export class TreeNode {
  val: number
  leftChild: TreeNode | null
  rightChild: TreeNode | null
  isPorQ: boolean
  isLCA: boolean
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null, isPorQ?: boolean) {
      this.val = (val===undefined ? 0 : val)
      this.leftChild = (left===undefined ? null : left)
      this.rightChild = (right===undefined ? null : right)
      this.isPorQ = (isPorQ===undefined ? false : isPorQ)
      this.isLCA = false;
  }
}

/**
* Least Common Ancestor. I actually took some time to understand the solution and comment it out, even though it's a well known algorithm.
*/
export function LCA(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
  if(root === null) return null; //if root is null, return null. Stops the recursion chain
  if(root === p || root === q) return root; // if root is p or q, return root. Returns the branch with p or q as the root

  let left = LCA(root.leftChild, p, q); //recursively call the function on the left branch, if any
  let right = LCA(root.rightChild, p, q); //recursively call the function on the right branch, if any

  if(left !== null && right !== null) return root; // if both l&r were found, we have found the LCA in different branches

  return left || right; // then left or right will be the LCA, because they are on the same branch and one contains the other
  
};

/**
 * Deserializes a string into a TreeNode structure and finds the LCA of two nodes
 */
export function deserialize(string:string, p:number, q:number): TreeNode|undefined{

  let splitted = string.slice(1, -1).split(',')
  if(splitted.filter(val => val !== 'null').some(val => isNaN(parseInt(val)))) return undefined;

  let nodes = splitted.map(val =>{
      if(val === 'null') return null;
      const parsedVal = parseInt(val);
      return new TreeNode(parsedVal,null,null, parsedVal === p || parsedVal === q);
    }
  );
  let children:TreeNode[] = [];
  nodes.forEach((node, index) => {
    if (node !== null) {
      node.leftChild = nodes[index * 2 + 1] || null;
      node.rightChild = nodes[index * 2 + 2] || null;
      children.push(node);
    }
  });
  const lca=LCA(children[0], children.find(node => node.val===p)!, children.find(node => node.val===q)!)
  children[children.findIndex(node => node.val === lca!.val)]!.isLCA = true;
  return children[0] || null;
};

const LowestCommonAncestor = () => {
  const [nodeP, setNodeP] = useState('');
  const [nodeQ, setNodeQ] = useState('');
  const [ancestor, setAncestor] = useState(null);

  const handleFindAncestor = () => {

  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Node P"
          value={nodeP}
          onChange={(e) => setNodeP(e.target.value)}
        />
        <input
          type="text"
          placeholder="Node Q"
          value={nodeQ}
          onChange={(e) => setNodeQ(e.target.value)}
        />
        <button onClick={handleFindAncestor}>Find LCA</button>
      </div>
      <div>
        <h2>Lowest Common Ancestor:</h2>
        {ancestor && <div>{ancestor}</div>}
      </div>
    </div>
  );
};

export default LowestCommonAncestor;