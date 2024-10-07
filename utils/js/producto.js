class Producto {
  id;
  name;
  price;
  brand;
  category;
  image;

  constructor(id, name, price, brand, category, image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.brand = brand;
    this.category = category;
    this.image = image;
  }

  get getId() {
    return this.id;
  }

  get getName() {
    return this.name;
  }
  get getPrice() {
    return this.price;
  }
  get getBrand() {
    return this.brand;
  }

  get getCategory() {
    return this.category;
  }

  get getImage() {
    return this.image;
  }
}
