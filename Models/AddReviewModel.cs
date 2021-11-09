using System.Collections.Generic;

namespace Northwind.Models
{
    public class AddReviewModel
    {
        public Product Product { get; set; }
        public Review Review {get; set;}
        
    }
}