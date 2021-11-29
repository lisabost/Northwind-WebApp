using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Northwind.Models
{
    public class OrderDetails
    {
        [Required]
        public int OrderDetailsId { get; set;}
        public int OrderId {get; set;}
        public int ProductId {get; set;}
        [Column(TypeName = "decimal(5, 2)")]
        public decimal UnitPrice {get; set;}
        public short Quantity {get; set;}
        [Column(TypeName = "decimal(5, 2)")]
        public decimal Discount {get; set;}
        public virtual Order Order {get; set;}
        public virtual Product Product {get; set;}
    }
}