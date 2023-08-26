// criar a variavel modalkey sera global
let modalkey = 0

// variavel para controlar inicial de pizzas na modal
let quantPizzas = 1

let cart = []// carrinho

// funções auxiliares ou utéis
const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)


const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})
}

const formatoMonentario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.pizzaWindowArea').style.opacity = 0 // transparente
    seleciona('.pizzaWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.pizzaWindowArea').style.opacity = 1,  150 )
}

const fecharModal = () => {
    seleciona('.pizzaWindowArea').style.opacity = 0 // transparente
    setTimeout(() => seleciona('.pizzaWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {
    //botões fechar modal
    selecionaTodos('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach( (item) => item.addEventListener ('click', fecharModal) ) 
}

const preencheDadosDasPizzas = (pizzaItem, item, index) => {
    //setar um atributo para identificar qual elemento foi clicado
    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--price').innerHTML = formatoReal(item.price[2])
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
    

}

const preencheDadosModal = (item) => {
    seleciona('.pizzaBig img').src = item.img
    seleciona('.pizzaInfo h1').innerHTML = item.name
    seleciona('.pizzaInfo--desc').innerHTML = item.description
    seleciona('.pizzaInfo--actualPrice').innerHTML = formatoReal(item.price[2])
}

const pegarKey = (e) => {
    // .closest retorna o elemento mais proximo que tem a classe que passamos
    // do .pizza-item ele vai pegar o valor do atributo data-key
    let key = e.target.closest('.pizza-item').getAttribute('data-key')
    console.log('Pizza clicada' + key)
    console.log(pizzaJson[key])

    //garantir que a quantidade inicial de pizzas é 1
    quantPizzas = 1

    //Para manter a informação de qual pizza for clicada
    modalkey = key

    return key

}

const preencherTamanhos = (key) => {
    //tirar a  seleção de  tamanho atual e selecionar o tamanho grande
    seleciona('.pizzaInfo--size.selected').classList.remove('selected')

    //selecionar todos os tamanhos
    selecionaTodos('.pizzaInfo--size').forEach((size, sizeIndex) => {
        //selecionar o tamanho grande
        (sizeIndex == 2) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
    })
}

const escolherTamanhoPreco = (key) => {
    //Ações nos botões de tamanho
    //Selencionar todos os tamanhos
    selecionaTodos('.pizzaInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            // clicou em um item, tirar a seleção em outros e marcar o que voce clicou
            // tirar a seleção de tamanho atual e selecionar o tamanho grande
            seleciona('.pizzaInfo--size.selected').classList.remove('selected')
            // marcar o q1ue voce clicou, ao inves de usar e.target use size, pois ele é nosso item dentro do loop
            size.classList.add('selected')

            //mudar o preço de acordo com o tamanho
            seleciona('.pizzaInfo--actualPrice').innerHTML = formatoReal(pizzaJson[key].price[sizeIndex])
        })
    })
}

const mudarQuantidade = () => {
    //Ações nos botões + e - da janela modal
    seleciona('.pizzaInfo--qtmais').addEventListener('click', () => {
        quantPizzas++
        seleciona('.pizzaInfo--qt').innerHTML = quantPizzas

    })

    seleciona('.pizzaInfo--qtmenos').addEventListener('click', () => {
        if (quantPizzas > 1) {
            quantPizzas--
            seleciona('.pizzaInfo--qt').innerHTML = quantPizzas
        }
    })

   }
        
const adicionarNoCarrinho = () => {
        seleciona('.pizzaInfo--addButton').addEventListener('click', () => {
    console.log('Adicionar no carrinho')
    
    // pegar dados  da janela modal atual
    // qual pizza pegue o modalKey para dar pizzaJson[modalKey]
    console.log(" Pizza " + modalkey)
    //tamanho
    let size = seleciona('.pizzaInfo--size.selected').getAttribute('data-key')
    console.log("Tamanho " + size)
    // quantidade
    console.log("Quant." + quantPizzas)
    // preco
    let price = seleciona('.pizzaInfo--actualPrice').innerHTML.replace('R$&nbsp;','')

    // criar um identificador que junte o ID e o tamanho
    // ligar as duas informacoes separadas por um símbolo vc escolhe
    let identificador = pizzaJson[modalkey].id+'t' +size

    //antes de adicionar verifique se ja tem aquele codigo e tamanho
    // para adicionarmos a quantidade
    let key = cart.findIndex( (item) => item.identificador == identificador )
    console.log(key)

    if(key > -1) {
        // se encontrar aumenta a quantidade
        cart[key].qt += quantPizzas
    } else {
        //adicionar objeto pizza no carrinho
        let pizza = {
            identificador,
            id: pizzaJson[modalkey].id,
            size, // size: size
            qt: quantPizzas,
            price: parseFloat(price) // price: price

        }
        cart.push(pizza)
        console.log(pizza)
        console.log('Sub total R$ ' + (pizza.qt * pizza.price).toFixed(2))
        
       }
            
            fecharModal()
            abrirCarrinho()
            atualizarCarrinho()
        })
    }
const abrirCarrinho = () => {
        console.log('Qtd de items no carrinho ' + cart.length)
        if(cart.length > 0) {
            // mostrar o carrinho
            seleciona('aside').classList.add('show' )
            seleciona('header').style.display = 'flex' // mostrar barra superior
        }
        // exibir aside do carrinho
        seleciona('.menu-openner').addEventListener('click', () => {
            if (cart.length > 0) {
                seleciona('aside').classList.add('show')
                seleciona('aside').style.left = '0'
            }
        })
    
    }
const fecharCarrinho = () => {
        // fechar o carrinho com o botão X no celular
        seleciona('.menu-closer').addEventListener('click', () => {
            seleciona('aside').style.left = '100vw' // usando 100vw ele ficara fora da tela 
            seleciona('header').style.display = 'flex'
        })
    }
    
const atualizarCarrinho = () => {
        // exibir numero do items no carrinho
        seleciona('.menu-openner span').innerHTML = cart.length
        
        // mostrar ou não o carrinho
    if(cart.length > 0) {
            
        // motrar o carrinho
        seleciona('aside').classList.add('show')

        //gerar meu cart para não fazer inserções duplicadas
        seleciona('.cart').innerHTML = ''

        // criar variaveis antes do for
        let subtotal = 0
        let desconto = 0
        let total    = 0
            
        //para preenche os items do carrinho, calcular subtotal
        for (let i in cart) {
            // use o find para pegar o item por id
            let pizzaItem = pizzaJson.find( (item) => item.id == cart[i].id )
            console.log(pizzaItem)


            subtotal += cart[i].price * cart[i].qt
            let cartItem = seleciona('.models .cart--item').cloneNode(true) // , exibir na tela e depois preencher as informações o clone 
            seleciona('.cart').append(cartItem)

            let pizzaSizeName = (cart[i].size) 

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            // preencher as informações
            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

            //selecionar botões + e -
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                console.log('Clicou no botão mais')
                //adicionar apenas a quantidade que está nesse contexto
                cart[i].qt++
                //atualizar a quantidade
                atualizarCarrinho()
                  
            })
                
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                console.log('clicou no botão menos')
                if(cart[i].qt > 1) {
                    //substrair apenas a quantidade que esta nesse contexto
                    cart[i].qt--
                } else {
                    //remover se for zero
                    cart.splice(i, 1)
        
                }
    
                (cart.length < 1) ? seleciona(`header`).style.display = 'flex' : ' '
    
                //atualizar a quantidade
                atualizarCarrinho()
            })
                
            seleciona(`.cart`).append(cartItem);

        } // fim do for

        // fora do for
        // calcule desconto 10% e total
        //desconto = subtotal * 0.1
        desconto = subtotal * 0
        total = subtotal - desconto

        // exibir na tela os resultados
        // selecionar o ultimo span do elemento
        seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
        seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
        seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {
		// ocultar o carrinho
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
	}
}

const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}
    
            


pizzaJson.map((item, index) => {
    //console.log(item)
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true)
    //console.log(pizzaItem)
    //document.querySelector('.pizza-area').append(pizzaItem)
    seleciona('.pizza-area').append(pizzaItem);

    //seleciona os dados de cada pizza
    preencheDadosDasPizzas(pizzaItem, item, index)

    // pizza clicada
    pizzaItem.querySelector('.pizza-item a').addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Clicou na pizza')
    

        let chave = pegarKey(e)

        // abrir janela modal
        abrirModal()

        // preenchimentos de dados
        preencheDadosModal(item)

        //pegar tamanho selecionado
        preencherTamanhos(chave)

        //definir quantidade inicial como 1 
        seleciona('.pizzaInfo--qt').innerHTML = quantPizzas

        //seleciona o tamanho e preço com o clique no botao
        escolherTamanhoPreco(chave)

    })

    botoesFechar()

}) // fim do mapear pizzaJson para gerar lista de pizzas


// mudar quantidade com os botões - ou +
  mudarQuantidade()

    adicionarNoCarrinho()
    atualizarCarrinho()
    fecharCarrinho()
    finalizarCompra()
    

    