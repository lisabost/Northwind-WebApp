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

        public IActionResult CategoryDetail(int id) => View(new CategoryViewModel
        {
            category = _northwindContext.Categories.FirstOrDefault(c => c.CategoryId == id),
            product = _northwindContext.Products.Where(p => p.CategoryId == id).Where(p => p.Discontinued == false)
        });

        public IActionResult DiscountDetail(int id) => View(new DiscountViewModel
        {
            discount = _northwindContext.Discounts.FirstOrDefault(d => d.DiscountID == id),
            product = _northwindContext.Products.Where(p => p.CategoryId == id).Where(p => p.Discontinued == false)
        });

    }

        

}