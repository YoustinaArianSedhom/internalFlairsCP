import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  Injectable,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { OrganizationState } from '@modules/organization/state/organization.state';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { BehaviorSubject, Observable } from 'rxjs';
import * as CLIENTS_ACTIONS from '../../state/organization.actions';
import * as CLIENTS_MODELS from '../../models/clients.models';
import { Select } from '@ngxs/store';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

/**
 * Node for to-do item
 */
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
  id: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
  id: string;
}

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  @Select(OrganizationState.Tree)
  public Tree$: Observable<CLIENTS_MODELS.Tree[]>;

  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }

  constructor() {
    // this._getOrganization();
    // this.initialize();
    this.Tree$.subscribe((value) => {
      if (value) {
        const data = this.buildFileTree(value, 0);
        this.dataChange.next(data);
      }
    });
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    this.Tree$.subscribe((value) => {
      const data = this.buildFileTree(value, 0);
      this.dataChange.next(data);
    });
    // console.log('tree', this.Tree);

    // Notify the change.
  }

  // @Dispatch() private _getOrganization() {
  //   return new CLIENTS_ACTIONS.getTree();
  // }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   *
   * @param level
   */
  buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      if (key === 'id' || key === 'name') {
        return accumulator;
      }

      let value = obj[key];
      const node = new TodoItemNode();
      if (key == 'platforms') {
      }
      if (!!Number(key) || key === '0') {
        node.item = obj[key].name;
        node.id = obj[key].id;
      } else {
        node.item = key;
      }

      if (value != null) {
        if (typeof value === 'object') {
          if (obj[key].platforms && obj[key].platforms.length) {
            value = obj[key].platforms;
          } else if (obj[key].portfolios && obj[key].portfolios.length) {
            value = obj[key].portfolios;
          } else if (obj[key].departments && obj[key].departments.length) {
            value = obj[key].departments;
          }
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }
      return accumulator.concat(node);
    }, []);
  }

  /**
   * Add an item to to-do list
   *
   * @param parent
   * @param name
   */
  insertItem(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({ item: name } as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}

interface SelectedLevelIds {
  clientIDS: string[];
  portfolioIDS: string[];
  teamIDS: string[];
  departmentsIDS: departmentsIDS[];
}

interface departmentsIDS {
  platformId: string;
  departments: number[];
}

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'clients-tree',
  templateUrl: './clients-tree.component.html',
  styleUrls: ['./clients-tree.component.scss'],
  providers: [ChecklistDatabase],
})
export class ClientsTreeComponent implements OnChanges {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(
    true /* multiple */
  );

  @Input() checkedIds;

  @Output() selectedLevelIds = new EventEmitter<SelectedLevelIds>();

  levelMap: SelectedLevelIds = {
    clientIDS: [],
    portfolioIDS: [],
    teamIDS: [],
    departmentsIDS: [],
  };

  constructor(private _database: ChecklistDatabase) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    _database.dataChange.subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  ngOnChanges() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    this._database.dataChange.subscribe((data) => {
      this.dataSource.data = data;
    });
    if (this.checkedIds) {
      let clients = this.checkedIds.clientIDS;
      let portfolios = this.checkedIds.portfolioIDS;
      let teams = this.checkedIds.TeamIDS;
      let departments = this.checkedIds.departmentsIDS;

      let tree = this.treeControl.dataNodes;
      for (let y = 0; y < this.treeControl.dataNodes.length; y++) {
        for (let i = 0; i < clients.length; i++) {
          if (tree[y].id == clients[i]) {
            this.todoItemSelectionToggle(tree[y]);
          }
        }
        for (let i = 0; i < portfolios.length; i++) {
          if (tree[y].id == portfolios[i]) {
            // console.log(tree[y].id == portfolios[i]);
            this.todoItemSelectionToggle(tree[y]);
          }
        }
        for (let i = 0; i < teams.length; i++) {
          if (tree[y].id == teams[i]) {
            this.todoItemSelectionToggle(tree[y]);
          }
        }

        for (let i = 0; i < departments.length; i++) {
          let parent: TodoItemFlatNode | null = this.getParentNode(tree[y]);
          // if (tree[y].id == departments[i]) {
          //   this.todoItemSelectionToggle(tree[y]);
          // }
          
          if (parent && parent.id === departments[i].platformId && departments[i].departments.includes(+tree[y].id)) {
            this.todoItemSelectionToggle(tree[y]);
          }
        }
      }
    }
  }

  getIdsOfSelectedNode(node: TodoItemNode) {
    const flatNode = this.nestedNodeMap.get(node);
    let parent: TodoItemFlatNode | null = this.getParentNode(flatNode);
    if (this.checklistSelection.isSelected(flatNode)) {
      switch (flatNode.level) {
        case 0:
          this.levelMap.clientIDS.push(flatNode.id);
          break;
        case 1:
          this.levelMap.portfolioIDS.push(flatNode.id);
          break;
        case 2:
          this.levelMap.teamIDS.push(flatNode.id);
          break;
        case 3:
          let found = this.levelMap.departmentsIDS.findIndex(
            ({ platformId }) => platformId === parent.id
          );
          if (found !== -1) {
            if (
              this.levelMap.departmentsIDS[found].departments.includes(+node.id)
            ) {
              let indexOfNodeId = this.levelMap.departmentsIDS[
                found
              ].departments.indexOf(+node.id);
              this.levelMap.departmentsIDS[found].departments.splice(
                indexOfNodeId,
                1
              );
            } else {
              this.levelMap.departmentsIDS[found].departments.push(+node.id);
            }
          } else {
            this.levelMap.departmentsIDS.push({
              platformId: parent.id,
              departments: [+node.id],
            });
          }
          break;
        default:
          break;
      }
      console.log(this.levelMap);
      return;
    }
    if (node.children.length) {
      this.DFS(0, node.children);
    }
  }

  DFS(index: number, nodesArray: TodoItemNode[]) {
    if (index >= nodesArray.length) {
      return;
    }
    this.getIdsOfSelectedNode(nodesArray[index]);
    this.DFS(index + 1, nodesArray);

    // if (typeof node === TodoItemNode) // console.log('data', this.dataSource.data);
    // this.dataSource.data.forEach((client) => {
    //   this.getIdsOfSelectedNodes(client);
    // });
  }
  getSelectedIds() {
    this.levelMap = {
      clientIDS: [],
      portfolioIDS: [],
      teamIDS: [],
      departmentsIDS: [],
    };
    this.DFS(0, this.dataSource.data);
    console.log("emit", this.levelMap);
    this.selectedLevelIds.emit(this.levelMap);
  }

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) =>
    _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   *
   * @param node
   * @param level
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.id = node.id;

    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /**
   * Whether all the descendants of the node are selected.
   *
   * @param node
   */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    // console.log('nodeAll', node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /**
   * Whether part of the descendants are selected
   *
   * @param node
   */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    if (this.checklistSelection.isSelected(node)) {
      // console.log('partially', node);
    }
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /**
   * Toggle the to-do item selection. Select/deselect all the descendants node
   *
   * @param node
   */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    // console.log('nodeItem', node);
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach((child) => {
      this.checklistSelection.isSelected(child);
    });
    this.checkAllParentsSelection(node);
    this.getSelectedIds();
  }

  /**
   * Toggle a leaf to-do item selection. Check all the parents to see if they changed
   *
   * @param node
   */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    // let team = this.levelMap.teamIDS.filter((id) => id === node.id);

    // this.levelMap.teamIDS.push(node.id);
    console.log('leaf');

    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this.getSelectedIds();
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    // this.checkRootNodeSelection(node);

    let parent: TodoItemFlatNode | null = this.getParentNode(node);

    // if (node.level === 3) {
    //   let found = this.levelMap.departmentsIDS.findIndex(
    //     ({ platformId }) => platformId === parent.id
    //   );
    //   if (found !== -1) {
    //     if (this.levelMap.departmentsIDS[found].departments.includes(node.id)) {
    //       let indexOfNodeId = this.levelMap.departmentsIDS[
    //         found
    //       ].departments.indexOf(node.id);
    //       this.levelMap.departmentsIDS[found].departments.splice(
    //         indexOfNodeId,
    //         1
    //       );
    //     } else {
    //       this.levelMap.departmentsIDS[found].departments.push(node.id);
    //     }
    //   } else {
    //     this.levelMap.departmentsIDS.push({
    //       platformId: parent.id,
    //       departments: [node.id],
    //     });
    //   }
    // }

    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /**
   * Check root node checked state and change it accordingly
   *
   * @param node
   */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
}
