using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Northwind.Models;
using Microsoft.EntityFrameworkCore;

namespace Northwind.Controllers
{
    public class APIController : Controller
    {
        // this controller depends on the NorthwindRepository
        private NorthwindContext _northwindContext;
        public APIController(NorthwindContext db) => _northwindContext = db;

        [HttpGet, Route("api/product")]
        // returns all products
        public IEnumerable<ProductsJSON> Get() {
            return _northwindContext.Products.Select(p => new ProductsJSON{
                ProductId = p.ProductId,
                AverageRating = AvgRating(p.Reviews),
                RatingCount = p.Reviews.Count,
                ProductName = p.ProductName,
                UnitPrice = p.UnitPrice
            });
        } 

        [HttpGet, Route("api/product/{id}")]
        // returns specific product by specifying the id of the product
        public Product Get(int id) => _northwindContext.Products.FirstOrDefault(p => p.ProductId == id);

        [HttpGet, Route("api/product/discontinued/{discontinued}")]
        // returns all products where discontinued = true/false
        public IEnumerable<Product> GetDiscontinued(bool discontinued) => _northwindContext.Products.Where(p => p.Discontinued == discontinued).OrderBy(p => p.ProductName);

        [HttpGet, Route("api/category/{CategoryId}/product")]
        // returns all products in a specific category
        public IEnumerable<Product> GetByCategory(int CategoryId) => _northwindContext.Products.Where(p => p.CategoryId == CategoryId).OrderBy(p => p.ProductName);

        [HttpGet, Route("api/category/{CategoryId}/product/discontinued/{discontinued}")]
        // returns all products in a specific category where discontinued = true/false
        public IEnumerable<Product> GetByCategoryDiscontinued(int CategoryId, bool discontinued) => _northwindContext.Products.Where(p => p.CategoryId == CategoryId && p.Discontinued == discontinued).OrderBy(p => p.ProductName);

        [HttpGet, Route("api/product/{ProductId}/reviews")]
        // returns all products
        public IEnumerable<ReviewJSON> GetReviews(int ProductId)
        {
            return _northwindContext.Reviews.Where(r => r.ProductId == ProductId).Select(r => new ReviewJSON{
                RatingId = r.ReviewId,
                Rating = r.Rating,
                Comment = r.Comment,
                Name = r.Customer.Email
            });
        }

        [HttpPost, Route("api/addtocart")]
        // adds a row to the cartitem table
        public CartItem Post([FromBody] CartItemJSON cartItem) => _northwindContext.AddToCart(cartItem);

        [HttpPost, Route("api/addReview")]
        // adds a row to the cartitem table
        public Review AddReview([FromBody] ReviewJSON review) => _northwindContext.AddReview(review);

        public static int AvgRating(IEnumerable<Review> Reviews)
        {
            int total = 0;
            int amt = 0;
            foreach (Review r in Reviews)
            {
                total += r.Rating;
                amt++;
            }
            if(amt == 0) {
                return 0;
            }
            int avg = total / amt;
            return avg;
        }
    }
}
