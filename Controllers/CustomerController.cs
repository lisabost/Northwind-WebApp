using Microsoft.AspNetCore.Mvc;
using Northwind.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace Northwind.Controllers
{
    public class CustomerController : Controller
    {
        // this controller depends on the NorthwindRepository & the UserManager
        private NorthwindContext _northwindContext;
        private UserManager<AppUser> _userManager;
        public CustomerController(NorthwindContext db, UserManager<AppUser> usrMgr)
        {
            _northwindContext = db;
            _userManager = usrMgr;
        }
        public IActionResult Register() => View();
        [HttpPost, ValidateAntiForgeryToken]
        public async System.Threading.Tasks.Task<IActionResult> Register(CustomerWithPassword customerWithPassword)
        {
            if (ModelState.IsValid)
            {
                Customer customer = customerWithPassword.Customer;
                if (_northwindContext.Customer.Any(c => c.CompanyName == customer.CompanyName))
                {
                    ModelState.AddModelError("", "Company Name must be unique");
                }
                else
                {
                    if (ModelState.IsValid)
                    {
                        AppUser user = new AppUser
                        {
                            // email and username are synced - this is by choice
                            Email = customer.Email,
                            UserName = customer.Email
                        };
                        // Add user to Identity DB
                        IdentityResult result = await _userManager.CreateAsync(user, customerWithPassword.Password);
                        if (!result.Succeeded)
                        {
                            AddErrorsFromResult(result);
                        }
                        else
                        {
                            // Assign user to customers Role
                            result = await _userManager.AddToRoleAsync(user, "northwind-customer");

                            if (!result.Succeeded)
                            {
                                // Delete User from Identity DB
                                await _userManager.DeleteAsync(user);
                                AddErrorsFromResult(result);
                            }
                            else
                            {
                                // Create customer (Northwind)
                                _northwindContext.AddCustomer(customer);
                                return RedirectToAction("Index", "Home");
                            }
                        }
                    }
                }
            }
            return View();
        }

        public IActionResult CustomersList() => View(_northwindContext.Customer);

        private void AddErrorsFromResult(IdentityResult result)
        {
            foreach (IdentityError error in result.Errors)
            {
                ModelState.AddModelError("", error.Description);
            }
        }
    }
}