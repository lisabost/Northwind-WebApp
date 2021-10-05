using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Northwind.Models;
using System.Linq;

namespace Northwind.Controllers
{
    public class CustomerController : Controller
    {
        // this controller depends on the NorthwindRepository
        private NorthwindContext _northwindContext;
        public CustomerController(NorthwindContext db) => _northwindContext = db;
        
        //http get
        public IActionResult Register() => View();

        public IActionResult CustomersList() => View(_northwindContext.Customer);

        //http post
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Register(Customer model)
        {
            if (ModelState.IsValid)
            {
                if (_northwindContext.Customer.Any(c => c.CompanyName == model.CompanyName))
                {
                    ModelState.AddModelError("", "Name must be unique");
                }
                else
                {
                    _northwindContext.AddCustomer(model);
                    return RedirectToAction("CustomersList", "Customer");
                }
            }
            return View();
        }

    }

        

}