import { test, expect } from "@playwright/test"

test("Pegando emprestimo", async ({ page, request }) => {
    const loginAdmin = await request.post("/api/auth/login", {
        data: { email: "admin@biblioteca.com", senha: "Admin@123" },
    })
    const admin = await loginAdmin.json()

    const criar = await request.post("/api/livros", {
        headers: { Authorization: `Bearer ${admin.token}` },
        data: {
            titulo: "Livro de Teste",
            autor: "Autor Teste",
            isbn: String(Date.now()),
            anoPublicacao: 2020,
            quantidade: 1,
        },
    })
    const livro = await criar.json()

    const loginLeitor = await request.post("/api/auth/login", {
        data: { email: "leitor@biblioteca.com", senha: "Leitor@123" },
    })
    const leitor = await loginLeitor.json()

    await page.addInitScript(([token, usuario]) => {
        localStorage.setItem("token", token)
        localStorage.setItem("usuario", JSON.stringify(usuario))
    }, [leitor.token, leitor.usuario])

    await page.goto(`/livros/${livro.id}`)
    await page.getByTestId("botao-emprestar").click()

    await expect(page.getByTestId("mensagem-sucesso")).toHaveText("Empréstimo realizado com sucesso")
    await expect(page.getByTestId("livro-disponibilidade")).toHaveText("Indisponível")

    const lista = await request.get("/api/emprestimos", {
        headers: { Authorization: `Bearer ${admin.token}` },
    })
    const emprestimos = await lista.json()
    const emprestimo = emprestimos.find((e: any) => e.livroId === livro.id)

    await request.delete(`/api/emprestimos/${emprestimo.id}`, {
        headers: { Authorization: `Bearer ${admin.token}` },
    })
    await request.delete(`/api/livros/${livro.id}`, {
        headers: { Authorization: `Bearer ${admin.token}` },
    })
})