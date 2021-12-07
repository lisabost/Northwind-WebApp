using System;
using System.ComponentModel.DataAnnotations;

namespace Northwind.Models
{
    public class ReviewJSON
    {
        public int RatingId { get; set; }
        [Required]
        public int Rating { get; set; }
        [Required]
        public string Comment { get; set; }
        public string Name { get; set; }
        public int ProductId { get; set; }
        public bool isAuthor { get; set; }
        public DateTime UploadDate { get; set; }
    }
}