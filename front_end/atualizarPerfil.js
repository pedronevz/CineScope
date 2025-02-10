document.addEventListener("DOMContentLoaded", () => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    
    if (!usuarioLogado) {
        window.location.href = "login.html";
        return;
    }

    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const bioInput = document.getElementById('bio');
    const atualizarBtn = document.querySelector('.btn-salvar');
    const deletarBtn = document.querySelector('.btn-deletar');

    // Preenche os campos com os dados atuais do usuário
    nomeInput.value = usuarioLogado.nome;
    emailInput.value = usuarioLogado.email;
    bioInput.value = usuarioLogado.bio || "";

    atualizarBtn.addEventListener("click", async (event) => {
        event.preventDefault();

        const dadosAtualizados = {
            nome: nomeInput.value,
            email: emailInput.value,
            senha: senhaInput.value || undefined,
            bio: bioInput.value
        };

        try {
            const response = await fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosAtualizados)
            });

            if (!response.ok) {
                throw new Error("Erro ao atualizar usuário");
            }

            const usuarioAtualizado = await response.json();
            
            // Atualiza o localStorage com os novos dados
            localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));
            
            // Atualiza a interface com os novos dados
            const usernameElement = document.querySelector(".username");
            if (usernameElement) {
                usernameElement.textContent = usuarioAtualizado.nome;
            }

            const bioElement = document.querySelector(".bio");
            if (bioElement) {
                bioElement.textContent = usuarioAtualizado.bio;
            }

            alert("Usuário atualizado com sucesso!");
            window.location.href = "usuario.html";
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            alert("Erro ao atualizar usuário. Tente novamente.");
        }
    });

    // Adiciona o evento de clique para deletar o perfil
    deletarBtn.addEventListener("click", async (event) => {
        event.preventDefault();

        const confirmacao = confirm("Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.");

        if (confirmacao) {
            try {
                const response = await fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Erro ao deletar usuário");
                }

                // Remove o usuário logado do localStorage
                localStorage.removeItem("usuarioLogado");

                alert("Conta deletada com sucesso!");
                window.location.href = "login.html"; // Redireciona para a página de login
            } catch (error) {
                console.error("Erro ao deletar usuário:", error);
                alert("Erro ao deletar usuário. Tente novamente.");
            }
        }
    });
});