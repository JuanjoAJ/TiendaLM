let shopView = document.querySelector("#shopView");
let shoppingCart = document.querySelector("#shoppingCart");
let totalPrice = document.querySelector("#totalPrice");
let minPrice = document.querySelector("#inputMin");
let category = document.querySelector("#inputCateg");
let marca = document.querySelector("#inputMarca");
let filtrar = document.querySelector("#btnFiltrar");
let acumulativo = 0;
let buttonsAdd;
let buttonsDel;
let productos = [];
let noRepeat;

fetch("https://dummyjson.com/products")
  .then((result) => {
    return result.json();
  })
  .then((productosJson) => {
    productosJson.products.forEach((element) => {
      productos.push(
        new Producto(
          element.id,
          element.title,
          element.price,
          element.brand,
          element.category,
          element.images[0]
        )
      );
    });
    fillShopView(productos);
    crearListaMarca(productos);
    crearListaCategory(productos);
    cambioFoco();
    filtro(productos);
    addEventListeners(productos);
  })
  .catch((error) => {
    console.log(error.message);
  });

function fillShopView(lista) {
  lista.forEach((element) => {
    shopView.innerHTML += `<div class="col-lg-4 col-md-6 mb-4">
      <div class="card h-100">
        <img src="${element.image}" class="card-img-top" alt="imagen-carta" style="width: 10rem; height: 10rem; align-self: center;">
        <div class="card-body">
          <h5 class="card-title">${element.name}</h5>
          <p class="card-text">${element.price} €</p>
          <input type="button" class="btn btn-sm btn-primary btnAdd" value="Añadir a la cesta">
          <input type="button" class="btn btn-sm btn-secondary btnDel" value="Eliminar de la cesta">
        </div>
      </div>
    </div>`;
  });
}
/*FUNCIONES FILTRADO */
function crearListaCategory(productosLista) {
  noRepeat = [];
  productosLista.forEach((element) => {
    if (element.category != null && !noRepeat.includes(element.category)) {
      noRepeat.push(element.category);
      category.innerHTML += ` <option value="${element.category}">${element.category}</option>`;
    }
  });
}
function crearListaMarca(productosLista) {
  noRepeat = [];
  productosLista.forEach((element) => {
    if (element.brand != null && !noRepeat.includes(element.brand)) {
      noRepeat.push(element.brand);
      marca.innerHTML += ` <option value="${element.brand}">${element.brand}</option>`;
    }
  });
}

//Lista filtrada
function cambioFoco() {
  minPrice.addEventListener("focus", () => {
    category.value = "Categoria";
    marca.value = "Marca";
  });
  category.addEventListener("focus", () => {
    marca.value = "Marca";
    minPrice.value = "0";
  });
  marca.addEventListener("focus", () => {
    minPrice.value = "0";
    category.value = "Categoria";
  });
}
function resetSelect() {
  marca.value = "Marca";
  minPrice.value = "0";
  category.value = "Categoria";
}
function filtro(lista) {
  filtrar.addEventListener("click", () => {
    while (shopView.firstChild) {
      shopView.removeChild(shopView.firstChild);
    }
    if (
      marca.value === "Marca" &&
      minPrice.value === "0" &&
      category.value === "Categoria"
    ) {
      fillShopView(lista);
      addEventListeners(lista);
    } else {
      let listaFiltrada = [];
      listaFiltrada = lista.filter((item) => {
        if (marca.value !== "Marca" && marca.value === item.brand) {
          return true;
        } else if (
          category.value !== "Categoria" &&
          category.value === item.category
        ) {
          return true;
        } else if (minPrice.value !== "0" && minPrice.value <= item.price) {
          return true;
        }
        return false;
      });
      fillShopView(listaFiltrada);
      addEventListeners(listaFiltrada);
      resetSelect();
    }
  });
}

/*Funciones carrito compra */
function addEventListeners(lista) {
  const buttonsAdd = document.querySelectorAll(".btnAdd");
  const buttonsDel = document.querySelectorAll(".btnDel");
  buttonsAdd.forEach((button, index) => {
    button.addEventListener("click", () => {
      addShoppingCart(lista[index]);
    });
  });

  buttonsDel.forEach((button, index) => {
    button.addEventListener("click", () => {
      delShoppingCart(lista[index]);
    });
  });
}

function addShoppingCart(product) {
  if (product && product.name && product.price) {
    const li = document.createElement("li");
    li.className = "listacompra animate__animated animate__backInRight";
    li.innerHTML = `<img src="${product.image}" alt="${product.name}" class="imgCesta"> ${product.name} -> ${product.price}€`;
    shoppingCart.appendChild(li);
    addTotalPrice(product);
  } else {
    console.log("El producto no tiene las propiedades correctas");
  }
}

function delShoppingCart(product) {
  if (product && product.name && product.price) {
    const items = document.querySelectorAll(".listacompra");

    for (let i = 0; i < items.length; i++) {
      if (items[i].textContent.includes(product.name)) {
        items[i].remove();
        restarTotalPrice(product);
        break;
      }
    }
  } else {
    console.log("El producto no tiene las propiedades correctas");
  }
}

function addTotalPrice(product) {
  if (product && product.price) {
    acumulativo += product.price;
    acumulativo = Math.round(acumulativo * 100) / 100;
  } else {
    console.log("El producto no tiene las propiedades correctas");
  }
  totalPrice.innerHTML = `<li class="listacompra totalCompra animate__animated animate__backInRight" style="list-style: none; font-weight: bold; background-color: #fff; border-radius: 2px; border: #39434c; border-bottom: 1px dashed;">Total de compra = ${acumulativo} €</li>`;
}

function restarTotalPrice(product) {
  if (product && product.price) {
    acumulativo -= product.price;
    acumulativo = Math.round(acumulativo * 100) / 100;
    if (acumulativo < 0) acumulativo = 0;
  } else {
    console.log("El producto no tiene las propiedades correctas");
  }
  totalPrice.innerHTML = `<li class="listacompra totalCompra animate__animated animate__backInRight" style="list-style: none; font-weight: bold; background-color: #fff; border-radius: 2px; border: #39434c; border-bottom: 1px dashed;">Total de compra = ${acumulativo} €</li>`;
}
