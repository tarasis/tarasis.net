---
title: Cash Register Challenge on freeCodeCamp
tags: [webdev, javascript, freecodecamp]
category: programming
eleventyExcludeFromCollections: true
layout: single
---

I've been (slowly) working through the JavaScript module on [freeCodeCamp](https://freecodecamp.org) for a while now, and have recently been doing the certificate challenges. The last of which is the "Cash Register" challenge where you are to write a function that takes a price, a payment amount and an array that contains the cash in the drawer.

I found a couple of things strange about the challenge

| Currency Unit       | Amount             |
| ------------------- | ------------------ |
| Penny               | $0.01 (PENNY)      |
| Nickel              | $0.05 (NICKEL)     |
| Dime                | $0.1 (DIME)        |
| Quarter             | $0.25 (QUARTER)    |
| Dollar              | $1 (ONE)           |
| Five Dollars        | $5 (FIVE)          |
| Ten Dollars         | $10 (TEN)          |
| Twenty Dollars      | $20 (TWENTY)       |
| One-hundred Dollars | $100 (ONE HUNDRED) |

Example of the cash in drawer array:
```javascript
[
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
]
```

Sample input to function,

```javascript
checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]])
```

and the expected return object
```javascript
{status: "OPEN", change: [["TWENTY", 60], ["TEN", 20], ["FIVE", 15], ["ONE", 1], ["QUARTER", 0.5], ["DIME", 0.2], ["PENNY", 0.04]]}
```

Why is this weird? Well it was drilled into me back in college (1991/1992), to NEVER use floating point values for currency. Its inpercise (especially in JavaScript) and this challenge just doubles down on it.

I'd much rather see that there are 101 PENNIES that 1.01 in PENNIES. I find it faster to say give 4 pennies as change than 0.04 pennies.

Final **solution**

```javascript

function checkCashRegister(price, cash, cid) {
    /*
      First step, adjust amounts into pennies.
      Learnt long ago to never use floats
        for currency.
    */
    let adjustmentAmount = 100;
    let adjustedPrice = price * adjustmentAmount;
    let adjustedCashGiven = cash * adjustmentAmount;

    // Reverse cid, need to make new array as using = is just a reference
    let cashInDrawer = Array.from(cid);
    cashInDrawer.reverse();

    // total of all the cash in drawer
    let totalCashInDrawer = 0;

    // in the array the denomination comes in an array with two parts, name and value
    const availableCashInDrawer = cashInDrawer.map((denomination) => {
        const adjustedAmount = Math.round(denomination[1] * adjustmentAmount);
        totalCashInDrawer += adjustedAmount;
        return [denomination[0], adjustedAmount];
    });

    // console.log(
    //     "Total Cash in Drawer",
    //     totalCashInDrawer,
    //     " -- $",
    //     totalCashInDrawer / adjustmentAmount
    // );

    let currencyValues = {
        "ONE HUNDRED": 10000,
        TWENTY: 2000,
        TEN: 1000,
        FIVE: 500,
        ONE: 100,
        QUARTER: 25,
        DIME: 10,
        NICKEL: 5,
        PENNY: 1,
    };

    // console.log(currencyValue);

    // Now how much change is required?
    const changeRequired = adjustedCashGiven - adjustedPrice;
    // console.log(`Change Required ${changeRequired}`);

    // Two options, either set up the default object as
    //   change["status"] = "INSUFFICIENT_FUNDS";
    //   change["change"] = [];
    // which would remove two if checks below, OR leave it empty
    // and be explicit in the code

    let change = {};
    // Simplest case first.
    // If no change required
    if (changeRequired == 0) {
        change["status"] = "CLOSED";
        change["change"] = cid;
        // if the change required is more than the available cash in the drawer
    } else if (changeRequired > totalCashInDrawer) {
        change["status"] = "INSUFFICIENT_FUNDS";
        change["change"] = [];
    } else {
        let workingChange = changeRequired;
        let changeWithCash = {};

        availableCashInDrawer.forEach((denomination) => {
            // console.log(denomination);
            while (true) {
                const denominationName = denomination[0];
                const denominationValue = denomination[1];
                let currencyVal = currencyValues[denominationName];

                if (
                    workingChange >= currencyValues[denominationName] &&
                    denominationValue >= currencyVal
                ) {
                    denomination[1] -= currencyVal;
                    workingChange -= currencyVal;
                    let val = currencyVal / adjustmentAmount;
                    if (changeWithCash[denominationName]) {
                        changeWithCash[denominationName] += val;
                    } else {
                        changeWithCash[denominationName] = val;
                    }
                } else {
                    break;
                }
            }
        });

        // If we have calculated the change correctly, and there was exactly that
        // amount in the drawer, return closed and the cid (required for challenge)
        if (workingChange === 0 && changeRequired == totalCashInDrawer) {
            change["status"] = "CLOSED";
            change["change"] = cid;
            // otherwise if we have calculated change correctly, open the drawer and show what amount
            // to give.
        } else if (workingChange === 0) {
            change["status"] = "OPEN";
            change["change"] = Object.entries(changeWithCash);
            // Otherwise we have enough money in the cash drawer but not the right denominations to
            // give change, so return insufficent funds.
        } else {
            change["status"] = "INSUFFICIENT_FUNDS";
            change["change"] = [];
        }
    }

    console.log(change);
    return change;
}

checkCashRegister(19.5, 20, [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100],
]); // {status: "OPEN", change: [["QUARTER", 0.5]]}

checkCashRegister(20, 20, [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100],
]); //{ status: 'CLOSED', change: [ [ 'PENNY', 1.01 ], [ 'NICKEL', 2.05 ], [ 'DIME', 3.1 ], [ 'QUARTER', 4.25 ], [ 'ONE', 90 ], [ 'FIVE', 55 ], [ 'TEN', 20 ], [ 'TWENTY', 60 ], [ 'ONE HUNDRED', 100 ] ] }

checkCashRegister(19.5, 20, [
    ["PENNY", 0.01],
    ["NICKEL", 0],
    ["DIME", 0],
    ["QUARTER", 0],
    ["ONE", 0],
    ["FIVE", 0],
    ["TEN", 0],
    ["TWENTY", 0],
    ["ONE HUNDRED", 0],
]); // {status: "INSUFFICIENT_FUNDS", change: []}

checkCashRegister(19.5, 20, [
    ["PENNY", 0.5],
    ["NICKEL", 0],
    ["DIME", 0],
    ["QUARTER", 0],
    ["ONE", 0],
    ["FIVE", 0],
    ["TEN", 0],
    ["TWENTY", 0],
    ["ONE HUNDRED", 0],
]);

```