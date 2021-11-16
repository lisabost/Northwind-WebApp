using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Northwind.Models
{
    public class OrderDetails
    {
        [Required]
        public int OrderDetailsId { get; set;}
        public int OrderId {get; set;}
        public int ProductId {get; set;}
        public decimal UnitPrice {get; set;}
        public short Quantity {get; set;}
        public decimal Discount {get; set;}
        public virtual Order Order {get; set;}
        public virtual Product Product {get; set;}
    }
}