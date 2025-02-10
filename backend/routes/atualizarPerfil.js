document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Evita o recarregamento da página

        const id = document.getElementById("id").value;
        const nome = document.getElementById("nome").value;
        const bio = document.getElementById("bio").value;
        const emailNovo = document.getElementsByName("email")[1].value; // Pegando o segundo campo de email
        const senhaNova = document.getElementsByName("senha")[1].value; // Pegando o segundo campo de senha

        // Criar um objeto com os campos preenchidos
        const dadosAtualizados = {};
        if (nome) dadosAtualizados.nome = nome;
        if (bio) dadosAtualizados.bio = bio;
        if (emailNovo) dadosAtualizados.email = emailNovo;
        if (senhaNova) dadosAtualizados.senha = senhaNova;

        try {
            const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dadosAtualizados),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.erro || "Erro ao atualizar perfil");
            }

            alert("Perfil atualizado com sucesso!");
            window.location.href = "usuario.html"; // Redireciona para a página do usuário

        } catch (error) {
            alert(error.message);
        }
    });
});
