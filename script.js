// Seleciona os elementos do form
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

// Captura o evento de input do valor.
amount.oninput = () => {
	// filtrar para retirar LETRAS do input, permitindo assim somente numeros
	let value = amount.value.replace(/\D/g, "")

	// transformar o valor em centavos (ex: 150/100 = 1.5)
	value = Number(value) / 100

	// atribuindo ao valor do amount o input filtrado acima.
	amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
	// formata o valor no padrao BRL
	value = value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	})

	// retornamos ela para usarmos o valor fora do escopo dessa funcao e atribuir ao valor da variavel que for receber ela.
	return value
}

// Captura o evento de submit do form para obter os valores
form.onsubmit = (event) => {
	// previne de fazer o reload
	event.preventDefault()

	// cria um objeto com os detalhes da nova despesa.
	const newExpense = {
		id: new Date().getTime(),
		expense: expense.value,
		category_id: category.value,
		category_name: category.options[category.selectedIndex].text,
		amount: amount.value,
		created_at: new Date(),
	}

	// chama a funcao que ira adicionar o item na lista
	expenseAdd(newExpense)
}

// add uma novo item na lista
function expenseAdd(newExpense) {
	try {
		// cria o elemento <li> para adicionar a lista.
		const expenseItem = document.createElement("li")
		expenseItem.classList.add("expense")

		// cria o icone da categoria
		const expenseIcon = document.createElement("img")
		expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
		expenseIcon.setAttribute("alt", newExpense.category_name)

		// cria o grupo de nome e tipo de gasto
		const expenseInfo = document.createElement("div")
		expenseInfo.classList.add("expense-info")
		//nome da despesa
		const expenseName = document.createElement("strong")
		expenseName.textContent = newExpense.expense
		//categoria da despesa
		const expenseCategory = document.createElement("span")
		expenseCategory.textContent = newExpense.category_name

		// cria o campo de valor da despesa
		const expenseAmount = document.createElement("span")
		expenseAmount.classList.add("expense-amount")
		expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
			.toUpperCase()
			.replace("R$", "")}`

		// cria o icone de remover
		const removeIcon = document.createElement("img")
		removeIcon.classList.add("remove-icon")
		removeIcon.setAttribute("src", "img/remove.svg")
		removeIcon.setAttribute("alt", "remover")

		// add o nome e a categoria a div de despesa
		expenseInfo.append(expenseName, expenseCategory)

		// adiciona as infos no item
		expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

		// add o item geral
		expenseList.append(expenseItem)

		// atualiza os totais apos uma nova insercao
		updateTotals()
		//limpa o form
		formClear()
	} catch (error) {
		console.log(error)
	}
}

// atualiza os totais
function updateTotals() {
	try {
		// recupera todos os itens <li> da lista
		const items = expenseList.children

		// att quantidade de itens na lista
		expensesQuantity.textContent = `${items.length} ${
			items.length > 1 ? "despesas" : "despesa"
		}`

		// att o valor total
		let total = 0
		// percorre cada item da <li> da lista <ul>
		for (let item = 0; item < items.length; item++) {
			const itemAmount = items[item].querySelector(".expense-amount")

			// remove caracteres nao numericos e substitui a virgula pelo ponto
			let value = itemAmount.textContent
				.replace(/[^\d,]/g, "")
				.replace(",", ".")

			// converte o valor para float (nao recomendado para banco de dados.)
			value = parseFloat(value)

			if (isNaN(value)) {
				return alert(
					"Nao foi possivel calcular o total. O valor nao parece ser um numero"
				)
			}

			// incrementa o valor total
			total += value
		}

		// cria a span para adicionar o R$
		const symbolBRL = document.createElement("small")
		symbolBRL.textContent = "R$"

		// formata o valor e remove o R$ que sera exibido pela small com um estilo
		total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

		// limpa o elemento
		expensesTotal.innerHTML = ""

		// add o simbolo e o valor da moeda
		expensesTotal.append(symbolBRL, total)
	} catch (error) {
		console.log(error)
	}
}

// evento que captura o clique nos itens da lista
expenseList.addEventListener("click", function (event) {
	// verifica se o elemento clicado eh o icone de remover
	if (event.target.classList.contains("remove-icon")) {
		// obtem a li pai do elemento
		const item = event.target.closest(".expense")

		//remove o item da lista
		item.remove()
		// atualiza o total
		updateTotals()
	}
})

function formClear() {
	expense.value = ""
	category.value = ""
	amount.value = ""

	expense.focus()
}