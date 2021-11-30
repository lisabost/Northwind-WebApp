using System;
using System.ComponentModel.DataAnnotations;

namespace Northwind.Models
{
    public class ReviewJSON
    {
        public int RatingId { get; set; }
        
        public int Rating { get; set; }

        public string Comment { get; set; }

        public string Name { get; set; }

        public int ProductId { get; set; }
        public bool isAuthor { get; set; }
    }
}