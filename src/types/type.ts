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
type TYPES = 'Boolean' | 'Number' | 'String' | 'Function' | 'Array' | 'Date' | 'RegExp'| 'Object' | 'Error';
export type Utils = {
  [K in TYPES as `is${K}`]: (obj: any) => boolean;
};