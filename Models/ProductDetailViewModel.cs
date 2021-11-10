using System.Collections.Generic;

namespace Northwind.Models
{
    public class ProductDetailViewModel
    {
        public Product Product { get; set; }
        public Review Review {get; set; }
        public IEnumerable<Review> Reviews { get; set; }

        public int AvgRating()
        {
            int total = 0;
            int amt = 0;
            foreach (Review r in Reviews)
            {
                total += r.Rating;
                amt++;
            }
            int avg = total / amt;
            return avg;
        }
        
    }
}