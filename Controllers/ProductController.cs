using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
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

        public IActionResult CategoryDetail(int id) => View(new CategoryViewModel
        {
            category = _northwindContext.Categories.FirstOrDefault(c => c.CategoryId == id),
            product = _northwindContext.Products.Where(p => p.CategoryId == id).Where(p => p.Discontinued == false)
        });

        public IActionResult DiscountDetail() => View(_northwindContext.Discounts.Where(d => DateTime.Compare(d.EndTime, DateTime.Now) > 0 && DateTime.Compare(d.StartTime, DateTime.Now) <= 0));

    }

        

}