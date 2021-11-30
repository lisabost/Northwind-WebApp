using System.ComponentModel.DataAnnotations;
using System;
namespace Northwind.Models
{
    public class Review
    {
        public int ReviewId { get; set; }

        [Required]
        public int Rating { get; set; }
        [Required]
        public string Comment { get; set; }

        public int ProductId { get; set; }

        public int CustomerId { get; set; }

        public DateTime UploadDate { get; set; }

        public Product Product { get; set; }

        public Customer Customer { get; set; }
    }
}