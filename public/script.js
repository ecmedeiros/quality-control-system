const usersDiv = document.querySelector('.users');
const container = document.getElementById('container')
// console.log(usersDiv)

async function homePage() {
    const data = await fetchData()
    const users_revisores = data.revisores.filter(rev => rev.ativo === true)


    for (let user of users_revisores) {
        const userElement = document.createElement('input')
        userElement.type = 'button'
        userElement.value = user.nome
        userElement.addEventListener('click', () => { renderUserPage(user) })
        usersDiv.appendChild(userElement)
    }
}

homePage()

function feedBackButton(element) {
    element.style.backgroundColor = '#0E1012'
    const interval = setInterval(() => { element.style.backgroundColor = '#242731' }, 200)

    setTimeout(() => {
        clearInterval(interval)
    }, 500)

}

async function fetchData() {
    const response = await fetch('/data')
    const data = await response.json()

    return data.data
}

async function renderUserPage(value) {

    const data = await fetchData()
    const pairProblem = data.motivos.filter(motivo => motivo.ativo === true)
    const pairModels = data.modelos.filter(modelo => modelo.ativo === true)

    while (container.children.length > 0) {
        container.removeChild(container.children[0])
    }
    document.body.removeChild(document.body.children[0])

    const header = document.createElement('header')
    const user = document.createElement('p')
    const problemsDiv = document.createElement('div')
    const modelsDiv = document.createElement('div')

    const countDiv = document.createElement('div')
    const buttonMore = document.createElement('button')
    const buttonLess = document.createElement('button')
    let pairsCount = document.createElement('p')
    const buttonRegister = document.createElement('button')

    document.body.appendChild(header)
    document.body.appendChild(container)
    document.body.appendChild(countDiv)

    header.appendChild(user)
    user.textContent = value.nome
    buttonMore.textContent = '+'
    buttonLess.textContent = '-'
    pairsCount.textContent = 0

    buttonRegister.textContent = `REGISTRAR`

    container.appendChild(modelsDiv)
    container.appendChild(problemsDiv)

    user.id = 'selected-user'
    problemsDiv.classList = `problems`
    modelsDiv.classList = `models`
    container.classList = `container`
    countDiv.classList = `count-div`

    container.append(countDiv)
    countDiv.append(buttonMore)
    countDiv.append(pairsCount)
    countDiv.append(buttonLess)
    countDiv.append(buttonRegister)

    buttonMore.addEventListener('click', () => {
        pairsCount.innerText = Number(pairsCount.innerText) + 0.5;
        feedBackButton(buttonMore)
    });
    buttonLess.addEventListener('click', () => {
        (pairsCount.innerText != 0 ?
            pairsCount.innerText = Number(pairsCount.innerText) - 0.5
            :
            pairsCount.innerText = Number(pairsCount.innerText = 0))
        feedBackButton(buttonLess)
    })

    buttonRegister.addEventListener('click', async () => {
        const optionsChecked = document.querySelectorAll('.checked')
        const dataObj = {}
        const currentTimeStamp = Date.now()

        feedBackButton(buttonRegister)

        try {
            dataObj.revisor = value
            dataObj.modelo = { id: optionsChecked[0].id, modelo: optionsChecked[0].innerText, } || null
            dataObj.motivo = { id: optionsChecked[1].id, motivo: optionsChecked[1].innerText, } || null
            dataObj.quantidade = (pairsCount.innerText != 0 ? pairsCount.innerText : (() => { throw new Error('Selecione a quantidade'); })())
            dataObj.data_hora = currentTimeStamp / 1000

        } catch (error) {
            alert('Informações incompletas para registro.')
            return
        }

        const optionsFetch = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataObj)
        }

        //Reset
        pairsCount.innerText = Number(pairsCount.innerText = 0)
        optionsChecked.forEach(element => {
            uncheck(element)
        })

        if (optionsFetch != 'undefined') {
            const retornofetch = fetch('/insertData', optionsFetch)
        }

    })

    pairProblem.forEach(problem => {
        const button = document.createElement('button')
        button.textContent = problem.motivo
        button.id = problem.id
        button.addEventListener('click', () => handleClickOptions(button))
        button.classList = 'unchecked'
        problemsDiv.append(button)
    })

    pairModels.forEach(model => {
        const button = document.createElement('button')
        button.textContent = model.modelo
        button.id = model.id
        button.addEventListener('click', () => handleClickOptions(button))
        button.classList = 'unchecked'
        modelsDiv.append(button)
    })
}

function handleClickOptions(option) {
    uncheck(option)
    option.classList = 'checked'
}

function uncheck(div) {
    const classDiv = document.querySelector(`.${div.parentNode.classList.value}`)

    for (button of classDiv.children) {
        button.classList = 'unchecked'
    }
}