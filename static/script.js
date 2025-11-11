function validarNome(nome) {
  if (nome.length < 3) {
    return false;
  }
  return true;
}

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0, resto;

  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

function validarTelefone(telefone) {
  telefone = telefone.replace(/[^\d]+/g, '');
  if (telefone.length !== 11) return false;

  const ddd = telefone.substring(0, 2);
  if (ddd < 11 || ddd > 99) return false;

  if (/^(\d)\1+$/.test(telefone)) return false;

  return true
}

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

function validarDataNascimento(nascimento) {
  let hoje = new Date();
  nascimento = new Date(nascimento);
  if (nascimento.getTime() >= hoje.getTime()) return false
  return true;
}

const inputCPF = document.querySelector(".cpf");
const inputTelefone = document.querySelector(".telefone");

inputTelefone.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, '');

  if (value.length > 11) {
    value = value.substring(0, 11);
  }

  if (value.length === 0) {
    value = '';
  } else if (value.length <= 2) {
    value = `(${value}`;
  } else if (value.length <= 6) {
    value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
  } else if (value.length <= 10) {
    value = `(${value.substring(0, 2)}) ${value.substring(2, 6)}-${value.substring(6)}`;
  } else {
    value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
  }

  e.target.value = value;
});

inputCPF.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, '');

  if (value.length > 11) {
    value = value.substring(0, 11);
  }

  if (value.length > 3 && value.length <= 6) {
    value = value.replace(/(\d{3})(\d+)/, '$1.$2');
  } else if (value.length > 6 && value.length <= 9) {
    value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
  } else if (value.length > 9) {
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  }

  e.target.value = value;
});

const form = document.querySelector("#formCadastro");
let enviado = false;
let avisos = document.querySelector(".avisos");

form.addEventListener("submit", (e) => {
  if (enviado) return;
  e.preventDefault();
  let msgs = [];
  let erros = 0;

  enviado = false
  let nome = document.querySelector(".nome").value;
  let cpf = document.querySelector(".cpf").value;
  let senha = document.querySelector(".senha").value;
  let email = document.querySelector(".email").value;
  let nascimento = document.querySelector(".nascimento").value;
  let telefone = document.querySelector(".telefone").value;

  if (!validarNome(nome)) {
    msgs.push("Nome precisa ter no minímo 3 letras");
    erros++;
  }
  if (!validarEmail(email)) {
    msgs.push("Email inválido");
    erros++;
  }
  if (!validarTelefone(telefone)) {
    msgs.push("Telefone inválido");
    erros++
  }
  if (!validarCPF(cpf)) {
    msgs.push("CPF inválido");
    erros++;
  }
  if (!validarDataNascimento(nascimento)) {
    msgs.push("data de nascimento inválida");
    erros++
  }
  if (!validarSenha(senha)) {
    msgs.push("senha precisa ter no minímo 8 digitos");
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