


function getElement(arrElement, data) {
    arrElement.forEach((element, index) => {
        element.value = data[index]
    });
}

function addCheckBox(form, ativo) {
    const checkBox = document.createElement('input')
    checkBox.type = 'checkbox'
    checkBox.checked = ativo
    console.log(ativo)

    // checkBox.addEventListener('click', () => { parentElement.parentElement.removeChild(parentElement) })
    form.appendChild(checkBox)
}

function addInput(classe, value, id, ativo) {
    const classElement = document.querySelectorAll(classe)
    const form = document.createElement('div')
    const new_label = document.createElement('label')
    new_label.innerText = `${classElement[0].className}`
    const new_input = document.createElement('input')
    new_input.type = 'text'
    new_input.style = 'width:15rem'
    new_input.value = value || ''
    form.classList = 'form'
    form.appendChild(new_label)
    form.appendChild(new_input)
    form.id = id

    classElement[0].appendChild(form)
    addCheckBox(form, ativo)
    // console.log('fim')
}

function recordElement(div, arr) {
    console.log(typeof arr)
    div.forEach(value => {
        arr.push(substituirStringVaziaPorZero(value.value))
    })
}

async function getValues() {
    var myHeaders = new Headers();

    const config = {
        method: "GET",
        headers: myHeaders,
        mode: "cors",
        cache: "default",
    };

    const response = await fetch('/data', config)
    return await response.json()

}

async function postValues(data) {

    const config = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    const response = await fetch('/post/data', config)
    // return await response.json()

}

async function getDbValues() {
    const values = await getValues()
    values.data.revisores.forEach(rev => {
        console.log(rev)
        addInput('.revisor', rev.nome, rev.id, rev.ativo)
    })

    values.data.motivos.forEach(motivo => {
        console.log(motivo, '<<<')
        addInput('.motivos',
            motivo.motivo,
            motivo.id,
            motivo.ativo
        )
    })
    values.data.modelos.forEach(model =>
        addInput('.modelos',
            model.modelo,
            model.id,
            model.ativo
        ))

}

getDbValues()

function onSubmit() {
    const valores = { revisores: [], motivos: [], modelos: [] }
    const motivos = document.querySelector('.motivos')
    const revisoras = document.querySelector('.revisor')
    const modelos = document.querySelector('.modelos')

    const arrayRevisores = Array.from(revisoras.children)
    arrayRevisores.forEach(revisor => {
        valores.revisores.push({
            id: revisor.id,
            nome: revisor.children[1].value,
            ativo: revisor.children[2].checked
        })
    })

    const arrayMotivos = Array.from(motivos.children)
    arrayMotivos.forEach(motivo => valores.motivos.push({
        id: motivo.id,
        motivo: motivo.children[1].value,
        ativo: motivo.children[2].checked
    }))

    const arrayModelos = Array.from(modelos.children)
    arrayModelos.forEach(modelo => valores.modelos.push({
        id: modelo.id,
        modelo: modelo.children[1].value,
        ativo: modelo.children[2].checked
    }))

    console.log(valores)
    postValues(valores)
}
