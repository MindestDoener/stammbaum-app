import { Injectable } from '@angular/core';
import { TestData } from './types/test/testData';
import { FamilyTree } from './types/familyTree';
import { Person } from './types/person';
import { CreatePersonRequest } from './types/createPersonRequest';
import { SortMode } from './types/sortMode';
import { makeUUID } from './types/uuid';
import { getNow, getToday, Time } from './types/time';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Config, CreateFamilyTreeModel, FamilyTreeModel } from './api/models/familyTreeModel';
import { AuthService } from './auth.service';
import { TreeApiService } from './api/tree-api.service';

@Injectable({
  providedIn: 'root',
})
export class FamilyTreeService {
  familyTreeMap: Map<string, FamilyTree> = TestData.testList;

  constructor(private auth: AuthService, private treeApi: TreeApiService) {
  }

  public static mapModelToObject(tree: FamilyTreeModel): FamilyTree {
    const lastChanged = tree.config.lastChanged;
    const personMap: Map<number, Person> = new Map(tree.config.persons);
    return {
      ...tree.config,
      id: tree.id.toString(),
      persons: personMap,
      lastChanged: {
        date: new NgbDate(
          lastChanged.date.year,
          lastChanged.date.month,
          lastChanged.date.day,
        ),
        time: new Time(
          lastChanged.time.hours,
          lastChanged.time.minutes,
          lastChanged.time.seconds,
        ),
      },
    };
  }

  static tree2Blob(tree: FamilyTree): Blob {
    const parsableTree = { ...tree, persons: Array.from(tree.persons) };
    return new Blob([JSON.stringify(parsableTree)], { type: 'application/json' });
  }

  private static sortByLastChanged(list: FamilyTree[]): FamilyTree[] {
    return list.sort((a, b) => {
      if (a && b) {
        if (a.lastChanged.date.before(b.lastChanged.date)) {
          return 1;
        }
        if (a.lastChanged.date.after(b.lastChanged.date)) {
          return -1;
        }
        if (a.lastChanged.time.before(b.lastChanged.time)) {
          return 1;
        }
        if (a.lastChanged.time.after(b.lastChanged.time)) {
          return -1;
        }
      }
      return 0;
    });
  }

  private static sortByNameAlphabetic(list: FamilyTree[]): FamilyTree[] {
    return list.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }

  private static sortByNumberOfPersons(list: FamilyTree[]): FamilyTree[] {
    return list.sort((a, b) => {
      return b.persons.size - a.persons.size;
    });
  }

  createEmptyFamilyTree(name: string): Observable<FamilyTreeModel> {
    const familyTree: CreateFamilyTreeModel = {
      config: {
        name,
        persons: Array.from(new Map<number, Person>()),
        lastChanged: { date: getToday(), time: { hours: getNow().hours, minutes: getNow().minutes, seconds: getNow().seconds || 0 } },
      },
      username: this.auth.getUsername(),
    };
    return this.treeApi.createTree(familyTree);
  }

  importTree(file: File): Observable<FamilyTreeModel> {
    return new Observable<FamilyTreeModel>(resultObserver => {
      const readFile = new Observable<Config>(observer => {
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = () => {
          observer.next(JSON.parse(reader.result as string));
        };
        reader.onerror = () => {
          observer.error(reader.error);
        };
      });

      readFile.subscribe(data => {
        const familyTree: CreateFamilyTreeModel = {
          config: {
            name: data.name,
            persons: data.persons,
            lastChanged: data.lastChanged,
          },
          username: this.auth.getUsername(),
        };
        this.treeApi.createTree(familyTree).subscribe(tree => {
          resultObserver.next(tree);
        });
      });
    });
  }

  deleteFamilyTree(id: string): Observable<any> {
    return this.treeApi.deleteTree(id);
  }

  updateFamilyTree(tree: FamilyTree): Observable<any> {
    const newTree: CreateFamilyTreeModel = {
      config: {
        name: tree.name,
        persons: Array.from(tree.persons),
        lastChanged: tree.lastChanged,
      },
      username: this.auth.getUsername(),
    }
    return this.treeApi.updateTree(tree.id, newTree)
  }

  addPerson(familyTree: FamilyTree, personRequest: CreatePersonRequest): Person {
    const person = {
      id: this.makeUUID(familyTree),
      ...personRequest,
    };
    familyTree.persons.set(person.id, person);
    this.updateLastChanged(familyTree).subscribe();
    return person;
  }

  // Takes Person as input and changes data of person in map with same id to data of person in parameter
  updatePerson(familyTree: FamilyTree, person: Person): void {
    familyTree.persons.set(person.id, person);
    this.updateLastChanged(familyTree).subscribe();
  }

  deletePerson(familyTree: FamilyTree, person: Person): void {
    familyTree.persons.delete(person.id);

    familyTree.persons.forEach(
      otherPerson => {
        // @ts-ignore
        otherPerson.children = otherPerson.children.filter(
          childId => childId !== person.id,
        )
        if (otherPerson.spouse === person.id) {
          otherPerson.spouse = undefined;
        }
      }
    );
    this.updateLastChanged(familyTree).subscribe();
  }

  getPersonById(familyTree: FamilyTree, id: number): Person | undefined {
    return familyTree.persons.get(id);
  }

  getPersonIdBySpouseId(familyTree: FamilyTree, spouseId: number): number | undefined {
    for (const person of familyTree.persons.values()) {
      if (person.spouse === spouseId) {
        return person.id
      }
    }
    return undefined
  }

  getTreeMap(): Map<string, FamilyTree> {
    return this.familyTreeMap;
  }

  getTreeList(): Observable<FamilyTree[]> {
    return this.treeApi.getTreesForUser();
  }

  getTreeListSorted(sortMode: SortMode): Observable<FamilyTree[]> {
    return this.getTreeList().pipe(
      map((list) => {
        switch (sortMode) {
          case SortMode.lastChanged:
            return FamilyTreeService.sortByLastChanged(list);
          case SortMode.alphabetic:
            return FamilyTreeService.sortByNameAlphabetic(list);
          case SortMode.persons:
            return FamilyTreeService.sortByNumberOfPersons(list);
        }
      }),
    );
  }

  getSingleTree(id: string | null): Observable<FamilyTree> {
    if (!id) {
      throw new Error('id was null');
    }
    return this.treeApi.getSingleTree(id);
  }

  updateLastChanged(familyTree: FamilyTree): Observable<any> {
    familyTree.lastChanged = { date: getToday(), time: getNow() };
    const updateFamilyTree: CreateFamilyTreeModel = {
      config: {
        name: familyTree.name,
        persons: Array.from(familyTree.persons),
        lastChanged: { date: familyTree.lastChanged.date, time: familyTree.lastChanged.time },
      },
      username: this.auth.getUsername(),
    };
    return this.treeApi.updateTree(familyTree.id, updateFamilyTree);
  }

  private makeUUID(tree: FamilyTree): number {
    const num = makeUUID();
    // check for duplicate ids
    if (tree.persons.has(num)) {
      return this.makeUUID(tree);
    }
    return num;
  }
}
