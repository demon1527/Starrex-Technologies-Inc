import "../styles/Products.css";

// Add new products to this list. Each one becomes a card automatically.
//
// whopUrl: paste the checkout link from Whop
//          (Whop dashboard > Products > the link icon on the product's row).
// price:   must match the price set on Whop.
//
// While whopUrl is empty the card shows "Coming soon" and nothing can be clicked.
const products = [
  {
    id: "ai-starter-pack",
    category: "AI & Productivity",
    title: "AI Starter Pack",
    description:
      "Ready-to-use AI prompts and simple automation workflows for students, freelancers and beginners. Everything works with free tools.",
    includes: [
      "30 copy-and-paste prompts for studying, freelancing, content and coding",
      "5 step-by-step workflows built on free tools",
      "A prompt formula you can reuse to write your own prompts",
      "A troubleshooting guide for weak AI answers",
    ],
    image: "/products/ai-starter-pack-art.webp",
    imageAlt: "Illustration of a chat window with an AI prompt and a workflow card",
    price: "", // TODO: e.g. "$4.99"
    whopUrl: "", // TODO: paste your Whop checkout link
  },
];

function Products() {
  return (
    <main className="products-page">
      <div className="products-hero">
        <div className="hero-badge">
          <span className="status-dot" />
          OUR PRODUCTS
        </div>
        <h1>
          Tools you can
          <span> use today.</span>
        </h1>
        <p>
          Practical guides and tools from Starrex Technologies. Pick one, check
          out on Whop, and get access right away.
        </p>
      </div>

      <div className="products-container">
        <div className="products-section-heading">
          <span className="section-label">AVAILABLE</span>
        </div>

        <div className="products-list">
          {products.map((product) => {
            const available = Boolean(product.whopUrl);

            return (
              <article
                className="product-card"
                key={product.id}
                aria-labelledby={`${product.id}-title`}
              >
                <div className="product-media">
                  <img
                    className="product-image"
                    src={product.image}
                    alt={product.imageAlt}
                    width="900"
                    height="900"
                    loading="lazy"
                  />
                </div>

                <div className="product-info">
                  <span className="product-category">{product.category}</span>
                  <h3 id={`${product.id}-title`}>{product.title}</h3>
                  <p className="product-description">{product.description}</p>

                  <ul className="product-includes">
                    {product.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <div className="product-buy">
                    {available ? (
                      <>
                        {product.price && (
                          <span className="product-price">{product.price}</span>
                        )}
                        <a
                          href={product.whopUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="product-button"
                          aria-label={`Buy ${product.title} on Whop (opens in a new tab)`}
                        >
                          Buy on Whop
                          <span aria-hidden="true">↗</span>
                        </a>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="product-button"
                        disabled
                      >
                        Coming soon
                      </button>
                    )}
                  </div>

                  <p className="product-note">
                    Checkout opens on Whop in a new tab. You get access through
                    your Whop account after you pay.
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default Products;
