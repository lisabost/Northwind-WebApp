using System;
using System.ComponentModel.DataAnnotations.Schema;
namespace Northwind.Models
{
    public class Review
    {
        public int ReviewId { get; set; }

        public int Rating { get; set; }

        public string Comment { get; set; }

        public int ProductId { get; set; }

        public int CustomerId { get; set; }

        public Product products { get; set; }

        public Customer customer { get; set; }
    }
}