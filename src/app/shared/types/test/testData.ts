import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FamilyTree } from '../familyTree';
import { Gender } from '../gender';
import { Person } from '../person';
import { Time } from '../time';

export class TestData {
  static testSon: Person = {
    id: 1243,
    firstName: 'Sören',
    lastName: 'Sohn',
    gender: Gender.MALE,
    birthDate: new NgbDate(2010, 1, 1),
  };
  static testDaughter: Person = {
    id: 1432,
    firstName: 'Tanja',
    lastName: 'Tochter',
    gender: Gender.FEMALE,
    birthDate: new NgbDate(2010, 1, 1),
  };
  static testDiverseKid: Person = {
    id: 6969,
    firstName: 'AEX12rÈ',
    lastName: 'Abkömmling',
    gender: Gender.DIVERSE,
    birthDate: new NgbDate(2015, 4, 20),
  };
  static testFather: Person = {
    id: 1234,
    firstName: 'Volker',
    lastName: 'Vater',
    gender: Gender.MALE,
    birthDate: new NgbDate(2000, 1, 1),
    children: [TestData.testSon.id, TestData.testDaughter.id, TestData.testDiverseKid.id],
  };
  static testMother: Person = {
    id: 1324,
    firstName: 'Marianne',
    lastName: 'Mutter',
    gender: Gender.FEMALE,
    birthDate: new NgbDate(2000, 1, 1),
    children: [TestData.testSon.id, TestData.testDaughter.id, TestData.testDiverseKid.id],
  };
  static testGrandFather: Person = {
    id: 1111,
    firstName: 'Gustaf',
    lastName: 'Großvater',
    gender: Gender.MALE,
    birthDate: new NgbDate(1969, 1, 1),
    deathDate: new NgbDate(2020, 1, 1),
    children: [TestData.testFather.id],
  };
  static testGrandMother: Person = {
    id: 2222,
    firstName: 'Gundula',
    lastName: 'Großmutter',
    gender: Gender.FEMALE,
    birthDate: new NgbDate(1420, 1, 1),
    deathDate: new NgbDate(2010, 1, 1),
    children: [TestData.testFather.id],
  };

  static testPersons: Map<number, Person> = new Map<number, Person>([
    [1111, TestData.testGrandFather],
    [2222, TestData.testGrandMother],
    [1234, TestData.testFather],
    [1324, TestData.testMother],
    [1243, TestData.testSon],
    [1432, TestData.testDaughter],
    [6969, TestData.testDiverseKid],
  ]);

  static testTree: FamilyTree = {
    id: '0',
    name: 'Stammbaum1',
    persons: new Map(TestData.testPersons),
    lastChanged: { date: new NgbDate(2021, 6, 9), time: new Time(12, 34, 56) },
  };

  static testList: Map<string, FamilyTree> = new Map<string, FamilyTree>([
    ['0', TestData.testTree],
    ['1', { id: '1', name: 'Stammbaum2', persons: new Map(), lastChanged: {date: new NgbDate(2021, 4, 9), time: new Time(12,34,56)} }],
    ['2', { id: '2', name: 'Stammbaum3', persons: new Map(), lastChanged: {date: new NgbDate(2021, 2, 9), time: new Time(12,34,56)} }],
    ['3', { id: '3', name: 'Stammbaum4', persons: new Map(), lastChanged: {date: new NgbDate(2021, 5, 9), time: new Time(12,10,56)} }],
    ['4', { id: '4', name: 'Stammbaum5', persons: new Map(), lastChanged: {date: new NgbDate(2021, 5, 9), time: new Time(12,34,56)} }],
    ['5', { id: '5', name: 'Stammbaum6', persons: new Map(), lastChanged: {date: new NgbDate(2021, 4, 9), time: new Time(12,34,56)} }],
    ['6', { id: '6', name: 'Stammbaum7', persons: new Map(), lastChanged: {date: new NgbDate(2021, 5, 9), time: new Time(12,34,56)} }],
    ['7', { id: '7', name: 'Stammbaum8', persons: new Map(), lastChanged: {date: new NgbDate(2021, 5, 23), time: new Time(12,10,56)} }],
    ['8', { id: '8', name: 'Stammbaum9', persons: new Map(), lastChanged: {date: new NgbDate(2021, 5, 9), time: new Time(12,34,56)} }],
    ['9', { id: '9', name: 'Stammbaum10', persons: new Map(), lastChanged: {date: new NgbDate(2021, 8, 12), time: new Time(12,34,56)} }],
    ['10', { id: '10', name: 'Stammbaum11', persons: new Map(), lastChanged: {date: new NgbDate(2021, 5, 9), time: new Time(12,34,56)} }],
  ]);
}
