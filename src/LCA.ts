

class TreeNode {
    val: number
    leftChild: TreeNode | null
    rightChild: TreeNode | null
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val===undefined ? 0 : val)
        this.leftChild = (left===undefined ? null : left)
        this.rightChild = (right===undefined ? null : right)
    }
}

/**
 * LCA. I actually took some time to understand the solution and comment it out, even though it's a well known algorithm.
 */
export function lowestCommonAncestor(root: TreeNode | null, p: TreeNode | null, q: TreeNode | null): TreeNode | null {
    if(root === null) return null; //if root is null, return null. Stops the recursion chain
    if(root === p || root === q) return root; // if root is p or q, return root. Returns the branch with p or q as the root

    let left = lowestCommonAncestor(root.leftChild, p, q); //recursively call the function on the left branch, if any
    let right = lowestCommonAncestor(root.rightChild, p, q); //recursively call the function on the right branch, if any

    if(left !== null && right !== null) return root; // if both l&r were found, we have found the LCA in different branches

    return left || right; // then left or right will be the LCA, because they are on the same branch and one contains the other
    
};