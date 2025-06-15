// Seleciona os elementos do form
const amount = document.getElementById("amount");

// Captura o evento de input do valor.
amount.oninput = () => {
  // filtrar para retirar LETRAS do input, permitindo assim somente numeros
  let value = amount.value.replace(/\D/g, "");

  // transformar o valor em centavos (ex: 150/100 = 1.5)
  value = Number(value) / 100

  // atribuindo ao valor do amount o input filtrado acima.
  amount.value = formatCurrencyBRL(value);
}

function formatCurrencyBRL (value) {
  // formata o valor no padrao BRL
  value = value.toLocaleString('pt-BR', {
    style: "currency",
    currency: "BRL",
  });

  // retornamos ela para usarmos o valor fora do escopo dessa funcao e atribuir ao valor da variavel que for receber ela.
  return value
}