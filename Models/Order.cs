using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Northwind.Models
{
    public class Order
    {
        [Required]
        public int OrderId { get; set;}
        public int CustomerId {get; set;}
        public int EmployeeId {get; set;}
        public DateTime OrderDate {get; set;}
        public DateTime RequiredDate {get; set;}
        public DateTime ShippedDate {get; set;}
        public int ShipVia {get; set;}
        [Column(TypeName = "decimal(5, 2)")]
        public decimal? Freight {get; set;}
        public string ShipName {get; set;}
        public string ShipAddress {get; set;}
        public string ShipCity {get; set;}
        public string ShipRegion {get; set;}
        public string ShipPostalCode {get; set;}
        public string ShipCountry {get; set;}
        public virtual Customer Customer {get; set;}
        public virtual ICollection<OrderDetails> OrderDetails {get; set;}
    }
}