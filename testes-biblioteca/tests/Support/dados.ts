export const admin = { email: "admin@biblioteca.com", senha: "Admin@123" }

export function novolivro( qtd = 1){
    return {
        titulo: "collen hoover",
        autor: "Jair inacio",
        isbn: String(Date.now()),
        anoPublicacao: 2020,
        quantidade: qtd
    }
}