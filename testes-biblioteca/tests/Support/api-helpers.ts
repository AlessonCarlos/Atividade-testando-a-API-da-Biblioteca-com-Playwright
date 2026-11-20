import { APIRequestContext, APIRequest, request, expect } from "@playwright/test";
import { novolivro } from "./dados";

function autorizacao(token: string) {
    return{Authorization: `Bearer ${token}`};
}

export async function login(request: APIRequestContext, email: string, senha: string): Promise<String> {
const resposta = await request.post("/api/auth/login", { data: {email,  senha}}) 
const dados = await resposta.json()
return dados.token

}
export async function apagarlivro( request: APIRequestContext, token: string, id:number): Promise<void>{
    const resposta =await request.delete(`/api/livros/${id}`, { headers: autorizacao(token) })
    expect(resposta.status()).toBe(200)
}

export async function criarlivro(request: APIRequestContext, token: string, dados: object): Promise<number> {
    const resposta = await request.post("/api/livros", { headers: autorizacao(token), data: dados })
    expect(resposta.status()).toBe(201)
    const livro = await resposta.json()
    return livro.id
}





