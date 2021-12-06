using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Northwind.Models;
using System.Linq;
using System.Collections.Generic;

namespace Northwind.Controllers
{
    public class ProductController : Controller
    {
        // this controller depends on the NorthwindRepository
        private NorthwindContext _northwindContext;
        public ProductController(NorthwindContext db) => _northwindContext = db;
        public IActionResult Category() => View(_northwindContext.Categories);

        public IActionResult Discount() => View(_northwindContext.Discounts);

        [HttpGet]
        public IActionResult ProductDetail(int id) {
            IEnumerable<Review> reviews = _northwindContext.Reviews.Where(r => r.ProductId == id);
            Product prod = _northwindContext.Products.Where(p => p.ProductId == id).FirstOrDefault();
            return View(new ProductDetailViewModel{
                Product = prod,
                Category = _northwindContext.Categories.Where(c => c.CategoryId == prod.CategoryId).FirstOrDefault(),
                Reviews = reviews,
                AverageRating = APIController.AvgRating(reviews),
                hasPurchased = HasPurchased(id, User.Identity.Name)
            });
        }

        public IActionResult Index(int id)
        {
            ViewBag.id = id;
            return View(_northwindContext.Categories.OrderBy(c => c.CategoryName));
        }

        public IActionResult DiscountDetail() => View(_northwindContext.Discounts.Where(d => DateTime.Compare(d.EndTime, DateTime.Now) > 0 && DateTime.Compare(d.StartTime, DateTime.Now) <= 0));

        [HttpGet]
        public IActionResult Products()
        {
            return View(_northwindContext.Categories);
        }

        public Boolean HasPurchased(int productId, string email)
        {
            return _northwindContext.OrderDetails.Where(od => od.ProductId == productId).Any(o => o.Order.Customer.Email == email);
        }

    }
}