import { test, expect } from '@playwright/test';

test('GET /api/livros/Dom Casmurro disponível', async ({ request }) => {
  const resposta = await request.get('/api/livros/1');

  expect(resposta.status()).toBe(200);
  const livro = await resposta.json();
  expect(livro.titulo).toBe('Dom Casmurro');
  expect(livro.disponivel).toBe(true);
});

test('POST /api/livros Enviados, codigo: 201', async ({ request }) => {
  const login = await request.post('/api/auth/login', {
    data: { email: 'admin@biblioteca.com', senha: 'Admin@123' },
  });
  const { token } = await login.json();

  const novoLivro = {
    titulo: 'Grande Sertão: Veredas',
    autor: 'João Guimarães Rosa',
    isbn: String(Date.now()),
    anoPublicacao: 1956,
    quantidade: 2,
  };

  const resposta = await request.post('/api/livros', {
    headers: { Authorization: `Bearer ${token}` },
    data: novoLivro,
  });

  expect(resposta.status()).toBe(201);
  const criado = await resposta.json();
  expect(criado).toMatchObject(novoLivro);
  expect(criado.id).toBeDefined();

  const exclusao = await request.delete(`/api/livros/${criado.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(exclusao.status()).toBe(204);
});

test('POST /api/Erro de token: 401', async ({ request }) => {
  const resposta = await request.post('/api/livros', {
    data: {
      titulo: 'Livro Sem Token',
      autor: 'Autor Teste',
      isbn: String(Date.now()),
      anoPublicacao: 2000,
      quantidade: 1,
    },
  });

  expect(resposta.status()).toBe(401);
  const corpo = await resposta.json();
  expect(corpo.erro).toBe('Token não informado');
});

test('POST /api/livro: Vidas Secas indisponível', async ({ request }) => {
  const login = await request.post('/api/auth/login', {
    data: { email: 'leitor@biblioteca.com', senha: 'Leitor@123' },
  });
  const { token } = await login.json();

  const resposta = await request.post('/api/emprestimos', {
    headers: { Authorization: `Bearer ${token}` },
    data: { livroId: 4 },
  });

  expect(resposta.status()).toBe(409);
  const corpo = await resposta.json();
  expect(corpo.erro).toBe('Livro indisponível');
});