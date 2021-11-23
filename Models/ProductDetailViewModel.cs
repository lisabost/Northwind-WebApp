﻿using System.Collections.Generic;

namespace Northwind.Models
{
    public class ProductDetailViewModel
    {
        public bool hasPurchased { get; set; }
        public Product Product { get; set; }
        public Review Review {get; set; }
        public IEnumerable<Review> Reviews { get; set; }
        public int AverageRating { get; set; }
    }
}