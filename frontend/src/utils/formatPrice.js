export const formatPrice = (amount) => {
 const amountInRupees = Number(amount) * 83;
 return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
 }).format(amountInRupees);
}


export const formatPriceCalculation = (quantity, price) => {
   return (Number(quantity) * Number(price)).toFixed(2);
  }


export const formatRevenue = (value) => {
   if (value >= 1e9) {
      return (value / 1e9).toFixed(1) + "B";
   } else if (value >= 1e6) {
      return (value / 1e6).toFixed(1) + "M";
   } else if (value >= 1e3) {
      return (value / 1e3).toFixed(1) + "K";
   } else {
      return value;
   }
};

export const convertDollarToRupee = (amountInDollars, exchangeRate = 83) => {
   const amountInRupees = Number(amountInDollars) * exchangeRate;
   return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
   }).format(amountInRupees);
};