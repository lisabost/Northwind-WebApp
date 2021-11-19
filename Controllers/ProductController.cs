using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Northwind.Models;
using System.Linq;

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
        public IActionResult ProductDetail(int id) => View(new ProductDetailViewModel
        {
            Product = _northwindContext.Products.Where(p => p.ProductId == id).FirstOrDefault(),
            Reviews = _northwindContext.Reviews.Where(r => r.ProductId == id)
        });

        public IActionResult Index(int id)
        {
            ViewBag.id = id;
            return View(_northwindContext.Categories.OrderBy(c => c.CategoryName));
        }

        public IActionResult DiscountDetail() => View(_northwindContext.Discounts.Where(d => DateTime.Compare(d.EndTime, DateTime.Now) > 0 && DateTime.Compare(d.StartTime, DateTime.Now) <= 0));

        [HttpGet]
        public IActionResult Products()
        {
            List<ProductDetailViewModel> viewModels = new List<ProductDetailViewModel>();
            foreach (var product in _northwindContext.Products)
            {
                viewModels.Add(new ProductDetailViewModel
                {
                    Product = product,
                    Reviews = _northwindContext.Reviews.Where(r => r.ProductId == product.ProductId)
                });
            }
            return View(viewModels);
        }

        [HttpPost, ValidateAntiForgeryToken, Authorize]
        public IActionResult AddReview(int id, Review review)
        {
            string email = User.Identity.Name;
            review.ProductId = id;
            Console.WriteLine(HasPurchased(id, email));
            // Error on un-purchased item!
            if (HasPurchased(id, email))
            {
                if (ModelState.IsValid)
                {
                    if (review.Comment.Length <= 0)
                    {
                        ModelState.AddModelError("", "Comment is required!");
                    }
                    else
                    {
                        review.CustomerId = _northwindContext.Customers.Where(c => c.Email == email).FirstOrDefault().CustomerId;
                        _northwindContext.AddReview(review);
                        return RedirectToAction("Products", "Product", review.ProductId);
                    }
                }
            } else {
                ModelState.AddModelError("", "You have not purched this product!");
            }

            return View();
        }

        public Boolean HasPurchased(int productId, string email)
        {
            return _northwindContext.OrderDetails.Where(od => od.ProductId == productId).Any(o => o.Order.Customer.Email == email);
        }

    }
}