export interface TreeNode {
  id: number;
  parentId: number | null;
  name: string;
  children?: TreeNode[];
}

export interface NodeInfo {
  node: TreeNode;
  parents: TreeNode[];
  children: TreeNode[];
}