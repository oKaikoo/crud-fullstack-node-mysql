console.log("login.js carregou");

async function login() {
  console.log("clicou em Entrar");
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const msg = document.getElementById("msg");

  try {
    const response = await fetch("https://crud-fullstack-node-mysql.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (!response.ok) {
      msg.innerText = data.mensagem || "Erro no login";
      return;
    }

    localStorage.setItem("token", data.token);

    msg.innerText = "Login realizado com sucesso";

    window.location.href = "index.html";
  } catch (error) {
    console.error(error);
    msg.innerText = "Erro ao conectar com o servidor";
  }
}

async function register() {
  console.log("clicou em Cadastrar");
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  await fetch("https://crud-fullstack-node-mysql.onrender.com/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha }),
  });
  alert("Usuário criado");
}
