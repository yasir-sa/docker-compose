describe('Todo API - Basic Tests', () => {
  test('todo item has required fields', () => {
    const todo = { id: 1, text: 'Buy groceries', completed: false };
    expect(todo).toHaveProperty('id');
    expect(todo).toHaveProperty('text');
    expect(todo).toHaveProperty('completed');
  });

  test('todo text should be a string', () => {
    const todo = { id: 1, text: 'Learn Jenkins', completed: false };
    expect(typeof todo.text).toBe('string');
  });

  test('completed should be boolean', () => {
    const todo = { id: 1, text: 'Setup CI/CD', completed: false };
    expect(typeof todo.completed).toBe('boolean');
  });

  test('todo id should be a number', () => {
    const todo = { id: 42, text: 'Deploy to Render', completed: true };
    expect(typeof todo.id).toBe('number');
  });
});
