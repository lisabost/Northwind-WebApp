using System;
using System.ComponentModel.DataAnnotations;

namespace Northwind.Models
{
    public class ProductsJSON
    {
        public int ProductId { get; set; }
    
        public int AverageRating { get; set; }

        public int RatingCount { get; set; }

        public string ProductName { get; set; }

        public decimal UnitPrice { get; set; }
        
        public bool Discontinued { get; set; }
    }
}