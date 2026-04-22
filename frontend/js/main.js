const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

function salvarDados() {
  let entrada = document.getElementById("entrada").value;
  if (!entrada.trim()) {
    alert("Digite uma tarefa");
    return;
  }
  const token = localStorage.getItem("token");

  fetch("http://localhost:3001/tarefas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ texto: entrada }),
  }).then(() => {
    document.getElementById("entrada").value = "";
    mostrar();
  });
}

function mostrar() {
  const token = localStorage.getItem("token");

  fetch("http://localhost:3001/tarefas", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      let listaDeTarefas = data;

      let ul = document.getElementById("resultados");
      let html = "";

      listaDeTarefas.forEach((elemento) => {
        html += `<li><span>${elemento.texto}</span><button onclick="editar(${elemento.id})">Editar</button><button onclick="deletar(${elemento.id})">Deletar</button></li>`;
      });
      ul.innerHTML = html;
    });
}

function editar(id) {
  let html = `<input type="text" id="textoparaeditar"><button onclick="editarDados(${id})">Salvar</button>`;
  let divEditar = document.getElementById("editar");
  divEditar.innerHTML = html;
}

function editarDados(id) {
  let textoParaEditar = document.getElementById("textoparaeditar").value;
  if (!textoParaEditar.trim()) {
    alert("A tarefa não pode ficar vazia!");
    return;
  }

  const token = localStorage.getItem("token");

  fetch(`http://localhost:3001/tarefas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ texto: textoParaEditar }),
  }).then(() => {
    mostrar();
    document.getElementById("editar").innerHTML = "";
  });
}

function deletar(id) {
  const token = localStorage.getItem("token");

  fetch(`http://localhost:3001/tarefas/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(() => mostrar());
  document.getElementById("editar").innerHTML = "";
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

mostrar();
