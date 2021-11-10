using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Northwind.Models;

namespace Northwind.Controllers
{
    public class APIController : Controller
    {
        // this controller depends on the NorthwindRepository
        private NorthwindContext _northwindContext;
        public APIController(NorthwindContext db) => _northwindContext = db;

        [HttpGet, Route("api/product/{ProductId}/reviews")]
        // returns all products
        public IEnumerable<Review> Get(int id) => _northwindContext.Reviews.Where(r => r.ProductId == id);
    
    }
}