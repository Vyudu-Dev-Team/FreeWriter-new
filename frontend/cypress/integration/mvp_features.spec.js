describe('MVP Features', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('allows user to register', () => {
    cy.get('a[href="/register"]').click();
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="password2"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('allows user to login', () => {
    cy.get('a[href="/login"]').click();
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('allows user to create a new story', () => {
    cy.login('test@example.com', 'password123');
    cy.visit('/dashboard');
    cy.contains('Create New Story').click();
    cy.get('input[name="title"]').type('My Test Story');
    cy.get('button[type="submit"]').click();
    cy.contains('My Test Story').should('be.visible');
  });

  it('allows user to write in the story workspace', () => {
    cy.login('test@example.com', 'password123');
    cy.visit('/dashboard');
    cy.contains('My Test Story').click();
    cy.get('.ql-editor').type('Once upon a time...');
    cy.contains('Saving...').should('be.visible');
    cy.contains('All changes saved').should('be.visible');
  });

  it('allows user to use the AI assistant', () => {
    cy.login('test@example.com', 'password123');
    cy.visit('/write/1');
    cy.get('input[placeholder="Ask Virgil for writing assistance..."]').type('Suggest a plot twist');
    cy.get('button').contains('Get Assistance').click();
    cy.get('.MuiPaper-root').should('contain.text', 'Here\'s a suggestion for a plot twist:');
  });

  it('allows user to create and manage cards', () => {
    cy.login('test@example.com', 'password123');
    cy.visit('/deck');
    cy.get('button').contains('Create New Card').click();
    cy.get('select[name="cardType"]').select('character');
    cy.get('input[name="cardName"]').type('John Doe');
    cy.get('textarea[name="cardDescription"]').type('A mysterious stranger');
    cy.get('button').contains('Create Card').click();
    cy.contains('John Doe').should('be.visible');
  });

  it('allows user to view and update their profile', () => {
    cy.login('test@example.com', 'password123');
    cy.visit('/profile');
    cy.get('input[name="username"]').clear().type('updateduser');
    cy.get('button').contains('Update Profile').click();
    cy.contains('Profile updated successfully').should('be.visible');
  });
});