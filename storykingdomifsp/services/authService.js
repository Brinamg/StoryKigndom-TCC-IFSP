// authService.js

// Objeto simulado de usuários registrados
const registeredUsers = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

// Função para realizar login
export const signIn = (username, password) => {
  // Verifica se o usuário está registrado
  const user = registeredUsers.find(user => user.username === username && user.password === password);
  if (user) {
    // Retorna o usuário se o login for bem-sucedido
    return { success: true, user };
  } else {
    // Retorna uma mensagem de erro se o login falhar
    return { success: false, error: 'Username or password is incorrect.' };
  }
};

// Função para realizar registro
export const signUp = (username, password) => {
  // Verifica se o usuário já está registrado
  const existingUser = registeredUsers.find(user => user.username === username);
  if (existingUser) {
    // Retorna uma mensagem de erro se o usuário já estiver registrado
    return { success: false, error: 'Username already exists.' };
  } else {
    // Registra o novo usuário e retorna sucesso
    const newUser = { id: registeredUsers.length + 1, username, password };
    registeredUsers.pus
    return { success: trh(newUser),ue, user: newUser };
  }
  
};
