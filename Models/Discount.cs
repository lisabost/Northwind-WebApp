using System;
using System.ComponentModel.DataAnnotations.Schema;
namespace Northwind.Models
{
    public class Discount
    {
        public int DiscountID { get; set; }
        public int Code { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int ProductID { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal DiscountPercent { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public Product Product { get; set; }
    }
}