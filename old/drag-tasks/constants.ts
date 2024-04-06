import { faker } from '@faker-js/faker';

export const colors = ['#304FD5', '#D28B2C', '#D03753', '#3DB668', '#252C80'];
export const types = ['In Progress', 'Review', 'Blocked', 'Completed', 'Backlog'];
faker.seed(10);

interface Collaborator {
  key: string;
  uri: string;
}

interface Task {
  key: string;
  name: string;
  isDone: boolean;
  collaborators: Collaborator[];
}

interface Collaborator {
  key: string;
  uri: string;
}

interface Task {
  key: string;
  name: string;
  isDone: boolean;
  collaborators: Collaborator[];
}

export const tasks: Task[] = [...Array(faker.datatype.number({ min: 1, max: 12 })).keys()]
  .map(() => {
    return {
      key: faker.string.uuid(),
      name: faker.lorem.sentence({ min: 2, max: 4 }),
      isDone: faker.helpers.arrayElement([true, false]),
      collaborators: [...Array(faker.number.int({ min: 1, max: 2 }))].map(() => ({
        key: faker.string.uuid(),
        uri: `https://randomuser.me/api/portraits/${faker.helpers.arrayElement([
          'women',
          'men',
        ])}/${faker.number.int(60)}.jpg`,
      })),
    };
  })
  .sort((a, b) => (a.isDone ? -1 : 1));

export const circleSize = 60;
export const spacing = 20;
export const border = 4;
export const circleTotalSize = circleSize + spacing + border * 2;
export const circleTotalSize2 = circleSize + spacing;
export const maxYDrag = circleTotalSize * 2.5;
