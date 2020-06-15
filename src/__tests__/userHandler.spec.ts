import { addUser, getUser, removeUser} from '../userHandler';

describe('userHandler', () => {
  describe('adduser', () => {
    test('should return the userObject', () => {
      expect(addUser('1', 'Doug')).toMatchObject({user:{id: '1', name: 'Doug'}});
    });
    test('should return the userObject', () => {
      expect(addUser('2', 'Sam')).toMatchObject({user:{id: '2', name: 'Sam'}});
    });
    test('should return error if trying to use same name', () => {
      expect(addUser('3', 'Sam')).toMatchObject({error: 'Username already in use'});
    });
  });
  describe('getuser',() => {
    test('should return correct user', () => {
      const res1 = getUser('1');
      const res2 = getUser('2');
      expect(res1).toMatchObject({id: '1', name: 'Doug'});
      expect(res2).toMatchObject({id: '2', name: 'Sam'});
    });
  });
  describe('removeUser', () => {
    test('should return removed user', () => {
      const res = removeUser('1');
      expect(res).toMatchObject({id: '1', name: 'Doug'});
    });
    test('should remove specified user', () => {
      const res = getUser('1');
      expect(res).toBe(undefined);
    });
  });
});