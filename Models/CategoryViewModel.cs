using System.Collections.Generic;

namespace Northwind.Models
{
    public class CategoryViewModel
    {
        public Category category { get; set; }
        public IEnumerable<Product> product { get; set; }
    }
}