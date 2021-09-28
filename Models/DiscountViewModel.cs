using System.Collections.Generic;

namespace Northwind.Models
{
    public class DiscountViewModel
    {
        public Discount discount { get; set; }
        public IEnumerable<Product> product { get; set; }
    }
}