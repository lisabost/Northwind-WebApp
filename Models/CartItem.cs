using System.ComponentModel.DataAnnotations;

namespace Northwind.Models
{
    public class CartItem
    {
        //auto-generated primary key
        public int CartItemId { get; set; }
        
        //foreign key
        [Required]
        public int ProductId { get; set; }

        //foreign key
        [Required]
        public int CustomerId { get; set; }
        [Required]
        public int Quantity { get; set; }

        public Customer Customer { get; set; }
        public Product Product { get; set; }
    }
}