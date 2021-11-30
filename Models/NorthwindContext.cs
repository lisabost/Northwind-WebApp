using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System;

namespace Northwind.Models
{
    public class NorthwindContext : DbContext
    {
        public NorthwindContext(DbContextOptions<NorthwindContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        // REMOVE Orders and OrderDetails if performing migration
        public DbSet<Order> Orders {get; set;}
        public DbSet<OrderDetails> OrderDetails {get; set;}
        public DbSet<Discount> Discounts { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<CartItem> CartItems { get; set; }

        public void AddCustomer(Customer customer)
        {
            this.Add(customer);
            this.SaveChanges();
        }

        public void EditCustomer(Customer customer)
        {
            var customerToUpdate = Customers.FirstOrDefault(c => c.CustomerId == customer.CustomerId);
            customerToUpdate.Address = customer.Address;
            customerToUpdate.City = customer.City;
            customerToUpdate.Region = customer.Region;
            customerToUpdate.PostalCode = customer.PostalCode;
            customerToUpdate.Country = customer.Country;
            customerToUpdate.Phone = customer.Phone;
            customerToUpdate.Fax = customer.Fax;
            SaveChanges();
        }

        //create a review
        public void AddReview(ReviewJSON reviewJSON)
        {
            int CustomerId = Customers.FirstOrDefault(c => c.Email == reviewJSON.Name).CustomerId;
            int ProductId = reviewJSON.ProductId;

            Review review = new Review(){
                Rating = reviewJSON.Rating,
                Comment = reviewJSON.Comment,
                CustomerId = CustomerId,
                ProductId = ProductId,
                UploadDate = DateTime.Now
            };
            Reviews.Add(review);
            this.SaveChanges();
        }

        public void DeleteReview(Review r) 
        {
            Reviews.Remove(r);
            this.SaveChanges();
        }

        //add items selected to the CartItems table
        public CartItem AddToCart(CartItemJSON cartItemJSON)
        {
            int CustomerId = Customers.FirstOrDefault(c => c.Email == cartItemJSON.email).CustomerId;
            int ProductId = cartItemJSON.id;
            // check for duplicate cart item
            CartItem cartItem = CartItems.FirstOrDefault(ci => ci.ProductId == ProductId && ci.CustomerId == CustomerId);
            if (cartItem == null)
            {
                // this is a new cart item
                cartItem = new CartItem()
                {
                    CustomerId = CustomerId,
                    ProductId = cartItemJSON.id,
                    Quantity = cartItemJSON.qty
                };
                CartItems.Add(cartItem);
            }
            else
            {
                // for duplicate cart item, simply update the quantity
                cartItem.Quantity += cartItemJSON.qty;
            }

            SaveChanges();
            cartItem.Product = Products.Find(cartItem.ProductId);
            return cartItem;
        }

    }
}