import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FamilyTreeService } from '../../shared/family-tree.service';
import { FamilyTree } from '../../shared/types/familyTree';
import { SortMode } from '../../shared/types/sortMode';

@Component({
    selector: 'app-tree-list',
    templateUrl: './tree-list.component.html',
    styleUrls: ['./tree-list.component.scss'],
})
export class TreeListComponent {
    sortMode: SortMode = SortMode.lastChanged;
    treeList$: Observable<FamilyTree[]>;
    treeList: FamilyTree[] = [];

    page = 1;
    pageSize = 4;

    createFamilyTreeForm = new FormGroup({
        treeName: new FormControl(),
    });

    mode: 'edit' | 'view' | 'add' = 'view';

    constructor(
        private familyTreeService: FamilyTreeService,
        private router: Router
    ) {
      this.treeList$ = this.familyTreeService.getTreeListSorted(this.sortMode);
      this.treeList$.toPromise().then((value) => this.treeList = value)
    }

    onCreateFamilyTree(): void {
        this.familyTreeService
            .createEmptyFamilyTree(
                this.createFamilyTreeForm.controls.treeName.value
            )
            .subscribe((response) => {
                this.setMode('view');
                this.router.navigate(['trees/' + response.id]);
                this.treeList$ = this.familyTreeService.getTreeListSorted(
                    this.sortMode
                );
            });
      this.treeList$.toPromise().then((value) => this.treeList = value)
    }

    setMode(mode: 'edit' | 'view' | 'add'): void {
        this.mode = mode;
        if (mode === 'add') {
            this.pageSize = 4;
        } else {
            this.pageSize = 5;
        }
    }

    setSortMode(sortMode: number): void {
        this.sortMode = sortMode;
        this.treeList$ = this.familyTreeService.getTreeListSorted(
            this.sortMode
        );
      this.treeList$.toPromise().then((value) => this.treeList = value)
    }

    deleteTree(id: string): void {
        this.familyTreeService.deleteFamilyTree(id).subscribe(
            () => {},
            () => {
                this.treeList$ = this.familyTreeService.getTreeListSorted(
                    this.sortMode
                );
            }
        );
      // tslint:disable-next-line:no-non-null-assertion
      this.treeList.splice(this.treeList.indexOf(this.treeList.find(tree => tree.id = id)!),1)
      this.treeList$.toPromise().then((value) => this.treeList = value)
    }

    openTree(id: string): void {
        if (this.mode === 'view') {
            this.router.navigate(['/trees/' + id]);
        }
    }

    onFileImport(event: any): void {
        const file: File = event.target.files[0];
        this.familyTreeService.importTree(file)
            .subscribe(() => {
              this.treeList$ = this.familyTreeService.getTreeListSorted(this.sortMode);
              this.treeList$.toPromise().then((value) => this.treeList = value);
            })
    }

    updateTreeName(newName: string, tree: FamilyTree): void {
      tree.name = newName;
      this.familyTreeService.updateFamilyTree(tree).subscribe(
        () => {
          if (this.sortMode === SortMode.alphabetic) {
            this.treeList$ = this.familyTreeService.getTreeListSorted(
              this.sortMode
            );
            this.treeList$.toPromise().then((value) => this.treeList = value)
          }
        },
      )

    }
}
