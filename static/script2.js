function validarSenha(senha) {
  if (senha.length >= 8) {
    return true;
  }
  return false;
}

function validarEmail(email) {
  let padrao = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return padrao.test(email);
}

const form = document.querySelector("#formCadastro");
let enviado = false;
let avisos = document.querySelector(".avisos");

form.addEventListener("submit", (e) => {
  if (enviado) return;
  e.preventDefault();
  let msgs = [];
  let erros = 0;

  enviado = false
  let senha = document.querySelector(".senha").value;
  let email = document.querySelector(".email").value;

  if (!validarEmail(email)) {
    msgs.push("Email inválido");
    erros++;
  }
  if (!validarSenha(senha)) {
    msgs.push("senha inválida");
    erros++;
  }

  if (erros === 0) {
    enviado = true;
    form.submit();
  }

  avisos.innerHTML = ""
  msgs.forEach(msg => {
    avisos.innerHTML += `<li>${msg}</li>`;
  });
}
);