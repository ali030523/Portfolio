let balances = { savings: 0, current: 0 };
let activeAccount = "";

// Toggle custom deposit input
document.addEventListener("DOMContentLoaded", () => {
  const depositOptions = document.getElementById("deposit-options");
  const depositInput = document.getElementById("deposit-amount");

  depositOptions.addEventListener("change", () => {
    depositInput.classList.toggle("hidden", depositOptions.value !== "custom");
    if (depositOptions.value !== "custom") depositInput.value = "";
  });
});

// Toggle PIN visibility
function togglePin() {
  const pin = document.getElementById("pin");
  pin.type = pin.type === "password" ? "text" : "password";
}

// LOGIN
function login() {
  const username = document.getElementById("username").value.trim();
  const pin = document.getElementById("pin").value.trim();
  const error = document.getElementById("login-error");

  if (!username || !pin) return alert("Please fill in all fields.");
  if (username === "admin" && pin.length === 8) {
    error.classList.add("hidden");
    document.getElementById("login-section").classList.add("hidden");
    showSection("main-menu");
  } else {
    error.classList.remove("hidden");
  }
}

// SECTION HANDLER
function showSection(id) {
  ["main-menu", "deposit-section", "withdraw-section", "balance-section"].forEach(sec =>
    document.getElementById(sec).classList.add("hidden")
  );
  document.getElementById(id).classList.remove("hidden");

  if (id === "balance-section" && activeAccount) {
    document.getElementById("account-type-display").textContent = capitalize(activeAccount);
    document.getElementById("balance-display").textContent = `PHP ${balances[activeAccount].toFixed(2)}`;

    setTimeout(() => {
      if (confirm("Would you like to print your balance receipt?")) {
        alert(generateBalanceReceipt(activeAccount));
      }
    }, 1000);
  }
}

function returnToMenu() {
  clearFields();
  showSection("main-menu");
}

function confirmCancel() {
  if (confirm("Are you sure you want to cancel this transaction?")) returnToMenu();
}

function confirmLogout() {
  if (confirm("Are you sure you want to logout?")) location.reload();
}

// DEPOSIT
function deposit() {
  const type = document.getElementById("account-type-deposit").value;
  const selected = document.getElementById("deposit-options").value;
  const custom = parseFloat(document.getElementById("deposit-amount").value);
  const amount = selected === "custom" ? custom : parseFloat(selected);

  if (!type) return alert("Select account type.");
  if (isNaN(amount) || amount < 100) return alert("Minimum deposit is PHP 100.");

  balances[type] += amount;
  activeAccount = type;

  showFeedback("deposit-success");

  setTimeout(() => {
    if (confirm("Would you like to print the deposit receipt?")) {
      alert(generateDepositReceipt(type, amount));
    }
    returnToMenu();
  }, 1000);
}

// WITHDRAW
function withdraw() {
  const type = document.getElementById("account-type-withdraw").value;
  const amount = parseFloat(document.getElementById("withdraw-amount").value);

  if (!type) return alert("Select account type.");
  if (isNaN(amount) || amount < 500) return alert("Minimum withdrawal is PHP 500.");
  if (amount > balances[type]) return showFeedback("withdraw-error");

  balances[type] -= amount;
  activeAccount = type;

  showFeedback("withdraw-success");

  setTimeout(() => {
    if (confirm("Would you like to print the withdrawal receipt?")) {
      alert(generateWithdrawReceipt(type, amount));
    }
    returnToMenu();
  }, 1000);
}

// RECEIPT CONTENT
function generateWithdrawReceipt(type, amount) {
  const id = generateTransactionId("TXN");
  const now = new Date();
  return `
ALC Bank - Withdrawal Receipt
Transaction ID: ${id}
Account: ${capitalize(type)}
Date: ${now.toLocaleString()}
Withdrawn: PHP ${amount.toFixed(2)}
Remaining Balance: PHP ${balances[type].toFixed(2)}
  `;
}

function generateDepositReceipt(type, amount) {
  const id = generateTransactionId("DEP");
  const now = new Date();
  return `
ALC Bank - Deposit Receipt
Transaction ID: ${id}
Account: ${capitalize(type)}
Date: ${now.toLocaleString()}
Deposited: PHP ${amount.toFixed(2)}
New Balance: PHP ${balances[type].toFixed(2)}
  `;
}

function generateBalanceReceipt(type) {
  const now = new Date();
  return `
ALC Bank - Balance Receipt
Account: ${capitalize(type)}
Date: ${now.toLocaleString()}
Current Balance: PHP ${balances[type].toFixed(2)}
  `;
}

// UTILITIES
function generateTransactionId(prefix) {
  return `${prefix}-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function showFeedback(id) {
  const el = document.getElementById(id);
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 2000);
}

function clearFields() {
  ["deposit-amount", "withdraw-amount", "username", "pin"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  document.getElementById("deposit-options").value = "";
  document.getElementById("account-type-deposit").value = "";
  document.getElementById("account-type-withdraw").value = "";

  ["deposit-success", "withdraw-success", "withdraw-error", "login-error"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
}
