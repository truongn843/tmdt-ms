import products from "../../pseudo-data/product-list.json";

function getData() {
  console.log(products);
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function ratingStarString(rating, reiviews) {
    return "⭐".repeat(rating) + " " + reiviews + " đánh giá";
  }

  let productList = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      image: product.image,
      price: numberWithCommas(product.price),
      discounted: numberWithCommas(product.discounted),
      currency: "đ",
      rating: ratingStarString(product.rating, product.ratingCount),
      brand: product.brand,
      battery: product.battery,
      chipset: product.chipset,
      frontCamera: product.frontCamera,
      rearCamera: product.rearCamera,
      bluetooth: product.bluetooth,
      gpu: product.gpu,
      screen: product.screen,
      description: product.description,
    };
  });

  return productList;
}

export default getData;
