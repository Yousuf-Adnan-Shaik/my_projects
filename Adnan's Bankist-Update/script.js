'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Shaik Yousuf',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">
          ${i + 1} ${type}</div>
          <div class="movements__value">${mov}</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((accum, cur) => accum + cur, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

const calcDisplaySummary = function (acc) {
  let incomes;
  acc.movements.filter(cur => cur > 0).length === 0
    ? (incomes = 0)
    : (incomes = acc.movements
        .filter(cur => cur > 0)
        .reduce((accum, cur) => accum + cur, 0));

  labelSumIn.textContent = `${incomes} 💶`;

  let outcome;
  acc.movements.filter(cur => cur < 0).length === 0
    ? (outcome = 0)
    : (outcome = acc.movements
        .filter(cur => cur < 0)
        .reduce((accum, cur) => accum + cur, 0));

  labelSumOut.textContent = `${Math.abs(outcome)} 💶`;

  let interest;
  acc.movements.filter(cur => cur > 0).length === 0
    ? (interest = 0)
    : (interest = acc.movements
        .filter(cur => cur > 0)
        .map(deposit => (deposit * acc.interestRate) / 100)
        .filter(int => int >= 1)
        .reduce((accum, int) => accum + int));

  labelSumInterest.textContent = `${interest} 💶`;
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

// ///////////// UPDATE UI //////////////

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcPrintBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
};

//////////// LOGIN IMPLEMENTATION //////////////

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back,  ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    // Clear inputs
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  } else {
    console.log('Wrong pin or password');
  }
});

/////////////// TRANSFER IMPLEMENTATION ///////////////

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  console.log(amount);

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferTo.blur();

  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Updating the UI

    updateUI(currentAccount);
  }
});

// LOAN IMPLEMENTATION

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(cur => cur >= amount * 0.1)) {
    // Add the movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

///////// DELETING AN ACCOUNT /////////

let currentAccount2;

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    console.log(index);
    accounts.splice(index, 1);

    // DELETE ACCOUNT
    containerApp.style.opacity = 0;

    // Display Login UI and message
    labelWelcome.textContent = `Log in to get started`;
  }

  // clear inputs
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

//// SORT IMPLEMENTATION //////

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// Creates a balance key in all accounts and calculates balance of all accounts

// const calcBalance = function (accs) {
//   accs.forEach(acc => {
//     acc.balance = acc.movements.reduce((accum, cur) => accum + cur, 0);
//   });
// };
// balance(accounts);

console.log(accounts);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(userName)

// console.log(userName1)

// console.log(userName1.join(''));

/// Coding challenge #1

// const checkDogs = function (dogsJulia, dogsKate) {
//   const juliaDogs = dogsJulia.slice(1, -2);
//   // const dogs = [...juliaDogs, ...dogsKate];
//   const dogs = juliaDogs.concat(dogsKate);
//   dogs.forEach(function (cur, i) {
//     const type = cur >= 3 ? 'adult 🐕‍🦺' : 'puppy 🐶';
//     console.log(`Dog number ${i + 1} is a ${type}`);
//   });
// };

// const juliaData = [3, 5, 2, 12, 7];
// const kateData = [4, 1, 15, 8, 3];

// const juliaData2 = [9, 16, 6, 8, 3];
// const kateData2 = [10, 5, 6, 1, 4];

// checkDogs(juliaData, kateData);
// console.log(`---Test Data 2 ---`);
// checkDogs(juliaData2, kateData2);

// const dogAge1 = [5, 2, 4, 1, 15, 8, 3];
// const dogAge2 = [16, 6, 10, 5, 6, 1, 4];

// Coding challenge #2

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(dogAge =>
//     dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4
//   );
//   const adults = humanAges.filter(cur => cur >= 18);
//   // console.log(humanAges)
//   console.log(adults)
//   const calcAverage =
//     adults.reduce((accum, age, i, arr) => accum + age / arr.length, 0);
//   return calcAverage;
// };

// const avg1 = calcAverageHumanAge(dogAge1);
// const avg2 = calcAverageHumanAge(dogAge2);

// console.log(avg1, avg2);

// Coding challenge #3

// const calcAverageHumanAge = (ages) => {
//   const humanAges = ages
//   .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
//   .filter((cur) => cur >= 18)
//   .reduce((accum, cur, i, arr) => accum + cur / arr.length);
//   return humanAges;
// };

// const avg1 = calcAverageHumanAge(dogAge1);
// const avg2 = calcAverageHumanAge(dogAge2);
// console.log(avg1, avg2);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

///////////////////////////////////////////////

// Simple array methods

// let arr = ['a', 'b', 'c', 'd', 'e'];

// Slice (Doesn't mutates the array)

// const nxt = arr.slice(1, -2);
// console.log(nxt)
// console.log(arr.slice());
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));

// console.log(arr.slice());
// console.log([...arr]);

// // Splice (Mutates the array)

// console.log(arr.splice(2));
// console.log(arr.splice(-1));
// console.log(arr.splice(1, 2));
// console.log(arr);

// // Reverse (Mutates the array)
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f']
// console.log(arr2.reverse());
// console.log(arr2);

// // CONCAT (Doesn't Mutate the array)

// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// // JOIN

// console.log(letters.join(' - ').toUpperCase())

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (let values of movements)
// for (let [i, values] of movements.entries()) {
//   if (values > 0) {
//     console.log(`Movement ${i + 1}: You Deposited ${values}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(values)} `);
//   }
// }

// console.log(`----- FOR-EACH -----`)

// movements.forEach(function (val, i, array) {
//   val > 0
//     ? console.log(`Movement ${i + 1}: You Deposited ${val}`)
//     : console.log(`Movement ${i + 1}: You withdrew ${Math.abs(val)} `);
// });

// // 0: function(200)
// // 1: function(450)
// // 2: function(-400)

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (val, key, map) {
//   console.log(`${key}: ${val}`);
// });

// // Set

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR', 'EUR']);

// console.log(currenciesUnique);

// currenciesUnique.forEach(function (val, _ , map) {
//   console.log(`${val}`);
//   console.log(`${map}`);
// });

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(sum);

// // Filter

// const deposits = movements.filter((cur) => cur > 0);
// const withdrawals = movements.filter((cur) => cur < 0);
// console.log(deposits);
// console.log(withdrawals);

// For-Of loop

// const depositsFor = [];
// const withdrawalsFor = [];

// for(let cur of movements) {
//   if(cur > 0) {
//     depositsFor.push(cur);
//   } else {
//     withdrawalsFor.push(cur);
//   }
// }

// console.log(depositsFor);
// console.log(withdrawalsFor);

// const eurToUsd = 1.1;
// // const usdToInr = 73.47;

// const movementsUsd = movements.map(function (cur) {
//   return Math.trunc(cur * eurToUsd);
// });

// // const movementsUsd = movements.map(cur =>
// //   Math.trunc(cur * eurToUsd));
// console.log(movementsUsd);

// const movementUsd = [];
// for (let movement of movements) {
//   movementUsd.push(movement * eurToUsd);
// }
// console.log(movementUsd);

// const movementsDescription = movements.map((val, i) => {
//   // if (val > 0) {
//   //   return `Movement ${i + 1}: You Deposited ${val}`;
//   // } else {
//   //   return `Movement ${i + 1}: You withdrew ${val}`;
//   // }

//   return `Movement ${i + 1}: You ${val > 0 ? 'Deposited' : 'Withdrew'} ${val}`;
// });

// console.log(movementsDescription);

// const inr = movements.map(function(cur) {
//   return cur * usdToInr;
// })

// console.log(inr)

// console.log(movements);

// Accumulator => SnowBall
// const balance = movements.reduce((accum, cur, i, arr) =>
// accum + cur, 0);

// console.log(balance);

// For-Of loop

// let sum = 0;
// for (let cur of movements) {
//   sum += cur;
// }

// Maximum value

// const max = movements.reduce((accum, cur) => {
//   if(accum > cur) return accum;
//   else return cur;
// }, movements[0]);

// console.log(max)

// const eurToUsd = 1.1;

// PIPELINE
// const totalDepositsInUsd = movements
//   .filter(cur => cur > 0)
//   .map(cur => cur * eurToUsd)
//   .reduce((accum, cur) => accum + cur);

// console.log(totalDepositsInUsd);

// const firstWithdrawal = movements.find(cur => cur < 0);

// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');

// console.log(account);

// console.log(movements)

// EQUALITY
// console.log(movements.includes(-130));

// SOME: CONDITION
// console.log(movements.some(cur => cur === -130));

// const anyDeposits = movements.some(cur => cur > 5000)
// console.log(anyDeposits);

// EVERY

// console.log(movements.every(cur => cur > 0));
// console.log(account4.movements.every(cur => cur > 0));

// SEPARATE CALLBACK FUNCTIONS
// const deposit = cur => cur > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));
// // FLAT
// const overallBalance = accounts
//   .map(cur => cur.movements)
//   .flat()
//   .reduce((accum, cur) => accum + cur);
// console.log(overallBalance);

// // FLAT MAP

// const overallBalance2 = accounts
//   .flatMap(cur => cur.movements)
//   .reduce((accum, cur) => accum + cur);
// console.log(overallBalance2);

// Strings

// const owners = ['Shaik', 'Yousuf', 'Adnan', 'Sk', 'Sky'];
// console.log(owners.sort());
// console.log(owners);

// console.log(movements);

// // return < 0 A, B (Keep order)
// // return > 0 B, A (Switch Order)

// // ASCENDING

// movements.sort((a, b) => a - b);

// console.log(movements);

// // DESCENDING
// movements.sort((a, b) => b - a);

// console.log(movements);

// const arr = [1, 2, 3, 4, 5, 6, 7]
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// const x = new Array(7);
// console.log(x)

// x.fill(1, 1, 6)
// console.log(x);

// arr.fill(23, 2, 6)
// console.log(arr)

// // Array.from()
// const y = Array.from({length: 7}, () => 1);
// console.log(y);

// const z = Array.from({length: 7}, (_, i) => i + 1)

// console.log(z);

// // const n = Array.from({length: 100}, ())

// console.log(y.concat(z));

// EXERCISES

// // 1.
// const totalBankDeposit = accounts
//   .flatMap(cur => cur.movements)
//   .filter(cur => cur > 0)
//   .reduce((accum, cur) => accum + cur, 0);
// console.log(totalBankDeposit);

// // 2.

// // console.log(accounts.flatMap(cur => cur.movements).filter(cur => cur > 0));

// // const noOfDeposits1000 = accounts
// //   .flatMap(cur => cur.movements)
// //   .filter(cur => cur >= 1000).length;

// const noOfDeposits1000 = accounts
//   .flatMap(cur => cur.movements)
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

// console.log(noOfDeposits1000);

// // Prefixed ++ operator
// let a = 10;
// console.log(++a);
// console.log(a);

// // 3.
// const { deposits, withdrawals } = accounts
//   .flatMap(cur => cur.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
//       sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, withdrawals);

// const [dep, wit] = accounts
//   .flatMap(cur => cur.movements)
//   .reduce(
//     (prev, cur) => {
//       // cur > 0 ? prev[0] += cur : prev[1] += cur;
//       prev[cur > 0 ? 0 : 1] += cur
//       return prev
//     },
//     [0, 0]
//   );
// console.log(dep, wit);

// 4.

// Coding challenge #4

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.

dogs.forEach(cur => {
  return (cur.recFoodPortion = Math.trunc(cur.weight ** 0.75 * 28));
});

// dogs.forEach(cur => {
//   if (cur.owners.includes('Sarah')) {
//     if (cur.curFood > cur.recFoodPortion) {
//       console.log(
//         `Sarah's dog eats more than the recommended portion of food. Rec:${cur.recFoodPortion}, Cur:${cur.curFood}`
//       );
//     } else {
//       console.log(
//         `Sarah's dog eats less than the recommended portion of food. Rec:${cur.recFoodPortion}gm, Cur:${cur.curFood}gm`
//       );
//     }
//   }
// });

// 2.
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  `Sarah's dog is eating too ${
    dogSarah.curFood > dogSarah.recFoodPortion ? 'much' : 'little'
  }`
);

const ownerEatTooMuch = dogs
  .filter(cur => cur.curFood >= cur.recFoodPortion)
  .flatMap(cur => cur.owners);

const ownerEatTooLittle = dogs
  .filter(cur => cur.curFood <= cur.recFoodPortion)
  .flatMap(cur => cur.owners);

  
  console.log(ownerEatTooLittle)
  console.log(ownerEatTooMuch)
// dogs.map(cur => {
//   if (cur.curFood >= cur.recFoodPortion) {
//     ownerEatTooMuch.push(cur.owners);
//     ownerEatTooLittle.flat();
//   } else if (cur.curFood <= cur.recFoodPortion) {
//     ownerEatTooLittle.push(cur.owners);
//   }
// });

// 4.

console.log(`${ownerEatTooLittle.join(' and ')}'s dogs eat too little`);
console.log(`${ownerEatTooMuch.join(' and ')}'s dogs eat too much`);

// 5.

dogs.map(cur => {
  cur.curFood > cur.recFoodPortion * 0.9 &&
  cur.curFood < cur.recFoodPortion * 1.1
    ? console.log('true')
    : console.log('false');
});

console.log(
  dogs.some(
    cur =>
      cur.curFood > cur.recFoodPortion * 0.9 &&
      cur.curFood < cur.recFoodPortion * 1.1
  )
);

// 
